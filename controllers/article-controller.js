const { join } = require('node:path');
const sharp = require('sharp');
const { asyncHandler } = require('../utils/async-handler');
const Article = require('../models/atricle-schema');
const { multerUpload } = require('../utils/multer-config');
const { fstat } = require('node:fs');

const articleThumbnailDefault = 'default-article-thumbnail.jpeg';

// req.files = { thumbnail: [{}], images: [{}] };
const uploadArticleImages = multerUpload.fields([
	{ name: 'thumbnail', maxCount: 1 },
	{ name: 'images', maxCount: 5 }
]);

const resizeArticleThumbnail = async (articleId, files) => {
	const { thumbnail = [] } = files;

	if (!thumbnail.length) return null;

	const articleThumbnailFilename = `articles-${articleId}-${Date.now()}.jpeg`;

	await sharp(thumbnail[0].buffer)
		.resize(1200, 800)
		.toFormat('jpeg')
		.jpeg({ quality: 95 })
		.toFile(
			join(
				__dirname,
				`../public/images/articles/thumbnails/${articleThumbnailFilename}`
			)
		);

	return articleThumbnailFilename;
};

const resizeArticleImages = async (articleId, files) => {
	const { images = [] } = files;

	if (!images.length) return images;

	const articleImagesFilenames = await Promise.all(
		images.map(async (image, index) => {
			const imageFilename = `articles-${articleId}-${Date.now()}-${
				index + 1
			}.jpeg`;

			await sharp(image.buffer)
				.resize(1000, 600)
				.toFormat('jpeg')
				.jpeg({ quality: 95 })
				.toFile(
					join(__dirname, `../public/images/articles/images/${imageFilename}`)
				);

			return imageFilename;
		})
	);

	return articleImagesFilenames;
};

const createArticle = asyncHandler(async (req, res, next) => {
	const { userId } = req.session;
	const { title, content } = req.body;

	const article = await Article.create({ title, content, author: userId });

	const articleThumbnail = await resizeArticleThumbnail(article._id, req.files);
	const articleImages = await resizeArticleImages(article._id, req.files);

	article.thumbnail = articleThumbnail ?? articleThumbnailDefault;
	console.log(articleImages);
	article.images = articleImages;
	await article.save({ validateBeforeSave: false });

	res.status(201).json({
		status: 'success',
		data: { article }
	});
});

module.exports = { createArticle, uploadArticleImages };
