import mongoose, {Schema} from 'mongoose';

const customersModelSchema = new Schema(
	{
		userId: {
			type: String,
			required: true,
		},
		name: String,
		street: String,
		email: String,
		phone: String,
		age: String,
	},
	{
		timestamps: true,
	},
);

const customersModel = mongoose.models.Customers || mongoose.model('Customers', customersModelSchema);

export default customersModel;
