import {baseApiUrl} from '@/app/constants';
import {Customer} from '@/app/types';

type ErrorResponse = {
	error: string;
};

export const getCustomer = async (id: String): Promise<Customer | ErrorResponse> => {
	try {
		const res = await fetch(`${baseApiUrl}/api/customers/getCustomer/${id}`, {
			method: 'GET',
		})

		if (!res.ok) {
			throw new Error(`HTTP error! Status: ${res.status}`);
		}

		return await res.json();
	} catch (error) {
		console.error('Error fetching customer:', error);
		const errorMessage = error instanceof Error && error.message ? error.message : 'Failed to fetch customer';
		const errorResponse: ErrorResponse = {error: errorMessage};

		return errorResponse;
	}
};
