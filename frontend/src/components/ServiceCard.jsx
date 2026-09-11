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
  ShieldCheck,
  Users,
  HeartHandshake,
  Car
} from 'lucide-react';

const iconMap = {
  Wrench: Wrench,
  Zap: Zap,
  Hammer: Hammer,
  Sparkles: Sparkles,
  Paintbrush: Paintbrush,
  Cpu: Cpu,
  Users: Users,
  HeartHandshake: HeartHandshake,
  ShieldCheck: Car
};

export function ServiceCard({ service, onSelect, isSelected }) {
  const IconComponent = iconMap[service.icon] || Wrench;

  return (
    <Card
      onClick={() => onSelect && onSelect(service)}
      className={`cursor-pointer group hover:border-brand-400 hover:shadow-card transition-all duration-200 overflow-hidden bg-white ${
        isSelected ? 'border-2 border-brand-600 ring-2 ring-brand-100 bg-brand-50/20' : 'border-slate-200/90 shadow-subtle'
      }`}
    >
      <div className="p-5 text-left">
        <div className="flex items-start justify-between">
          <div className="w-11 h-11 rounded-xl bg-brand-50 group-hover:bg-brand-600 text-brand-600 group-hover:text-white transition-all flex items-center justify-center shadow-subtle">
            <IconComponent className="w-5 h-5 transition-transform group-hover:scale-110" />
          </div>
          <span className="text-xs font-semibold text-slate-500 group-hover:text-brand-700 flex items-center gap-1 transition-colors">
            Starts at <span className="text-slate-900 font-bold">{formatINR(service.startingPrice)}</span>
          </span>
        </div>

        <div className="mt-4">
          <h4 className="text-sm font-bold text-slate-900 group-hover:text-brand-700 transition-colors">
            {service.title}
          </h4>
          <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
            {service.description}
          </p>
        </div>

        {/* Popular Tasks Pills */}
        {service.popularTasks && service.popularTasks.length > 0 && (
          <div className="mt-3.5 flex flex-wrap gap-1.5">
            {service.popularTasks.slice(0, 3).map((task, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 bg-slate-100/90 group-hover:bg-brand-50 group-hover:text-brand-700 text-slate-600 rounded-md text-[10px] font-medium transition-colors"
              >
                {task}
              </span>
            ))}
          </div>
        )}

        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-brand-600">
          <span className="flex items-center gap-1 text-[10px] text-coop-700 font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-coop-600" />
            Verified Artisan
          </span>
          <span className="flex items-center gap-1 group-hover:translate-x-0.5 transition-transform text-brand-700 font-semibold text-[11px]">
            Explore <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>
    </Card>
  );
}
