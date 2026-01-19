import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Crown, Check, Loader2, Mail, BookOpen, Image, MessageSquare } from 'lucide-react';
import { useUser } from '@clerk/clerk-react';
import { getUserPreferences } from '@/services/supabase/preferencesService';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

interface TierConfig {
  tier: string;
  display_name: string;
  story_limit_per_day: number;
  story_limit_per_month: number;
  image_limit_per_day: number;
  image_limit_per_month: number;
  chat_limit_per_day: number;
  chat_limit_per_month: number;
}

const TIER_DISPLAY = {
  free: { name: 'Free', color: 'bg-muted text-muted-foreground', icon: null },
  basic: { name: 'Basic', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200', icon: null },
  pro: { name: 'Pro', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200', icon: Crown },
  enterprise: { name: 'Enterprise', color: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200', icon: Crown },
};

const SubscriptionSection = () => {
  const { user } = useUser();
  const [loading, setLoading] = useState(true);
  const [currentTier, setCurrentTier] = useState<string>('free');
  const [allTiers, setAllTiers] = useState<TierConfig[]>([]);

  useEffect(() => {
    const loadSubscription = async () => {
      if (!user?.id) return;
      
      try {
        // Get user's current tier
        const prefs = await getUserPreferences(user.id);
        setCurrentTier(prefs?.subscription_tier || 'free');
        
        // Get all tier configs
        const { data: tiers, error } = await supabase
          .from('subscription_tiers_config')
          .select('*')
          .order('story_limit_per_day', { ascending: true });
        
        if (error) {
          console.error('Error fetching tiers:', error);
        } else {
          setAllTiers(tiers || []);
        }
      } catch (error) {
        console.error('Error loading subscription:', error);
      } finally {
        setLoading(false);
      }
    };

    loadSubscription();
  }, [user?.id]);

  const handleContactAdmin = () => {
    toast({
      title: 'Upgrade Request',
      description: 'Contact an administrator to upgrade your subscription tier.',
    });
  };

  const currentTierConfig = allTiers.find(t => t.tier === currentTier);
  const tierDisplay = TIER_DISPLAY[currentTier as keyof typeof TIER_DISPLAY] || TIER_DISPLAY.free;
  const TierIcon = tierDisplay.icon;

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Crown className="h-5 w-5 text-primary" />
          Subscription
        </CardTitle>
        <CardDescription>
          Your current plan and available tiers
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current Tier */}
        <div className="rounded-lg border-2 border-primary/20 bg-primary/5 p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Badge className={tierDisplay.color}>
                {TierIcon && <TierIcon className="h-3 w-3 mr-1" />}
                {currentTierConfig?.display_name || tierDisplay.name}
              </Badge>
              <span className="text-sm text-muted-foreground">Current Plan</span>
            </div>
          </div>
          
          {currentTierConfig && (
            <div className="grid grid-cols-3 gap-3 text-sm">
              <div className="flex items-center gap-2 p-2 rounded bg-background">
                <BookOpen className="h-4 w-4 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground">Stories</p>
                  <p className="font-semibold">{currentTierConfig.story_limit_per_day}/day</p>
                </div>
              </div>
              <div className="flex items-center gap-2 p-2 rounded bg-background">
                <Image className="h-4 w-4 text-secondary" />
                <div>
                  <p className="text-xs text-muted-foreground">Images</p>
                  <p className="font-semibold">{currentTierConfig.image_limit_per_day}/day</p>
                </div>
              </div>
              <div className="flex items-center gap-2 p-2 rounded bg-background">
                <MessageSquare className="h-4 w-4 text-accent" />
                <div>
                  <p className="text-xs text-muted-foreground">Chat</p>
                  <p className="font-semibold">{currentTierConfig.chat_limit_per_day}/day</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* All Tiers Comparison */}
        <div className="space-y-3">
          <h4 className="font-medium text-sm">Available Tiers</h4>
          <div className="grid gap-3">
            {allTiers.map((tier) => {
              const display = TIER_DISPLAY[tier.tier as keyof typeof TIER_DISPLAY] || TIER_DISPLAY.free;
              const Icon = display.icon;
              const isCurrent = tier.tier === currentTier;
              
              return (
                <div 
                  key={tier.tier}
                  className={`rounded-lg border p-3 transition-colors ${isCurrent ? 'border-primary bg-primary/5' : 'hover:bg-muted/50'}`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className={display.color}>
                        {Icon && <Icon className="h-3 w-3 mr-1" />}
                        {tier.display_name}
                      </Badge>
                      {isCurrent && (
                        <Check className="h-4 w-4 text-primary" />
                      )}
                    </div>
                  </div>
                  <div className="flex gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <BookOpen className="h-3 w-3" />
                      {tier.story_limit_per_day}/day
                    </span>
                    <span className="flex items-center gap-1">
                      <Image className="h-3 w-3" />
                      {tier.image_limit_per_day}/day
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageSquare className="h-3 w-3" />
                      {tier.chat_limit_per_day}/day
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Upgrade Button */}
        {currentTier !== 'enterprise' && (
          <Button 
            onClick={handleContactAdmin}
            variant="outline"
            className="w-full"
          >
            <Mail className="h-4 w-4 mr-2" />
            Contact Admin to Upgrade
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default SubscriptionSection;
