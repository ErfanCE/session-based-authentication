const { Schema, model } = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new Schema({
	firstname: {
		type: String,
		required: true
	},
	lastname: {
		type: String,
		required: true
	},
	gender: {
		type: String,
		enum: ['male', 'female', 'not-set'],
		default: 'not-set'
	},
	username: {
		type: String,
		unique: true,
		required: true,
		lowercase: true,
		trim: true
	},
	password: {
		type: String,
		required: true,
		select: false
	},
	avatar: {
		type: String,
		default: 'user-default-avatar.jpeg'
	},
	role: {
		type: String,
		enum: ['user', 'admin'],
		default: 'user'
	}
});

UserSchema.pre('save', async function (next) {
	if (!this.isModified('password')) return next();

	this.password = await bcrypt.hash(this.password, 12);
	next();
});

UserSchema.methods.comparePassword = function (userPassword) {
	return bcrypt.compare(userPassword, this.password);
};

module.exports = model('User', UserSchema);
