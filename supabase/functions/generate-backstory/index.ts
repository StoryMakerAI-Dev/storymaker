import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { verifyClerkUser } from "../_shared/clerkAuth.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-user-id, x-clerk-token',
};

const RATE_LIMIT_WINDOW_MS = 60 * 1000;
const MAX_REQUESTS_PER_WINDOW = 5;

async function checkRateLimit(supabase: any, userId: string): Promise<boolean> {
  const now = new Date();
  const windowStart = new Date(now.getTime() - RATE_LIMIT_WINDOW_MS);

  const { data: existingLimit } = await supabase
    .from('rate_limits')
    .select('*')
    .eq('user_id', userId)
    .eq('function_name', 'generate-backstory')
    .single();

  if (!existingLimit) {
    await supabase.from('rate_limits').insert({
      user_id: userId,
      function_name: 'generate-backstory',
      request_count: 1,
      window_start: now.toISOString()
    });
    return true;
  }

  if (new Date(existingLimit.window_start) < windowStart) {
    await supabase.from('rate_limits')
      .update({ request_count: 1, window_start: now.toISOString() })
      .eq('id', existingLimit.id);
    return true;
  }

  if (existingLimit.request_count >= MAX_REQUESTS_PER_WINDOW) return false;

  await supabase.from('rate_limits')
    .update({ request_count: existingLimit.request_count + 1 })
    .eq('id', existingLimit.id);
  return true;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    const verified = await verifyClerkUser(req);
    const clientIp = req.headers.get('cf-connecting-ip')
      || req.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
      || 'unknown';
    const userId = verified?.userId || `anon:${clientIp}`;

    if (!(await checkRateLimit(supabase, userId))) {
      return new Response(
        JSON.stringify({ error: "Rate limit exceeded. Please wait a minute before trying again." }),
        { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { name, role, setting, traits, genre } = await req.json();

    if (typeof name !== 'string' || name.length > 100 ||
        (role && (typeof role !== 'string' || role.length > 100)) ||
        (setting && (typeof setting !== 'string' || setting.length > 200)) ||
        (traits && (typeof traits !== 'string' || traits.length > 500)) ||
        (genre && (typeof genre !== 'string' || genre.length > 50))) {
      return new Response(
        JSON.stringify({ error: "Invalid input" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const systemPrompt = `You are an expert character backstory writer. Create a rich, original character backstory of 300-500 words. Include: formative childhood experiences, a defining moment that shaped their worldview, key relationships, a secret or hidden motivation, and how their past connects to who they are today. Write in flowing prose, vivid but concise. Never use generic filler — every detail should be specific to this character.`;

    const userPrompt = `Character name: ${name || 'Unnamed character'}
Role in story: ${role || 'not specified'}
Setting/world: ${setting || 'not specified'}
Key traits: ${traits || 'not specified'}
Genre: ${genre || 'general fiction'}

Write the backstory now.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Usage limit reached. Please add credits to continue." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(JSON.stringify({ error: "AI service error" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    const backstory = data.choices?.[0]?.message?.content || '';

    try {
      await supabase.from('ai_usage_logs').insert({
        user_id: userId,
        function_name: 'generate-backstory',
        model_used: 'google/gemini-2.5-flash',
        tokens_used: 0
      });
    } catch (e) {
      console.error('Error logging usage:', e);
    }

    return new Response(JSON.stringify({ backstory }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Backstory generator error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
