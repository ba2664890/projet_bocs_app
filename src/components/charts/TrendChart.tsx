// ============================================
// FATI - Graphique de Tendance
// ============================================

import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface TrendChartProps {
  data: Array<Record<string, string | number>>;
  lines: Array<{
    key: string;
    name: string;
    color: string;
    type?: 'line' | 'area';
  }>;
  title?: string;
  subtitle?: string;
  className?: string;
  height?: number;
  showGrid?: boolean;
  showLegend?: boolean;
  showTooltip?: boolean;
  referenceLine?: number;
  yAxisUnit?: string;
  loading?: boolean;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border bg-white p-3 shadow-lg dark:bg-slate-900">
        <p className="mb-2 text-sm font-medium">{label}</p>
        <div className="space-y-1">
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center gap-2 text-sm">
              <div
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-muted-foreground">{entry.name}:</span>
              <span className="font-medium">{entry.value}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

export const TrendChart = ({
  data,
  lines,
  title,
  subtitle,
  className,
  height = 300,
  showGrid = true,
  showLegend = true,
  showTooltip = true,
  referenceLine,
  yAxisUnit,
  loading = false,
}: TrendChartProps) => {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chartRef.current && !loading) {
      gsap.fromTo(
        chartRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }
      );
    }
  }, [loading]);

  if (loading) {
    return (
      <Card className={className}>
        {title && (
          <CardHeader>
            <Skeleton className="h-6 w-48" />
            {subtitle && <Skeleton className="mt-2 h-4 w-32" />}
          </CardHeader>
        )}
        <CardContent>
          <Skeleton className="w-full" style={{ height }} />
        </CardContent>
      </Card>
    );
  }

  // Calculer la tendance globale
  const calculateTrend = () => {
    if (data.length < 2) return { direction: 'neutral', value: 0 };
    
    const firstValue = Number(data[0][lines[0].key]) || 0;
    const lastValue = Number(data[data.length - 1][lines[0].key]) || 0;
    const change = ((lastValue - firstValue) / firstValue) * 100;
    
    return {
      direction: change > 0 ? 'up' : change < 0 ? 'down' : 'neutral',
      value: Math.abs(change).toFixed(1),
    };
  };

  const trend = calculateTrend();

  return (
    <Card ref={chartRef} className={className}>
      {(title || trend) && (
        <CardHeader className="flex flex-row items-start justify-between">
          <div>
            {title && <CardTitle className="text-lg">{title}</CardTitle>}
            {subtitle && (
              <p className="text-sm text-muted-foreground">{subtitle}</p>
            )}
          </div>
          <div className="flex items-center gap-2">
            {trend.direction === 'up' && (
              <div className="flex items-center gap-1 text-sm text-emerald-600">
                <TrendingUp className="h-4 w-4" />
                <span>+{trend.value}%</span>
              </div>
            )}
            {trend.direction === 'down' && (
              <div className="flex items-center gap-1 text-sm text-red-600">
                <TrendingDown className="h-4 w-4" />
                <span>-{trend.value}%</span>
              </div>
            )}
            {trend.direction === 'neutral' && (
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Minus className="h-4 w-4" />
                <span>Stable</span>
              </div>
            )}
          </div>
        </CardHeader>
      )}
      <CardContent>
        <ResponsiveContainer width="100%" height={height}>
          {lines.some((l) => l.type === 'area') ? (
            <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              {showGrid && (
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              )}
              <XAxis
                dataKey="name"
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={{ stroke: 'hsl(var(--border))' }}
              />
              <YAxis
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value}${yAxisUnit || ''}`}
              />
              {showTooltip && <Tooltip content={<CustomTooltip />} />}
              {showLegend && <Legend />}
              {referenceLine && (
                <ReferenceLine
                  y={referenceLine}
                  stroke="#ef4444"
                  strokeDasharray="5 5"
                  label="Objectif"
                />
              )}
              {lines.map((line) => (
                <Area
                  key={line.key}
                  type="monotone"
                  dataKey={line.key}
                  name={line.name}
                  stroke={line.color}
                  fill={line.color}
                  fillOpacity={0.2}
                  strokeWidth={2}
                  dot={{ r: 4, strokeWidth: 2 }}
                  activeDot={{ r: 6 }}
                />
              ))}
            </AreaChart>
          ) : (
            <LineChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              {showGrid && (
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              )}
              <XAxis
                dataKey="name"
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={{ stroke: 'hsl(var(--border))' }}
              />
              <YAxis
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value}${yAxisUnit || ''}`}
              />
              {showTooltip && <Tooltip content={<CustomTooltip />} />}
              {showLegend && <Legend />}
              {referenceLine && (
                <ReferenceLine
                  y={referenceLine}
                  stroke="#ef4444"
                  strokeDasharray="5 5"
                  label="Objectif"
                />
              )}
              {lines.map((line) => (
                <Line
                  key={line.key}
                  type="monotone"
                  dataKey={line.key}
                  name={line.name}
                  stroke={line.color}
                  strokeWidth={2}
                  dot={{ r: 4, strokeWidth: 2, fill: 'white' }}
                  activeDot={{ r: 6 }}
                />
              ))}
            </LineChart>
          )}
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
