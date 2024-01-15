import { NextResponse } from 'next/server';
import { getSession, withApiAuthRequired } from '@auth0/nextjs-auth0';
import connectToMongoDb from '@/app/libs/mongodb';
import customerModel from '@/app/models/customer';
import { Customer } from '@/app/types';

const GET = withApiAuthRequired(async () => {
	try {
		await connectToMongoDb();

		const session = await getSession();

		if (!session?.accessToken || !session.user) {
			console.log('Invalid or missing access token or user in the session');
			return NextResponse.json({ error: 'Invalid or missing access token or user in the session' }, { status: 401 });
		}
		const userId = session.user.sub as string;

		const existingData = await customerModel.findOne({ userId }) as Customer;

		if (!existingData) {
			const defaultData = await customerModel.find({ userId: { $exists: false, $eq: null } });

			const newData = defaultData.map((item) => ({
				userId: String(userId.toString()),
				name: String(item.name),
				street: String(item.street),
				phone: String(item.phone),
				email: String(item.email),
				age: String(item.age),
			}));

			await customerModel.insertMany(newData);
		}

		const data = await customerModel.find({ userId }).lean();

		data.sort((a, b) => {
			const nameA = a.name.charAt(0).toLowerCase() as string;
			const nameB = b.name.charAt(0).toLowerCase() as string;

			return nameA.localeCompare(nameB);
		});

		return NextResponse.json(data, {
			headers: {
				'Cache-Control': 'no-store, max-age=0, must-revalidate',
			},
		});
	} catch (error) {
		console.error('Error fetching customers:', error);

		const errorMessage = error instanceof Error && error.message ? error.message : 'Failed to fetch customers';

		console.log('Error Message:', errorMessage);

		return NextResponse.json({ error: errorMessage }, { status: 500 });
	}
});

export { GET };
