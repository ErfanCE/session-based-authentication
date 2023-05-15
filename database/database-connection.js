const { connect, connection } = require('mongoose');

const connectToDatabase = async () => {
	try {
		await connect(process.env.DATABASE_URL);
	} catch (error) {
		console.log('[-] database connection', error);
		console.info('[i] process terminated');

		process.exit(1);
	}
};

connection.once('connected', () => {
	console.log('[+] database connected');
});

connection.on('error', error => {
	console.error('[-] database error', error);
});

module.exports = { connectToDatabase };
