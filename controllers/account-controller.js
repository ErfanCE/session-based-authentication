const { access, unlink, constants } = require('node:fs/promises');
const { join } = require('node:path');
const sharp = require('sharp');
const User = require('../models/user-model');
const { asyncHandler } = require('../utils/async-handler');
const { AppError } = require('../utils/app-error');
const { multerUpload } = require('../utils/multer-config');

const uploadUserAvatar = multerUpload.single('avatar');

const resizeUserAvatar = async (userId, file = null) => {
	if (!file) return file;

	const userAvatarFilename = `users-${userId}-${Date.now()}.jpeg`;

	await sharp(file.buffer)
		.resize(100, 100)
		.toFormat('jpeg')
		.jpeg({ quality: 90 })
		.toFile(
			join(__dirname, `../public/images/users/avatars/${userAvatarFilename}`)
		);

	return userAvatarFilename;
};

const getUserAccount = asyncHandler(async (req, res, next) => {
	const { userId } = req.session;

	const user = await User.findById(userId, { __v: 0 });

	res.status(200).json({
		status: 'success',
		data: { user }
	});
});

const editUserAccount = asyncHandler(async (req, res, next) => {
	const { userId } = req.session;
	const {
		firstname = null,
		lastname = null,
		gender = null,
		username = null
	} = req.body;

	const user = await User.findById(userId);

	const duplicateUser = await User.findOne({ username });
	if (!!duplicateUser && duplicateUser.username !== user.username) {
		return next(
			new AppError(409, `username: ${username} already exist, try again`)
		);
	}

	const avatar = await resizeUserAvatar(userId, req.file);

	if (!!avatar && user.avatar !== 'user-default-avatar.jpeg') {
		await access(
			join(__dirname, `../public/images/users/avatars/${user.avatar}`),
			constants.F_OK
		);

		await unlink(
			join(__dirname, `../public/images/users/avatars/${user.avatar}`)
		);
	}

	user.avatar = avatar ?? user.avatar;
	user.firstname = firstname ?? user.firstname;
	user.lastname = lastname ?? user.lastname;
	user.gender = gender ?? user.gender;
	user.username = username ?? user.username;

	await user.save({ validateModifiedOnly: true });

	res.status(202).json({
		status: 'success',
		data: { user }
	});
});

const deleteUserAccount = asyncHandler(async (req, res, next) => {
	const { userId } = req.session;

	// remove user account(documnet)
	const user = await User.findByIdAndDelete(userId);

	// remove user avatar
	if (user.avatar !== 'user-default-avatar.jpeg') {
		await access(
			join(__dirname, `../public/images/users/avatars/${user.avatar}`),
			constants.F_OK
		);

		await unlink(
			join(__dirname, `../public/images/users/avatars/${user.avatar}`)
		);
	}

	// remove session
	req.session.destroy((err) => {
		if (!!err) return next(err);
	});

	res.status(204).json({
		status: 'success',
		data: null
	});
});

const changePassword = asyncHandler(async (req, res, next) => {
	const { userId } = req.session;
	const { currentPassword, newPassword } = req.body;

	const user = await User.findById(userId).select('+password');

	const isCurrentPasswordMatch = await user.comparePassword(currentPassword);
	if (!isCurrentPasswordMatch) {
		return next(new AppError(400, 'your current password is not match'));
	}

	user.password = newPassword;
	await user.save({ validateModifiedOnly: true });

	res.status(200).json({
		status: 'success',
		data: { user }
	});
});

module.exports = {
	changePassword,
	getUserAccount,
	editUserAccount,
	uploadUserAvatar,
	deleteUserAccount
};
