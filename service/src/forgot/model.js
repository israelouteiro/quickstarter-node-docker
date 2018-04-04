import mongoose from 'mongoose';

const ForgotMongoose = mongoose.Schema({
	token: {
		type: String,
		required: false,
	},
	user_id: {
		type: String,
		required: false,
	}
}, { collection: 'users_forgot' });

let ForgotModel = mongoose.model('ForgotMongoose', ForgotMongoose);

export default ForgotModel;


