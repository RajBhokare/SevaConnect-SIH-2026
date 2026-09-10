import React from 'react';
import { Award, Star, Diamond, Crown, Medal } from 'lucide-react';

export function RankBadge({ rank, className = '' }) {
  // Default to Bronze if rank is missing
  const currentRank = rank || 'Bronze';

  const rankConfig = {
    Bronze: {
      color: 'bg-orange-100 text-orange-800 border-orange-300',
      icon: <Medal className="w-4 h-4 text-orange-600" />,
      label: 'Bronze Provider'
    },
    Silver: {
      color: 'bg-slate-100 text-slate-700 border-slate-300',
      icon: <Award className="w-4 h-4 text-slate-500" />,
      label: 'Silver Provider'
    },
    Gold: {
      color: 'bg-yellow-100 text-yellow-800 border-yellow-400 shadow-sm',
      icon: <Star className="w-4 h-4 text-yellow-600 fill-yellow-600" />,
      label: 'Gold Provider'
    },
    Platinum: {
      color: 'bg-cyan-50 text-cyan-800 border-cyan-300 shadow-sm',
      icon: <Crown className="w-4 h-4 text-cyan-600" />,
      label: 'Platinum Provider'
    },
    Diamond: {
      color: 'bg-gradient-to-r from-purple-100 to-indigo-100 text-indigo-900 border-indigo-300 shadow-md ring-1 ring-indigo-200',
      icon: <Diamond className="w-4 h-4 text-indigo-600 fill-indigo-200" />,
      label: 'Diamond Elite'
    }
  };

  const config = rankConfig[currentRank] || rankConfig['Bronze'];

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold rounded-full border ${config.color} ${className}`}
      title={`AI-Ranked based on feedback & ratings`}
    >
      {config.icon}
      {config.label}
    </span>
  );
}
