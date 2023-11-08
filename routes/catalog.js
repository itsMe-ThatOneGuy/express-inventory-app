const express = require('express');
const router = express.Router();

const game_controller = require('../controllers/gameController');

router.get('/', game_controller.index);

router.get('/game/create', game_controller.game_create_get);

router.get('/games', game_controller.game_list);

router.get('/game/:id', game_controller.game_detail);

module.exports = router;
