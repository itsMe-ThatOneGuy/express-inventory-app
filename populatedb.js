#! /usr/bin/env node

const userArgs = process.argv.slice(2);

const Game = require('./models/games');
const Category = require('./models/categories');

const games = [];
const categories = [];

const mongoose = require('mongoose');
mongoose.set('strictQuery', false);

const mongoDB = userArgs[0];

main().catch((err) => console.log(err));

async function main() {
	console.log('Connecting');
	await mongoose.connect(mongoDB);
	console.log('Connected');
	await createCategories();
	await createGames();
	console.log('Closing connection');
	mongoose.connection.close();
}

async function categoryCreate(index, name, description) {
	const category = new Category({ name: name, description: description });
	await category.save();
	categories[index] = category;
}

async function gameCreate(
	index,
	title,
	description,
	category,
	price,
	quantity,
) {
	const gameDetails = {
		title: title,
		description: description,
		price: price,
		quantity: quantity,
	};
	if (category != false) gameDetails.category = category;

	const game = new Game(gameDetails);
	await game.save();
	games[index] = game;
}

async function createCategories() {
	console.log('Adding categories');
	await Promise.all([
		categoryCreate(
			0,
			'PlayStation 4',
			'Home video game console developed by Sony. Successor to the PlayStation 3, launched on November 15 2013.',
		),
		categoryCreate(
			1,
			'Nintendo Switch',
			'Hybrid video game console developed by Nintendo and released worldwide on March 3 2017',
		),
		categoryCreate(
			2,
			'Game Boy Advance',
			'A 32-bit handheld game console developed by Nintendo. A successor to the Game Boy Color, released in America on June 11, 2001.',
		),
		categoryCreate(
			3,
			'PlayStation',
			'Home video game console developed by Sony. It was released in America on September 9 1995.',
		),
	]);
}

async function createGames() {
	console.log('Adding Games');
	await Promise.all([
		gameCreate(
			0,
			'Spyro the Dragon',
			'Spyro the Dragon was released in North America on September 9, 1998 and Europe in October 1998 for the PlayStation. It is a platform game that placed the player as Spyro, a small purple dragon set with the task of freeing his fellow dragons from crystal prisons, which are scattered around their world.',
			categories[3],
			9.98,
			3,
		),
		gameCreate(
			1,
			'Twisted Metal',
			'Welcome to a twisted world where the drivers are insane, the explosions apocalyptic and the weapons hard core. As the ultimate automobile combat simulation for the PlayStation, Twisted Metal features all-new explosive battlegrounds and revved-up, fully armed vehicles.',
			categories[3],
			11.69,
			7,
		),
		gameCreate(
			2,
			'Super Mario Bros. Wonder',
			'Super Mario Bros. Wonder is a 2023 platform game developed and published by Nintendo for the Nintendo Switch. It is the first traditional side-scrolling Super Mario game since New Super Mario Bros. U (2012). The game received critical acclaim.',
			categories[1],
			59.99,
			23,
		),
		gameCreate(
			3,
			'Pokemon Ruby',
			'Pokémon Ruby Version[a] and Pokémon Sapphire Version[b] are 2002 role-playing video games developed by Game Freak and published by The Pokémon Company and Nintendo for the Game Boy Advance. They are the first installments in the third generation of the Pokémon video game series, also known as the "advanced generation".',
			categories[2],
			75.81,
			3,
		),
		gameCreate(
			4,
			'Sekiro: Shadows Die Twice',
			'Sekiro follows a shinobi known as Wolf, who attempts to take revenge on a samurai clan that imprisoned him and kidnapped his lord. The gameplay is focused on stealth, exploration, and combat, with a particular emphasis on boss battles.',
			categories[0],
			41.14,
			9,
		),
	]);
}
