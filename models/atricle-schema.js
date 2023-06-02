const { Schema, model, Types } = require('mongoose');

const ArticleSchema = new Schema({
	author: {
		type: Types.ObjectId,
		ref: 'User',
		required: true
	},
	title: {
		type: String,
		required: true
	},
	thumbnail: {
		type: String,
		default: 'default-article-thumbnail.jpeg'
	},
	content: {
		type: String,
		required: true
	},
	images: {
		type: [String]
	}
});

module.exports = model('Article', ArticleSchema);
