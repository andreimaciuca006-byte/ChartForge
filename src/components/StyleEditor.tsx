import React from 'react';
import { 
  BarChart2, LineChart, PieChart, AreaChart, 
  ScatterChart, Radar, Settings, Palette, 
  Type, Grid3X3, Layers, Layout
} from 'lucide-react';
import { useChartStore, ChartType } from '../store';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const CHART_TYPES: { type: ChartType; icon: any; label: string }[] = [
  { type: 'bar', icon: BarChart2, label: 'Bar' },
  { type: 'line', icon: LineChart, label: 'Line' },
  { type: 'area', icon: AreaChart, label: 'Area' },
  { type: 'pie', icon: PieChart, label: 'Pie' },
  { type: 'donut', icon: PieChart, label: 'Donut' },
  { type: 'scatter', icon: ScatterChart, label: 'Scatter' },
  { type: 'radar', icon: Radar, label: 'Radar' },
];

const PALETTES = [
  ['#6C47FF', '#947BFF', '#BCADFF', '#E3DEFF'],
  ['#10B981', '#34D399', '#6EE7B7', '#A7F3D0'],
  ['#F59E0B', '#FBBF24', '#FCD34D', '#FDE68A'],
  ['#EF4444', '#F87171', '#FCA5A5', '#FECACA'],
  ['#3B82F6', '#60A5FA', '#93C5FD', '#BFDBFE'],
];

export const StyleEditor: React.FC = () => {
  const { config, updateConfig } = useChartStore();

  return (
    <div className="flex flex-col gap-8 pb-8">
      {/* Chart Type */}
      <section>
        <div className="flex items-center gap-2 mb-4 text-slate-900 font-semibold">
          <Layout size={18} className="text-indigo-600" />
          <h3>Chart Type</h3>
        </div>
        <div className="grid grid-cols-4 gap-2">
          {CHART_TYPES.map((item) => (
            <button
              key={item.type}
              onClick={() => updateConfig({ type: item.type })}
              className={cn(
                "flex flex-col items-center justify-center p-3 rounded-xl border transition-all gap-2",
                config.type === item.type 
                  ? "bg-indigo-50 border-indigo-200 text-indigo-600 ring-1 ring-indigo-200" 
                  : "bg-white border-slate-100 text-slate-500 hover:border-slate-200 hover:bg-slate-50"
              )}
            >
              <item.icon size={20} />
              <span className="text-[10px] font-medium uppercase tracking-wider">{item.label}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Content */}
      <section>
        <div className="flex items-center gap-2 mb-4 text-slate-900 font-semibold">
          <Type size={18} className="text-indigo-600" />
          <h3>Content</h3>
        </div>
        <div className="space-y-4">
          <div>
            <label className="text-xs font-medium text-slate-500 mb-1 block">Title</label>
            <input
              type="text"
              value={config.title}
              onChange={(e) => updateConfig({ title: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-500 mb-1 block">Subtitle</label>
            <input
              type="text"
              value={config.subtitle}
              onChange={(e) => updateConfig({ subtitle: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>
      </section>

      {/* Appearance */}
      <section>
        <div className="flex items-center gap-2 mb-4 text-slate-900 font-semibold">
          <Palette size={18} className="text-indigo-600" />
          <h3>Appearance</h3>
        </div>
        <div className="space-y-6">
          <div>
            <label className="text-xs font-medium text-slate-500 mb-3 block">Color Palette</label>
            <div className="flex gap-3">
              {PALETTES.map((palette, i) => (
                <button
                  key={i}
                  onClick={() => updateConfig({ colors: palette })}
                  className={cn(
                    "w-8 h-8 rounded-full border-2 transition-all flex overflow-hidden",
                    config.colors[0] === palette[0] ? "border-indigo-600 scale-110" : "border-transparent"
                  )}
                >
                  {palette.map((color, j) => (
                    <div key={j} className="flex-1 h-full" style={{ backgroundColor: color }} />
                  ))}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <label className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={config.showGrid}
                onChange={(e) => updateConfig({ showGrid: e.target.checked })}
                className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="text-sm text-slate-600 group-hover:text-slate-900 transition-colors">Show Grid</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={config.showLegend}
                onChange={(e) => updateConfig({ showLegend: e.target.checked })}
                className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="text-sm text-slate-600 group-hover:text-slate-900 transition-colors">Show Legend</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={config.showTooltip}
                onChange={(e) => updateConfig({ showTooltip: e.target.checked })}
                className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="text-sm text-slate-600 group-hover:text-slate-900 transition-colors">Tooltip</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={config.animation}
                onChange={(e) => updateConfig({ animation: e.target.checked })}
                className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="text-sm text-slate-600 group-hover:text-slate-900 transition-colors">Animation</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={config.is3D}
                onChange={(e) => updateConfig({ is3D: e.target.checked })}
                className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="text-sm text-slate-600 group-hover:text-slate-900 transition-colors font-bold">3D Effect</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={config.diverseColors}
                onChange={(e) => updateConfig({ diverseColors: e.target.checked })}
                className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="text-sm text-slate-600 group-hover:text-slate-900 transition-colors font-bold">Diverse Colors</span>
            </label>
          </div>
        </div>
      </section>
    </div>
  );
};
