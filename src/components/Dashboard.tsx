import React from 'react';
import { 
  TrendingUp, 
  Target, 
  FileText, 
  Bot, 
  ArrowUpRight, 
  CheckCircle2, 
  Clock, 
  Sparkles,
  Zap
} from 'lucide-react';
import { RevenueSummary, LeadItem, ContentArticle, ClientWidgetConfig, ExecutionLog, TabType } from '../types';

interface DashboardProps {
  metrics: RevenueSummary;
  leads: LeadItem[];
  articles: ContentArticle[];
  widgets: ClientWidgetConfig[];
  logs: ExecutionLog[];
  setActiveTab: (tab: TabType) => void;
  onRunAgent: (agentName: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  metrics,
  leads,
  articles,
  widgets,
  logs,
  setActiveTab,
  onRunAgent
}) => {
  return (
    <div style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Hero Welcome Banner */}
      <div className="glass-panel" style={{
        padding: '24px 28px',
        borderRadius: '20px',
        background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.12), rgba(99, 102, 241, 0.12))',
        border: '1px solid rgba(16, 185, 129, 0.25)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ maxWidth: '650px' }}>
          <div className="badge badge-emerald" style={{ marginBottom: '10px' }}>
            <Sparkles size={12} /> Autonomous Revenue Engine 2026
          </div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#f8fafc', letterSpacing: '-0.02em', marginBottom: '8px' }}>
            Your 3 AI Revenue Agents Are Operating 24/7
          </h2>
          <p style={{ fontSize: '0.92rem', color: '#94a3b8', lineHeight: 1.6 }}>
            Scraping live high-budget freelance RFPs, generating SEO-optimized affiliate marketing content, and managing White-Label AI Sales Rep widgets for recurring subscription revenue.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button onClick={() => onRunAgent('LeadFinder')} className="btn-emerald">
            <Zap size={16} fill="#042f1e" /> Trigger Scraper Now
          </button>
          <button onClick={() => setActiveTab('lead-finder')} className="btn-secondary">
            View All Opportunities <ArrowUpRight size={16} />
          </button>
        </div>
      </div>

      {/* 3 Core Revenue Pillars Overview Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
        {/* Pillar 1 */}
        <div className="glass-panel glass-panel-hover" style={{ padding: '22px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              background: 'rgba(16, 185, 129, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid rgba(16, 185, 129, 0.3)'
            }}>
              <Target size={24} color="#34d399" />
            </div>
            <span className="badge badge-emerald">Channel #1</span>
          </div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f8fafc' }}>High-Ticket Opportunities</h3>
          <p style={{ fontSize: '0.82rem', color: '#94a3b8', margin: '6px 0 16px 0' }}>
            Auto-scraped client RFPs & bounties from Upwork, RemoteOK & GitHub.
          </p>
          <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '12px', display: 'flex', justifyContent: 'space-between' }}>
            <div>
              <span style={{ fontSize: '0.7rem', color: '#64748b' }}>Active Pipeline</span>
              <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#34d399' }}>
                ${metrics.totalEstimatedPipelineValue.toLocaleString()}
              </div>
            </div>
            <button onClick={() => setActiveTab('lead-finder')} style={{ padding: '6px 12px', fontSize: '0.75rem' }} className="btn-secondary">
              Open Agent →
            </button>
          </div>
        </div>

        {/* Pillar 2 */}
        <div className="glass-panel glass-panel-hover" style={{ padding: '22px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              background: 'rgba(99, 102, 241, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid rgba(99, 102, 241, 0.3)'
            }}>
              <FileText size={24} color="#818cf8" />
            </div>
            <span className="badge badge-indigo">Channel #2</span>
          </div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f8fafc' }}>SEO & Affiliate Publishing</h3>
          <p style={{ fontSize: '0.82rem', color: '#94a3b8', margin: '6px 0 16px 0' }}>
            Automated niche keyword research & multi-channel affiliate campaigns.
          </p>
          <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '12px', display: 'flex', justifyContent: 'space-between' }}>
            <div>
              <span style={{ fontSize: '0.7rem', color: '#64748b' }}>Articles Live</span>
              <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#818cf8' }}>
                {articles.length} Published
              </div>
            </div>
            <button onClick={() => setActiveTab('content-engine')} style={{ padding: '6px 12px', fontSize: '0.75rem' }} className="btn-secondary">
              Open Agent →
            </button>
          </div>
        </div>

        {/* Pillar 3 */}
        <div className="glass-panel glass-panel-hover" style={{ padding: '22px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              background: 'rgba(245, 158, 11, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid rgba(245, 158, 11, 0.3)'
            }}>
              <Bot size={24} color="#f59e0b" />
            </div>
            <span className="badge badge-amber">Channel #3</span>
          </div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f8fafc' }}>White-Label AI Client SaaS</h3>
          <p style={{ fontSize: '0.82rem', color: '#94a3b8', margin: '6px 0 16px 0' }}>
            Embeddable 24/7 lead qualification sales reps sold to business clients.
          </p>
          <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '12px', display: 'flex', justifyContent: 'space-between' }}>
            <div>
              <span style={{ fontSize: '0.7rem', color: '#64748b' }}>Active SaaS MRR</span>
              <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#f59e0b' }}>
                ${metrics.monthlyRecurringRevenue.toLocaleString()}/mo
              </div>
            </div>
            <button onClick={() => setActiveTab('white-label')} style={{ padding: '6px 12px', fontSize: '0.75rem' }} className="btn-secondary">
              Open Agent →
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Grid: Recent High Match Opportunities + Live Logs Terminal */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '20px' }}>
        {/* Recent High Match Opportunities */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f8fafc' }}>High-Converting Opportunities</h3>
              <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Matched & evaluated by Agent 1 (Min. 85% match score)</p>
            </div>
            <button onClick={() => setActiveTab('lead-finder')} className="btn-secondary" style={{ fontSize: '0.78rem', padding: '6px 12px' }}>
              View All ({leads.length})
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {leads.slice(0, 3).map((lead) => (
              <div key={lead.id} style={{
                padding: '14px 16px',
                background: 'rgba(15, 23, 42, 0.6)',
                borderRadius: '12px',
                border: '1px solid rgba(255, 255, 255, 0.06)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <div style={{ maxWidth: '400px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <span className="badge badge-emerald" style={{ fontSize: '0.65rem', padding: '2px 6px' }}>{lead.source}</span>
                    <span style={{ fontSize: '0.72rem', color: '#64748b' }}>{lead.postedTime}</span>
                  </div>
                  <h4 style={{ fontSize: '0.92rem', fontWeight: 700, color: '#f8fafc', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {lead.title}
                  </h4>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#34d399' }}>${lead.budget.toLocaleString()}</div>
                    <span style={{ fontSize: '0.7rem', color: '#818cf8', fontWeight: 600 }}>{lead.matchScore}% Match</span>
                  </div>
                  <button onClick={() => setActiveTab('lead-finder')} className="btn-secondary" style={{ padding: '8px 12px', fontSize: '0.75rem' }}>
                    Proposal →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Live Execution Stream */}
        <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 10px #10b981' }} />
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#f8fafc' }}>Live Agent Stream</h3>
            </div>
            <button onClick={() => setActiveTab('agent-terminal')} className="btn-secondary" style={{ fontSize: '0.75rem', padding: '4px 10px' }}>
              Console
            </button>
          </div>

          <div style={{
            flex: 1,
            background: '#040711',
            borderRadius: '12px',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            padding: '14px',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.78rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            overflowY: 'auto',
            maxHeight: '260px'
          }}>
            {logs.map((log) => (
              <div key={log.id} style={{ display: 'flex', gap: '8px', lineHeight: 1.4 }}>
                <span style={{ color: '#64748b' }}>[{log.timestamp}]</span>
                <span style={{ color: log.agentName === 'LeadFinder' ? '#34d399' : log.agentName === 'ContentEngine' ? '#818cf8' : '#f59e0b', fontWeight: 600 }}>
                  [{log.agentName}]
                </span>
                <span style={{ color: log.level === 'error' ? '#f43f5e' : log.level === 'success' ? '#34d399' : '#cbd5e1' }}>
                  {log.message}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
