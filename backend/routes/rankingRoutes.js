const express = require('express');
const router = express.Router();
const {
  getProviderRanking,
  getRankingLeaderboard,
  recalculateAllRankings
} = require('../controllers/rankingController');

router.get('/leaderboard', getRankingLeaderboard);
router.get('/provider/:id', getProviderRanking);
router.post('/recalculate-all', recalculateAllRankings);

module.exports = router;
