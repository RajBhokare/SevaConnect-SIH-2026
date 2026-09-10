const express = require('express');
const router = express.Router();
const { submitRating, getWorkerRatings } = require('../controllers/ratingController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, submitRating);
router.get('/worker/:workerId', getWorkerRatings);

module.exports = router;
