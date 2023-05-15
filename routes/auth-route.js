const router = require('express').Router();
const {
	signup,
	login,
	logout,
	protect
} = require('../controllers/auth-controller');
const {
	signupValidationSchema,
	loginValidationSchema
} = require('../validations/auth-validation');
const { validator } = require('../validations/validator');

router.post('/signup', validator(signupValidationSchema), signup);

router.post('/login', validator(loginValidationSchema), login);

router.get('/logout', protect, logout);

module.exports = router;
