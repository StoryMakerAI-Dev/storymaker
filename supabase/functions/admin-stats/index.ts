import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-user-id',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get user ID from header
    const userId = req.headers.get('x-user-id');
    
    if (!userId) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check if user is admin
    const { data: isAdmin } = await supabase.rpc('is_admin', { _user_id: userId });
    
    if (!isAdmin) {
      return new Response(
        JSON.stringify({ error: 'Forbidden: Admin access required' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const url = new URL(req.url);
    const action = url.searchParams.get('action') || 'overview';

    console.log(`Admin ${userId} requesting ${action}`);

    let result: any;

    switch (action) {
      case 'overview':
        // Get overall usage statistics
        const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const todayStr = today.toISOString();

        const [usageLogs, todayLogs, uniqueUsers, tierStats] = await Promise.all([
          supabase.from('ai_usage_logs').select('*').gte('created_at', thirtyDaysAgo),
          supabase.from('ai_usage_logs').select('*').gte('created_at', todayStr),
          supabase.from('ai_usage_logs').select('user_id').gte('created_at', thirtyDaysAgo),
          supabase.from('user_preferences').select('subscription_tier'),
        ]);

        const uniqueUserIds = new Set(uniqueUsers.data?.map(u => u.user_id) || []);
        const tierCounts = tierStats.data?.reduce((acc: Record<string, number>, item) => {
          acc[item.subscription_tier] = (acc[item.subscription_tier] || 0) + 1;
          return acc;
        }, {}) || {};

        // Group by function
        const functionBreakdown = (usageLogs.data || []).reduce((acc: Record<string, number>, log) => {
          acc[log.function_name] = (acc[log.function_name] || 0) + 1;
          return acc;
        }, {});

        // Daily breakdown for the chart
        const dailyBreakdown: Record<string, number> = {};
        for (let i = 29; i >= 0; i--) {
          const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
          const dateStr = date.toISOString().split('T')[0];
          dailyBreakdown[dateStr] = 0;
        }
        (usageLogs.data || []).forEach(log => {
          const dateStr = log.created_at.split('T')[0];
          if (dailyBreakdown[dateStr] !== undefined) {
            dailyBreakdown[dateStr]++;
          }
        });

        result = {
          totalRequests: usageLogs.data?.length || 0,
          todayRequests: todayLogs.data?.length || 0,
          uniqueUsers: uniqueUserIds.size,
          functionBreakdown,
          tierDistribution: tierCounts,
          dailyUsage: Object.entries(dailyBreakdown).map(([date, count]) => ({ date, count })),
        };
        break;

      case 'users':
        // Get all users with their usage and preferences
        const { data: allUsageLogs } = await supabase
          .from('ai_usage_logs')
          .select('user_id, function_name, created_at')
          .order('created_at', { ascending: false });

        const { data: preferences } = await supabase
          .from('user_preferences')
          .select('*');

        const { data: rateLimits } = await supabase
          .from('rate_limits')
          .select('*');

        // Aggregate user data
        const userMap = new Map<string, any>();
        
        (allUsageLogs || []).forEach(log => {
          if (!userMap.has(log.user_id)) {
            userMap.set(log.user_id, {
              userId: log.user_id,
              totalRequests: 0,
              storyRequests: 0,
              imageRequests: 0,
              chatRequests: 0,
              lastActivity: log.created_at,
            });
          }
          const user = userMap.get(log.user_id)!;
          user.totalRequests++;
          if (log.function_name === 'generate-story') user.storyRequests++;
          if (log.function_name === 'generate-story-image') user.imageRequests++;
          if (log.function_name === 'chat-assistant') user.chatRequests++;
        });

        // Merge with preferences
        (preferences || []).forEach(pref => {
          if (userMap.has(pref.user_id)) {
            const user = userMap.get(pref.user_id)!;
            user.tier = pref.subscription_tier;
            user.preferredModel = pref.preferred_ai_model;
            user.emailNotifications = pref.email_notifications_enabled;
          } else {
            userMap.set(pref.user_id, {
              userId: pref.user_id,
              totalRequests: 0,
              storyRequests: 0,
              imageRequests: 0,
              chatRequests: 0,
              tier: pref.subscription_tier,
              preferredModel: pref.preferred_ai_model,
              emailNotifications: pref.email_notifications_enabled,
            });
          }
        });

        result = {
          users: Array.from(userMap.values()).sort((a, b) => b.totalRequests - a.totalRequests),
          rateLimits: rateLimits || [],
        };
        break;

      case 'tiers':
        // Get tier configurations
        const { data: tierConfigs } = await supabase
          .from('subscription_tiers_config')
          .select('*')
          .order('tier');

        result = { tiers: tierConfigs || [] };
        break;

      case 'update-tier':
        // Update a user's tier
        const body = await req.json();
        const { targetUserId, newTier } = body;

        const { error: updateError } = await supabase
          .from('user_preferences')
          .upsert({
            user_id: targetUserId,
            subscription_tier: newTier,
            updated_at: new Date().toISOString(),
          }, { onConflict: 'user_id' });

        if (updateError) throw updateError;

        result = { success: true, message: `Updated user ${targetUserId} to ${newTier} tier` };
        break;

      case 'update-tier-config':
        // Update tier configuration
        const configBody = await req.json();
        const { tier, ...updates } = configBody;

        const { error: configError } = await supabase
          .from('subscription_tiers_config')
          .update(updates)
          .eq('tier', tier);

        if (configError) throw configError;

        result = { success: true, message: `Updated ${tier} tier configuration` };
        break;

      case 'add-admin':
        // Add admin role to a user
        const adminBody = await req.json();
        const { targetUserIdForAdmin } = adminBody;

        const { error: adminError } = await supabase
          .from('user_roles')
          .upsert({
            user_id: targetUserIdForAdmin,
            role: 'admin',
          }, { onConflict: 'user_id,role' });

        if (adminError) throw adminError;

        result = { success: true, message: `Added admin role to ${targetUserIdForAdmin}` };
        break;

      case 'upgrade-requests':
        // Get all pending upgrade requests
        const { data: upgradeRequests } = await supabase
          .from('tier_upgrade_requests')
          .select('*')
          .order('created_at', { ascending: false });

        result = { requests: upgradeRequests || [] };
        break;

      case 'handle-upgrade-request':
        // Approve or reject an upgrade request
        const requestBody = await req.json();
        const { requestId, status, adminNotes } = requestBody;

        // Get the request details
        const { data: requestData } = await supabase
          .from('tier_upgrade_requests')
          .select('*')
          .eq('id', requestId)
          .single();

        if (!requestData) {
          result = { error: 'Request not found' };
          break;
        }

        // Update the request status
        const { error: requestUpdateError } = await supabase
          .from('tier_upgrade_requests')
          .update({
            status,
            admin_notes: adminNotes,
            updated_at: new Date().toISOString(),
          })
          .eq('id', requestId);

        if (requestUpdateError) throw requestUpdateError;

        // If approved, update the user's tier
        if (status === 'approved') {
          const { error: tierUpdateError } = await supabase
            .from('user_preferences')
            .upsert({
              user_id: requestData.user_id,
              subscription_tier: requestData.requested_tier,
              updated_at: new Date().toISOString(),
            }, { onConflict: 'user_id' });

          if (tierUpdateError) throw tierUpdateError;
        }

        result = { 
          success: true, 
          message: `Request ${status}${status === 'approved' ? ` - User upgraded to ${requestData.requested_tier}` : ''}` 
        };
        break;

      default:
        result = { error: 'Unknown action' };
    }

    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in admin-stats:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Failed to fetch admin stats' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
