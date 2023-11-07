const Game = require('../models/games');
const Category = require('../models/categories');
const { body, validationResult } = require('express-validator');
const asyncHandler = require('express-async-handler');

exports.index = asyncHandler(async (req, res, next) => {
	const [numCategories, numGames] = await Promis.all([
		Category.countDocuments({}).exec(),
		Game.countDocuments({}).exec(),
	]);

	res.render('index', {
		title: 'Game Store Inventory',
		console_count: numCategories,
		game_count: numGames,
	});
});
