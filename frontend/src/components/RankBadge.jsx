import React from 'react';
import { Crown, Award, Medal, Sparkles } from 'lucide-react';

export function RankBadge({
  rank = 'Silver',
  score,
  worker,
  size = 'md',
  className = ''
}) {
  const currentRank = (rank || worker?.rank || 'New').trim();
  const displayScore = score !== undefined ? score : (worker?.score || 0);

  // Single consistent color scale: Top tier gets accent gold (#C9973B), lower tiers use progressively lighter neutral tones
  const getTierStyle = (r, sc) => {
    const norm = r.toLowerCase();
    if (norm.includes('diamond') || norm.includes('gold') || sc >= 85) {
      return {
        style: 'bg-accent-50 text-accent-900 border-accent-300 font-bold shadow-xs',
        icon: Crown,
        iconColor: 'text-accent-600',
        label: `${currentRank} Provider`,
        tier: 'Top Tier'
      };
    }
    if (norm.includes('platinum') || (sc >= 70 && sc < 85)) {
      return {
        style: 'bg-slate-800 text-white border-slate-700 font-semibold',
        icon: Award,
        iconColor: 'text-slate-200',
        label: `${currentRank} Provider`,
        tier: 'Senior'
      };
    }
    if (norm.includes('silver') || (sc >= 50 && sc < 70)) {
      return {
        style: 'bg-slate-200 text-slate-800 border-slate-300 font-medium',
        icon: Medal,
        iconColor: 'text-slate-600',
        label: `${currentRank} Provider`,
        tier: 'Established'
      };
    }
    return {
      style: 'bg-slate-100 text-slate-600 border-slate-200',
      icon: Sparkles,
      iconColor: 'text-slate-400',
      label: currentRank === 'New' ? 'New Artisan' : `${currentRank} Provider`,
      tier: 'Standard'
    };
  };

  const { style, icon: Icon, iconColor, label } = getTierStyle(currentRank, displayScore);

  const sizeClasses = {
    sm: 'text-[10px] px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5',
    lg: 'text-sm px-3.5 py-1.5 gap-2'
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border transition-all select-none ${sizeClasses[size] || sizeClasses.md} ${style} ${className}`}
      title={`${label} (Score: ${displayScore})`}
    >
      <Icon className={`w-3.5 h-3.5 flex-shrink-0 ${iconColor}`} />
      <span>{label}</span>
    </span>
  );
}
