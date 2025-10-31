import { Flame, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface HeatIndicatorProps {
  heat: {
    level: 'low' | 'medium' | 'high' | 'very-high';
    score: number;
    trend: 'stable' | 'rising' | 'falling';
    growthRate: number;
  };
  language: 'pt' | 'en';
}

const HeatIndicator = ({ heat, language }: HeatIndicatorProps) => {
  const config = {
    'very-high': {
      color: 'from-red-500 to-orange-500',
      bgColor: 'bg-red-500/20',
      borderColor: 'border-red-500/50',
      label: { pt: 'Muito Quente', en: 'Very Hot' },
      icon: Flame,
      iconClass: 'text-red-500 animate-pulse'
    },
    'high': {
      color: 'from-orange-500 to-yellow-500',
      bgColor: 'bg-orange-500/20',
      borderColor: 'border-orange-500/50',
      label: { pt: 'Quente', en: 'Hot' },
      icon: Flame,
      iconClass: 'text-orange-500'
    },
    'medium': {
      color: 'from-yellow-500 to-green-500',
      bgColor: 'bg-yellow-500/20',
      borderColor: 'border-yellow-500/50',
      label: { pt: 'Aquecendo', en: 'Warming Up' },
      icon: Flame,
      iconClass: 'text-yellow-500'
    },
    'low': {
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-500/20',
      borderColor: 'border-blue-500/50',
      label: { pt: 'Descoberta', en: 'Discovery' },
      icon: Flame,
      iconClass: 'text-blue-500 opacity-60'
    }
  };
  
  const trendIcons = {
    rising: TrendingUp,
    falling: TrendingDown,
    stable: Minus
  };
  
  const currentConfig = config[heat.level];
  const Icon = currentConfig.icon;
  const TrendIcon = trendIcons[heat.trend];
  
  return (
    <div className="absolute top-4 right-4 flex flex-col items-end gap-2">
      {/* Badge Principal */}
      <Badge 
        className={cn(
          "px-3 py-1.5 backdrop-blur-md border",
          currentConfig.bgColor,
          currentConfig.borderColor
        )}
      >
        <Icon className={cn("h-4 w-4 mr-1.5", currentConfig.iconClass)} />
        <span className="text-xs font-semibold text-foreground">
          {currentConfig.label[language]}
        </span>
      </Badge>
      
      {/* Score Bar */}
      <div className="w-24 h-1.5 bg-background/60 backdrop-blur-sm rounded-full overflow-hidden">
        <div 
          className={cn("h-full bg-gradient-to-r transition-all duration-500", currentConfig.color)}
          style={{ width: `${heat.score}%` }}
        />
      </div>
      
      {/* Trend Indicator */}
      {heat.trend !== 'stable' && (
        <Badge 
          variant="secondary" 
          className="backdrop-blur-sm bg-background/80 text-xs gap-1"
        >
          <TrendIcon className="h-3 w-3" />
          <span>{Math.abs(heat.growthRate).toFixed(1)}%</span>
        </Badge>
      )}
    </div>
  );
};

export default HeatIndicator;
