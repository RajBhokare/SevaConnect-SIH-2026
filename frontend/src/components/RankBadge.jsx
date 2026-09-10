import React, { useState } from 'react';
import { 
  Award, 
  Star, 
  Crown, 
  Medal, 
  Gem, 
  Sparkles, 
  CheckCircle2, 
  Info, 
  TrendingUp, 
  X,
  ShieldCheck
} from 'lucide-react';

export function RankBadge({ 
  rank = 'Bronze', 
  score, 
  worker, 
  size = 'md', 
  showExplanation = true,
  className = '' 
}) {
  const [modalOpen, setModalOpen] = useState(false);
  const currentRank = rank || worker?.rank || 'Unranked';
  const displayScore = score !== undefined ? score : (worker?.score || 0);

  const rankConfig = {
    Diamond: {
      color: 'bg-gradient-to-r from-cyan-500/15 via-blue-500/15 to-indigo-500/15 text-blue-900 border-cyan-400/80 shadow-xs ring-1 ring-cyan-300/40',
      iconText: '💠',
      icon: <Gem className="w-3.5 h-3.5 text-cyan-600 fill-cyan-400" />,
      label: 'Diamond Provider',
      tagline: 'Top 5% Performance • Outstanding Satisfaction',
      scoreRange: '90–100',
      bgGlow: 'from-cyan-50 to-blue-50'
    },
    Platinum: {
      color: 'bg-gradient-to-r from-purple-500/15 to-indigo-500/15 text-purple-900 border-purple-300 shadow-xs ring-1 ring-purple-200',
      iconText: '💎',
      icon: <Crown className="w-3.5 h-3.5 text-purple-600 fill-purple-300" />,
      label: 'Platinum Provider',
      tagline: 'Top Tier Artisan • High Reliability & Ratings',
      scoreRange: '75–89',
      bgGlow: 'from-purple-50 to-indigo-50'
    },
    Gold: {
      color: 'bg-amber-50 text-amber-900 border-amber-300 shadow-xs',
      iconText: '🥇',
      icon: <Award className="w-3.5 h-3.5 text-amber-600 fill-amber-300" />,
      label: 'Gold Provider',
      tagline: 'Consistent Quality • Proven Customer Satisfaction',
      scoreRange: '60–74',
      bgGlow: 'from-amber-50 to-yellow-50'
    },
    Silver: {
      color: 'bg-slate-100 text-slate-800 border-slate-300',
      iconText: '🥈',
      icon: <Medal className="w-3.5 h-3.5 text-slate-500" />,
      label: 'Silver Provider',
      tagline: 'Steady Track Record • Verified Cooperative Member',
      scoreRange: '40–59',
      bgGlow: 'from-slate-50 to-zinc-50'
    },
    Bronze: {
      color: 'bg-orange-50 text-orange-900 border-orange-200',
      iconText: '🥉',
      icon: <Medal className="w-3.5 h-3.5 text-orange-600" />,
      label: 'Bronze Provider',
      tagline: 'Entry Cooperative Tier • Verified Foundation',
      scoreRange: '0–39',
      bgGlow: 'from-orange-50 to-amber-50'
    },
    Unranked: {
      color: 'bg-slate-100 text-slate-600 border-slate-200',
      iconText: '🆕',
      icon: <Sparkles className="w-3.5 h-3.5 text-slate-400" />,
      label: 'New Provider',
      tagline: 'Needs 3+ customer reviews for AI rank tier',
      scoreRange: '< 3 Reviews',
      bgGlow: 'from-slate-50 to-gray-50'
    }
  };

  const config = rankConfig[currentRank] || rankConfig['Unranked'];

  const sizeClasses = {
    sm: 'text-[10px] px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5',
    lg: 'text-sm px-3.5 py-1.5 gap-2'
  };

  const handleClick = (e) => {
    if (showExplanation) {
      e.stopPropagation();
      setModalOpen(true);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        className={`inline-flex items-center font-bold rounded-full border transition-all duration-150 hover:scale-[1.02] active:scale-95 cursor-pointer text-left ${sizeClasses[size]} ${config.color} ${className}`}
        title="Click to view AI Performance Rank & Feedback Analysis"
      >
        <span className="leading-none">{config.iconText}</span>
        <span>{config.label}</span>
        {displayScore > 0 && currentRank !== 'Unranked' && (
          <span className="ml-0.5 text-[10px] px-1.5 py-0.2 bg-black/10 rounded-full font-black opacity-90">
            {displayScore}
          </span>
        )}
        {showExplanation && (
          <Info className="w-3 h-3 ml-0.5 opacity-60 hover:opacity-100 transition-opacity" />
        )}
      </button>

      {/* Interactive Explanation Modal */}
      {modalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in"
          onClick={() => setModalOpen(false)}
        >
          <div 
            className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-md w-full overflow-hidden text-left p-6 space-y-5 transform transition-all"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-slate-900 to-indigo-900 text-white flex items-center justify-center text-2xl shadow-sm">
                  {config.iconText}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-slate-900">{config.label}</h3>
                    {displayScore > 0 && (
                      <span className="text-xs font-black px-2 py-0.5 rounded-full bg-brand-50 text-brand-700 border border-brand-200">
                        {displayScore}/100 Score
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500">{config.tagline}</p>
                </div>
              </div>
              <button 
                onClick={() => setModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* AI Summary Rationale */}
            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 space-y-1.5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                <Sparkles className="w-4 h-4 text-brand-600" />
                AI Quality & Sentiment Evaluation
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                {worker?.rankSummary || `${config.label} — Evaluated based on customer review sentiment, rating consistency, and completed gig volume.`}
              </p>
            </div>

            {/* Performance Metrics Breakdown */}
            {worker && (
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                  <p className="text-[10px] text-slate-500 font-semibold uppercase">Avg Rating</p>
                  <p className="text-sm font-black text-amber-900 mt-0.5">
                    ⭐ {worker.rating?.toFixed(1) || '4.8'}
                  </p>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                  <p className="text-[10px] text-slate-500 font-semibold uppercase">Positive Sentiment</p>
                  <p className="text-sm font-black text-emerald-700 mt-0.5">
                    {worker.positiveFeedbackPercentage || 95}%
                  </p>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                  <p className="text-[10px] text-slate-500 font-semibold uppercase">Reviews Count</p>
                  <p className="text-sm font-black text-slate-800 mt-0.5">
                    {worker.reviewCount || 0} Reviews
                  </p>
                </div>
              </div>
            )}

            {/* Top Recognized Strengths / Feedback Categories */}
            {worker?.topCategories && worker.topCategories.length > 0 && (
              <div className="space-y-1.5">
                <p className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                  Top Recognized Qualities
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {worker.topCategories.map((cat, i) => (
                    <span 
                      key={i} 
                      className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200/70"
                    >
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      {cat}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Tier Reference Scale */}
            <div className="pt-3 border-t border-slate-100 space-y-2 text-xs">
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Cooperative AI Ranking Scale (0–100)
              </p>
              <div className="grid grid-cols-5 gap-1 text-center text-[10px] font-bold">
                <div className={`p-1.5 rounded-lg border ${currentRank === 'Bronze' ? 'bg-orange-100 border-orange-300 text-orange-900' : 'bg-slate-50 text-slate-600'}`}>
                  🥉 Bronze<br/><span className="font-normal text-[9px]">0–39</span>
                </div>
                <div className={`p-1.5 rounded-lg border ${currentRank === 'Silver' ? 'bg-slate-200 border-slate-400 text-slate-900' : 'bg-slate-50 text-slate-600'}`}>
                  🥈 Silver<br/><span className="font-normal text-[9px]">40–59</span>
                </div>
                <div className={`p-1.5 rounded-lg border ${currentRank === 'Gold' ? 'bg-amber-100 border-amber-300 text-amber-900' : 'bg-slate-50 text-slate-600'}`}>
                  🥇 Gold<br/><span className="font-normal text-[9px]">60–74</span>
                </div>
                <div className={`p-1.5 rounded-lg border ${currentRank === 'Platinum' ? 'bg-purple-100 border-purple-300 text-purple-900' : 'bg-slate-50 text-slate-600'}`}>
                  💎 Plat<br/><span className="font-normal text-[9px]">75–89</span>
                </div>
                <div className={`p-1.5 rounded-lg border ${currentRank === 'Diamond' ? 'bg-cyan-100 border-cyan-400 text-blue-900 font-black' : 'bg-slate-50 text-slate-600'}`}>
                  💠 Diam<br/><span className="font-normal text-[9px]">90–100</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}
