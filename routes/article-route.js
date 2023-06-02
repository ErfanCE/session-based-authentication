const router = require('express').Router();
const {
	createArticle,
	uploadArticleImages
} = require('../controllers/article-controller');
const { validator } = require('../validations/validator');
const {
	createArticleValidationSchema
} = require('../validations/article-validation');
const { protect, restrictTo } = require('../controllers/auth-controller');

router.post(
	'/',
	protect,
	restrictTo('blogger'),
	uploadArticleImages,
	validator(createArticleValidationSchema),
	createArticle
);

module.exports = router;
