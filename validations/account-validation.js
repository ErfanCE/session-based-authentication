const Joi = require('joi');

const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)/;

const editUserAccountValidationSchema = Joi.object({
	firstname: Joi.string().min(3).max(40).trim(),
	lastname: Joi.string().min(3).max(40).trim(),
	gender: Joi.string().valid('male', 'female', 'not-set').trim().lowercase(),
	username: Joi.string().min(3).max(40).trim().lowercase()
});

const changePasswordUserAccountValidationSchema = Joi.object({
	currentPassword: Joi.string().required(),
	newPassword: Joi.string().min(8).pattern(passwordRegex).required()
});

module.exports = {
	editUserAccountValidationSchema,
	changePasswordUserAccountValidationSchema
};
