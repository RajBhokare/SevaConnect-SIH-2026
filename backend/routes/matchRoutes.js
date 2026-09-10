const express = require('express');
const router = express.Router();
const { getFairMatchRecommendations } = require('../controllers/matchController');

router.post('/fairmatch', getFairMatchRecommendations);

module.exports = router;
