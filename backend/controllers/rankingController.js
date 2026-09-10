const store = require('../config/store');

// Configurable thresholds matching system specs
const RANK_THRESHOLDS = {
  Diamond: 90,
  Platinum: 75,
  Gold: 60,
  Silver: 40,
  Bronze: 0
};

// Fallback deterministic ranking calculation in case Python AI service is unreachable
const calculateFallbackRank = (worker, ratings, bookings = []) => {
  const totalReviews = ratings.length;
  const avgRating = worker.rating || 5.0;
  const completedJobs = worker.completedJobs || totalReviews;

  if (totalReviews < 3) {
    return {
      providerId: worker._id,
      name: worker.name,
      rank: 'Unranked',
      score: 0,
      rankConfidence: Number((totalReviews / 3.0).toFixed(2)),
      averageRating: avgRating,
      totalReviews,
      positiveFeedbackPercentage: avgRating >= 4 ? 100 : 50,
      sentimentScore: 0.0,
      rankSummary: 'New Service Provider (Insufficient reviews to establish performance tier; minimum 3 required).',
      breakdown: {
        ratingScore: 0,
        sentimentScore: 0,
        volumeScore: 0,
        consistencyScore: 0,
        reliabilityScore: 0
      },
      topCategories: ['New Provider'],
      thresholds: RANK_THRESHOLDS
    };
  }

  // 1. Bayesian star rating (Weight: 40%)
  const priorRating = 4.0;
  const priorWeight = 5.0;
  const sumStars = ratings.reduce((acc, r) => acc + (r.stars || 5), 0);
  const bayesianRating = (priorWeight * priorRating + sumStars) / (priorWeight + totalReviews);
  const ratingScore = Math.max(0, Math.min(100, ((bayesianRating - 1.0) / 4.0) * 100));

  // 2. Sentiment score from star ratings / keywords (Weight: 25%)
  let positiveCount = 0;
  let totalSentiment = 0;
  const positiveWords = ['great', 'excellent', 'superb', 'best', 'good', 'perfect', 'prompt', 'polite', 'clean', 'skilled'];
  const negativeWords = ['bad', 'poor', 'rude', 'late', 'slow', 'waste', 'terrible', 'worst', 'broken'];

  ratings.forEach(r => {
    let s = (r.stars - 3) / 2.0;
    const txt = (r.comment || '').toLowerCase();
    positiveWords.forEach(w => { if (txt.includes(w)) s += 0.2; });
    negativeWords.forEach(w => { if (txt.includes(w)) s -= 0.3; });
    s = Math.max(-1.0, Math.min(1.0, s));
    if (s > 0.1) positiveCount++;
    totalSentiment += s;
  });

  const avgSentiment = totalSentiment / totalReviews;
  const sentimentScore = ((avgSentiment + 1.0) / 2.0) * 100;
  const posPercentage = Math.round((positiveCount / totalReviews) * 100);

  // 3. Volume score (Weight: 15%)
  const volumeScore = Math.min(100, (completedJobs / 30.0) * 100);

  // 4. Consistency score (Weight: 10%)
  const mean = sumStars / totalReviews;
  const variance = ratings.reduce((acc, r) => acc + Math.pow(r.stars - mean, 2), 0) / totalReviews;
  const consistencyScore = Math.max(0, 100 - (variance * 25.0));

  // 5. Reliability score (Weight: 10%)
  const reliabilityScore = Math.max(0, 100 - ((totalReviews - positiveCount) * 10));

  const composite = (ratingScore * 0.40) + (sentimentScore * 0.25) + (volumeScore * 0.15) + (consistencyScore * 0.10) + (reliabilityScore * 0.10);
  const finalScore = Math.round(Math.max(0, Math.min(100, composite)));

  let rank = 'Bronze';
  let summary = '';
  if (finalScore >= RANK_THRESHOLDS.Diamond) {
    rank = 'Diamond';
    summary = `Diamond — ${finalScore}/100: Consistently exceptional service quality, outstanding customer sentiment (${posPercentage}% positive), and trusted track record.`;
  } else if (finalScore >= RANK_THRESHOLDS.Platinum) {
    rank = 'Platinum';
    summary = `Platinum — ${finalScore}/100: Highly dependable artisan with strong positive feedback (${posPercentage}% positive) and proven field reliability.`;
  } else if (finalScore >= RANK_THRESHOLDS.Gold) {
    rank = 'Gold';
    summary = `Gold — ${finalScore}/100: Good customer satisfaction and consistent performance across verified service tasks.`;
  } else if (finalScore >= RANK_THRESHOLDS.Silver) {
    rank = 'Silver';
    summary = `Silver — ${finalScore}/100: Developing track record with moderate customer feedback and steady delivery.`;
  } else {
    rank = 'Bronze';
    summary = `Bronze — ${finalScore}/100: Baseline cooperative entry tier with improvement opportunities identified in customer feedback.`;
  }

  const confidence = Math.min(0.99, 0.70 + (totalReviews * 0.02));

  return {
    providerId: worker._id,
    name: worker.name,
    rank,
    score: finalScore,
    rankConfidence: Number(confidence.toFixed(2)),
    averageRating: Number(avgRating.toFixed(2)),
    totalReviews,
    positiveFeedbackPercentage: posPercentage,
    sentimentScore: Number(avgSentiment.toFixed(2)),
    rankSummary: summary,
    breakdown: {
      ratingScore: Number(ratingScore.toFixed(1)),
      sentimentScore: Number(sentimentScore.toFixed(1)),
      volumeScore: Number(volumeScore.toFixed(1)),
      consistencyScore: Number(consistencyScore.toFixed(1)),
      reliabilityScore: Number(reliabilityScore.toFixed(1))
    },
    topCategories: ['Service Quality', 'Professionalism', 'Timeliness'],
    thresholds: RANK_THRESHOLDS
  };
};

