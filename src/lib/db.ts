import { supabase, isSupabaseConfigured } from './supabaseClient';
import { LeadItem, ContentArticle, ClientWidgetConfig, ExecutionLog, ApiSettings } from '../types';

// ---------- row <-> app-type mappers ----------

const leadToRow = (l: LeadItem) => ({
  id: l.id,
  title: l.title,
  source: l.source,
  category: l.category,
  budget: l.budget,
  est_days: l.estDays,
  match_score: l.matchScore,
  description: l.description,
  skills_required: l.skillsRequired,
  status: l.status,
  client_name: l.clientName,
  client_location: l.clientLocation,
  posted_time: l.postedTime,
  proposal: l.proposal ?? null,
  updated_at: new Date().toISOString(),
});

const rowToLead = (r: any): LeadItem => ({
  id: r.id,
  title: r.title,
  source: r.source,
  category: r.category,
  budget: Number(r.budget),
  estDays: r.est_days,
  matchScore: r.match_score,
  description: r.description,
  skillsRequired: r.skills_required ?? [],
  status: r.status,
  clientName: r.client_name ?? undefined,
  clientLocation: r.client_location ?? undefined,
  postedTime: r.posted_time,
  proposal: r.proposal ?? undefined,
});

const articleToRow = (a: ContentArticle) => ({
  id: a.id,
  topic: a.topic,
  niche: a.niche,
  keyword: a.keyword,
  est_monthly_search_volume: a.estMonthlySearchVolume,
  monetization_type: a.monetizationType,
  status: a.status,
  title: a.title,
  outline: a.outline,
  content_body: a.contentBody,
  suggested_affiliate_products: a.suggestedAffiliateProducts,
  social_snippets: a.socialSnippets,
  est_monthly_revenue: a.estMonthlyRevenue,
  updated_at: new Date().toISOString(),
});

const rowToArticle = (r: any): ContentArticle => ({
  id: r.id,
  topic: r.topic,
  niche: r.niche,
  keyword: r.keyword,
  estMonthlySearchVolume: r.est_monthly_search_volume,
  monetizationType: r.monetization_type,
  status: r.status,
  title: r.title,
  outline: r.outline ?? [],
  contentBody: r.content_body ?? '',
  suggestedAffiliateProducts: r.suggested_affiliate_products ?? [],
  socialSnippets: r.social_snippets ?? [],
  estMonthlyRevenue: Number(r.est_monthly_revenue),
  createdAt: new Date(r.created_at).toLocaleString(),
});

const widgetToRow = (w: ClientWidgetConfig) => ({
  id: w.id,
  client_name: w.clientName,
  business_niche: w.businessNiche,
  primary_color: w.primaryColor,
  bot_avatar_url: w.botAvatarUrl,
  welcome_message: w.welcomeMessage,
  auto_lead_qualification_questions: w.autoLeadQualificationQuestions,
  monthly_subscription_price: w.monthlySubscriptionPrice,
  active_leads_captured: w.activeLeadsCaptured,
  monthly_recurring_revenue: w.monthlyRecurringRevenue,
  embed_script_code: w.embedScriptCode,
  status: w.status,
  updated_at: new Date().toISOString(),
});

const rowToWidget = (r: any): ClientWidgetConfig => ({
  id: r.id,
  clientName: r.client_name,
  businessNiche: r.business_niche,
  primaryColor: r.primary_color,
  botAvatarUrl: r.bot_avatar_url ?? undefined,
  welcomeMessage: r.welcome_message,
  autoLeadQualificationQuestions: r.auto_lead_qualification_questions ?? [],
  monthlySubscriptionPrice: Number(r.monthly_subscription_price),
  activeLeadsCaptured: r.active_leads_captured,
  monthlyRecurringRevenue: Number(r.monthly_recurring_revenue),
  embedScriptCode: r.embed_script_code,
  status: r.status,
});

const rowToLog = (r: any): ExecutionLog => ({
  id: r.id,
  timestamp: r.timestamp,
  agentName: r.agent_name,
  level: r.level,
  message: r.message,
  details: r.details ?? undefined,
});

// ---------- generic guard ----------
// Every function below no-ops (returns null/empty) when Supabase isn't configured,
// so App.tsx can fall back to its existing in-memory mock state without special-casing.

