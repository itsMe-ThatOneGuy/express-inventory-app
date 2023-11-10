const Category = require('../models/categories');
const Game = require('../models/games');
const { body, validationResult } = require('express-validator');
const asyncHandler = require('express-async-handler');

exports.category_list = asyncHandler(async (req, res, next) => {
	const allCategories = await Category.find().sort({ name: 1 }).exec();
	res.render('category_list', {
		title: 'List of Categories',
		categories: allCategories,
	});
});

exports.category_detail = asyncHandler(async (req, res, next) => {
	const category = await Category.findById(req.params.id).exec();
	const allGames = await Game.find().populate('category').exec();

	const gamesInCategory = [];
	for (const game of allGames) {
		game.category.name === category.name ? gamesInCategory.push(game) : false;
	}

	if (category === null) {
		const err = new Error('Category not found');
		err.status = 404;
		return next(err);
	}

	res.render('category_detail', {
		title: category.name,
		category: category,
		categoryGames: gamesInCategory,
	});
});

exports.category_create_get = asyncHandler(async (req, res, next) => {
	res.render('category_form', {
		title: 'Add Category to Inventory',
	});
});

exports.category_create_post = [
	body('name', 'Name must not be empty').trim().isLength({ min: 1 }).escape(),
	body('description', 'Description required')
		.trim()
		.isLength({ min: 1 })
		.escape(),

	asyncHandler(async (req, res, next) => {
		const errors = validationResult(req);

		const category = new Category({
			name: req.body.name,
			description: req.body.description,
		});

		if (!errors.isEmpty()) {
			res.render('category_form', {
				title: 'Add Category to Inventory',
				category: category,
				errors: errors.array(),
			});
		} else {
			await category.save();
			res.redirect(category.url);
		}
	}),
];

exports.category_update_get = asyncHandler(async (req, res, next) => {
	const category = await Category.findById(req.params.id).exec();

	if (category === null) {
		const err = new Error('Category not found');
		err.status = 404;
		return next(err);
	}

	res.render('category_form', {
		title: 'Update Category Info',
		category: category,
	});
});
