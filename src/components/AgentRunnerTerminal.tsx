import React, { useState } from 'react';
import { Terminal, Play, Pause, Trash2, Shield, Activity, RefreshCw } from 'lucide-react';
import { ExecutionLog } from '../types';

interface AgentRunnerTerminalProps {
  logs: ExecutionLog[];
  onClearLogs: () => void;
  onRunAgent: (agentName: string) => void;
  autoPilot: boolean;
  setAutoPilot: (val: boolean) => void;
}

export const AgentRunnerTerminal: React.FC<AgentRunnerTerminalProps> = ({
  logs,
  onClearLogs,
  onRunAgent,
  autoPilot,
  setAutoPilot
}) => {
  const [filterAgent, setFilterAgent] = useState<string>('all');

  const filteredLogs = logs.filter(
    (l) => filterAgent === 'all' || l.agentName.toLowerCase() === filterAgent.toLowerCase()
  );

  return (
    <div style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div className="badge badge-emerald" style={{ marginBottom: '6px' }}>
            <Terminal size={12} /> Real-Time Execution Console
          </div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#f8fafc' }}>
            Live Agent Execution Stream & Scheduler
          </h2>
          <p style={{ fontSize: '0.88rem', color: '#94a3b8' }}>
            Monitor automated background scrapers, SEO content workflows, and client widget events in real-time.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button onClick={() => setAutoPilot(!autoPilot)} className={autoPilot ? 'btn-emerald' : 'btn-secondary'}>
            {autoPilot ? <Activity className="spin-slow" size={16} /> : <Pause size={16} />}
            {autoPilot ? 'AutoPilot: ACTIVE' : 'AutoPilot: PAUSED'}
          </button>

          <button onClick={onClearLogs} className="btn-secondary">
            <Trash2 size={16} /> Clear Logs
          </button>
        </div>
      </div>

      {/* Manual Agent Trigger Bar */}
      <div className="glass-panel" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Play size={18} color="#10b981" />
          <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#f8fafc' }}>Trigger Individual Agent Workflows:</span>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={() => onRunAgent('LeadFinder')} className="btn-emerald" style={{ fontSize: '0.8rem', padding: '6px 14px' }}>
            Run Lead Scraper
          </button>
          <button onClick={() => onRunAgent('ContentEngine')} className="btn-indigo" style={{ fontSize: '0.8rem', padding: '6px 14px' }}>
            Run SEO Article Writer
          </button>
          <button onClick={() => onRunAgent('WhiteLabelSaaS')} className="btn-secondary" style={{ fontSize: '0.8rem', padding: '6px 14px', borderColor: '#f59e0b', color: '#f59e0b' }}>
            Run Client Widget Simulator
          </button>
        </div>
      </div>

      {/* Terminal Display Container */}
      <div className="glass-panel" style={{ padding: '0', overflow: 'hidden', borderRadius: '16px' }}>
        {/* Terminal Header */}
        <div style={{
          padding: '12px 18px',
          background: 'rgba(15, 23, 42, 0.9)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#f43f5e' }} />
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#f59e0b' }} />
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10b981' }} />
            <span style={{ fontSize: '0.78rem', color: '#94a3b8', fontFamily: 'var(--font-mono)', marginLeft: '8px' }}>
              revenue-agent-daemon.service --watch
            </span>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <select
              value={filterAgent}
              onChange={(e) => setFilterAgent(e.target.value)}
              style={{ padding: '4px 8px', fontSize: '0.75rem', width: '150px' }}
            >
              <option value="all">Filter All Agents</option>
              <option value="leadfinder">LeadFinder</option>
              <option value="contentengine">ContentEngine</option>
              <option value="whitelabelsaas">WhiteLabelSaaS</option>
              <option value="system">System</option>
            </select>
          </div>
        </div>

        {/* Logs Console Body */}
        <div style={{
          background: '#040711',
          padding: '20px',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.82rem',
          height: '420px',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}>
          {filteredLogs.map((log) => {
            const agentColor =
              log.agentName === 'LeadFinder'
                ? '#34d399'
                : log.agentName === 'ContentEngine'
                ? '#818cf8'
                : log.agentName === 'WhiteLabelSaaS'
                ? '#f59e0b'
                : '#38bdf8';

            return (
              <div key={log.id} style={{ display: 'flex', gap: '12px', lineHeight: 1.5, alignItems: 'flex-start' }}>
                <span style={{ color: '#64748b' }}>[{log.timestamp}]</span>
                <span style={{ color: agentColor, fontWeight: 600 }}>[{log.agentName}]</span>
                <span style={{
                  color: log.level === 'error' ? '#f43f5e' : log.level === 'success' ? '#34d399' : '#cbd5e1',
                  flex: 1
                }}>
                  {log.message}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
