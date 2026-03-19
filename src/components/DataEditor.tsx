import React from 'react';
import { Plus, Trash2, Wand2 } from 'lucide-react';
import { useChartStore } from '../store';
import { parseDataFromText } from '../services/aiService';
import { motion, AnimatePresence } from 'motion/react';

export const DataEditor: React.FC = () => {
  const { data, addRow, removeRow, updateRow, setData, updateConfig } = useChartStore();
  const [aiInput, setAiInput] = React.useState('');
  const [isAiLoading, setIsAiLoading] = React.useState(false);

  const handleAiGenerate = async () => {
    if (!aiInput.trim()) return;
    setIsAiLoading(true);
    try {
      const result = await parseDataFromText(aiInput);
      setData(result.data);
      updateConfig({ type: result.suggestedType, title: result.title });
      setAiInput('');
    } catch (error) {
      console.error("AI Generation failed", error);
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full gap-6">
      {/* AI Input Section */}
      <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100">
        <label className="text-xs font-semibold text-indigo-600 uppercase tracking-wider mb-2 block">
          AI Data Assistant
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={aiInput}
            onChange={(e) => setAiInput(e.target.value)}
            placeholder="e.g., Sales for 2024: Jan 100, Feb 150, Mar 200..."
            className="flex-1 bg-white border border-indigo-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            onClick={handleAiGenerate}
            disabled={isAiLoading}
            className="bg-indigo-600 hover:bg-indigo-700 text-white p-2 rounded-lg transition-colors disabled:opacity-50"
          >
            {isAiLoading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Wand2 size={20} />
            )}
          </button>
        </div>
      </div>

      {/* Table Section */}
      <div className="flex-1 overflow-auto bg-white rounded-xl border border-black/5 shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead className="sticky top-0 bg-slate-50 border-bottom border-slate-100">
            <tr>
              <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Label</th>
              <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Value</th>
              <th className="px-4 py-3 w-10"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            <AnimatePresence initial={false}>
              {data.map((row) => (
                <motion.tr
                  key={row.id}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="group hover:bg-slate-50/50 transition-colors"
                >
                  <td className="px-4 py-2">
                    <input
                      type="text"
                      value={row.label}
                      onChange={(e) => updateRow(row.id, 'label', e.target.value)}
                      className="w-full bg-transparent border-none focus:ring-0 text-sm font-medium text-slate-700"
                    />
                  </td>
                  <td className="px-4 py-2">
                    <input
                      type="number"
                      value={row.value}
                      onChange={(e) => updateRow(row.id, 'value', parseFloat(e.target.value) || 0)}
                      className="w-full bg-transparent border-none focus:ring-0 text-sm text-slate-600"
                    />
                  </td>
                  <td className="px-4 py-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => removeRow(row.id)}
                      className="text-slate-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      <button
        onClick={addRow}
        className="flex items-center justify-center gap-2 py-3 border-2 border-dashed border-slate-200 rounded-xl text-slate-400 hover:text-indigo-600 hover:border-indigo-200 hover:bg-indigo-50 transition-all text-sm font-medium"
      >
        <Plus size={18} />
        Add Row
      </button>
    </div>
  );
};
