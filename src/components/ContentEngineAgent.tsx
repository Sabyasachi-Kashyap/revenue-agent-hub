import React, { useState } from 'react';
import { FileText, Sparkles, Share2, DollarSign, ExternalLink, Copy, Check, Plus } from 'lucide-react';
import { ContentArticle } from '../types';
import { generateSEOArticle } from '../services/contentGenerator';

interface ContentEngineAgentProps {
  articles: ContentArticle[];
  setArticles: React.Dispatch<React.SetStateAction<ContentArticle[]>>;
  onAddLog: (agent: 'ContentEngine', level: 'info' | 'success', msg: string) => void;
}

export const ContentEngineAgent: React.FC<ContentEngineAgentProps> = ({
  articles,
  setArticles,
  onAddLog
}) => {
  const [selectedArticle, setSelectedArticle] = useState<ContentArticle | null>(articles[0] || null);
  const [newTopic, setNewTopic] = useState('');
  const [newNiche, setNewNiche] = useState('AI Software & SaaS');
  const [isDrafting, setIsDrafting] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCreateArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTopic.trim()) return;

    setIsDrafting(true);
    const generated = await generateSEOArticle(newTopic, newNiche);
    setArticles((prev) => [generated, ...prev]);
    setSelectedArticle(generated);
    setNewTopic('');
    setIsDrafting(false);
    onAddLog('ContentEngine', 'success', `Generated SEO Article & Affiliate Draft for "${generated.topic}"`);
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div className="badge badge-indigo" style={{ marginBottom: '6px' }}>
            <FileText size={12} /> Autonomous Agent Module #2
          </div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#f8fafc' }}>
            SEO & Affiliate Content Monetization Engine
          </h2>
          <p style={{ fontSize: '0.88rem', color: '#94a3b8' }}>
            Identifies high-search-volume keywords, authors SEO-optimized articles, embeds affiliate tracking links, and builds social promotional campaigns.
          </p>
        </div>
      </div>

      {/* Generator Input Panel */}
      <form onSubmit={handleCreateArticle} className="glass-panel" style={{ padding: '20px', display: 'flex', gap: '16px', alignItems: 'flex-end' }}>
        <div style={{ flex: 1 }}>
          <label style={{ fontSize: '0.78rem', color: '#94a3b8', display: 'block', marginBottom: '6px', fontWeight: 600 }}>
            Target Topic or Keyword Focus
          </label>
          <input
            type="text"
            placeholder="e.g. Best AI Code Generators for Web Developers"
            value={newTopic}
            onChange={(e) => setNewTopic(e.target.value)}
          />
        </div>

        <div style={{ width: '220px' }}>
          <label style={{ fontSize: '0.78rem', color: '#94a3b8', display: 'block', marginBottom: '6px', fontWeight: 600 }}>
            Industry Niche
          </label>
          <select value={newNiche} onChange={(e) => setNewNiche(e.target.value)}>
            <option value="AI Software & SaaS">AI Software & SaaS</option>
            <option value="B2B Local Marketing">B2B Local Marketing</option>
            <option value="FinTech & Crypto Trading">FinTech & Crypto Trading</option>
            <option value="Developer Productivity">Developer Productivity</option>
          </select>
        </div>

        <button type="submit" disabled={isDrafting} className="btn-indigo">
          {isDrafting ? (
            'Drafting Article...'
          ) : (
            <>
              <Sparkles size={16} /> Auto-Generate Article & Campaign
            </>
          )}
        </button>
      </form>

      {/* Articles Grid / Details */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '20px' }}>
        {/* Left Column: Articles List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '640px', overflowY: 'auto' }}>
          {articles.map((art) => {
            const isSelected = selectedArticle?.id === art.id;
            return (
              <div
                key={art.id}
                onClick={() => setSelectedArticle(art)}
                className="glass-panel"
                style={{
                  padding: '16px 18px',
                  cursor: 'pointer',
                  borderColor: isSelected ? 'rgba(99, 102, 241, 0.6)' : 'rgba(255, 255, 255, 0.08)',
                  background: isSelected ? 'rgba(99, 102, 241, 0.08)' : 'rgba(15, 23, 42, 0.7)',
                  borderRadius: '14px',
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span className="badge badge-indigo" style={{ fontSize: '0.68rem' }}>{art.niche}</span>
                  <span className="badge badge-emerald" style={{ fontSize: '0.68rem' }}>
                    Est. ${art.estMonthlyRevenue}/mo
                  </span>
                </div>

                <h3 style={{ fontSize: '0.98rem', fontWeight: 700, color: '#f8fafc', marginBottom: '6px', lineHeight: 1.35 }}>
                  {art.title}
                </h3>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.78rem', color: '#64748b' }}>
                  <span>Keyword: <code style={{ color: '#818cf8' }}>{art.keyword}</code></span>
                  <span>{art.estMonthlySearchVolume.toLocaleString()} searches/mo</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: Article & Social Snippets Inspection */}
        {selectedArticle ? (
          <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                <span className="badge badge-indigo">{selectedArticle.monetizationType}</span>
                <span style={{ fontSize: '0.8rem', color: '#34d399', fontWeight: 700 }}>
                  Est. Revenue: ${selectedArticle.estMonthlyRevenue}/month
                </span>
              </div>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#f8fafc', lineHeight: 1.3, marginBottom: '6px' }}>
                {selectedArticle.title}
              </h3>
              <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                Target Keyword: <code style={{ color: '#38bdf8' }}>{selectedArticle.keyword}</code> ({selectedArticle.estMonthlySearchVolume.toLocaleString()} monthly volume)
              </p>
            </div>

            {/* Affiliate Product Commissions */}
            <div style={{ background: 'rgba(15, 23, 42, 0.8)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#34d399', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <DollarSign size={16} /> Embedded Affiliate Tracking Links
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {selectedArticle.suggestedAffiliateProducts.map((aff, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(30, 41, 59, 0.6)', padding: '10px 12px', borderRadius: '8px' }}>
                    <div>
                      <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#f8fafc' }}>{aff.name}</span>
                      <span style={{ fontSize: '0.75rem', color: '#818cf8', marginLeft: '10px' }}>Commission: {aff.commissionRate}</span>
                    </div>
                    <button onClick={() => copyToClipboard(aff.affiliateUrl, `aff-${i}`)} className="btn-secondary" style={{ padding: '4px 10px', fontSize: '0.72rem' }}>
                      {copiedId === `aff-${i}` ? <Check size={14} color="#34d399" /> : <Copy size={14} />} Copy Link
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Social Promotion Snippets */}
            <div>
              <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#818cf8', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Share2 size={16} /> Multi-Channel Social Promotion Snippets
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {selectedArticle.socialSnippets.map((snip, i) => (
                  <div key={i} style={{ background: '#040711', padding: '14px', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <span className="badge badge-indigo" style={{ fontSize: '0.65rem' }}>{snip.platform}</span>
                      <button onClick={() => copyToClipboard(snip.postText, `snip-${i}`)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '0.75rem' }}>
                        {copiedId === `snip-${i}` ? 'Copied!' : 'Copy Snippet'}
                      </button>
                    </div>
                    <p style={{ fontSize: '0.82rem', color: '#cbd5e1', fontFamily: 'var(--font-sans)', lineHeight: 1.5 }}>
                      {snip.postText}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};
