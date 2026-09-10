const store = require('../config/store');
const { calculateAndSaveProviderRank } = require('./rankingController');

// Submit Rating & Review
const submitRating = async (req, res) => {
  try {
    const { bookingId, stars, comment } = req.body;

    if (!bookingId || !stars || stars < 1 || stars > 5) {
      return res.status(400).json({ message: 'Please provide a valid rating between 1 and 5 stars.' });
    }

    const booking = store.bookings.find(b => b._id === bookingId || b.bookingId === bookingId);
    if (!booking) {
      return res.status(404).json({ message: 'Booking record not found.' });
    }

    // AI Feedback Sentiment Analysis
    let sentiment = stars >= 4 ? 'positive' : (stars === 3 ? 'neutral' : 'negative');
    let sentimentScore = (stars - 3) / 2.0;
    let confidence = 0.85;
    let categories = ['Customer Satisfaction'];

    try {
      const aiSentimentRes = await fetch('http://localhost:8000/analyze-feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ comment: comment || '', stars: Number(stars) })
      });
      if (aiSentimentRes.ok) {
        const aiSentimentData = await aiSentimentRes.json();
        sentiment = aiSentimentData.sentiment;
        sentimentScore = aiSentimentData.sentimentScore;
        confidence = aiSentimentData.confidence;
        categories = aiSentimentData.categories;
      }
    } catch (err) {
      console.warn('AI feedback analysis fallback applied.');
    }

    const newRating = {
      _id: `rate-${Date.now()}`,
      bookingId: booking._id,
      customerId: req.user._id,
      customerName: req.user.name,
      workerId: booking.workerId,
      stars: Number(stars),
      comment: comment || '',
      sentiment,
      sentimentScore,
      confidence,
      categories,
      createdAt: new Date().toISOString()
    };

    store.ratings.push(newRating);

    // Update worker aggregate rating
    const worker = store.workers.find(w => w._id === booking.workerId);
    if (worker) {
      const workerRatings = store.ratings.filter(r => r.workerId === worker._id);
      const totalStars = workerRatings.reduce((sum, r) => sum + r.stars, 0);
      const newAvgRating = Math.round((totalStars / workerRatings.length) * 10) / 10;

      worker.rating = newAvgRating;
      worker.reviewCount = workerRatings.length;

      // Automatically recalculate and update provider AI rank
      await calculateAndSaveProviderRank(worker._id);
    }

    booking.isRated = true;

    res.status(201).json({
      message: 'Thank you! Rating recorded and AI provider rank updated.',
      rating: newRating,
      updatedWorkerRating: worker?.rating,
      updatedWorkerRank: worker?.rank,
      updatedWorkerScore: worker?.score
    });
  } catch (error) {
    console.error('Submit rating error:', error);
    res.status(500).json({ message: 'Error submitting rating.' });
  }
};

// Get ratings for a worker
const getWorkerRatings = async (req, res) => {
  try {
    const { workerId } = req.params;
    const workerRatings = store.ratings.filter(r => r.workerId === workerId);
    res.json(workerRatings);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching reviews.' });
  }
};

module.exports = { submitRating, getWorkerRatings };
