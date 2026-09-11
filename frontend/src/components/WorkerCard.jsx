import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { RankBadge } from './RankBadge';
import { formatINR } from '../lib/utils';
import {
  Star,
  ShieldCheck,
  Award,
  ArrowRight,
  Check
} from 'lucide-react';

export function WorkerCard({ worker, onRequestService, isRecommended = false }) {
  const isFairMatch = isRecommended || worker.isFairMatchRecommended;

  return (
    <Card
      className={`relative overflow-hidden transition-all duration-200 hover:shadow-card hover:border-brand-300 ${
        isFairMatch
          ? 'border-2 border-brand-500/80 bg-white shadow-subtle ring-2 ring-brand-50'
          : 'border-slate-200/90 bg-white shadow-subtle'
      }`}
    >
      {/* Recommended Banner */}
      {isFairMatch && (
        <div className="bg-brand-600 text-white text-[11px] font-semibold px-3.5 py-1.5 flex items-center justify-between tracking-wide">
          <span className="flex items-center gap-1.5">
            <Check className="w-3.5 h-3.5" />
            Recommended Match
          </span>
          <span className="text-[10px] text-brand-100 font-normal">
            Verified • Available
          </span>
        </div>
      )}

      <div className="p-5 text-left">
        <div className="flex items-start gap-3.5">
          {/* Avatar / Initials */}
          <div className="relative flex-shrink-0">
            <div className="w-12 h-12 rounded-xl bg-brand-700 text-white flex items-center justify-center font-bold text-base shadow-subtle">
              {worker.name
                .split(' ')
                .map((n) => n[0])
                .join('')
                .slice(0, 2)}
            </div>
            {worker.isAvailable && (
              <span
                className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-coop-500 border-2 border-white"
                title="Available Now"
              />
            )}
          </div>

          {/* Worker Details */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <h4 className="text-sm font-bold text-slate-900 truncate">
                {worker.name}
              </h4>
              <div className="flex items-center gap-1 px-2 py-0.5 bg-amber-50 border border-amber-200/80 rounded-lg text-xs font-bold text-amber-900">
                <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                <span>{worker.rating?.toFixed(1) || '4.8'}</span>
                <span className="text-[10px] text-amber-700 font-normal">
                  ({worker.reviewCount || 1})
                </span>
              </div>
            </div>

            {/* Cooperative, Rank & Verification Badges */}
            <div className="mt-1 flex flex-wrap items-center gap-1.5">
              <RankBadge worker={worker} rank={worker.rank} score={worker.score} size="sm" />
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-coop-700 bg-coop-50 px-2 py-0.5 rounded-md border border-coop-200/70">
                <ShieldCheck className="w-3 h-3 text-coop-600" />
                Verified
              </span>
              <span className="inline-flex items-center gap-1 text-[10px] font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                <Award className="w-3 h-3 text-brand-600" />
                Cooperative Member
              </span>
            </div>

            <p className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed">
              {worker.bio}
            </p>
          </div>
        </div>

        {/* Experience, Distance, and Skills Grid */}
        <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-3 gap-2 text-center">
          <div className="bg-slate-50/80 p-2 rounded-xl border border-slate-100">
            <p className="text-[10px] text-slate-500 uppercase font-semibold">Experience</p>
            <p className="text-xs font-bold text-slate-800">{worker.experience} Years</p>
          </div>
          <div className="bg-slate-50/80 p-2 rounded-xl border border-slate-100">
            <p className="text-[10px] text-slate-500 uppercase font-semibold">Completed</p>
            <p className="text-xs font-bold text-slate-800">{worker.completedJobs} Gigs</p>
          </div>
          <div className="bg-slate-50/80 p-2 rounded-xl border border-slate-100">
            <p className="text-[10px] text-slate-500 uppercase font-semibold">Base Rate</p>
            <p className="text-xs font-bold text-brand-700">{formatINR(worker.hourlyRate)}/hr</p>
          </div>
        </div>

        {/* Skills Chips */}
        {worker.skills && worker.skills.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1">
            {worker.skills.slice(0, 4).map((s, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md text-[10px] font-medium"
              >
                {s}
              </span>
            ))}
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
          <Link
            to={`/worker/profile/${worker._id}`}
            className="text-xs font-semibold text-slate-600 hover:text-brand-600 transition-colors px-2 py-1.5"
          >
            View Profile
          </Link>

          <Button
            variant={isFairMatch ? 'primary' : 'outline'}
            size="sm"
            onClick={() => onRequestService && onRequestService(worker)}
            className="font-semibold"
          >
            Request Service
            <ArrowRight className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
