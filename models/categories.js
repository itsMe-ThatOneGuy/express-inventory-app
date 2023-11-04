const { default: mongoose } = require('mongoose');
const mongose = require('mongose');

const Schema = mongoose.Schema;

const CategoriesSchema = new Schema({
	name: { type: String, required: true },
	description: { type: String, required: true },
});

module.exports = mongoose.model('Category', CategoriesSchema);
