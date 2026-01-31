// ============================================
// FATI - Carte Alerte
// ============================================

import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  AlertTriangle,
  TrendingDown,
  Clock,
  CheckCircle,
  X,
  MapPin,
  BarChart3,
  AlertCircle,
} from 'lucide-react';
import type { Alert, AlertSeverity, AlertType } from '@/types';

interface AlertCardProps {
  alert: Alert;
  className?: string;
  compact?: boolean;
  onMarkAsRead?: (id: string) => void;
  onClick?: () => void;
}

const severityConfig: Record<AlertSeverity, { color: string; icon: React.ElementType; label: string }> = {
  critical: {
    color: 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800',
    icon: AlertTriangle,
    label: 'Critique',
  },
  high: {
    color: 'bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-800',
    icon: AlertCircle,
    label: 'Élevée',
  },
  medium: {
    color: 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800',
    icon: AlertTriangle,
    label: 'Moyenne',
  },
  low: {
    color: 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800',
    icon: AlertCircle,
    label: 'Faible',
  },
  info: {
    color: 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700',
    icon: CheckCircle,
    label: 'Info',
  },
};

const typeConfig: Record<AlertType, { label: string; icon: React.ElementType }> = {
  threshold: { label: 'Seuil', icon: BarChart3 },
  trend: { label: 'Tendance', icon: TrendingDown },
  anomaly: { label: 'Anomalie', icon: AlertCircle },
  delay: { label: 'Retard', icon: Clock },
  validation: { label: 'Validation', icon: CheckCircle },
};

export const AlertCard = ({
  alert,
  className,
  compact = false,
  onMarkAsRead,
  onClick,
}: AlertCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const severity = severityConfig[alert.severity];
  const type = typeConfig[alert.type];
  const SeverityIcon = severity.icon;
  const TypeIcon = type.icon;

  useEffect(() => {
    if (cardRef.current && !alert.isRead) {
      gsap.fromTo(
        cardRef.current,
        { opacity: 0, x: -20 },
        { opacity: 1, x: 0, duration: 0.4, ease: 'power2.out' }
      );
    }
  }, [alert.isRead]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (hours < 1) return 'Il y a quelques minutes';
    if (hours < 24) return `Il y a ${hours}h`;
    if (days < 7) return `Il y a ${days}j`;
    return date.toLocaleDateString('fr-FR');
  };

  if (compact) {
    return (
      <div
        ref={cardRef}
        className={cn(
          'flex items-start gap-3 rounded-lg border p-3 transition-colors',
          alert.isRead
            ? 'border-border bg-card'
            : 'border-l-4 border-l-red-500 bg-card shadow-sm',
          onClick && 'cursor-pointer hover:bg-accent',
          className
        )}
        onClick={onClick}
      >
        <div className={cn('rounded-full p-2', severity.color)}>
          <SeverityIcon className="h-4 w-4" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="truncate text-sm font-medium">{alert.title}</p>
          <p className="truncate text-xs text-muted-foreground">{alert.message}</p>
          <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            {formatDate(alert.createdAt)}
          </div>
        </div>
        {!alert.isRead && (
          <div className="h-2 w-2 rounded-full bg-red-500" />
        )}
      </div>
    );
  }

  return (
    <Card
      ref={cardRef}
      className={cn(
        'transition-all duration-200',
        alert.isRead ? 'opacity-75' : 'shadow-card',
        onClick && 'cursor-pointer hover:shadow-elevated',
        className
      )}
      onClick={onClick}
    >
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className={cn('gap-1.5', severity.color)}>
            <SeverityIcon className="h-3 w-3" />
            {severity.label}
          </Badge>
          <Badge variant="secondary" className="gap-1.5">
            <TypeIcon className="h-3 w-3" />
            {type.label}
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">{formatDate(alert.createdAt)}</span>
          {!alert.isRead && onMarkAsRead && (
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={(e) => {
                e.stopPropagation();
                onMarkAsRead(alert.id);
              }}
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div>
          <h4 className="font-semibold">{alert.title}</h4>
          <p className="text-sm text-muted-foreground">{alert.message}</p>
        </div>

        {(alert.geographicName || alert.indicatorName) && (
          <div className="flex flex-wrap gap-2">
            {alert.geographicName && (
              <Badge variant="outline" className="gap-1 text-xs">
                <MapPin className="h-3 w-3" />
                {alert.geographicName}
              </Badge>
            )}
            {alert.indicatorName && (
              <Badge variant="outline" className="gap-1 text-xs">
                <BarChart3 className="h-3 w-3" />
                {alert.indicatorName}
              </Badge>
            )}
          </div>
        )}

        {alert.value !== undefined && alert.threshold !== undefined && (
          <div className="rounded-lg bg-muted p-3">
            <div className="flex items-center justify-between text-sm">
              <span>Valeur actuelle:</span>
              <span className="font-semibold text-red-600">{alert.value}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span>Seuil:</span>
              <span className="font-medium">{alert.threshold}</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
