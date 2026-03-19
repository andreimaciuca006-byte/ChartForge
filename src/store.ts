import { create } from 'zustand';

export type ChartType = 
  | 'bar' | 'line' | 'area' | 'pie' | 'donut' | 'scatter' | 'radar' | 'composed';

export interface DataRow {
  id: string;
  label: string;
  value: number;
  [key: string]: any;
}

export interface ChartConfig {
  title: string;
  subtitle: string;
  type: ChartType;
  colors: string[];
  showGrid: boolean;
  showLegend: boolean;
  showTooltip: boolean;
  animation: boolean;
  is3D: boolean;
  diverseColors: boolean;
  theme: 'light' | 'dark';
  xAxisLabel: string;
  yAxisLabel: string;
}

interface ChartStore {
  data: DataRow[];
  config: ChartConfig;
  setData: (data: DataRow[]) => void;
  updateConfig: (config: Partial<ChartConfig>) => void;
  addRow: () => void;
  removeRow: (id: string) => void;
  updateRow: (id: string, field: keyof DataRow, value: any) => void;
}

export const useChartStore = create<ChartStore>((set) => ({
  data: [
    { id: '1', label: 'Jan', value: 400 },
    { id: '2', label: 'Feb', value: 300 },
    { id: '3', label: 'Mar', value: 600 },
    { id: '4', label: 'Apr', value: 800 },
    { id: '5', label: 'May', value: 500 },
  ],
  config: {
    title: 'Monthly Performance',
    subtitle: 'Overview of key metrics for 2024',
    type: 'bar',
    colors: ['#6C47FF', '#947BFF', '#BCADFF', '#E3DEFF'],
    showGrid: true,
    showLegend: true,
    showTooltip: true,
    animation: true,
    is3D: true,
    diverseColors: false,
    theme: 'light',
    xAxisLabel: 'Month',
    yAxisLabel: 'Value',
  },
  setData: (data) => set({ data }),
  updateConfig: (newConfig) => set((state) => ({ config: { ...state.config, ...newConfig } })),
  addRow: () => set((state) => ({
    data: [...state.data, { id: Math.random().toString(36).substr(2, 9), label: 'New', value: 0 }]
  })),
  removeRow: (id) => set((state) => ({
    data: state.data.filter((row) => row.id !== id)
  })),
  updateRow: (id, field, value) => set((state) => ({
    data: state.data.map((row) => row.id === id ? { ...row, [field]: value } : row)
  })),
}));
