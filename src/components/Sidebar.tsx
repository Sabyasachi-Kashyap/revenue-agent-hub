import React from 'react';
import { 
  LayoutDashboard, 
  Target, 
  FileText, 
  Bot, 
  Terminal, 
  Settings, 
  Zap,
  TrendingUp
} from 'lucide-react';
import { TabType } from '../types';

interface SidebarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  mrr: number;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, mrr }) => {
  const menuItems = [
    { id: 'dashboard' as TabType, label: 'Executive Dashboard', icon: LayoutDashboard, badge: 'Live' },
    { id: 'lead-finder' as TabType, label: 'Opportunity Lead Finder', icon: Target, badge: 'Agent 1' },
    { id: 'content-engine' as TabType, label: 'SEO & Affiliate Engine', icon: FileText, badge: 'Agent 2' },
    { id: 'white-label' as TabType, label: 'White-Label Client Widgets', icon: Bot, badge: 'Agent 3' },
    { id: 'agent-terminal' as TabType, label: 'Live Agent Console', icon: Terminal, badge: 'Logs' },
    { id: 'settings' as TabType, label: 'Settings & API Keys', icon: Settings }
  ];

  return (
    <aside style={{
      width: '280px',
      background: 'rgba(15, 23, 42, 0.9)',
      backdropFilter: 'blur(20px)',
      borderRight: '1px solid rgba(255, 255, 255, 0.08)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      padding: '24px 16px',
      height: '100vh',
      position: 'sticky',
      top: 0
    }}>
      <div>
        {/* Brand Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '0 8px 24px 8px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', marginBottom: '20px' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #10b981, #059669)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 20px rgba(16, 185, 129, 0.4)'
          }}>
            <Zap size={24} color="#042f1e" />
          </div>
          <div>
            <h1 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#f8fafc', letterSpacing: '-0.02em', lineHeight: 1.2 }}>
              REVENUE<span style={{ color: '#10b981' }}>.AI</span>
            </h1>
            <p style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 600 }}>Autonomous Money Hub</p>
          </div>
        </div>

        {/* Navigation List */}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                style={{
                  width: '100%',
                  justifyContent: 'space-between',
                  padding: '12px 14px',
                  borderRadius: '12px',
                  fontSize: '0.88rem',
                  fontWeight: isActive ? 700 : 500,
                  background: isActive ? 'linear-gradient(90deg, rgba(16, 185, 129, 0.15), rgba(99, 102, 241, 0.1))' : 'transparent',
                  color: isActive ? '#34d399' : '#94a3b8',
                  border: isActive ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid transparent',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Icon size={18} color={isActive ? '#34d399' : '#94a3b8'} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className={`badge ${isActive ? 'badge-emerald' : 'badge-indigo'}`} style={{ fontSize: '0.65rem', padding: '2px 6px' }}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer Banner */}
      <div className="glass-panel" style={{ padding: '16px', borderRadius: '14px', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <TrendingUp size={16} color="#10b981" />
          <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#f8fafc' }}>Active SaaS MRR</span>
        </div>
        <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#34d399', letterSpacing: '-0.03em' }}>
          ${mrr.toLocaleString()}
          <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 500, marginLeft: '4px' }}>/mo</span>
        </div>
        <p style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '4px' }}>
          Recurring monthly revenue from 2 white-label clients
        </p>
      </div>
    </aside>
  );
};
