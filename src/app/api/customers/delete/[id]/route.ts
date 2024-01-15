import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@auth0/nextjs-auth0';
import customerModel from '@/app/models/customer';

export async function DELETE(request: NextRequest, context: { params: {id: string}; }) {
	try {
		const { params } = context;

		const session = await getSession();

		if (!session?.accessToken || !session.user) {
			console.log('Invalid or missing access token or user in the session');
			return NextResponse.json(
				{ error: 'Invalid or missing access token or user in the session' },
				{ status: 401 }
			);
		}

		const userId = session.user.sub as string;

		const result = await customerModel.deleteOne({ _id: String(params.id.toString()), userId });

		if (result.deletedCount === 0) {
			return NextResponse.json({ message: 'Customer not found' }, { status: 404 });
		}

		return NextResponse.json({ message: 'Customer deleted successfully' }, { status: 200 });
	} catch (error) {
		console.error('Failed to delete customer from the database', error);

		const errorMessage =
			error instanceof Error && error.message
				? error.message
				: 'Failed to delete customer from the database';

		return NextResponse.json({ error: errorMessage }, { status: 500 });
	}
}