async function requireAuthedUserId(): Promise<string | null> {
  if (!supabase) return null;
  const { data } = await supabase.auth.getSession();
  return data.session?.user.id ?? null;
}

// ---------- LEADS ----------

export async function fetchLeads(): Promise<LeadItem[] | null> {
  if (!supabase) return null;
  const { data, error } = await supabase.from('leads').select('*').order('created_at', { ascending: false });
  if (error) { console.error('fetchLeads', error); return null; }
  return (data ?? []).map(rowToLead);
}

export async function upsertLeads(leads: LeadItem[]): Promise<void> {
  if (!supabase) return;
  const userId = await requireAuthedUserId();
  if (!userId) return;
  const rows = leads.map((l) => ({ ...leadToRow(l), user_id: userId }));
  const { error } = await supabase.from('leads').upsert(rows);
  if (error) console.error('upsertLeads', error);
}

// ---------- ARTICLES ----------

export async function fetchArticles(): Promise<ContentArticle[] | null> {
  if (!supabase) return null;
  const { data, error } = await supabase.from('articles').select('*').order('created_at', { ascending: false });
  if (error) { console.error('fetchArticles', error); return null; }
  return (data ?? []).map(rowToArticle);
}

export async function upsertArticle(article: ContentArticle): Promise<void> {
  if (!supabase) return;
  const userId = await requireAuthedUserId();
  if (!userId) return;
  const { error } = await supabase.from('articles').upsert({ ...articleToRow(article), user_id: userId });
  if (error) console.error('upsertArticle', error);
}

// ---------- WIDGETS ----------

export async function fetchWidgets(): Promise<ClientWidgetConfig[] | null> {
  if (!supabase) return null;
  const { data, error } = await supabase.from('widgets').select('*').order('created_at', { ascending: false });
  if (error) { console.error('fetchWidgets', error); return null; }
  return (data ?? []).map(rowToWidget);
}

export async function upsertWidget(widget: ClientWidgetConfig): Promise<void> {
  if (!supabase) return;
  const userId = await requireAuthedUserId();
  if (!userId) return;
  const { error } = await supabase.from('widgets').upsert({ ...widgetToRow(widget), user_id: userId });
  if (error) console.error('upsertWidget', error);
}

// ---------- LOGS ----------

export async function fetchLogs(): Promise<ExecutionLog[] | null> {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from('execution_logs')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(50);
  if (error) { console.error('fetchLogs', error); return null; }
  return (data ?? []).map(rowToLog);
}

export async function insertLog(log: ExecutionLog): Promise<void> {
  if (!supabase) return;
  const userId = await requireAuthedUserId();
  if (!userId) return;
  const { error } = await supabase.from('execution_logs').insert({
    id: log.id,
    timestamp: log.timestamp,
    agent_name: log.agentName,
    level: log.level,
    message: log.message,
    details: log.details,
    user_id: userId,
  });
  if (error) console.error('insertLog', error);
}

// ---------- SETTINGS (non-secret only) ----------

export async function fetchSettings(): Promise<Partial<ApiSettings> | null> {
  if (!supabase) return null;
  const userId = await requireAuthedUserId();
  if (!userId) return null;
  const { data, error } = await supabase.from('user_settings').select('*').eq('user_id', userId).maybeSingle();
  if (error) { console.error('fetchSettings', error); return null; }
  if (!data) return null;
  return {
    autoPilotEnabled: data.auto_pilot_enabled,
    minLeadBudget: Number(data.min_lead_budget),
    minMatchScore: data.min_match_score,
    bankDetails: data.bank_details ?? undefined,
  };
}

export async function saveSettings(settings: ApiSettings): Promise<void> {
  if (!supabase) return;
  const userId = await requireAuthedUserId();
  if (!userId) return;
  const { error } = await supabase.from('user_settings').upsert({
    user_id: userId,
    auto_pilot_enabled: settings.autoPilotEnabled,
    min_lead_budget: settings.minLeadBudget,
    min_match_score: settings.minMatchScore,
    bank_details: settings.bankDetails ?? null,
    updated_at: new Date().toISOString(),
  });
  if (error) console.error('saveSettings', error);
}

export { isSupabaseConfigured };
