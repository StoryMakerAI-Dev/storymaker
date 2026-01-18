import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-user-id',
};

interface UsageAlertRequest {
  userId: string;
  userEmail: string;
  alertType: 'rate_limit_warning' | 'usage_threshold' | 'limit_exceeded';
  functionName?: string;
  currentUsage: number;
  limit: number;
  thresholdPercentage: number;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const resendApiKey = Deno.env.get('RESEND_API_KEY');
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { userId, userEmail, alertType, functionName, currentUsage, limit, thresholdPercentage }: UsageAlertRequest = await req.json();

    console.log(`Processing ${alertType} alert for user ${userId}`);

    // Check if we've already sent this type of alert recently (within 1 hour)
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    const { data: recentAlerts } = await supabase
      .from('usage_alerts')
      .select('id')
      .eq('user_id', userId)
      .eq('alert_type', alertType)
      .eq('function_name', functionName || '')
      .gte('sent_at', oneHourAgo)
      .limit(1);

    if (recentAlerts && recentAlerts.length > 0) {
      console.log('Alert already sent recently, skipping');
      return new Response(
        JSON.stringify({ success: true, message: 'Alert already sent recently' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Generate alert message
    let subject: string;
    let message: string;
    const usagePercentage = Math.round((currentUsage / limit) * 100);

    switch (alertType) {
      case 'rate_limit_warning':
        subject = `⚠️ StoryMaker: Rate Limit Warning`;
        message = `You've used ${usagePercentage}% of your ${functionName?.replace('-', ' ')} rate limit. You have ${limit - currentUsage} requests remaining in the current window.`;
        break;
      case 'usage_threshold':
        subject = `📊 StoryMaker: Usage Threshold Reached`;
        message = `You've reached ${usagePercentage}% of your daily ${functionName?.replace('-', ' ')} limit. Consider upgrading your plan for more capacity.`;
        break;
      case 'limit_exceeded':
        subject = `🚫 StoryMaker: Usage Limit Exceeded`;
        message = `You've reached your ${functionName?.replace('-', ' ')} limit for this period. Your limits will reset shortly. Upgrade your plan for higher limits.`;
        break;
      default:
        subject = `StoryMaker: Usage Alert`;
        message = `You've used ${usagePercentage}% of your usage limit.`;
    }

    // Log the alert
    await supabase.from('usage_alerts').insert({
      user_id: userId,
      alert_type: alertType,
      function_name: functionName || null,
      threshold_percentage: thresholdPercentage,
      message,
      email_sent: false
    });

    // Send email if Resend API key is configured and email is provided
    if (resendApiKey && userEmail) {
      try {
        const emailResponse = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${resendApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: 'StoryMaker <notifications@storymaker.lovable.app>',
            to: [userEmail],
            subject,
            html: `
              <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                <h1 style="color: #7c3aed; margin-bottom: 20px;">StoryMaker Usage Alert</h1>
                <div style="background: linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%); border-radius: 12px; padding: 24px; margin-bottom: 20px;">
                  <p style="font-size: 16px; line-height: 1.6; color: #374151; margin: 0;">
                    ${message}
                  </p>
                </div>
                <div style="background: #fef3c7; border-radius: 8px; padding: 16px; margin-bottom: 20px;">
                  <p style="font-size: 14px; color: #92400e; margin: 0;">
                    <strong>Current Usage:</strong> ${currentUsage} / ${limit} (${usagePercentage}%)
                  </p>
                </div>
                <a href="https://storymaker.lovable.app" style="display: inline-block; background: linear-gradient(135deg, #7c3aed 0%, #a855f7 100%); color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: 600;">
                  View Your Dashboard
                </a>
                <p style="font-size: 12px; color: #6b7280; margin-top: 24px;">
                  You're receiving this email because you have usage notifications enabled in your StoryMaker account settings.
                </p>
              </div>
            `
          }),
        });

        if (emailResponse.ok) {
          // Update the alert to mark email as sent
          await supabase
            .from('usage_alerts')
            .update({ email_sent: true })
            .eq('user_id', userId)
            .eq('alert_type', alertType)
            .eq('message', message);
          
          console.log('Email sent successfully');
        } else {
          console.error('Failed to send email:', await emailResponse.text());
        }
      } catch (emailError) {
        console.error('Email sending error:', emailError);
      }
    }

    return new Response(
      JSON.stringify({ success: true, message: 'Alert processed' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in send-usage-alert:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Failed to process alert' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
