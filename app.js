// Third Party Modules
const express = require('express');
const session = require('express-session');

// Local Modules
const { AppError } = require('./utils/app-error');
const apiRouter = require('./routes/api-route');
const { connectToDatabase } = require('./database/database-connection');

const app = express();

// database connection
connectToDatabase();

// Body Parser
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(
	session({
		secret: process.env.SESSION_SECRET,
		resave: false,
		saveUninitialized: false,
		// 1hr
		cookie: { maxAge: 1000 * 60 * 60 }
	})
);

// Routing
app.use('/api', apiRouter);

// Not Found Routes
app.all('*', (req, res, next) => {
	next(new AppError(404, `can't find ${req.method} ${req.originalUrl}`));
});

// Global Error Handler
app.use((err, req, res, next) => {
	const {
		statusCode = 500,
		status = 'error',
		message = 'internal sever error, not your fault :)'
	} = err;

	console.log(err);

	res.status(statusCode).json({ status, message });
});

module.exports = { app };
