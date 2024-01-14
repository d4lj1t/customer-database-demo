import { baseApiUrl } from '@/app/constants';
import {Customer} from '@/app/types';

type ErrorResponse = {
	error: string;
};

export const deleteCustomer = async (id: string): Promise<Customer | ErrorResponse> => {
	try {
		const res = await fetch(`${baseApiUrl}/api/customers/delete/${id}`, {
			method: 'DELETE',
			headers: {
				'Content-type': 'application/json',
			},
		});

		if (!res.ok) {
			throw new Error(`HTTP error! Status: ${res.status}`);
		}

		return await res.json();
	} catch (error) {
		console.error('Error deleting customer:', error);
		const errorMessage =
			error instanceof Error && error.message ? error.message : 'Failed to delete customer';
		const errorResponse: ErrorResponse = { error: errorMessage };

		return errorResponse;
	}
};
