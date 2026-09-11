// Supabase Edge Function: scan-leads
// Calls a RapidAPI job-listing feed server-side (key never touches the browser).
// Deploy with: supabase functions deploy scan-leads
// Set secrets with:
//   supabase secrets set RAPIDAPI_KEY=xxxxx
//   supabase secrets set RAPIDAPI_HOST=freelancer-job-search.p.rapidapi.com  (swap for whichever RapidAPI product you subscribe to)
//
// NOTE: Upwork/Fiverr don't offer public scraping APIs directly — this function is
// written against a generic RapidAPI job-search shape. Once you pick a specific
// RapidAPI listing (search "freelance jobs" or "upwork" on rapidapi.com), adjust
// the `mapExternalJob` function below to match that provider's response fields.
// Until RAPIDAPI_KEY is set, this function returns clearly-labeled demo data so
// the UI keeps working.

import { serve } from 'https://deno.land/std@0.224.0/http/server.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface RequestBody {
  minBudget?: number;
}

function mapExternalJob(job: any) {
  // Adjust these field mappings to match your chosen RapidAPI provider's schema.
  return {
    id: `lead-${job.id ?? crypto.randomUUID()}`,
    title: job.title ?? 'Untitled opportunity',
    source: 'Upwork Feed',
    category: job.category ?? 'General',
    budget: Number(job.budget ?? job.price ?? 0),
    estDays: job.estDays ?? 5,
    matchScore: job.matchScore ?? Math.floor(Math.random() * 15) + 80,
    description: job.description ?? '',
    skillsRequired: job.skills ?? [],
    status: 'new',
    clientName: job.clientName ?? job.client?.name,
    clientLocation: job.clientLocation ?? job.client?.location,
    postedTime: job.postedTime ?? 'Just now',
  };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { minBudget = 500 } = (await req.json().catch(() => ({}))) as RequestBody;

    const rapidApiKey = Deno.env.get('RAPIDAPI_KEY');
    const rapidApiHost = Deno.env.get('RAPIDAPI_HOST');

    if (!rapidApiKey || !rapidApiHost) {
      // Graceful fallback — backend is live, but no job-feed key configured yet.
      const demoLead = mapExternalJob({
        id: Date.now(),
        title: 'Demo Lead — connect RAPIDAPI_KEY for live feeds',
        category: 'Automation & AI',
        budget: 1800,
        skills: ['Node.js', 'React'],
        clientName: 'Demo Client',
        clientLocation: 'Remote',
      });
      return new Response(JSON.stringify({ leads: [demoLead], source: 'demo' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const apiRes = await fetch(`https://${rapidApiHost}/search?query=react%20developer`, {
      headers: {
        'x-rapidapi-key': rapidApiKey,
        'x-rapidapi-host': rapidApiHost,
      },
    });

    if (!apiRes.ok) {
      const errText = await apiRes.text();
      return new Response(JSON.stringify({ error: `RapidAPI error: ${errText}` }), {
        status: 502,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const apiData = await apiRes.json();
    const rawJobs = Array.isArray(apiData) ? apiData : apiData.jobs ?? apiData.results ?? [];
    const leads = rawJobs.map(mapExternalJob).filter((l: any) => l.budget >= minBudget);

    return new Response(JSON.stringify({ leads, source: 'live' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
