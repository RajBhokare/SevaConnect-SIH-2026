import React from 'react';
import { Card } from './ui/Card';
import { formatINR } from '../lib/utils';
import { 
  Wrench, 
  Zap, 
  Hammer, 
  Sparkles, 
  Paintbrush, 
  Cpu, 
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

const iconMap = {
  Wrench: Wrench,
  Zap: Zap,
  Hammer: Hammer,
  Sparkles: Sparkles,
  Paintbrush: Paintbrush,
  Cpu: Cpu
};

export function ServiceCard({ service, onSelect, isSelected }) {
  const IconComponent = iconMap[service.icon] || Wrench;

  return (
    <Card
      onClick={() => onSelect && onSelect(service)}
      className={`cursor-pointer group hover:border-brand-500 hover:shadow-md transition-all duration-200 overflow-hidden ${
        isSelected ? 'border-2 border-brand-600 ring-4 ring-brand-100 bg-brand-50/20' : ''
      }`}
    >
      <div className="p-5">
        <div className="flex items-start justify-between">
          <div className="w-12 h-12 rounded-2xl bg-brand-50 group-hover:bg-brand-600 text-brand-600 group-hover:text-white transition-all flex items-center justify-center shadow-sm">
            <IconComponent className="w-6 h-6 transition-transform group-hover:scale-110" />
          </div>
          <span className="text-xs font-semibold text-slate-500 group-hover:text-brand-600 flex items-center gap-1 transition-colors">
            Starts at <span className="text-slate-900 font-bold">{formatINR(service.startingPrice)}</span>
          </span>
        </div>

        <div className="mt-4">
          <h4 className="text-base font-bold text-slate-900 group-hover:text-brand-600 transition-colors">
            {service.title}
          </h4>
          <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
            {service.description}
          </p>
        </div>

        {/* Popular Tasks Pills */}
        {service.popularTasks && service.popularTasks.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {service.popularTasks.slice(0, 3).map((task, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 bg-slate-100 group-hover:bg-brand-50 group-hover:text-brand-700 text-slate-600 rounded-md text-[11px] font-medium transition-colors"
              >
                {task}
              </span>
            ))}
          </div>
        )}

        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-brand-600">
          <span className="flex items-center gap-1 text-[11px] text-emerald-700 font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            Cooperative Verified
          </span>
          <span className="flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
            Book Service <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>
    </Card>
  );
}
