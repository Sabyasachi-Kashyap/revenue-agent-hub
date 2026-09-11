// Supabase Edge Function: generate-content
// Calls the Anthropic API server-side (key never touches the browser) to produce
// a real SEO article. Deploy with: supabase functions deploy generate-content
// Set the secret with: supabase secrets set ANTHROPIC_API_KEY=sk-ant-...

import { serve } from 'https://deno.land/std@0.224.0/http/server.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface RequestBody {
  topic: string;
  niche: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { topic, niche } = (await req.json()) as RequestBody;
    if (!topic || !niche) {
      return new Response(JSON.stringify({ error: 'topic and niche are required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const apiKey = Deno.env.get('ANTHROPIC_API_KEY');
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: 'ANTHROPIC_API_KEY secret not configured on the backend yet.' }),
        { status: 503, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const systemPrompt = `You are an SEO content strategist. Respond ONLY with valid JSON — no markdown fences, no preamble.
Schema:
{
  "keyword": string,               // primary target keyword
  "estMonthlySearchVolume": number,// realistic estimate, integer
  "title": string,                 // SEO-optimized article title
  "outline": string[],             // 5-7 numbered section headings as strings
  "contentBody": string,           // full article in markdown, 500-800 words
  "suggestedAffiliateProducts": [{ "name": string, "commissionRate": string, "affiliateUrl": string }],
  "socialSnippets": [{ "platform": "X (Twitter)" | "LinkedIn" | "Newsletter", "postText": string }],
  "estMonthlyRevenue": number       // realistic estimate in USD, integer
}`;

    const userPrompt = `Write an SEO article about "${topic}" in the "${niche}" niche, optimized for affiliate/SaaS monetization.`;

    const anthropicRes = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 2000,
        system: systemPrompt,
        messages: [{ role: 'user', content: userPrompt }],
      }),
    });

    if (!anthropicRes.ok) {
      const errText = await anthropicRes.text();
      return new Response(JSON.stringify({ error: `Anthropic API error: ${errText}` }), {
        status: 502,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const anthropicData = await anthropicRes.json();
    const textBlock = anthropicData.content?.find((b: any) => b.type === 'text');
    const raw = (textBlock?.text ?? '{}').trim().replace(/^```json\s*|```$/g, '');
    const parsed = JSON.parse(raw);

    const article = {
      id: `art-${Date.now()}`,
      topic,
      niche,
      keyword: parsed.keyword,
      estMonthlySearchVolume: parsed.estMonthlySearchVolume,
      monetizationType: 'Affiliate Marketing',
      status: 'ready',
      title: parsed.title,
      outline: parsed.outline,
      contentBody: parsed.contentBody,
      suggestedAffiliateProducts: parsed.suggestedAffiliateProducts ?? [],
      socialSnippets: parsed.socialSnippets ?? [],
      estMonthlyRevenue: parsed.estMonthlyRevenue ?? 0,
      createdAt: new Date().toISOString(),
    };

    return new Response(JSON.stringify(article), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
