import mongoose from 'mongoose';

const UserMongoose = mongoose.Schema({
	name: {
		type: String,
		required: false,
	},
	cpf: {
		type: String,
		required: false,
	},
	email: {
		type: String,
		required: false,
		index: true
	},
	phone: {
		type: String,
		required: false,
	},
	password: {
		type: String,
		required: false,
	},
	secure_pin: {
		type: Number,
		required: false,
	},
	validated_identity: {
		type: Boolean,
		required: false,
	},
	validated_phone: {
		type: Boolean,
		required: false,
	},
	validated_email: {
		type: Boolean,
		required: false,
	}
}, { collection: 'users' });

let UserModel = mongoose.model('UserMongoose', UserMongoose);

export default UserModel;


