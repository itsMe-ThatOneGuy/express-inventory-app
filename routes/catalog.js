const express = require('express');
const router = express.Router();

const game_controller = require('../controllers/gameController');

router.get('/', game_controller.index);

router.get('/game/create', game_controller.game_create_get);

router.post('/game/create', game_controller.game_create_post);

router.get('/games', game_controller.game_list);

router.get('/game/:id', game_controller.game_detail);

router.get('/game/:id/update', game_controller.game_update_get);

router.post('/game/:id/update', game_controller.game_update_post);

router.get('/game/:id/delete', game_controller.game_delete_get);

module.exports = router;
