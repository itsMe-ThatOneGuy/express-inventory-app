const mongoose = require('mongoose');

const ImageSchema = new mongoose.Schema({
	fileName: {
		type: String,
		required: true,
	},

	file: {
		data: Buffer,
		contentType: String,
	},
	uploadTime: {
		type: Date,
		default: Date.now,
	},
});

module.exports = mongoose.model('Image', ImageSchema);
