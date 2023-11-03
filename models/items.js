const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ItemSchema = new Schema({
	name: { type: String, required: true },
	description: { type: String, required: true },
	category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
	price: { type: Schema.Types.Decimal128, required: true },
	quantity: { type: Number, required: true },
});

ItemSchema.virtual('url').get(function () {
	return `/catalog/item/${this._id}`;
});

module.exports = mongoose.model('Item', ItemSchema);
