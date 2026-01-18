import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-user-id',
};

// Rate limit configuration
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute window
const MAX_REQUESTS_PER_WINDOW = 5; // 5 image generations per minute (more expensive)

async function checkRateLimit(supabase: any, userId: string, functionName: string): Promise<{ allowed: boolean; remaining: number }> {
  const now = new Date();
  const windowStart = new Date(now.getTime() - RATE_LIMIT_WINDOW_MS);

  const { data: existingLimit } = await supabase
    .from('rate_limits')
    .select('*')
    .eq('user_id', userId)
    .eq('function_name', functionName)
    .single();

  if (!existingLimit) {
    await supabase.from('rate_limits').insert({
      user_id: userId,
      function_name: functionName,
      request_count: 1,
      window_start: now.toISOString()
    });
    return { allowed: true, remaining: MAX_REQUESTS_PER_WINDOW - 1 };
  }

  const recordWindowStart = new Date(existingLimit.window_start);
  
  if (recordWindowStart < windowStart) {
    await supabase
      .from('rate_limits')
      .update({ request_count: 1, window_start: now.toISOString() })
      .eq('id', existingLimit.id);
    return { allowed: true, remaining: MAX_REQUESTS_PER_WINDOW - 1 };
  }

  if (existingLimit.request_count >= MAX_REQUESTS_PER_WINDOW) {
    return { allowed: false, remaining: 0 };
  }

  await supabase
    .from('rate_limits')
    .update({ request_count: existingLimit.request_count + 1 })
    .eq('id', existingLimit.id);

  return { allowed: true, remaining: MAX_REQUESTS_PER_WINDOW - existingLimit.request_count - 1 };
}

async function logUsage(supabase: any, userId: string, functionName: string, modelUsed: string) {
  try {
    await supabase.from('ai_usage_logs').insert({
      user_id: userId,
      function_name: functionName,
      model_used: modelUsed,
      tokens_used: 0
    });
  } catch (error) {
    console.error('Error logging usage:', error);
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const userId = req.headers.get('x-user-id') || 'anonymous';
    
    const { allowed, remaining } = await checkRateLimit(supabase, userId, 'generate-story-image');
    
    if (!allowed) {
      console.log(`Rate limit exceeded for user ${userId}`);
      return new Response(
        JSON.stringify({ error: "Rate limit exceeded. Please wait a minute before trying again.", imageUrl: null }),
        { 
          status: 429, 
          headers: { 
            ...corsHeaders, 
            "Content-Type": "application/json",
            "X-RateLimit-Remaining": "0"
          } 
        }
      );
    }

    const { title, characters, setting, ageGroup } = await req.json();
    
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const styleMap: Record<string, string> = {
      children: "whimsical children's book illustration style, bright colors, friendly and cute",
      teens: "dynamic young adult book cover style, vibrant and engaging",
      adults: "sophisticated book cover art, cinematic and detailed"
    };

    const style = styleMap[ageGroup] || styleMap.children;
    
    const prompt = `Create a beautiful book cover illustration for a story titled "${title}". 
Features: ${characters || 'interesting characters'} in ${setting || 'a magical setting'}. 
Style: ${style}, professional book cover quality, no text or titles on the image.`;

    console.log("Generating image for user:", userId);

    const modelUsed = "google/gemini-2.5-flash-image-preview";

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: modelUsed,
        messages: [{ role: "user", content: prompt }],
        modalities: ["image", "text"]
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later.", imageUrl: null }), 
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI usage limit reached. Please add credits to continue.", imageUrl: null }), 
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      throw new Error("Failed to generate image");
    }

    // Log usage after successful generation
    await logUsage(supabase, userId, 'generate-story-image', modelUsed);

    const data = await response.json();
    const imageUrl = data.choices?.[0]?.message?.images?.[0]?.image_url?.url;
    
    if (!imageUrl) {
      console.log("No image in response");
      return new Response(
        JSON.stringify({ imageUrl: null }), 
        { headers: { ...corsHeaders, "Content-Type": "application/json", "X-RateLimit-Remaining": String(remaining) } }
      );
    }

    console.log("Image generated successfully");

    return new Response(
      JSON.stringify({ imageUrl }), 
      { headers: { ...corsHeaders, "Content-Type": "application/json", "X-RateLimit-Remaining": String(remaining) } }
    );
  } catch (error) {
    console.error("Error in generate-story-image function:", error);
    return new Response(
      JSON.stringify({ imageUrl: null, error: error.message || "Failed to generate image" }), 
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
