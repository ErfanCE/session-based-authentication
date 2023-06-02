const User = require('../models/user-model');
const { AppError } = require('../utils/app-error');
const { asyncHandler } = require('../utils/async-handler');

const signup = asyncHandler(async (req, res, next) => {
	const { userId: userSession = null } = req.session;
	if (!!userSession) {
		return next(
			new AppError(400, 'session already exists, you need logout first')
		);
	}

	const { firstname, lastname, gender, username, password } = req.body;

	const userExists = await User.exists({ username }).select('+password');
	if (userExists) {
		return next(
			new AppError(409, `username: ${username} already taken, try again`)
		);
	}

	const user = await User.create({
		firstname,
		lastname,
		gender,
		username,
		password,
		role: 'blogger'
	});

	req.session.userId = user._id;

	res.status(201).json({
		status: 'success',
		data: { user }
	});
});

const login = asyncHandler(async (req, res, next) => {
	const { userId: userSession = null } = req.session;
	if (!!userSession) {
		return next(
			new AppError(400, 'session already exists, you need logout first')
		);
	}

	const { username, password } = req.body;

	const user = await User.findOne({ username }).select('+password');

	console.log(user);
	if (!user) {
		return next(new AppError(401, '!username or password is not match'));
	}

	const isPasswordMatch = await user.comparePassword(password);
	if (!isPasswordMatch) {
		return next(new AppError(401, 'username or !password is not match'));
	}

	req.session.userId = user._id;

	res.status(200).json({
		status: 'success',
		data: { user }
	});
});

const protect = asyncHandler(async (req, res, next) => {
	const { userId } = req.session;
	if (!userId) {
		return next(new AppError(401, 'you are not logged in, please login first'));
	}

	const user = await User.findById(userId);
	if (!user) {
		return next(
			new AppError(401, 'the user blonging to this session no longer exists')
		);
	}

	next();
});

const restrictTo = (...roles) => {
	return asyncHandler(async (req, res, next) => {
		const { userId } = req.session;
		const { role } = await User.findById(userId);

		if (!roles.includes(role)) {
			return next(
				new AppError(403, 'you do not have permission to perform this action')
			);
		}

		next();
	});
};

const logout = (req, res, next) => {
	req.session.destroy((err) => {
		if (!!err) return next(err);
	});

	res.status(204).json({
		status: 'success',
		data: null
	});
};

module.exports = { signup, protect, login, restrictTo, logout };
