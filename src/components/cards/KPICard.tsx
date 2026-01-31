// ============================================
// FATI - Carte KPI (Key Performance Indicator)
// ============================================

import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import type { KPIData } from '@/types';

interface KPICardProps {
  data: KPIData;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showTrend?: boolean;
  onClick?: () => void;
}

const sizeClasses = {
  sm: 'p-4',
  md: 'p-5',
  lg: 'p-6',
};

const valueSizeClasses = {
  sm: 'text-2xl',
  md: 'text-3xl',
  lg: 'text-4xl',
};

export const KPICard = ({
  data,
  className,
  size = 'md',
  showTrend = true,
  onClick,
}: KPICardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const valueRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (valueRef.current) {
      gsap.fromTo(
        valueRef.current,
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out', delay: 0.1 }
      );
    }
  }, [data.value]);

  const getVariationIcon = () => {
    if (!data.variation) return <Minus className="h-4 w-4" />;
    if (data.variation > 0) {
      return data.variationType === 'positive' ? (
        <TrendingUp className="h-4 w-4" />
      ) : (
        <TrendingDown className="h-4 w-4" />
      );
    }
    return data.variationType === 'positive' ? (
      <TrendingDown className="h-4 w-4" />
    ) : (
      <TrendingUp className="h-4 w-4" />
    );
  };

  const getVariationColor = () => {
    if (!data.variation) return 'text-muted-foreground';
    const isPositive = data.variation > 0;
    const isGood = data.variationType === 'positive';
    
    if (isPositive && isGood) return 'text-emerald-600 dark:text-emerald-400';
    if (isPositive && !isGood) return 'text-red-600 dark:text-red-400';
    if (!isPositive && isGood) return 'text-emerald-600 dark:text-emerald-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getAchievementColor = (rate: number) => {
    if (rate >= 90) return 'bg-emerald-500';
    if (rate >= 70) return 'bg-blue-500';
    if (rate >= 50) return 'bg-amber-500';
    return 'bg-red-500';
  };

  const getColorClass = (color?: string) => {
    switch (color) {
      case 'blue': return 'bg-blue-500';
      case 'green': return 'bg-emerald-500';
      case 'teal': return 'bg-teal-500';
      case 'purple': return 'bg-purple-500';
      case 'amber': return 'bg-amber-500';
      case 'red': return 'bg-red-500';
      default: return 'bg-primary';
    }
  };

  const getStrokeColor = (color?: string) => {
    switch (color) {
      case 'blue': return 'text-blue-500';
      case 'green': return 'text-emerald-500';
      case 'teal': return 'text-teal-500';
      case 'purple': return 'text-purple-500';
      case 'amber': return 'text-amber-500';
      case 'red': return 'text-red-500';
      default: return 'text-primary';
    }
  };

  return (
    <Card
      ref={cardRef}
      className={`group relative overflow-hidden transition-all duration-300 hover:shadow-elevated ${
        onClick ? 'cursor-pointer' : ''
      } ${className || ''}`}
      onClick={onClick}
    >
      <CardContent className={`relative ${sizeClasses[size]}`}>
        {/* Background decoration */}
        <div
          className={`absolute -right-4 -top-4 h-24 w-24 rounded-full opacity-10 transition-transform duration-500 group-hover:scale-150 ${
            getColorClass(data.color)
          }`}
        />

        {/* Content */}
        <div className="relative">
          {/* Title */}
          <p className="text-sm font-medium text-muted-foreground">{data.title}</p>

          {/* Value */}
          <div className="mt-2 flex items-baseline gap-2">
            <span
              ref={valueRef}
              className={`font-bold tracking-tight text-foreground ${valueSizeClasses[size]}`}
            >
              {data.formattedValue}
            </span>
            {data.unit && data.unit !== '%' && data.unit !== '‰' && (
              <span className="text-sm text-muted-foreground">{data.unit}</span>
            )}
          </div>

          {/* Variation */}
          {showTrend && data.variation !== undefined && (
            <div className="mt-2 flex items-center gap-2">
              <span className={`flex items-center gap-1 text-sm font-medium ${getVariationColor()}`}>
                {getVariationIcon()}
                {Math.abs(data.variation).toFixed(1)}%
              </span>
              <span className="text-xs text-muted-foreground">vs période précédente</span>
            </div>
          )}

          {/* Target & Achievement */}
          {data.target !== undefined && data.achievementRate !== undefined && (
            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Objectif: {data.target}</span>
                <span className="font-medium">{data.achievementRate.toFixed(0)}%</span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${getAchievementColor(data.achievementRate)}`}
                  style={{ width: `${Math.min(data.achievementRate, 100)}%` }}
                />
              </div>
            </div>
          )}

          {/* Mini trend chart */}
          {showTrend && data.trend && data.trend.length > 0 && (
            <div className="mt-4">
              <svg
                viewBox={`0 0 ${data.trend.length - 1} 30`}
                className="h-8 w-full"
                preserveAspectRatio="none"
              >
                <polyline
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className={`opacity-50 ${getStrokeColor(data.color)}`}
                  points={data.trend
                    .map((v, i) => {
                      const min = Math.min(...data.trend!);
                      const max = Math.max(...data.trend!);
                      const range = max - min || 1;
                      const y = 30 - ((v - min) / range) * 25 - 2.5;
                      return `${i},${y}`;
                    })
                    .join(' ')}
                />
              </svg>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
