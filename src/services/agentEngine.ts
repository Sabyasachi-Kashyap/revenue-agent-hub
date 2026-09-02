import { ExecutionLog, RevenueSummary, LeadItem, ContentArticle, ClientWidgetConfig } from '../types';

export const INITIAL_LOGS: ExecutionLog[] = [
  {
    id: 'log-1',
    timestamp: '13:28:10',
    agentName: 'System',
    level: 'info',
    message: 'Revenue AI Agent Engine initialized in multi-channel autonomous mode.'
  },
  {
    id: 'log-2',
    timestamp: '13:28:15',
    agentName: 'LeadFinder',
    level: 'success',
    message: 'Scraped 4 high-budget RFPs from Upwork & RemoteOK feeds. Match score range: 89% - 98%.'
  },
  {
    id: 'log-3',
    timestamp: '13:28:22',
    agentName: 'LeadFinder',
    level: 'info',
    message: 'Auto-generated high-converting proposal for Nexus AI Labs (Est. Value: $3,500).'
  },
  {
    id: 'log-4',
    timestamp: '13:28:35',
    agentName: 'ContentEngine',
    level: 'success',
    message: 'Drafted SEO article "Top 7 AI Developer Tools 2026" with 2 active affiliate commission tracking links.'
  },
  {
    id: 'log-5',
    timestamp: '13:28:48',
    agentName: 'WhiteLabelSaaS',
    level: 'info',
    message: 'Apex Real Estate widget captured 3 new Qualified Patient/Property leads. MRR: $348.00/mo.'
  }
];

export function calculateRevenueMetrics(
  leads: LeadItem[],
  articles: ContentArticle[],
  widgets: ClientWidgetConfig[]
): RevenueSummary {
  const pipelineValue = leads
    .filter((l) => l.status !== 'archived')
    .reduce((sum, l) => sum + l.budget, 0);

  const mrr = widgets
    .filter((w) => w.status === 'active')
    .reduce((sum, w) => sum + w.monthlyRecurringRevenue, 0);

  const wonContracts = leads
    .filter((l) => l.status === 'won' || l.status === 'submitted')
    .reduce((sum, l) => sum + l.budget, 0);

  return {
    totalEstimatedPipelineValue: pipelineValue,
    monthlyRecurringRevenue: mrr,
    totalWonContracts: wonContracts,
    activeAutomatedAgents: 3,
    leadsProcessedCount: leads.length,
    articlesPublishedCount: articles.length,
    clientWidgetsActiveCount: widgets.length
  };
}
