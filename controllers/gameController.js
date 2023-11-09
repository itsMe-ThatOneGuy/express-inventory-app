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

exports.game_detail = asyncHandler(async (req, res, next) => {
	const game = await Game.findById(req.params.id).populate('category').exec();

	if (game === null) {
		const err = new Error('Game not found');
		err.status = 404;
		return next(err);
	}

	res.render('game_details', {
		title: game.title,
		game: game,
	});
});

exports.game_create_get = asyncHandler(async (req, res, next) => {
	const allCategories = await Category.find({}).exec();

	res.render('game_form', {
		title: 'Add Game to Inventory',
		categories: allCategories,
	});
});

exports.game_create_post = [
	(req, res, next) => {
		if (!(req.body.category instanceof Array)) {
			if (typeof req.body.category === 'undefined') req.body.category = [];
			else req.body.category = new Array(req.body.category);
		}
		next();
	},

	body('title', 'Title must not be empty').trim().isLength({ min: 1 }).escape(),
	body('category', 'A category must be selected').isLength({ min: 1 }),
	body('description', 'Description required').trim().isLength({ min: 1 }),
	body('price')
		.trim()
		.isLength({ min: 1 })
		.withMessage('Price required')
		.isCurrency({ allow_negatives: false })
		.withMessage('Price must be positive number')
		.isCurrency({ require_decimal: true, digits_after_decimal: [2] })
		.withMessage('Price must be fromatted as a decimal. Ex. 1.00, 4.69, ect'),
	body('quantity')
		.trim()
		.isInt({ min: 0 })
		.withMessage('Quantity must not be empty'),

	asyncHandler(async (req, res, next) => {
		const errors = validationResult(req);

		const game = new Game({
			title: req.body.title,
			category: req.body.category,
			description: req.body.description,
			price: req.body.price,
			quantity: req.body.quantity,
		});

		if (!errors.isEmpty()) {
			const allCategories = await Category.find().exec();

			res.render('game_form', {
				title: 'Add Game to Inventory',
				categories: allCategories,
				game: game,
				errors: errors.array(),
			});
		} else {
			await game.save();
			res.redirect(game.url);
		}
	}),
];
