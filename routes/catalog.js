const express = require('express');
const router = express.Router();

const game_controller = require('../controllers/gameController');

router.get('/', game_controller.index);

module.exports = router;
