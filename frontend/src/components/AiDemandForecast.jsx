import React, { useState, useMemo } from 'react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { toast } from 'sonner';
import { Sparkles, TrendingUp, Calendar, Send, Check } from 'lucide-react';

const HISTORICAL_BASELINES = {
  Electrician: { base: 28, factor: 1.15 },
  Plumber: { base: 32, factor: 1.20 },
  Cleaning: { base: 22, factor: 1.40 },
  Appliance: { base: 18, factor: 1.10 },
  Carpentry: { base: 15, factor: 1.05 }
};

const LOCALITY_WEIGHTS = {
  Kothrud: 1.25,
  'Karve Nagar': 1.10,
  Shivajinagar: 1.30,
  Deccan: 1.05,
  Warje: 0.95,
  Aundh: 1.35
};

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const DAY_FACTORS = [0.85, 0.90, 0.95, 1.05, 1.20, 1.45, 1.35];

export function AiDemandForecast({ localities = ['Kothrud', 'Karve Nagar', 'Shivajinagar', 'Aundh'], categories = ['Electrician', 'Plumber', 'Cleaning', 'Appliance', 'Carpentry'] }) {
  const [selectedLocality, setSelectedLocality] = useState('Kothrud');
  const [selectedCategory, setSelectedCategory] = useState('Electrician');
  const [isWeekendSurge, setIsWeekendSurge] = useState(true);

  const forecastData = useMemo(() => {
    const config = HISTORICAL_BASELINES[selectedCategory] || { base: 25, factor: 1.1 };
    const locWeight = LOCALITY_WEIGHTS[selectedLocality] || 1.0;
    const surgeMultiplier = isWeekendSurge ? 1.2 : 1.0;

    return DAYS.map((day, idx) => {
      const dayFactor = DAY_FACTORS[idx];
      const historicalAvg = Math.round(config.base * locWeight * (idx < 5 ? 0.95 : 1.25));
      const aiPredicted = Math.round(config.base * locWeight * dayFactor * config.factor * surgeMultiplier);
      return { day, historicalAvg, aiPredicted };
    });
  }, [selectedCategory, selectedLocality, isWeekendSurge]);

  const totalWeeklyPredicted = forecastData.reduce((acc, d) => acc + d.aiPredicted, 0);
  const peakDay = forecastData.reduce((max, d) => (d.aiPredicted > max.aiPredicted ? d : max), forecastData[0]);
  const recommendedWorkers = Math.ceil(peakDay.aiPredicted / 3.5);
  const reserveQuota = Math.ceil(recommendedWorkers * 0.2);

  const handleBroadcastAllocation = () => {
    toast.success(
      `Broadcasted: ${recommendedWorkers} ${selectedCategory}s allocated for ${selectedLocality} (${peakDay.day})`
    );
  };

  return (
    <div className="space-y-6 text-left">
      {/* Header & Controls Strip (Subtle Violet for AI) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 bg-ai-50 border border-ai-200 text-slate-900 rounded-2xl shadow-xs">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-ai-100 text-ai-700 rounded-md text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            AI Demand Forecaster & Allocation
          </div>
          <h3 className="text-lg font-bold text-slate-900 tracking-tight">Predictive Workforce Mobilization</h3>
          <p className="text-xs text-slate-600">
            Seasonality projection & cluster mobilization for cooperative clusters
          </p>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={selectedLocality}
            onChange={(e) => setSelectedLocality(e.target.value)}
            className="px-3 py-1.5 bg-white text-slate-900 border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none"
          >
            {localities.map((loc) => (
              <option key={loc} value={loc}>{loc}</option>
            ))}
          </select>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-1.5 bg-white text-slate-900 border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          <button
            onClick={() => setIsWeekendSurge(!isWeekendSurge)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
              isWeekendSurge ? 'bg-ai-600 text-white border-ai-600' : 'bg-white text-slate-700 border-slate-200'
            }`}
          >
            Surge: {isWeekendSurge ? 'ON' : 'OFF'}
          </button>
        </div>
      </div>

      {/* Projection Chart & Allocation Recommendation */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Projection Chart */}
        <Card className="lg:col-span-2 p-5 border-slate-200 shadow-xs space-y-4 bg-white">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-bold text-slate-900">7-Day Demand Forecast ({selectedCategory} in {selectedLocality})</h4>
              <p className="text-xs text-slate-500">Predicted booking requests vs baseline average</p>
            </div>
            <span className="text-xs font-bold text-primary-900">{totalWeeklyPredicted} est. weekly jobs</span>
          </div>

          <div className="grid grid-cols-7 gap-2 pt-3 items-end h-44">
            {forecastData.map((d) => {
              const maxVal = Math.max(...forecastData.map(f => f.aiPredicted));
              const heightPct = Math.round((d.aiPredicted / maxVal) * 100);
              const isPeak = d.day === peakDay.day;
              return (
                <div key={d.day} className="flex flex-col items-center gap-1 h-full justify-end">
                  <span className="text-[10px] font-bold text-slate-700">{d.aiPredicted}</span>
                  <div
                    style={{ height: `${heightPct}%` }}
                    className={`w-full rounded-t-lg transition-all ${
                      isPeak ? 'bg-ai-600' : 'bg-primary-900'
                    }`}
                  />
                  <span className={`text-[11px] font-semibold mt-1 ${isPeak ? 'text-ai-700 font-bold' : 'text-slate-500'}`}>
                    {d.day}
                  </span>
                </div>
              );
            })}
          </div>
        </Card>

        {/* AI Allocation Recommendation Card */}
        <Card className="p-5 border-slate-200 shadow-xs space-y-3 bg-white flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-1.5 text-xs font-bold text-ai-700">
              <Sparkles className="w-3.5 h-3.5" />
              Workforce Allocation
            </div>
            <h4 className="text-base font-bold text-slate-900">
              Recommended: +{recommendedWorkers} {selectedCategory}s
            </h4>
            <div className="space-y-1.5 text-xs text-slate-600">
              <p>• Locality: <strong className="text-slate-900">{selectedLocality}</strong></p>
              <p>• Peak Day: <strong className="text-slate-900">{peakDay.day} ({peakDay.aiPredicted} requests)</strong></p>
              <p>• Emergency Reserve: <strong className="text-slate-900">{reserveQuota} on standby</strong></p>
            </div>
          </div>

          <Button
            size="sm"
            variant="ai"
            onClick={handleBroadcastAllocation}
            className="w-full font-bold shadow-xs gap-1.5"
          >
            <Send className="w-3.5 h-3.5" /> Broadcast to Artisans
          </Button>
        </Card>
      </div>
    </div>
  );
}

export default AiDemandForecast;
