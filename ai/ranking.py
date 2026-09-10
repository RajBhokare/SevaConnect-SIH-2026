import re
from typing import List, Dict, Any, Optional

# Configurable Rank Thresholds (0-100)
RANK_THRESHOLDS = {
    "Diamond": 90,
    "Platinum": 75,
    "Gold": 60,
    "Silver": 40,
    "Bronze": 0
}

# Feedback Categorization Lexicons
CATEGORY_KEYWORDS = {
    "Service Quality": ["quality", "clean", "fixed", "neat", "perfect", "expert", "job", "skilled", "finish", "flawless", "work"],
    "Professionalism": ["polite", "professional", "respectful", "mannered", "gentleman", "courteous", "honest", "cooperative"],
    "Timeliness": ["time", "punctual", "fast", "quick", "prompt", "on time", "rapid", "delay", "late", "slow"],
    "Communication": ["explained", "helpful", "listened", "responsive", "communicated", "clear", "friendly"],
    "Pricing & Value": ["reasonable", "fair", "affordable", "worth", "cost", "expensive", "cheap", "overcharged", "price"],
    "Reliability": ["dependable", "trusted", "reliable", "guaranteed", "durable", "solved", "again"],
    "Customer Satisfaction": ["happy", "satisfied", "recommend", "great", "excellent", "superb", "best", "delighted"],
    "Complaint/Issue": ["terrible", "worst", "broken", "unprofessional", "rude", "damage", "scam", "waste", "poor", "bad"]
}

POSITIVE_LEXICON = {
    "excellent": 1.0, "superb": 1.0, "outstanding": 1.0, "perfect": 0.9, "amazing": 0.9,
    "great": 0.8, "good": 0.6, "prompt": 0.8, "polite": 0.7, "fast": 0.7, "satisfied": 0.8,
    "punctual": 0.8, "clean": 0.7, "skilled": 0.8, "expert": 0.9, "honest": 0.9,
    "reasonable": 0.7, "helpful": 0.7, "smooth": 0.7, "efficient": 0.8, "best": 0.9
}

NEGATIVE_LEXICON = {
    "terrible": -1.0, "worst": -1.0, "awful": -0.9, "horrible": -0.9, "rude": -0.9,
    "unprofessional": -0.8, "late": -0.7, "slow": -0.6, "bad": -0.7, "poor": -0.7,
    "overcharged": -0.8, "damaged": -0.9, "broken": -0.8, "scam": -1.0, "waste": -0.8,
    "disappointed": -0.8, "careless": -0.8, "delay": -0.6, "useless": -0.9
}

def analyze_single_feedback(comment: str, stars: int = 5) -> Dict[str, Any]:
    """
    Analyzes sentiment and extracts structured categories from a single written review.
    """
    text = (comment or "").lower().strip()
    
    if not text:
        # Base sentiment purely on star rating if comment is empty
        star_sentiment = (stars - 3.0) / 2.0  # 1 -> -1.0, 3 -> 0.0, 5 -> 1.0
        return {
            "sentiment": "positive" if stars >= 4 else ("neutral" if stars == 3 else "negative"),
            "sentimentScore": round(star_sentiment, 2),
            "confidence": 0.60,
            "categories": ["Customer Satisfaction"]
        }

    words = re.findall(r'\b\w+\b', text)
    pos_score = 0.0
    neg_score = 0.0
    matched_pos = 0
    matched_neg = 0

    for word in words:
        if word in POSITIVE_LEXICON:
            pos_score += POSITIVE_LEXICON[word]
            matched_pos += 1
        elif word in NEGATIVE_LEXICON:
            neg_score += abs(NEGATIVE_LEXICON[word])
            matched_neg += 1

    # Factor star rating into text sentiment
    star_weight = (stars - 3.0) / 2.0  # -1.0 to +1.0
    
    total_tokens = matched_pos + matched_neg
    if total_tokens > 0:
        net_text_sentiment = (pos_score - neg_score) / total_tokens
        combined_sentiment = (net_text_sentiment * 0.70) + (star_weight * 0.30)
        confidence = min(0.98, 0.65 + (total_tokens * 0.08))
    else:
        combined_sentiment = star_weight
        confidence = 0.70

    combined_sentiment = max(-1.0, min(1.0, combined_sentiment))

    if combined_sentiment > 0.15:
        sentiment_label = "positive"
    elif combined_sentiment < -0.15:
        sentiment_label = "negative"
    else:
        sentiment_label = "neutral"

    # Detect categories
    detected_categories = []
    for category, keywords in CATEGORY_KEYWORDS.items():
        if any(kw in text for kw in keywords):
            detected_categories.append(category)

    if not detected_categories:
        detected_categories.append("Customer Satisfaction")

    return {
        "sentiment": sentiment_label,
        "sentimentScore": round(combined_sentiment, 2),
        "confidence": round(confidence, 2),
        "categories": detected_categories
    }


