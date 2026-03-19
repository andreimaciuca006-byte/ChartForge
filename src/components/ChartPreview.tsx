import React from 'react';
import { 
  BarChart, Bar, LineChart, Line, AreaChart, Area, 
  PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer, ScatterChart, 
  Scatter, RadarChart, Radar, PolarGrid, PolarAngleAxis, 
  PolarRadiusAxis 
} from 'recharts';
import { useChartStore } from '../store';

export const ChartPreview: React.FC = () => {
  const { data, config } = useChartStore();

  const CustomBar = (props: any) => {
    const { fill, x, y, width, height } = props;
    if (!config.is3D) return <rect x={x} y={y} width={width} height={height} fill={fill} rx={4} ry={4} />;

    return (
      <g>
        {/* Shadow/Side effect for 3D */}
        <path
          d={`M ${x},${y} L ${x + 5},${y - 5} L ${x + width + 5},${y - 5} L ${x + width},${y} Z`}
          fill={fill}
          filter="brightness(0.8)"
        />
        <path
          d={`M ${x + width},${y} L ${x + width + 5},${y - 5} L ${x + width + 5},${y + height - 5} L ${x + width},${y + height} Z`}
          fill={fill}
          filter="brightness(0.6)"
        />
        <rect x={x} y={y} width={width} height={height} fill={fill} />
      </g>
    );
  };

  const renderChart = () => {
    const commonProps = {
      data,
      margin: { top: 30, right: 30, left: 20, bottom: 40 },
    };

    const legendProps: any = {
      verticalAlign: "bottom",
      align: "center",
      wrapperStyle: { paddingTop: '30px', paddingBottom: '10px' }
    };

    switch (config.type) {
      case 'bar':
        return (
          <BarChart {...commonProps}>
            {config.showGrid && <CartesianGrid strokeDasharray="3 3" opacity={0.1} vertical={false} />}
            <XAxis dataKey="label" label={{ value: config.xAxisLabel, position: 'bottom', offset: 20 }} />
            <YAxis label={{ value: config.yAxisLabel, angle: -90, position: 'insideLeft', offset: 10 }} />
            {config.showTooltip && <Tooltip cursor={{ fill: 'rgba(0,0,0,0.05)' }} />}
            {config.showLegend && <Legend {...legendProps} />}
            <Bar 
              dataKey="value" 
              shape={<CustomBar />}
              animationBegin={config.animation ? 0 : 10000}
            >
              {config.diverseColors && data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={config.colors[index % config.colors.length]} />
              ))}
              {!config.diverseColors && <Cell fill={config.colors[0]} />}
            </Bar>
          </BarChart>
        );
      case 'line':
        return (
          <LineChart {...commonProps}>
            {config.showGrid && <CartesianGrid strokeDasharray="3 3" opacity={0.1} />}
            <XAxis dataKey="label" />
            <YAxis />
            {config.showTooltip && <Tooltip />}
            {config.showLegend && <Legend {...legendProps} />}
            <Line 
              type="monotone" 
              dataKey="value" 
              stroke={config.colors[0]} 
              strokeWidth={config.is3D ? 5 : 3} 
              dot={{ r: 6, fill: config.colors[0], strokeWidth: 2, stroke: '#fff' }} 
              activeDot={{ r: 8 }} 
            />
          </LineChart>
        );
      case 'area':
        return (
          <AreaChart {...commonProps}>
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={config.colors[0]} stopOpacity={0.8}/>
                <stop offset="95%" stopColor={config.colors[0]} stopOpacity={0.1}/>
              </linearGradient>
            </defs>
            {config.showGrid && <CartesianGrid strokeDasharray="3 3" opacity={0.1} />}
            <XAxis dataKey="label" />
            <YAxis />
            {config.showTooltip && <Tooltip />}
            {config.showLegend && <Legend {...legendProps} />}
            <Area 
              type="monotone" 
              dataKey="value" 
              stroke={config.colors[0]} 
              strokeWidth={config.is3D ? 4 : 2}
              fillOpacity={1} 
              fill="url(#colorValue)" 
            />
          </AreaChart>
        );
      case 'pie':
      case 'donut':
        return (
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={config.type === 'donut' ? 60 : (config.is3D ? 20 : 0)}
              outerRadius={100}
              paddingAngle={config.is3D ? 8 : 5}
              dataKey="value"
              nameKey="label"
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            >
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={config.colors[index % config.colors.length]} 
                  stroke={config.is3D ? '#fff' : 'none'}
                  strokeWidth={2}
                />
              ))}
            </Pie>
            {config.showTooltip && <Tooltip />}
            {config.showLegend && <Legend {...legendProps} />}
          </PieChart>
        );
      case 'scatter':
        return (
          <ScatterChart {...commonProps}>
            {config.showGrid && <CartesianGrid strokeDasharray="3 3" opacity={0.1} />}
            <XAxis dataKey="label" name="Label" />
            <YAxis dataKey="value" name="Value" />
            {config.showTooltip && <Tooltip cursor={{ strokeDasharray: '3 3' }} />}
            {config.showLegend && <Legend />}
            <Scatter name="Data" data={data} fill={config.colors[0]} />
          </ScatterChart>
        );
      case 'radar':
        return (
          <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
            <PolarGrid />
            <PolarAngleAxis dataKey="label" />
            <PolarRadiusAxis />
            <Radar
              name="Value"
              dataKey="value"
              stroke={config.colors[0]}
              fill={config.colors[0]}
              fillOpacity={0.6}
            />
            {config.showTooltip && <Tooltip />}
          </RadarChart>
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-8 bg-white rounded-2xl shadow-sm border border-black/5 overflow-hidden">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-slate-900">{config.title}</h2>
        <p className="text-slate-500">{config.subtitle}</p>
      </div>
      <div className="w-full h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          {renderChart() || <div>Select a chart type</div>}
        </ResponsiveContainer>
      </div>
    </div>
  );
};
