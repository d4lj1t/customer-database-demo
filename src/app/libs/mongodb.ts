import mongoose from 'mongoose';

import {mongoDbUri} from '@/app/constants';

const connectToMongoDb = async () => {
	try {
		if (!mongoDbUri) {
			throw new Error('MongoDB URI is not defined');
		}

		await mongoose.connect(mongoDbUri);
	} catch (error) {
		console.log('mongoDb Connection error');
	}
};

export default connectToMongoDb;
