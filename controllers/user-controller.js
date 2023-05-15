const User = require('../models/user-model');
const { asyncHandler } = require('../utils/async-handler');

const getAllUsers = asyncHandler(async (req, res, next) => {
	const users = await User.find({}, { __v: 0 });

	res.status(200).json({
		status: 'success',
		data: { users }
	});
});

module.exports = { getAllUsers };
