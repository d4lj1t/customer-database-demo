import {type NextRequest, NextResponse} from 'next/server';
import {getSession} from '@auth0/nextjs-auth0';
import {type Customer} from '@/app/types';
import connectToMongoDb from '@/app/libs/mongodb';
import customerModel from '@/app/models/customer';

export async function POST(request: NextRequest) {
	try {
		await connectToMongoDb();

		const session = await getSession();

		if (!session?.accessToken || !session.user) {
			console.log('Invalid or missing access token or user in the session');
			return NextResponse.json(
				{error: 'Invalid or missing access token or user in the session'},
				{status: 401}
			);
		}

		const userId = session.user.sub as string;

		const {ID, name, street, email, phone, age} = await request.json() as Customer;

		const defaultData = await customerModel.find({userId: {$exists: false, $eq: null}});

		const existingCustomer = await customerModel.findOne({userId}) as Customer;

		if (!existingCustomer) {
			try {
				const newArrayWithUserId = defaultData.map((defaultItem) => {
					if (defaultItem._id.toString() === ID) {
						return {
							userId: userId,
							name: name,
							street: street,
							email: email,
							phone: phone,
							age: age
						};
					}
					return {
						userId: userId,
						name: String(defaultItem.name),
						street: String(defaultItem.street),
						email: String(defaultItem.email),
						phone: String(defaultItem.phone),
						age: String(defaultItem.age),
					};
				});

				await customerModel.insertMany(newArrayWithUserId);

				return NextResponse.json({message: 'Customers updated'}, {status: 201});
			} catch (error) {
				console.error('Error updating default customers with userId', error);

				const errorMessage =
					error instanceof Error && error.message
						? error.message
						: 'Failed to update customers';

				return NextResponse.json({error: errorMessage}, {status: 500});
			}
		} else if (existingCustomer) {
			try {
				await customerModel.updateOne(
					{_id: String(ID.toString())},
					{$set: {userId, ID, name, street, email, phone, age}},
					{upsert: true}
				);
				return NextResponse.json({message: 'Existing Customer updated'}, {status: 201});
			} catch (error) {
				console.error('Error updating customer', error);

				const errorMessage =
					error instanceof Error && error.message
						? error.message
						: 'Failed to update customer';

				return NextResponse.json({error: errorMessage}, {status: 500});
			}
		}
	} catch (error) {
		console.error('Failed to update customer database', error);

		const errorMessage = error instanceof Error && error.message ? error.message : 'Failed to update customer database';

		return NextResponse.json({error: errorMessage}, {status: 500});
	}
}
