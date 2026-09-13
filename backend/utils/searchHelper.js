const CATEGORY_SYNONYMS = {
  'Cleaner': ['clean', 'cleaning', 'cleaner', 'cleaners', 'maid', 'housekeeping', 'deep clean', 'sweep', 'dusting', 'sanitization', 'sanitisation', 'home cleaning', 'kitchen cleaning'],
  'Plumber': ['plumb', 'plumber', 'plumbers', 'plumbing', 'leak', 'leakage', 'tap', 'pipe', 'fitting', 'drain', 'drainage', 'faucet', 'toilet', 'flush', 'water motor'],
  'Electrician': ['electr', 'electrician', 'electricians', 'electrical', 'wiring', 'mcb', 'switch', 'fuse', 'fan', 'light', 'short circuit', 'power'],
  'Carpenter': ['carpent', 'carpenter', 'carpenters', 'carpentry', 'furniture', 'wood', 'table', 'chair', 'door', 'cupboard', 'cabinet', 'latch', 'hinge'],
  'Painter': ['paint', 'painter', 'painters', 'painting', 'texture', 'whitewash', 'wall paint', 'primer', 'polish'],
  'Appliance Repair': ['appliance', 'repair', 'technician', 'geyser', 'fridge', 'refrigerator', 'washing machine', 'ac', 'air conditioner', 'cooler', 'microwave', 'oven'],
  'Mechanic': ['mechanic', 'auto', 'bike', 'scooter', 'car', 'puncture', 'vehicle', 'two wheeler']
};

/**
 * Maps a keyword or search query to matching standard categories
 * @param {string} query
 * @returns {string[]} Array of matching category names
 */
function resolveQueryToCategories(query) {
  if (!query || typeof query !== 'string') return [];
  const q = query.trim().toLowerCase();
  const matchedCategories = [];

  for (const [category, synonyms] of Object.entries(CATEGORY_SYNONYMS)) {
    if (category.toLowerCase() === q) {
      matchedCategories.push(category);
      continue;
    }
    const matches = synonyms.some(syn => q.includes(syn) || syn.includes(q));
    if (matches) {
      matchedCategories.push(category);
    }
  }

  return matchedCategories;
}

/**
 * Tests if a worker matches a query either by category stemming, name, location, or direct skill match
 */
function workerMatchesQuery(worker, query) {
  if (!query || !query.trim()) return true;
  const q = query.trim().toLowerCase();

  // 1. Direct name or location match
  if (worker.name && worker.name.toLowerCase().includes(q)) return true;
  if (worker.location && worker.location.toLowerCase().includes(q)) return true;
  if (worker.serviceArea && worker.serviceArea.toLowerCase().includes(q)) return true;

  // 2. Check category mapped synonyms
  const matchedCats = resolveQueryToCategories(q);
  if (matchedCats.length > 0) {
    for (const cat of matchedCats) {
      if (worker.primarySkill && worker.primarySkill.toLowerCase() === cat.toLowerCase()) return true;
      if (worker.skills && worker.skills.some(s => s.toLowerCase() === cat.toLowerCase())) return true;
    }
  }

  // 3. Fallback: Check if any skill exactly or partially matches
  if (worker.primarySkill && worker.primarySkill.toLowerCase().includes(q)) return true;
  if (worker.skills && worker.skills.some(s => s.toLowerCase().includes(q))) return true;

  return false;
}

/**
 * Tests if worker matches a category filter
 */
function workerMatchesCategory(worker, category) {
  if (!category || category === 'All') return true;
  const catLower = category.toLowerCase();

  // Direct match
  if (worker.primarySkill && worker.primarySkill.toLowerCase().includes(catLower)) return true;
  if (worker.skills && worker.skills.some(s => s.toLowerCase().includes(catLower))) return true;

  // Mapped category match
  const mapped = resolveQueryToCategories(category);
  if (mapped.some(m => worker.primarySkill && worker.primarySkill.toLowerCase() === m.toLowerCase())) return true;

  return false;
}

module.exports = {
  resolveQueryToCategories,
  workerMatchesQuery,
  workerMatchesCategory
};
