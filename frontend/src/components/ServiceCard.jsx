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
      className={`cursor-pointer group hover:border-slate-300 hover:shadow-card transition-all duration-150 overflow-hidden bg-white text-left ${
        isSelected ? 'border-2 border-primary-900 bg-primary-50/20' : 'border-slate-200/90 shadow-xs'
      }`}
    >
      <div className="p-4 sm:p-5 flex flex-col justify-between h-full space-y-3">
        <div>
          <div className="flex items-start justify-between">
            <div className="w-10 h-10 rounded-xl bg-slate-100 group-hover:bg-primary-900 text-slate-700 group-hover:text-white transition-colors flex items-center justify-center">
              <IconComponent className="w-5 h-5" />
            </div>
            <span className="text-xs font-semibold text-slate-500">
              From <span className="text-slate-900 font-bold">{formatINR(service.startingPrice)}</span>
            </span>
          </div>

          <div className="mt-3.5">
            <h4 className="text-sm font-bold text-slate-900 group-hover:text-primary-900 transition-colors">
              {service.title}
            </h4>
            <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
              {service.description}
            </p>
          </div>
        </div>

        {/* Popular Tasks Pills */}
        {Array.isArray(service?.popularTasks) && service.popularTasks.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {service.popularTasks.slice(0, 3).map((task, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md text-[10px] font-medium"
              >
                {task}
              </span>
            ))}
          </div>
        )}

        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold">
          <span className="flex items-center gap-1 text-[11px] text-success-700 font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-success-600" />
            Verified Artisans
          </span>
          <span className="flex items-center gap-1 text-primary-900 font-semibold text-[11px] group-hover:translate-x-0.5 transition-transform">
            Book <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>
    </Card>
  );
}

export default ServiceCard;
