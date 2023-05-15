const router = require('express').Router();
const {
	changePassword,
	getUserAccount,
	editUserAccount,
	uploadUserAvatar,
	deleteUserAccount
} = require('../controllers/account-controller');
const { protect } = require('../controllers/auth-controller');
const {
	editUserAccountValidationSchema,
	changePasswordUserAccountValidationSchema
} = require('../validations/account-validation');
const { validator } = require('../validations/validator');

router.get('/', protect, getUserAccount);

router.patch(
	'/',
	protect,
	uploadUserAvatar,
	validator(editUserAccountValidationSchema),
	editUserAccount
);

router.delete('/', protect, deleteUserAccount);

router.put(
	'/change-password',
	protect,
	validator(changePasswordUserAccountValidationSchema),
	changePassword
);

module.exports = router;