/**
 * Calculates and saves rank for a specific worker
 */
const calculateAndSaveProviderRank = async (workerId) => {
  try {
    const worker = store.workers.find(w => w._id === workerId || w.userId === workerId);
    if (!worker) return null;

    const workerRatings = store.ratings.filter(r => r.workerId === worker._id);
    const workerBookings = store.bookings.filter(b => b.workerId === worker._id);

    let rankResult = null;

    // 1. Attempt AI Microservice calculation
    try {
      const aiServiceUrl = (process.env.AI_SERVICE_URL || 'http://localhost:8000').replace(/\/$/, '');
      const response = await fetch(`${aiServiceUrl}/rank-provider`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          worker: {
            _id: worker._id,
            name: worker.name,
            rating: worker.rating,
            reviewCount: worker.reviewCount || workerRatings.length,
            completedJobs: worker.completedJobs || 0
          },
          ratings: workerRatings.map(r => ({
            stars: r.stars,
            comment: r.comment || '',
            createdAt: r.createdAt
          })),
          bookings: workerBookings.map(b => ({
            status: b.status,
            workerId: b.workerId
          }))
        })
      });

      if (response.ok) {
        rankResult = await response.json();
      }
    } catch (aiErr) {
      console.warn(`[Ranking Engine]: AI Microservice unavailable (${aiErr.message}), applying deterministic Bayesian rank fallback.`);
    }

    // 2. If AI service didn't return, use fallback
    if (!rankResult) {
      rankResult = calculateFallbackRank(worker, workerRatings, workerBookings);
    }

    // 3. Persist to Worker store
    worker.rank = rankResult.rank;
    worker.score = rankResult.score;
    worker.rankConfidence = rankResult.rankConfidence;
    worker.positiveFeedbackPercentage = rankResult.positiveFeedbackPercentage;
    worker.sentimentScore = rankResult.sentimentScore;
    worker.rankSummary = rankResult.rankSummary;
    worker.rankBreakdown = rankResult.breakdown;
    worker.topCategories = rankResult.topCategories || ['Service Quality', 'Professionalism'];
    worker.lastCalculatedAt = new Date().toISOString();

    return rankResult;
  } catch (err) {
    console.error(`[Ranking Engine Error]:`, err);
    return null;
  }
};

