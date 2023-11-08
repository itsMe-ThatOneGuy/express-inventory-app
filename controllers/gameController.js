const Game = require('../models/games');
const Category = require('../models/categories');
const { body, validationResult } = require('express-validator');
const asyncHandler = require('express-async-handler');

exports.index = asyncHandler(async (req, res, next) => {
	const [numCategories, numGames] = await Promise.all([
		Category.countDocuments({}).exec(),
		Game.countDocuments({}).exec(),
	]);

	res.render('index', {
		title: 'Game Store Inventory',
		console_count: numCategories,
		game_count: numGames,
	});
});

exports.game_list = asyncHandler(async (req, res, next) => {
	const allGames = await Game.find({}, 'title game')
		.sort({ title: 1 })
		.populate('category')
		.exec();

	res.render('game_list', { title: 'List of Games', game_list: allGames });
});
