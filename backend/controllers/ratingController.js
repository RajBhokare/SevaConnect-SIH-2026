const store = require('../config/store');

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

    const newRating = {
      _id: `rate-${Date.now()}`,
      bookingId: booking._id,
      customerId: req.user._id,
      customerName: req.user.name,
      workerId: booking.workerId,
      stars: Number(stars),
      comment: comment || '',
      createdAt: new Date().toISOString()
    };

    store.ratings.push(newRating);

    // Update worker aggregate rating
    const worker = store.workers.find(w => w._id === booking.workerId);
    if (worker) {
      const currentRating = worker.rating || 5.0;
      const currentCount = worker.reviewCount || 1;
      const newCount = currentCount + 1;
      const updatedRating = Math.round(((currentRating * currentCount + Number(stars)) / newCount) * 10) / 10;

      worker.rating = updatedRating;
      worker.reviewCount = newCount;

      // AI Rank Integration
      try {
        const workerRatings = store.ratings.filter(r => r.workerId === booking.workerId);
        const reviews = workerRatings.map(r => r.comment).filter(c => c && c.trim() !== '');
        
        const aiRes = await fetch('http://localhost:8000/rank', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            rating: updatedRating,
            reviews: reviews
          })
        });
        
        if (aiRes.ok) {
          const aiData = await aiRes.json();
          worker.rank = aiData.rank;
        }
      } catch (aiError) {
        console.error('Failed to calculate AI rank:', aiError);
      }
    }

    booking.isRated = true;

    res.status(201).json({
      message: 'Thank you! Rating recorded successfully.',
      rating: newRating,
      updatedWorkerRating: worker?.rating,
      updatedWorkerRank: worker?.rank
    });
  } catch (error) {
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
