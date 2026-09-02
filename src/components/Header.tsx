import React from 'react';
import { 
  Activity, 
  DollarSign, 
  Play, 
  Pause, 
  SlidersHorizontal,
  Briefcase,
  Layers
} from 'lucide-react';
import { RevenueSummary } from '../types';

interface HeaderProps {
  metrics: RevenueSummary;
  autoPilot: boolean;
  setAutoPilot: (val: boolean) => void;
  onOpenSettings: () => void;
  onRunAllAgents: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  metrics,
  autoPilot,
  setAutoPilot,
  onOpenSettings,
  onRunAllAgents
}) => {
  return (
    <header style={{
      padding: '18px 28px',
      background: 'rgba(15, 23, 42, 0.7)',
      backdropFilter: 'blur(16px)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'sticky',
      top: 0,
      zIndex: 40
    }}>
      {/* Metrics Bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            background: 'rgba(16, 185, 129, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '1px solid rgba(16, 185, 129, 0.3)'
          }}>
            <DollarSign size={20} color="#34d399" />
          </div>
          <div>
            <span style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>
              Total Pipeline Value
            </span>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f8fafc' }}>
              ${metrics.totalEstimatedPipelineValue.toLocaleString()}
            </div>
          </div>
        </div>

        <div style={{ height: '32px', width: '1px', background: 'rgba(255, 255, 255, 0.1)' }} />

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            background: 'rgba(99, 102, 241, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '1px solid rgba(99, 102, 241, 0.3)'
          }}>
            <Briefcase size={20} color="#818cf8" />
          </div>
          <div>
            <span style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>
              Leads Analyzed
            </span>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f8fafc' }}>
              {metrics.leadsProcessedCount} <span style={{ fontSize: '0.8rem', color: '#34d399', fontWeight: 600 }}>(94% Match)</span>
            </div>
          </div>
        </div>

        <div style={{ height: '32px', width: '1px', background: 'rgba(255, 255, 255, 0.1)' }} />

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            background: 'rgba(245, 158, 11, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '1px solid rgba(245, 158, 11, 0.3)'
          }}>
            <Layers size={20} color="#f59e0b" />
          </div>
          <div>
            <span style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>
              Active Agents
            </span>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f8fafc' }}>
              3 / 3 <span style={{ fontSize: '0.8rem', color: '#10b981' }}>● Autonomous</span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <button
          onClick={() => setAutoPilot(!autoPilot)}
          className="btn-secondary"
          style={{
            borderColor: autoPilot ? 'rgba(16, 185, 129, 0.5)' : 'rgba(255, 255, 255, 0.1)',
            background: autoPilot ? 'rgba(16, 185, 129, 0.15)' : 'rgba(30, 41, 59, 0.8)',
            color: autoPilot ? '#34d399' : '#94a3b8'
          }}
        >
          {autoPilot ? <Activity className="spin-slow" size={16} color="#34d399" /> : <Pause size={16} />}
          <span>{autoPilot ? 'AutoPilot: ACTIVE' : 'AutoPilot: PAUSED'}</span>
        </button>

        <button onClick={onRunAllAgents} className="btn-emerald">
          <Play size={16} fill="#042f1e" />
          <span>Execute All Agents Now</span>
        </button>

        <button onClick={onOpenSettings} className="btn-secondary" style={{ padding: '10px' }}>
          <SlidersHorizontal size={18} />
        </button>
      </div>
    </header>
  );
};
