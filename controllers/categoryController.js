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
