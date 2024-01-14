import {type NextRequest, NextResponse} from 'next/server';
import {getSession, withApiAuthRequired} from '@auth0/nextjs-auth0';
import connectToMongoDb from '@/app/libs/mongodb';
import customerModel from '@/app/models/customer';
import {type Customer} from '@/app/types';

const GET = withApiAuthRequired(async (request: NextRequest, context) => {
	try {
		await connectToMongoDb();

		const {params} = context;

		const session = await getSession();

		if (!session?.accessToken || !session.user) {
			console.log('Invalid or missing access token or user in the session');
			return NextResponse.json({error: 'Invalid or missing access token or user in the session'}, {status: 401});
		}
		const userId = session.user.sub as string;

		const defaultData = await customerModel.find();
		const myCustomers = await customerModel.findOne({userId}) as Customer;

		let data;

		if (myCustomers) {
			data = await customerModel.find({userId});
		} else {
			data = defaultData;
		}

		const customer = data.find((x: { id: string; }) => params?.id === x.id) as Customer;

		return NextResponse.json(customer, {
			headers: {
				'Cache-Control': 'no-store, max-age=0, must-revalidate',
			},
		});
	} catch (error) {
		console.error('Error fetching customers:', error);

		const errorMessage = error instanceof Error && error.message ? error.message : 'Failed to fetch customer';

		console.log('Error Message:', errorMessage);

		return NextResponse.json({error: errorMessage}, {status: 500});
	}
});

export {GET};
