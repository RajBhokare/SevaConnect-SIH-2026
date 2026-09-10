const store = require('../config/store');

// Distance calculation utility (Haversine formula approximation in KM)
const calculateDistanceKm = (coord1, coord2) => {
  if (!coord1 || !coord2 || !coord1.lat || !coord2.lat) return 2.5; // fallback default distance
  const R = 6371; // Earth's radius in km
  const dLat = (coord2.lat - coord1.lat) * (Math.PI / 180);
  const dLon = (coord2.lng - coord1.lng) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(coord1.lat * (Math.PI / 180)) *
    Math.cos(coord2.lat * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round((R * c) * 10) / 10;
};

/**
 * FairMatch Engine:
 * 1. Hard Constraints (Zero Compromise):
 *    - Must have matching Skill/Category
 *    - Must be VERIFIED
 *    - Must be currently AVAILABLE (or emergency-ready if emergency)
 * 2. Multi-Objective Scoring:
 *    - Distance Proximity (Weight: 35%)
 *    - Workload Fairness (Weight: 25% - lower active workload receives boost to prevent monopoly)
 *    - Experience & Track Record (Weight: 20%)
 *    - Rating & Reliability (Weight: 20%)
 */
const getFairMatchRecommendations = async (req, res) => {
  try {
    const { category, userLocation, isEmergency } = req.body;
    const isUrgent = isEmergency === true || isEmergency === 'true';

    // Base customer coordinate approximation
    const userCoords = { lat: 18.5074, lng: 73.8077 }; // Pune baseline

    // 1. Strict Eligibility Filter (Hard Requirements)
    let eligibleWorkers = store.workers.filter(worker => {
      // Must be verified
      if (worker.verificationStatus !== 'VERIFIED') return false;

      // Must be available
      if (isUrgent) {
        if (!worker.isAvailable || !worker.emergencyAvailable) return false;
      } else {
        if (!worker.isAvailable) return false;
      }

      // Must match required skill category if specified
      if (category && category !== 'All') {
        const catLower = category.toLowerCase();
        const hasSkill = (worker.primarySkill && worker.primarySkill.toLowerCase().includes(catLower)) ||
          (worker.skills && worker.skills.some(s => s.toLowerCase().includes(catLower)));
        if (!hasSkill) return false;
      }

      return true;
    });

    if (eligibleWorkers.length === 0) {
      return res.json({
        recommendedWorker: null,
        eligibleCount: 0,
        rankedWorkers: [],
        message: 'No verified workers currently available matching all criteria.'
      });
    }

    // 2. Score and Rank eligible workers
    const scoredWorkers = eligibleWorkers.map(worker => {
      const distance = calculateDistanceKm(userCoords, worker.coordinates || userCoords);
      const activeWorkload = worker.activeWorkload || 0;
      const experience = worker.experience || 1;
      const rating = worker.rating || 4.5;

      // Proximity score (0 to 100, max at 0km, 0 at 20km)
      const distanceScore = Math.max(0, 100 - (distance * 5));

      // Workload fairness score (0 to 100, 100 if 0 active jobs, decaying as workload increases)
      const workloadScore = Math.max(10, 100 - (activeWorkload * 30));

      // Experience score (0 to 100, saturated at 10 years)
      const expScore = Math.min(100, experience * 10);

      // Rating score (0 to 100, normalized from 5 stars)
      const ratingScore = (rating / 5.0) * 100;

      // Weighted Total
      let totalScore;
      if (isUrgent) {
        // In emergencies, distance and speed take highest weight
        totalScore = (distanceScore * 0.50) + (ratingScore * 0.25) + (workloadScore * 0.15) + (expScore * 0.10);
      } else {
        // Standard FairMatch with balanced workload redistribution
        totalScore = (distanceScore * 0.35) + (workloadScore * 0.25) + (expScore * 0.20) + (ratingScore * 0.20);
      }

      const { governmentIdRef, ...safeWorker } = worker;

      return {
        ...safeWorker,
        distanceKm: distance,
        isFairMatchRecommended: false, // will flag top match below
        _matchScore: totalScore // Internal only
      };
    });

    // Sort descending by FairMatch score
    scoredWorkers.sort((a, b) => b._matchScore - a._matchScore);

    // Flag top worker as Recommended for you
    if (scoredWorkers.length > 0) {
      scoredWorkers[0].isFairMatchRecommended = true;
    }

    // Strip internal debug score before returning to frontend
    const sanitizedRanked = scoredWorkers.map(({ _matchScore, ...w }) => w);

    res.json({
      recommendedWorker: sanitizedRanked[0] || null,
      eligibleCount: sanitizedRanked.length,
      rankedWorkers: sanitizedRanked
    });
  } catch (error) {
    console.error('FairMatch error:', error);
    res.status(500).json({ message: 'Error computing FairMatch recommendations.' });
  }
};

module.exports = { getFairMatchRecommendations };
