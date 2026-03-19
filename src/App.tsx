import React from 'react';
import { 
  BarChart3, Download, Share2, 
  Settings2, Database, Sparkles,
  Github, Twitter, Linkedin
} from 'lucide-react';
import { DataEditor } from './components/DataEditor';
import { ChartPreview } from './components/ChartPreview';
import { StyleEditor } from './components/StyleEditor';
import { toPng } from 'html-to-image';
import { motion } from 'motion/react';

export default function App() {
  const [activeTab, setActiveTab] = React.useState<'data' | 'style'>('data');
  const chartRef = React.useRef<HTMLDivElement>(null);

  const handleDownload = async () => {
    if (chartRef.current === null) return;
    
    try {
      const dataUrl = await toPng(chartRef.current, { cacheBust: true, backgroundColor: '#fff' });
      const link = document.createElement('a');
      link.download = 'chartforge-export.png';
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Failed to download image', err);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FC] text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      {/* Header */}
      <header className="h-16 bg-white border-b border-black/5 px-6 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
            <BarChart3 size={24} />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight">ChartForge</h1>
            <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-widest">Beta v1.0</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={handleDownload}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-semibold text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-all"
          >
            <Download size={18} />
            Export PNG
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 rounded-lg text-sm font-semibold text-white hover:bg-indigo-700 shadow-md shadow-indigo-100 transition-all">
            <Share2 size={18} />
            Share
          </button>
        </div>
      </header>

      <main className="flex h-[calc(100vh-64px)] overflow-hidden">
        {/* Sidebar / Editor */}
        <aside className="w-[450px] bg-white border-r border-black/5 flex flex-col">
          <div className="flex border-b border-slate-100">
            <button
              onClick={() => setActiveTab('data')}
              className={`flex-1 flex items-center justify-center gap-2 py-4 text-sm font-bold transition-all border-b-2 ${
                activeTab === 'data' 
                  ? 'border-indigo-600 text-indigo-600 bg-indigo-50/30' 
                  : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
            >
              <Database size={18} />
              Data
            </button>
            <button
              onClick={() => setActiveTab('style')}
              className={`flex-1 flex items-center justify-center gap-2 py-4 text-sm font-bold transition-all border-b-2 ${
                activeTab === 'style' 
                  ? 'border-indigo-600 text-indigo-600 bg-indigo-50/30' 
                  : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
            >
              <Settings2 size={18} />
              Style
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === 'data' ? <DataEditor /> : <StyleEditor />}
            </motion.div>
          </div>

          {/* Sidebar Footer */}
          <div className="p-6 border-t border-slate-100 bg-slate-50/50">
            <div className="flex items-center gap-3 text-indigo-600 mb-2">
              <Sparkles size={16} />
              <span className="text-xs font-bold uppercase tracking-wider">AI Insights</span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Your data shows a positive trend. Consider using an <strong>Area Chart</strong> to emphasize volume growth over time.
            </p>
          </div>
        </aside>

        {/* Preview Area */}
        <section className="flex-1 p-12 flex flex-col items-center justify-center overflow-auto">
          <div ref={chartRef} className="w-full max-w-4xl aspect-[4/3] min-h-[600px]">
            <ChartPreview />
          </div>

          {/* Footer Info */}
          <div className="mt-12 flex items-center gap-8 opacity-40 hover:opacity-100 transition-opacity">
            <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
              <Github size={14} />
              <span>v1.0.4</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
              <Twitter size={14} />
              <span>@chartforge</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
              <Linkedin size={14} />
              <span>ChartForge AI</span>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
