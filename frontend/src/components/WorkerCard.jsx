import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';
import { RankBadge } from './RankBadge';
import { formatINR } from '../lib/utils';
import {
  Star,
  ShieldCheck,
  MapPin,
  Clock,
  Award,
  CheckCircle,
  Sparkles,
  ArrowRight
} from 'lucide-react';

export function WorkerCard({ worker, onRequestService, isRecommended = false }) {
  const isFairMatch = isRecommended || worker.isFairMatchRecommended;

  return (
    <Card
      className={`relative overflow-hidden transition-all duration-200 hover:shadow-md hover:border-brand-300 ${
        isFairMatch
          ? 'border-2 border-brand-500 bg-gradient-to-b from-blue-50/30 to-white shadow-sm ring-2 ring-brand-100'
          : 'border-slate-200'
      }`}
    >
      {/* FairMatch Recommended Flag - No AI jargon, simple user benefit */}
      {isFairMatch && (
        <div className="bg-brand-600 text-white text-[11px] font-bold px-3 py-1 flex items-center justify-between tracking-wide uppercase">
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 fill-current" />
            Recommended For You
          </span>
          <span className="text-[10px] text-blue-100 font-normal">
            Optimal Availability & Proximity
          </span>
        </div>
      )}

      <div className="p-5">
        <div className="flex items-start gap-4">
          {/* Avatar / Initials */}
          <div className="relative flex-shrink-0">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-600 to-indigo-700 text-white flex items-center justify-center font-bold text-lg shadow-sm">
              {worker.name
                .split(' ')
                .map((n) => n[0])
                .join('')
                .slice(0, 2)}
            </div>
            {worker.isAvailable && (
              <span
                className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white"
                title="Currently Available"
              />
            )}
          </div>

          {/* Worker Details */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <h4 className="text-base font-bold text-slate-900 truncate">
                {worker.name}
              </h4>
              <div className="flex items-center gap-1 px-2 py-0.5 bg-amber-50 border border-amber-200 rounded-lg text-xs font-bold text-amber-900">
                <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                <span>{worker.rating?.toFixed(1) || '4.8'}</span>
                <span className="text-[10px] text-amber-700 font-normal">
                  ({worker.reviewCount || 1})
                </span>
              </div>
            </div>

            {/* Cooperative, Rank & Verification Badges */}
            <div className="mt-1 flex flex-wrap items-center gap-1.5">
              <RankBadge rank={worker.rank} />
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/70">
                <ShieldCheck className="w-3 h-3 text-emerald-600" />
                Verified Worker
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                <Award className="w-3 h-3 text-brand-600" />
                {worker.cooperativeName?.split(' ')[0] || 'Cooperative'} Member
              </span>
            </div>

            <p className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed">
              {worker.bio}
            </p>
          </div>
        </div>

        {/* Experience, Distance, and Skills Grid */}
        <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-3 gap-2 text-center">
          <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
            <p className="text-[10px] text-slate-500 uppercase font-semibold">Experience</p>
            <p className="text-xs font-bold text-slate-800">{worker.experience} Years</p>
          </div>
          <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
            <p className="text-[10px] text-slate-500 uppercase font-semibold">Completed</p>
            <p className="text-xs font-bold text-slate-800">{worker.completedJobs} Gigs</p>
          </div>
          <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
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
                className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-[10px] font-medium"
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
            <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
