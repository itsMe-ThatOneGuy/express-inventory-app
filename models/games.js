const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const GameSchema = new Schema({
	title: { type: String, required: true },
	description: { type: String, required: true },
	category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
	price: { type: Schema.Types.Decimal128, required: true },
	quantity: { type: Number, required: true },
	image: { type: Schema.Types.ObjectId, ref: 'Image' },
});

GameSchema.virtual('url').get(function () {
	return `/catalog/game/${this._id}`;
});

module.exports = mongoose.model('Game', GameSchema);
