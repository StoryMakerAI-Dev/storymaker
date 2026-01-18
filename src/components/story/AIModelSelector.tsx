import React, { useEffect, useState } from 'react';
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Zap, Brain, Rocket } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@clerk/clerk-react';

interface AIModelSelectorProps {
  selectedModel: string;
  onModelChange: (model: string) => void;
}

interface AIModel {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  tier: 'free' | 'basic' | 'pro' | 'enterprise';
  speed: 'fast' | 'balanced' | 'slow';
}

const AI_MODELS: AIModel[] = [
  {
    id: 'google/gemini-2.5-flash',
    name: 'Gemini Flash',
    description: 'Fast & balanced, great for most stories',
    icon: <Zap className="h-4 w-4" />,
    tier: 'free',
    speed: 'fast',
  },
  {
    id: 'google/gemini-2.5-flash-lite',
    name: 'Gemini Lite',
    description: 'Fastest option, good for quick drafts',
    icon: <Rocket className="h-4 w-4" />,
    tier: 'free',
    speed: 'fast',
  },
  {
    id: 'google/gemini-2.5-pro',
    name: 'Gemini Pro',
    description: 'Best quality, complex narratives',
    icon: <Brain className="h-4 w-4" />,
    tier: 'pro',
    speed: 'slow',
  },
  {
    id: 'google/gemini-3-flash-preview',
    name: 'Gemini 3 Flash',
    description: 'Next-gen speed & quality balance',
    icon: <Sparkles className="h-4 w-4" />,
    tier: 'basic',
    speed: 'fast',
  },
  {
    id: 'openai/gpt-5-mini',
    name: 'GPT-5 Mini',
    description: 'Strong reasoning, creative stories',
    icon: <Brain className="h-4 w-4" />,
    tier: 'basic',
    speed: 'balanced',
  },
  {
    id: 'openai/gpt-5',
    name: 'GPT-5',
    description: 'Most powerful, premium quality',
    icon: <Sparkles className="h-4 w-4" />,
    tier: 'enterprise',
    speed: 'slow',
  },
];

const TIER_ORDER: Record<string, number> = {
  free: 0,
  basic: 1,
  pro: 2,
  enterprise: 3,
};

const AIModelSelector: React.FC<AIModelSelectorProps> = ({ selectedModel, onModelChange }) => {
  const { userId } = useAuth();
  const [userTier, setUserTier] = useState<string>('free');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserTier = async () => {
      if (!userId) {
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('user_preferences')
          .select('subscription_tier')
          .eq('user_id', userId)
          .single();

        if (data) {
          setUserTier(data.subscription_tier);
        }
      } catch (error) {
        console.error('Error fetching user tier:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserTier();
  }, [userId]);

  const isModelAvailable = (model: AIModel): boolean => {
    return TIER_ORDER[userTier] >= TIER_ORDER[model.tier];
  };

  const getSpeedBadge = (speed: string) => {
    switch (speed) {
      case 'fast':
        return <Badge variant="secondary" className="text-xs bg-green-100 text-green-700">Fast</Badge>;
      case 'balanced':
        return <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-700">Balanced</Badge>;
      case 'slow':
        return <Badge variant="secondary" className="text-xs bg-orange-100 text-orange-700">Thorough</Badge>;
      default:
        return null;
    }
  };

  const getTierBadge = (tier: string) => {
    const colors: Record<string, string> = {
      free: 'bg-gray-100 text-gray-700',
      basic: 'bg-blue-100 text-blue-700',
      pro: 'bg-purple-100 text-purple-700',
      enterprise: 'bg-gradient-to-r from-amber-100 to-orange-100 text-amber-700',
    };

    return (
      <Badge variant="outline" className={`text-xs capitalize ${colors[tier]}`}>
        {tier}
      </Badge>
    );
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="aiModel" className="flex items-center gap-2">
        <Sparkles className="h-4 w-4 text-primary" />
        AI Model
      </Label>
      <Select value={selectedModel} onValueChange={onModelChange} disabled={loading}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select AI model" />
        </SelectTrigger>
        <SelectContent>
          {AI_MODELS.map((model) => {
            const available = isModelAvailable(model);
            return (
              <SelectItem
                key={model.id}
                value={model.id}
                disabled={!available}
                className={!available ? 'opacity-50' : ''}
              >
                <div className="flex items-center gap-2 py-1">
                  <span className="text-primary">{model.icon}</span>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{model.name}</span>
                      {getSpeedBadge(model.speed)}
                      {!available && getTierBadge(model.tier)}
                    </div>
                    <span className="text-xs text-muted-foreground">{model.description}</span>
                  </div>
                </div>
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
      <p className="text-xs text-muted-foreground">
        Different models offer varying speed and quality tradeoffs
      </p>
    </div>
  );
};

export default AIModelSelector;
