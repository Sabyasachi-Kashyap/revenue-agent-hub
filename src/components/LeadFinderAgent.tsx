import React, { useState } from 'react';
import { Target, RefreshCw, Send, CheckCircle, Sparkles, Filter, DollarSign, Clock, FileText } from 'lucide-react';
import { LeadItem } from '../types';
import { generateLeadProposal } from '../services/leadScraper';

interface LeadFinderAgentProps {
  leads: LeadItem[];
  setLeads: React.Dispatch<React.SetStateAction<LeadItem[]>>;
  onScanFeeds: () => void;
  onAddLog: (agent: 'LeadFinder', level: 'info' | 'success', msg: string) => void;
}

export const LeadFinderAgent: React.FC<LeadFinderAgentProps> = ({
  leads,
  setLeads,
  onScanFeeds,
  onAddLog
}) => {
  const [selectedLead, setSelectedLead] = useState<LeadItem | null>(leads[0] || null);
  const [filterSource, setFilterSource] = useState<string>('all');
  const [isGenerating, setIsGenerating] = useState(false);

  const filteredLeads = leads.filter((l) => filterSource === 'all' || l.source === filterSource);

  const handleGenerateProposal = (lead: LeadItem) => {
    setIsGenerating(true);
    setTimeout(() => {
      const updatedLead = generateLeadProposal(lead);
      setLeads((prev) => prev.map((item) => (item.id === lead.id ? updatedLead : item)));
      setSelectedLead(updatedLead);
      setIsGenerating(false);
      onAddLog('LeadFinder', 'success', `Generated high-converting proposal for "${lead.title.slice(0, 35)}..." ($${lead.budget})`);
    }, 600);
  };

  const handleSubmitProposal = (lead: LeadItem) => {
    setLeads((prev) =>
      prev.map((item) => (item.id === lead.id ? { ...item, status: 'submitted' } : item))
    );
    if (selectedLead?.id === lead.id) {
      setSelectedLead({ ...selectedLead, status: 'submitted' });
    }
    onAddLog('LeadFinder', 'success', `Bid submitted for "${lead.title.slice(0, 30)}..." to ${lead.clientName}`);
  };

  return (
    <div style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div className="badge badge-emerald" style={{ marginBottom: '6px' }}>
            <Target size={12} /> Autonomous Agent Module #1
          </div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#f8fafc' }}>
            Opportunity Lead Finder & AI Proposal Engine
          </h2>
          <p style={{ fontSize: '0.88rem', color: '#94a3b8' }}>
            Monitors high-ticket tech RFPs, scores project-match compatibility, and drafts personalized proposals.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <select
            value={filterSource}
            onChange={(e) => setFilterSource(e.target.value)}
            style={{ width: '180px', padding: '8px 12px', fontSize: '0.85rem' }}
          >
            <option value="all">All Job Feeds</option>
            <option value="Upwork Feed">Upwork Feed</option>
            <option value="GitHub Bounties">GitHub Bounties</option>
            <option value="RemoteOK RFP">RemoteOK RFP</option>
            <option value="WeWorkRemotely">WeWorkRemotely</option>
          </select>

          <button onClick={onScanFeeds} className="btn-emerald">
            <RefreshCw size={16} /> Scan Public Feeds Now
          </button>
        </div>
      </div>

      {/* Main Content Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1.4fr', gap: '20px' }}>
        {/* Left Column: Lead Cards List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '720px', overflowY: 'auto', paddingRight: '4px' }}>
          {filteredLeads.map((lead) => {
            const isSelected = selectedLead?.id === lead.id;
            return (
              <div
                key={lead.id}
                onClick={() => setSelectedLead(lead)}
                className="glass-panel"
                style={{
                  padding: '16px 18px',
                  cursor: 'pointer',
                  borderColor: isSelected ? 'rgba(16, 185, 129, 0.6)' : 'rgba(255, 255, 255, 0.08)',
                  background: isSelected ? 'rgba(16, 185, 129, 0.08)' : 'rgba(15, 23, 42, 0.7)',
                  borderRadius: '14px',
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span className="badge badge-emerald" style={{ fontSize: '0.68rem' }}>{lead.source}</span>
                  <span style={{ fontSize: '0.78rem', color: '#34d399', fontWeight: 700 }}>
                    {lead.matchScore}% Match
                  </span>
                </div>

                <h3 style={{ fontSize: '0.98rem', fontWeight: 700, color: '#f8fafc', marginBottom: '6px', lineHeight: 1.35 }}>
                  {lead.title}
                </h3>

                <p style={{ fontSize: '0.8rem', color: '#94a3b8', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', marginBottom: '12px' }}>
                  {lead.description}
                </p>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.78rem', color: '#64748b' }}>
                  <span style={{ color: '#34d399', fontWeight: 800, fontSize: '0.95rem' }}>
                    ${lead.budget.toLocaleString()}
                  </span>
                  <span>Est. {lead.estDays} days</span>
                  <span style={{ textTransform: 'capitalize', color: lead.status === 'submitted' ? '#34d399' : '#818cf8' }}>
                    ● {lead.status.replace('_', ' ')}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: Lead Detail & AI Proposal Editor */}
        {selectedLead ? (
          <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <span className="badge badge-indigo" style={{ marginBottom: '8px' }}>{selectedLead.category}</span>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f8fafc', marginBottom: '4px' }}>
                    {selectedLead.title}
                  </h3>
                  <div style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'flex', gap: '16px' }}>
                    <span>Client: <strong style={{ color: '#f8fafc' }}>{selectedLead.clientName}</strong></span>
                    <span>Location: <strong style={{ color: '#f8fafc' }}>{selectedLead.clientLocation}</strong></span>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#34d399' }}>${selectedLead.budget.toLocaleString()}</div>
                  <span className="badge badge-emerald">{selectedLead.matchScore}% Match Score</span>
                </div>
              </div>

              {/* Skills Tags */}
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '12px' }}>
                {selectedLead.skillsRequired.map((skill, idx) => (
                  <span key={idx} style={{
                    fontSize: '0.72rem',
                    background: 'rgba(30, 41, 59, 0.9)',
                    color: '#94a3b8',
                    padding: '4px 10px',
                    borderRadius: '6px',
                    border: '1px solid rgba(255, 255, 255, 0.08)'
                  }}>
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Description */}
            <div>
              <h4 style={{ fontSize: '0.85rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px' }}>
                Job Description
              </h4>
              <p style={{ fontSize: '0.88rem', color: '#cbd5e1', lineHeight: 1.6 }}>
                {selectedLead.description}
              </p>
            </div>

            {/* AI Proposal Section */}
            <div style={{
              background: 'rgba(15, 23, 42, 0.8)',
              borderRadius: '14px',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              padding: '18px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Sparkles size={18} color="#34d399" />
                  <h4 style={{ fontSize: '0.98rem', fontWeight: 700, color: '#f8fafc' }}>
                    AI-Generated Proposal & Pitch
                  </h4>
                </div>

                {!selectedLead.proposal && (
                  <button
                    onClick={() => handleGenerateProposal(selectedLead)}
                    disabled={isGenerating}
                    className="btn-emerald"
                    style={{ padding: '6px 14px', fontSize: '0.8rem' }}
                  >
                    {isGenerating ? 'Generating Proposal...' : 'Generate Pitch Draft'}
                  </button>
                )}
              </div>

              {selectedLead.proposal ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div>
                    <label style={{ fontSize: '0.75rem', color: '#64748b', display: 'block', marginBottom: '4px' }}>Cover Letter Draft</label>
                    <textarea
                      rows={5}
                      value={selectedLead.proposal.coverLetter}
                      onChange={(e) => {
                        const newLetter = e.target.value;
                        if (!selectedLead.proposal) return;
                        const updatedProp = { ...selectedLead.proposal, coverLetter: newLetter };
                        setLeads((prev) =>
                          prev.map((item) =>
                            item.id === selectedLead.id
                              ? { ...item, proposal: updatedProp }
                              : item
                          )
                        );
                        setSelectedLead({
                          ...selectedLead,
                          proposal: updatedProp
                        });
                      }}
                      style={{ fontSize: '0.85rem', lineHeight: 1.5 }}
                    />
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Deliverables:</span>
                      <ul style={{ fontSize: '0.78rem', color: '#34d399', paddingLeft: '16px', marginTop: '4px' }}>
                        {selectedLead.proposal.keyDeliverables.map((d, i) => (
                          <li key={i}>{d}</li>
                        ))}
                      </ul>
                    </div>

                    <button
                      onClick={() => handleSubmitProposal(selectedLead)}
                      disabled={selectedLead.status === 'submitted'}
                      className={selectedLead.status === 'submitted' ? 'btn-secondary' : 'btn-emerald'}
                    >
                      {selectedLead.status === 'submitted' ? (
                        <>
                          <CheckCircle size={16} color="#34d399" /> Bid Submitted
                        </>
                      ) : (
                        <>
                          <Send size={16} /> Submit Proposal (${selectedLead.budget})
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '24px 0', color: '#64748b', fontSize: '0.85rem' }}>
                  Click "Generate Pitch Draft" to auto-create a tailored proposal based on client skills & budget.
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="glass-panel" style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>
            Select an opportunity on the left to view details and generate proposals.
          </div>
        )}
      </div>
    </div>
  );
};
