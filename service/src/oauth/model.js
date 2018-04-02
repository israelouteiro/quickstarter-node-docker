import mongoose from 'mongoose';

const AuthMongoose = mongoose.Schema({
	token: {
		type: String,
		required: false,
	},
	user_id: {
		type: String,
		required: false,
	},
	is_valid: {
		type: Boolean,
		required: false,
	}
}, { collection: 'auth_tokens' });

let AuthModel = mongoose.model('AuthMongoose', AuthMongoose);

export default AuthModel; 