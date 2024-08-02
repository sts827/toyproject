const express = require('express');
const router = express.Router();
const gptController = require('../controllers/gptController');

router.get('/', gptController.getGptPage);

module.exports = router;