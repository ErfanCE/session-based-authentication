const router = require('express').Router();
const authRouter = require('./auth-route');
const userRouter = require('./user-route');
const accountRouter = require('./account-route');
const articleRouter = require('./article-route');

router.use('/auth', authRouter);

router.use('/users', userRouter);

router.use('/account', accountRouter);

router.use('/articles', articleRouter);

module.exports = router;
