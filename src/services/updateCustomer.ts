import {baseApiUrl} from '@/app/constants';
import {Customer} from '@/app/types';

type ErrorResponse = {
	error: string;
};

export const updateCustomer = async (customer: Customer) => {
	const {_id, name, street, email, phone, age} = customer;
	try {
		const res = await fetch(`${baseApiUrl}/api/customers/updateExisting`, {
			method: 'POST',
			headers: {
				'Content-type': 'application/json',
			},
			body: JSON.stringify({_id, name, street, email, phone, age}),
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
