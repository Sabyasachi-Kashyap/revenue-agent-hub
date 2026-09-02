export type TabType = 'dashboard' | 'lead-finder' | 'content-engine' | 'white-label' | 'agent-terminal' | 'settings';

export interface LeadItem {
  id: string;
  title: string;
  source: 'Upwork Feed' | 'GitHub Bounties' | 'RemoteOK RFP' | 'WeWorkRemotely' | 'Direct Inbound';
  category: string;
  budget: number;
  estDays: number;
  matchScore: number; // 0-100%
  description: string;
  skillsRequired: string[];
  status: 'new' | 'analyzed' | 'pitch_generated' | 'submitted' | 'won' | 'archived';
  clientName?: string;
  clientLocation?: string;
  postedTime: string;
  proposal?: {
    coverLetter: string;
    estimatedPrice: number;
    timeline: string;
    keyDeliverables: string[];
  };
}

export interface ContentArticle {
  id: string;
  topic: string;
  niche: string;
  keyword: string;
  estMonthlySearchVolume: number;
  monetizationType: 'Affiliate Marketing' | 'AdSense / Media' | 'Digital Product Lead' | 'SaaS Trial';
  status: 'drafting' | 'ready' | 'published';
  title: string;
  outline: string[];
  contentBody: string;
  suggestedAffiliateProducts: {
    name: string;
    commissionRate: string;
    affiliateUrl: string;
  }[];
  socialSnippets: {
    platform: 'X (Twitter)' | 'LinkedIn' | 'Newsletter';
    postText: string;
  }[];
  estMonthlyRevenue: number;
  createdAt: string;
}

export interface ClientWidgetConfig {
  id: string;
  clientName: string;
  businessNiche: string;
  primaryColor: string;
  botAvatarUrl?: string;
  welcomeMessage: string;
  autoLeadQualificationQuestions: string[];
  monthlySubscriptionPrice: number; // e.g., $99/mo
  activeLeadsCaptured: number;
  monthlyRecurringRevenue: number;
  embedScriptCode: string;
  status: 'active' | 'pending_installation' | 'paused';
}

export interface ExecutionLog {
  id: string;
  timestamp: string;
  agentName: 'LeadFinder' | 'ContentEngine' | 'WhiteLabelSaaS' | 'System';
  level: 'info' | 'success' | 'warning' | 'error';
  message: string;
  details?: string;
}

export interface RevenueSummary {
  totalEstimatedPipelineValue: number;
  monthlyRecurringRevenue: number; // MRR from White-Label widgets
  totalWonContracts: number;
  activeAutomatedAgents: number;
  leadsProcessedCount: number;
  articlesPublishedCount: number;
  clientWidgetsActiveCount: number;
}

export interface ApiSettings {
  openaiApiKey: string;
  geminiApiKey: string;
  githubToken: string;
  autoPilotEnabled: boolean;
  minLeadBudget: number;
  minMatchScore: number;
  bankDetails?: {
    accountHolderName: string;
    bankName: string;
    accountNumber: string;
    ifscCode: string;
    upiId: string;
    stripePaymentLink: string;
  };
}
