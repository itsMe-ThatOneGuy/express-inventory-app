const Game = require('../models/games');
const Category = require('../models/categories');
const { body, validationResult, check } = require('express-validator');
const asyncHandler = require('express-async-handler');
const Image = require('../models/image');
const upload = require('../middleware/multer');

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
	const game = await Game.findById(req.params.id)
		.populate('category')
		.populate('image')
		.exec();

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
	upload.single('image'),

	body('title', 'Title must not be empty').trim().isLength({ min: 1 }).escape(),
	body('category', 'A category must be selected').isLength({ min: 1 }).escape(),
	body('description', 'Description required')
		.trim()
		.isLength({ min: 1 })
		.escape(),
	body('price')
		.trim()
		.isLength({ min: 1 })
		.withMessage('Price required')
		.isCurrency({ allow_negatives: false })
		.withMessage('Price must be positive number')
		.isCurrency({ require_decimal: true, digits_after_decimal: [2] })
		.withMessage('Price must be fromatted as a decimal. Ex. 1.00, 4.69, ect')
		.escape(),
	body('quantity')
		.trim()
		.isInt({ min: 0 })
		.withMessage('Quantity must not be empty')
		.escape(),
	check('image')
		.custom((value, { req }) => {
			if (!req.file) {
				return true;
			}
			if (req.file.size < 1024 * 1024 * 3) {
				return true;
			} else {
				return false;
			}
		})
		.withMessage('Max size for image is 3MB'),

	asyncHandler(async (req, res, next) => {
		const errors = validationResult(req);

		let image, game;

		if (!req.file) {
			image = undefined;

			game = new Game({
				title: req.body.title,
				category: req.body.category,
				description: req.body.description,
				price: req.body.price,
				quantity: req.body.quantity,
			});
		} else {
			image = new Image({
				fileName: `${req.body.title.split(' ').join('_')}.${
					req.file.mimetype.split('/')[1]
				}`,
				file: {
					data: req.file.buffer,
					contentType: req.file.mimetype,
				},
			});

			game = new Game({
				title: req.body.title,
				category: req.body.category,
				description: req.body.description,
				price: req.body.price,
				quantity: req.body.quantity,
				image: image,
			});
		}

		if (!errors.isEmpty()) {
			const allCategories = await Category.find().exec();

			res.render('game_form', {
				title: 'Add Game to Inventory',
				categories: allCategories,
				game: game,
				errors: errors.array(),
			});
		} else {
			if (image !== undefined) {
				await image.save();
			}
			await game.save();
			res.redirect(game.url);
		}
	}),
];

exports.game_update_get = asyncHandler(async (req, res, next) => {
	const [game, allCategories] = await Promise.all([
		Game.findById(req.params.id).populate('category').populate('image').exec(),
		Category.find().exec(),
	]);

	if (game === null) {
		const err = new Error('Game not found');
		err.status = 404;
		return next(err);
	}

	res.render('game_form', {
		title: 'Update Game Info',
		categories: allCategories,
		game: game,
	});
});

exports.game_update_post = [
	upload.single('image'),

	body('title', 'Title must not be empty').trim().isLength({ min: 1 }).escape(),
	body('category', 'A category must be selected').isLength({ min: 1 }).escape(),
	body('description', 'Description required')
		.trim()
		.isLength({ min: 1 })
		.escape(),
	body('price')
		.trim()
		.isLength({ min: 1 })
		.withMessage('Price required')
		.isCurrency({ allow_negatives: false })
		.withMessage('Price must be positive number')
		.isCurrency({ require_decimal: true, digits_after_decimal: [2] })
		.withMessage('Price must be fromatted as a decimal. Ex. 1.00, 4.69, ect')
		.escape(),
	body('quantity')
		.trim()
		.isInt({ min: 0 })
		.withMessage('Quantity must not be empty')
		.escape(),
	check('image')
		.custom((value, { req }) => {
			if (!req.file) {
				return true;
			}
			if (req.file.size < 1024 * 1024 * 3) {
				return true;
			} else {
				return false;
			}
		})
		.withMessage('Max size for image is 3MB'),

	asyncHandler(async (req, res, next) => {
		const errors = validationResult(req);

		let image, game;
		let currentGame = await Game.findById(req.params.id);

		if (!req.file) {
			image = undefined;
		} else {
			if (currentGame.image === undefined) {
				image = new Image({
					fileName: `${req.body.title.split(' ').join('_')}.${
						req.file.mimetype.split('/')[1]
					}`,
					file: {
						data: req.file.buffer,
						contentType: req.file.mimetype,
					},
				});

				game = new Game({
					title: req.body.title,
					category: req.body.category,
					description: req.body.description,
					price: req.body.price,
					quantity: req.body.quantity,
					image: image,
					_id: req.params.id,
				});
			} else {
				image = new Image({
					fileName: `${req.body.title.split(' ').join('_')}.${
						req.file.mimetype.split('/')[1]
					}`,
					file: {
						data: req.file.buffer,
						contentType: req.file.mimetype,
					},
					_id: currentGame.image._id,
				});

				game = new Game({
					title: req.body.title,
					category: req.body.category,
					description: req.body.description,
					price: req.body.price,
					quantity: req.body.quantity,
					image: image,
					_id: req.params.id,
				});
			}
		}

		if (!errors.isEmpty()) {
			const allCategories = await Category.find().exec();

			res.render('game_form', {
				title: 'Update Game',
				categories: allCategories,
				game: game,
				errors: errors.array(),
			});
		} else {
			let updatedGame;
			if (!req.file) {
				updatedGame = await Game.findByIdAndUpdate(req.params.id, game, {});
			} else {
				if (currentGame.image === undefined) {
					await image.save();
					updatedGame = await Game.findByIdAndUpdate(req.params.id, game, {});
				} else {
					await Image.findByIdAndDelete(image._id, image, {});
					await image.save();
					updatedGame = await Game.findByIdAndUpdate(req.params.id, game, {});
				}
			}
			res.redirect(updatedGame.url);
		}
	}),
];

exports.game_delete_get = asyncHandler(async (req, res, next) => {
	const game = await Game.findById(req.params.id)
		.populate('category')
		.populate('image')
		.exec();

	if (game === null) {
		res.redirect('/catalog/games');
	}

	res.render('game_delete', {
		title: `Delete ${game.title}`,
		game: game,
	});
});

exports.game_delete_post = asyncHandler(async (req, res, next) => {
	const game = await Game.findById(req.params.id).populate('category').exec();
	const image = await Image.findById(game.image._id);

	if (game === null) {
		res.redirect('/catalog/games');
	}

	await Game.findByIdAndRemove(req.params.id);
	await Image.findByIdAndRemove(image._id);
	res.redirect('/catalog/games');
});
