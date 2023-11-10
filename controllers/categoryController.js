const Category = require('../models/categories');
const { body, validationResult } = require('express-validator');
const asyncHandler = require('express-async-handler');

exports.category_list = asyncHandler(async (req, res, next) => {
	const allCategories = await Category.find().sort({ name: 1 }).exec();
	res.render('category_list', {
		title: 'List of Categories',
		categories: allCategories,
	});
});