// GET /api/ranking/provider/:id
const getProviderRanking = async (req, res) => {
  try {
    const { id } = req.params;
    const worker = store.workers.find(w => w._id === id || w.userId === id);
    if (!worker) {
      return res.status(404).json({ message: 'Service provider not found.' });
    }

    const workerRatings = store.ratings.filter(r => r.workerId === worker._id);

    res.json({
      providerId: worker._id,
      name: worker.name,
      rank: worker.rank || 'Unranked',
      score: worker.score || 0,
      averageRating: worker.rating,
      totalReviews: workerRatings.length,
      rankConfidence: worker.rankConfidence || 0.85,
      positiveFeedbackPercentage: worker.positiveFeedbackPercentage || 100,
      sentimentScore: worker.sentimentScore || 0.0,
      rankSummary: worker.rankSummary || `${worker.rank || 'Bronze'} Provider`,
      rankBreakdown: worker.rankBreakdown || {},
      topCategories: worker.topCategories || ['Service Quality'],
      lastCalculatedAt: worker.lastCalculatedAt || new Date().toISOString(),
      thresholds: RANK_THRESHOLDS
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching provider ranking.' });
  }
};

// GET /api/ranking/leaderboard
const getRankingLeaderboard = async (req, res) => {
  try {
    const providers = store.workers.map(w => {
      const wRatings = store.ratings.filter(r => r.workerId === w._id);
      return {
        _id: w._id,
        name: w.name,
        primarySkill: w.primarySkill,
        cooperativeName: w.cooperativeName,
        rating: w.rating,
        reviewCount: wRatings.length || w.reviewCount || 0,
        completedJobs: w.completedJobs || 0,
        rank: w.rank || 'Bronze',
        score: w.score || 0,
        rankConfidence: w.rankConfidence || 0.85,
        positiveFeedbackPercentage: w.positiveFeedbackPercentage || 95,
        sentimentScore: w.sentimentScore || 0.5,
        topCategories: w.topCategories || ['Service Quality'],
        lastCalculatedAt: w.lastCalculatedAt || new Date().toISOString()
      };
    });

    // Sort descending by score
    providers.sort((a, b) => (b.score || 0) - (a.score || 0));

    // Distribution stats
    const distribution = {
      Diamond: providers.filter(p => p.rank === 'Diamond').length,
      Platinum: providers.filter(p => p.rank === 'Platinum').length,
      Gold: providers.filter(p => p.rank === 'Gold').length,
      Silver: providers.filter(p => p.rank === 'Silver').length,
      Bronze: providers.filter(p => p.rank === 'Bronze').length,
      Unranked: providers.filter(p => p.rank === 'Unranked').length
    };

    res.json({
      totalProviders: providers.length,
      distribution,
      leaderboard: providers,
      thresholds: RANK_THRESHOLDS
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching ranking leaderboard.' });
  }
};

// POST /api/ranking/recalculate-all
const recalculateAllRankings = async (req, res) => {
  try {
    const results = [];
    for (const worker of store.workers) {
      const res = await calculateAndSaveProviderRank(worker._id);
      if (res) results.push(res);
    }

    res.json({
      message: `Recalculated AI rankings for ${results.length} cooperative service providers.`,
      updatedProviders: results
    });
  } catch (error) {
    res.status(500).json({ message: 'Error recalculating rankings.' });
  }
};

module.exports = {
  calculateAndSaveProviderRank,
  getProviderRanking,
  getRankingLeaderboard,
  recalculateAllRankings,
  RANK_THRESHOLDS
};
