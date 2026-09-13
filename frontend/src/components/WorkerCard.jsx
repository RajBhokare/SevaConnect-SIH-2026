import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { formatINR } from '../lib/utils';
import { Star, ShieldCheck, MapPin, Check, ArrowRight } from 'lucide-react';

export function WorkerCard({
  worker,
  onSelect,
  compact = false,
  showAction = true,
  actionLabel = 'Book',
  isFairMatch = true,
  className = ''
}) {
  if (!worker) return null;

  const initials = (worker.name || 'Worker')
    .split(' ')
    .filter(Boolean)
    .map((n) => n[0])
    .join('')
    .slice(0, 2);

  if (compact) {
    return (
      <div className={`p-3.5 bg-white rounded-xl border border-slate-200/90 flex items-start gap-3 text-left shadow-xs ${className}`}>
        <div className="w-10 h-10 rounded-lg bg-primary-900 text-white flex items-center justify-center font-bold text-xs flex-shrink-0">
          {initials}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-1">
            <h4 className="text-sm font-bold text-slate-900 truncate">{worker.name}</h4>
            <div className="flex items-center gap-1 text-xs font-semibold text-slate-900">
              <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              <span>{worker.rating?.toFixed(1) || '4.9'}</span>
            </div>
          </div>
          <p className="text-xs text-slate-600 font-medium">{worker.primarySkill || 'Artisan'}</p>
          <div className="mt-1 flex items-center gap-2 text-[11px] text-slate-500">
            <span className="inline-flex items-center gap-1 text-success-700 font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-success-600" />
              Verified
            </span>
            <span>•</span>
            <span className="truncate">{worker.cooperativeName || 'MSSC Cooperative'}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Card className={`overflow-hidden text-left border-slate-200/90 bg-white shadow-xs hover:shadow-card hover:border-slate-300 transition-all flex flex-col justify-between ${className}`}>
      <div className="p-5 space-y-4">
        {/* Worker Header */}
        <div className="flex items-start gap-3.5">
          <div className="relative flex-shrink-0">
            <div className="w-12 h-12 rounded-xl bg-primary-900 text-white flex items-center justify-center font-bold text-sm shadow-xs">
              {initials}
            </div>
            {worker.isAvailable && (
              <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-success-500 border-2 border-white" title="Available today" />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <h4 className="text-sm font-bold text-slate-900 truncate">{worker.name}</h4>
              <div className="flex items-center gap-1 text-xs font-bold text-slate-900">
                <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                <span>{worker.rating?.toFixed(1) || '4.9'}</span>
                <span className="text-[11px] text-slate-500 font-normal">({worker.reviewCount || 42})</span>
              </div>
            </div>

            <p className="text-xs font-semibold text-primary-800 mt-0.5">{worker.primarySkill || 'Artisan'}</p>

            <div className="mt-1 flex flex-wrap items-center gap-2 text-xs">
              <span className="inline-flex items-center gap-1 text-success-700 font-semibold text-[11px]">
                <ShieldCheck className="w-3.5 h-3.5 text-success-600" />
                Verified Worker
              </span>
              <span className="text-slate-300">•</span>
              <span className="text-slate-600 text-[11px] font-medium">{worker.experience || 5} yrs experience</span>
            </div>
          </div>
        </div>

        {/* Location & Availability Meta */}
        <div className="flex items-center justify-between text-xs text-slate-600 pt-2 border-t border-slate-100">
          <span className="flex items-center gap-1 truncate max-w-[180px]">
            <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
            {worker.location || 'Kothrud, Pune'} (~2.4 km)
          </span>
          <span className="font-medium text-slate-900">
            {worker.isAvailable ? (
              <span className="text-success-700 font-semibold">Available today</span>
            ) : (
              <span className="text-slate-500">Next available: Tomorrow</span>
            )}
          </span>
        </div>

        {/* FairMatch Trust Signal (No Gamified Tiers) */}
        {isFairMatch && (
          <div className="bg-slate-50 rounded-lg p-2.5 border border-slate-200/80 text-[11px] text-slate-600 space-y-1">
            <div className="flex items-center justify-between font-bold text-slate-900">
              <span className="text-primary-800 flex items-center gap-1">
                ⚡ FairMatch Recommended
              </span>
              <span className="text-[10px] font-semibold text-slate-500">{formatINR(worker.hourlyRate || 250)}/hr</span>
            </div>
            <div className="flex items-center gap-2 text-[10px] text-slate-500 flex-wrap">
              <span className="flex items-center gap-0.5"><Check className="w-3 h-3 text-success-600" /> Skill fit</span>
              <span className="flex items-center gap-0.5"><Check className="w-3 h-3 text-success-600" /> Nearby</span>
              <span className="flex items-center gap-0.5"><Check className="w-3 h-3 text-success-600" /> Fair workload</span>
            </div>
          </div>
        )}
      </div>

      {/* Action Footer */}
      {showAction && (
        <div className="px-5 pb-4 pt-0 flex items-center justify-between gap-3">
          <Link
            to={`/worker/profile/${worker._id}`}
            className="text-xs font-semibold text-slate-700 hover:text-primary-800 transition-colors py-2"
          >
            View Profile
          </Link>
          <Button
            size="sm"
            onClick={() => onSelect && onSelect(worker)}
            className="font-bold px-4"
          >
            {actionLabel} <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </Button>
        </div>
      )}
    </Card>
  );
}

export default WorkerCard;
