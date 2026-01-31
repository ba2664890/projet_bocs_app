// ============================================
// FATI - Graphique de Comparaison (Barres)
// ============================================

import { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
  ReferenceLine,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { ArrowUpDown, Download } from 'lucide-react';

interface ComparisonChartProps {
  data: Array<Record<string, string | number>>;
  bars: Array<{
    key: string;
    name: string;
    color: string;
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
  sortable?: boolean;
  onExport?: () => void;
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

export const ComparisonChart = ({
  data,
  bars,
  title,
  subtitle,
  className,
  height = 350,
  showGrid = true,
  showLegend = true,
  showTooltip = true,
  referenceLine,
  yAxisUnit,
  loading = false,
  sortable = false,
  onExport,
}: ComparisonChartProps) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const [sortedData, setSortedData] = useState(data);
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: 'asc' | 'desc';
  } | null>(null);

  useEffect(() => {
    if (chartRef.current && !loading) {
      gsap.fromTo(
        chartRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }
      );
    }
  }, [loading]);

  useEffect(() => {
    setSortedData(data);
  }, [data]);

  const handleSort = (key: string) => {
    if (!sortable) return;

    const direction = sortConfig?.key === key && sortConfig.direction === 'desc' ? 'asc' : 'desc';
    setSortConfig({ key, direction });

    const sorted = [...sortedData].sort((a, b) => {
      const aValue = Number(a[key]) || 0;
      const bValue = Number(b[key]) || 0;
      return direction === 'asc' ? aValue - bValue : bValue - aValue;
    });

    setSortedData(sorted);
  };

  // Calculer les couleurs dynamiques basées sur les valeurs
  const getBarColor = (value: number, index: number) => {
    if (referenceLine) {
      if (value >= referenceLine * 1.1) return '#10b981'; // Excellent
      if (value >= referenceLine) return '#3b82f6'; // Good
      if (value >= referenceLine * 0.8) return '#f59e0b'; // Warning
      return '#ef4444'; // Critical
    }
    return bars[index % bars.length]?.color || '#3b82f6';
  };

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

  return (
    <Card ref={chartRef} className={className}>
      <CardHeader className="flex flex-row items-start justify-between">
        <div>
          {title && <CardTitle className="text-lg">{title}</CardTitle>}
          {subtitle && (
            <p className="text-sm text-muted-foreground">{subtitle}</p>
          )}
        </div>
        <div className="flex items-center gap-2">
          {sortable && (
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={() => handleSort(bars[0].key)}
            >
              <ArrowUpDown className="h-4 w-4" />
              Trier
            </Button>
          )}
          {onExport && (
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={onExport}
            >
              <Download className="h-4 w-4" />
              Exporter
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={height}>
          <BarChart
            data={sortedData}
            margin={{ top: 10, right: 30, left: 0, bottom: 5 }}
            layout="vertical"
          >
            {showGrid && (
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" horizontal={false} />
            )}
            <XAxis
              type="number"
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={{ stroke: 'hsl(var(--border))' }}
              tickFormatter={(value) => `${value}${yAxisUnit || ''}`}
            />
            <YAxis
              type="category"
              dataKey="name"
              tick={{ fontSize: 11 }}
              tickLine={false}
              axisLine={{ stroke: 'hsl(var(--border))' }}
              width={100}
            />
            {showTooltip && <Tooltip content={<CustomTooltip />} />}
            {showLegend && <Legend />}
            {referenceLine && (
              <ReferenceLine
                x={referenceLine}
                stroke="#ef4444"
                strokeDasharray="5 5"
                label="Objectif"
              />
            )}
            {bars.map((bar, barIndex) => (
              <Bar
                key={bar.key}
                dataKey={bar.key}
                name={bar.name}
                radius={[0, 4, 4, 0]}
                maxBarSize={30}
              >
                {sortedData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={getBarColor(Number(entry[bar.key]), barIndex)}
                  />
                ))}
              </Bar>
            ))}
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