def calculate_provider_rank(
    worker: Dict[str, Any],
    ratings: List[Dict[str, Any]],
    bookings: Optional[List[Dict[str, Any]]] = None
) -> Dict[str, Any]:
    """
    Computes explainable 0-100 AI provider score and maps to Bronze, Silver, Gold, Platinum, Diamond.
    Uses Bayesian confidence weighting to avoid sample-size bias.
    """
    total_reviews = len(ratings)
    completed_jobs = worker.get("completedJobs", total_reviews)
    avg_rating = float(worker.get("rating", 5.0))

    # Edge Case: Under 3 reviews -> Not enough data to reliably rank
    if total_reviews < 3:
        return {
            "providerId": worker.get("_id"),
            "name": worker.get("name"),
            "rank": "Unranked",
            "score": 0,
            "rankConfidence": round(total_reviews / 3.0, 2),
            "averageRating": avg_rating,
            "totalReviews": total_reviews,
            "positiveFeedbackPercentage": 100 if avg_rating >= 4 else 50,
            "sentimentScore": 0.0,
            "rankSummary": "New Service Provider (Insufficient reviews to establish performance tier; minimum 3 required).",
            "breakdown": {
                "ratingScore": 0,
                "sentimentScore": 0,
                "volumeScore": 0,
                "consistencyScore": 0,
                "completionScore": 0
            },
            "topCategories": ["New Provider"],
            "thresholds": RANK_THRESHOLDS
        }

    # 1. Bayesian Confidence-Adjusted Star Rating (Weight: 40%)
    # Prior mean = 4.0, prior weight C = 5 reviews
    PRIOR_RATING = 4.0
    PRIOR_WEIGHT = 5.0
    bayesian_rating = ((PRIOR_WEIGHT * PRIOR_RATING) + sum(r.get("stars", 5) for r in ratings)) / (PRIOR_WEIGHT + total_reviews)
    rating_score_component = ((bayesian_rating - 1.0) / 4.0) * 100  # Map 1-5 to 0-100
    rating_score_component = max(0.0, min(100.0, rating_score_component))

    # 2. AI Sentiment & Feedback Quality (Weight: 25%)
    analyzed_feedbacks = [
        analyze_single_feedback(r.get("comment", ""), r.get("stars", 5))
        for r in ratings
    ]

    positive_count = sum(1 for af in analyzed_feedbacks if af["sentiment"] == "positive")
    negative_count = sum(1 for af in analyzed_feedbacks if af["sentiment"] == "negative")
    pos_feedback_pct = round((positive_count / total_reviews) * 100, 1)

    avg_sentiment = sum(af["sentimentScore"] for af in analyzed_feedbacks) / total_reviews
    # Map sentiment (-1.0 to +1.0) to (0 to 100)
    sentiment_score_component = ((avg_sentiment + 1.0) / 2.0) * 100

    # 3. Volume & Experience Track Record (Weight: 15%)
    # Saturated at 30 completed gigs
    volume_score_component = min(100.0, (completed_jobs / 30.0) * 100)

    # 4. Consistency & Recent Trend (Weight: 10%)
    # Penalize variance in star ratings
    star_values = [r.get("stars", 5) for r in ratings]
    mean_stars = sum(star_values) / total_reviews
    variance = sum((s - mean_stars) ** 2 for s in star_values) / total_reviews
    consistency_score_component = max(0.0, 100.0 - (variance * 25.0))

    # 5. Reliability & Complaint Avoidance (Weight: 10%)
    # Penalty for negative reviews or cancellations
    complaint_count = negative_count
    if bookings:
        declined_or_cancelled = sum(1 for b in bookings if b.get("status") in ["DECLINED", "CANCELLED"] and b.get("workerId") == worker.get("_id"))
        complaint_count += declined_or_cancelled

    complaint_penalty = min(100.0, (complaint_count / max(1, total_reviews)) * 100)
    reliability_score_component = max(0.0, 100.0 - (complaint_penalty * 1.5))

    # Composite Score (0-100)
    composite_score = (
        (rating_score_component * 0.40) +
        (sentiment_score_component * 0.25) +
        (volume_score_component * 0.15) +
        (consistency_score_component * 0.10) +
        (reliability_score_component * 0.10)
    )
    final_score = int(round(max(0.0, min(100.0, composite_score))))

    # Rank Mapping
    if final_score >= RANK_THRESHOLDS["Diamond"]:
        rank = "Diamond"
        summary = f"Diamond — {final_score}/100: Consistently exceptional service quality, outstanding customer sentiment ({pos_feedback_pct}% positive), and trusted track record."
    elif final_score >= RANK_THRESHOLDS["Platinum"]:
        rank = "Platinum"
        summary = f"Platinum — {final_score}/100: Highly dependable artisan with strong positive feedback ({pos_feedback_pct}% positive) and proven field reliability."
    elif final_score >= RANK_THRESHOLDS["Gold"]:
        rank = "Gold"
        summary = f"Gold — {final_score}/100: Good customer satisfaction and consistent performance across verified service tasks."
    elif final_score >= RANK_THRESHOLDS["Silver"]:
        rank = "Silver"
        summary = f"Silver — {final_score}/100: Developing track record with moderate customer feedback and steady delivery."
    else:
        rank = "Bronze"
        summary = f"Bronze — {final_score}/100: Baseline cooperative entry tier with improvement opportunities identified in customer feedback."

    # Top Category aggregations
    category_counts: Dict[str, int] = {}
    for af in analyzed_feedbacks:
        for cat in af["categories"]:
            if cat != "Complaint/Issue":
                category_counts[cat] = category_counts.get(cat, 0) + 1

    sorted_categories = sorted(category_counts.items(), key=lambda x: x[1], reverse=True)
    top_categories = [cat for cat, _ in sorted_categories[:3]] if sorted_categories else ["Service Quality"]

    # Statistical Rank Confidence
    confidence = min(0.99, 0.70 + (total_reviews * 0.02))

    return {
        "providerId": worker.get("_id"),
        "name": worker.get("name"),
        "rank": rank,
        "score": final_score,
        "rankConfidence": round(confidence, 2),
        "averageRating": round(avg_rating, 2),
        "totalReviews": total_reviews,
        "positiveFeedbackPercentage": pos_feedback_pct,
        "sentimentScore": round(avg_sentiment, 2),
        "rankSummary": summary,
        "breakdown": {
            "ratingScore": round(rating_score_component, 1),
            "sentimentScore": round(sentiment_score_component, 1),
            "volumeScore": round(volume_score_component, 1),
            "consistencyScore": round(consistency_score_component, 1),
            "reliabilityScore": round(reliability_score_component, 1)
        },
        "topCategories": top_categories,
        "thresholds": RANK_THRESHOLDS
    }
