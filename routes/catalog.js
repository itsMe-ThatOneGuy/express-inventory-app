const express = require('express');
const router = express.Router();

const game_controller = require('../controllers/gameController');

router.get('/', game_controller.index);

router.get('/games', game_controller.game_list);

module.exports = router;
