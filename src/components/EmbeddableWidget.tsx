import React, { useState } from 'react';
import { Bot, Plus, Check, Copy, Code, MessageSquare, DollarSign, Send, ShieldCheck } from 'lucide-react';
import { ClientWidgetConfig } from '../types';
import { createNewClientWidget } from '../services/widgetGenerator';

interface EmbeddableWidgetProps {
  widgets: ClientWidgetConfig[];
  setWidgets: React.Dispatch<React.SetStateAction<ClientWidgetConfig[]>>;
  onAddLog: (agent: 'WhiteLabelSaaS', level: 'info' | 'success', msg: string) => void;
}

export const EmbeddableWidget: React.FC<EmbeddableWidgetProps> = ({
  widgets,
  setWidgets,
  onAddLog
}) => {
  const [selectedWidget, setSelectedWidget] = useState<ClientWidgetConfig | null>(widgets[0] || null);
  const [clientName, setClientName] = useState('');
  const [niche, setNiche] = useState('Healthcare & Aesthetic Clinics');
  const [subPrice, setSubPrice] = useState(149);
  const [primaryColor, setPrimaryColor] = useState('#10b981');

  const [simulatedChatMessages, setSimulatedChatMessages] = useState<{ sender: 'bot' | 'user'; text: string }[]>([
    { sender: 'bot', text: selectedWidget?.welcomeMessage || 'Hi there! Welcome! How can I assist you today?' }
  ]);
  const [userChatInput, setUserChatInput] = useState('');
  const [copiedScript, setCopiedScript] = useState(false);

  const handleCreateWidget = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim()) return;

    const newW = createNewClientWidget(clientName, niche, primaryColor, subPrice);
    setWidgets((prev) => [newW, ...prev]);
    setSelectedWidget(newW);
    setClientName('');
    onAddLog('WhiteLabelSaaS', 'success', `Created White-Label Client Widget for "${newW.clientName}" ($${newW.monthlySubscriptionPrice}/mo MRR)`);
  };

  const handleSendSimulatedMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userChatInput.trim()) return;

    const userMsg = userChatInput;
    setSimulatedChatMessages((prev) => [...prev, { sender: 'user', text: userMsg }]);
    setUserChatInput('');

    setTimeout(() => {
      setSimulatedChatMessages((prev) => [
        ...prev,
        {
          sender: 'bot',
          text: `Thank you! I have logged your response ("${userMsg}"). Where should our consultation specialist send your confirmation packet?`
        }
      ]);
    }, 600);
  };

  const copyScript = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedScript(true);
    setTimeout(() => setCopiedScript(false), 2000);
  };

  return (
    <div style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div className="badge badge-amber" style={{ marginBottom: '6px' }}>
            <Bot size={12} /> Autonomous Agent Module #3
          </div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#f8fafc' }}>
            White-Label AI Client Sales Widgets (Micro-SaaS MRR)
          </h2>
          <p style={{ fontSize: '0.88rem', color: '#94a3b8' }}>
            Build and license embeddable 24/7 lead-qualification AI agents to business clients for $99–$199 monthly recurring subscription revenue.
          </p>
        </div>
      </div>

      {/* Main Grid: Create & Client List + Live Widget Playground */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1.4fr', gap: '20px' }}>
        {/* Left Column: Client SaaS Roster & Setup Form */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* New Client Onboarding Form */}
          <form onSubmit={handleCreateWidget} className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Plus size={18} color="#f59e0b" /> Add New Client Widget ($/mo MRR)
            </h3>

            <div>
              <label style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Client Business Name</label>
              <input
                type="text"
                placeholder="e.g. Radiant Aesthetics Spa"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Business Industry</label>
                <select value={niche} onChange={(e) => setNiche(e.target.value)}>
                  <option value="Healthcare & Aesthetic Clinics">Healthcare Clinics</option>
                  <option value="Real Estate & Property">Real Estate</option>
                  <option value="Legal & Law Firms">Legal & Law</option>
                  <option value="Automotive & Services">Automotive</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Monthly Retainer Price</label>
                <select value={subPrice} onChange={(e) => setSubPrice(Number(e.target.value))}>
                  <option value={99}>$99 / month</option>
                  <option value={149}>$149 / month</option>
                  <option value={199}>$199 / month</option>
                  <option value={299}>$299 / month</option>
                </select>
              </div>
            </div>

            <button type="submit" className="btn-emerald" style={{ marginTop: '4px' }}>
              Generate Client Script & Start Billing
            </button>
          </form>

          {/* Active Clients List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <h4 style={{ fontSize: '0.85rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Active SaaS Client Portfolio
            </h4>
            {widgets.map((w) => {
              const isSelected = selectedWidget?.id === w.id;
              return (
                <div
                  key={w.id}
                  onClick={() => {
                    setSelectedWidget(w);
                    setSimulatedChatMessages([{ sender: 'bot', text: w.welcomeMessage }]);
                  }}
                  className="glass-panel"
                  style={{
                    padding: '14px 16px',
                    cursor: 'pointer',
                    borderColor: isSelected ? 'rgba(245, 158, 11, 0.6)' : 'rgba(255, 255, 255, 0.08)',
                    background: isSelected ? 'rgba(245, 158, 11, 0.08)' : 'rgba(15, 23, 42, 0.7)',
                    borderRadius: '12px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: w.primaryColor }} />
                      <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#f8fafc' }}>{w.clientName}</h4>
                    </div>
                    <span style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '2px', display: 'block' }}>
                      {w.businessNiche} • {w.activeLeadsCaptured} leads captured
                    </span>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <span className="badge badge-amber">${w.monthlySubscriptionPrice}/mo</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Live Interactive Widget Simulation & Code Embed Generator */}
        {selectedWidget ? (
          <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Top Bar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span className="badge badge-amber">{selectedWidget.businessNiche}</span>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#f8fafc', marginTop: '4px' }}>
                  {selectedWidget.clientName} Widget Sandbox
                </h3>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#f59e0b' }}>
                  ${selectedWidget.monthlyRecurringRevenue}/mo
                </div>
                <span style={{ fontSize: '0.72rem', color: '#10b981' }}>Active Client Retainer</span>
              </div>
            </div>

            {/* Live Interactive Chat Sandbox */}
            <div style={{
              background: '#040711',
              borderRadius: '16px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              height: '340px'
            }}>
              {/* Chat Header */}
              <div style={{
                padding: '12px 16px',
                background: selectedWidget.primaryColor,
                color: '#000',
                fontWeight: 700,
                fontSize: '0.88rem',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <Bot size={18} />
                <span>{selectedWidget.clientName} AI Booking Rep</span>
              </div>

              {/* Chat Body */}
              <div style={{ flex: 1, padding: '14px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {simulatedChatMessages.map((msg, i) => (
                  <div
                    key={i}
                    style={{
                      alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                      maxWidth: '80%',
                      background: msg.sender === 'user' ? 'rgba(99, 102, 241, 0.25)' : 'rgba(30, 41, 59, 0.9)',
                      border: msg.sender === 'user' ? '1px solid rgba(99, 102, 241, 0.4)' : '1px solid rgba(255, 255, 255, 0.1)',
                      color: '#f8fafc',
                      padding: '10px 14px',
                      borderRadius: '12px',
                      fontSize: '0.82rem',
                      lineHeight: 1.4
                    }}
                  >
                    {msg.text}
                  </div>
                ))}
              </div>

              {/* Chat Input */}
              <form onSubmit={handleSendSimulatedMessage} style={{ padding: '10px', background: 'rgba(15, 23, 42, 0.9)', borderTop: '1px solid rgba(255, 255, 255, 0.08)', display: 'flex', gap: '8px' }}>
                <input
                  type="text"
                  placeholder="Test inquiry as a customer..."
                  value={userChatInput}
                  onChange={(e) => setUserChatInput(e.target.value)}
                  style={{ fontSize: '0.8rem', padding: '8px 12px' }}
                />
                <button type="submit" style={{ padding: '8px 14px', background: selectedWidget.primaryColor, color: '#000' }}>
                  <Send size={14} />
                </button>
              </form>
            </div>

            {/* Code Embed Snippet for Client Installation */}
            <div style={{ background: 'rgba(15, 23, 42, 0.8)', padding: '18px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Code size={16} color="#f59e0b" />
                  <h4 style={{ fontSize: '0.88rem', fontWeight: 700, color: '#f8fafc' }}>
                    Client Website Embed Script
                  </h4>
                </div>

                <button onClick={() => copyScript(selectedWidget.embedScriptCode)} className="btn-secondary" style={{ padding: '4px 10px', fontSize: '0.75rem' }}>
                  {copiedScript ? <Check size={14} color="#34d399" /> : <Copy size={14} />} {copiedScript ? 'Copied' : 'Copy Script'}
                </button>
              </div>

              <div className="code-block" style={{ fontSize: '0.78rem' }}>
                {selectedWidget.embedScriptCode}
              </div>
              <p style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '8px' }}>
                Paste this 1-line HTML snippet into the client's website <code>&lt;head&gt;</code> tag to activate live lead qualification.
              </p>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};
