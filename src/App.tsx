import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { LeadFinderAgent } from './components/LeadFinderAgent';
import { ContentEngineAgent } from './components/ContentEngineAgent';
import { EmbeddableWidget } from './components/EmbeddableWidget';
import { AgentRunnerTerminal } from './components/AgentRunnerTerminal';
import { SettingsModal } from './components/SettingsModal';

import { TabType, LeadItem, ContentArticle, ClientWidgetConfig, ExecutionLog, ApiSettings } from './types';
import { INITIAL_LEADS, fetchLiveLeads } from './services/leadScraper';
import { INITIAL_ARTICLES, generateSEOArticle } from './services/contentGenerator';
import { INITIAL_WIDGETS } from './services/widgetGenerator';
import { INITIAL_LOGS, calculateRevenueMetrics } from './services/agentEngine';
import { supabase, isSupabaseConfigured } from './lib/supabaseClient';
import * as db from './lib/db';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [leads, setLeads] = useState<LeadItem[]>(INITIAL_LEADS);
  const [articles, setArticles] = useState<ContentArticle[]>(INITIAL_ARTICLES);
  const [widgets, setWidgets] = useState<ClientWidgetConfig[]>(INITIAL_WIDGETS);
  const [logs, setLogs] = useState<ExecutionLog[]>(INITIAL_LOGS);

  const [autoPilot, setAutoPilot] = useState<boolean>(true);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [settings, setSettings] = useState<ApiSettings>({
    openaiApiKey: '',
    geminiApiKey: '',
    githubToken: '',
    autoPilotEnabled: true,
    minLeadBudget: 500,
    minMatchScore: 80
  });

  const [isBackendReady, setIsBackendReady] = useState<boolean>(!isSupabaseConfigured);

  // Calculate live revenue metrics
  const revenueMetrics = calculateRevenueMetrics(leads, articles, widgets);

  // ---- Backend bootstrap: sign in anonymously (per-device account), then
  // load persisted data. Falls back silently to in-memory mock state when
  // Supabase env vars aren't set — nothing here blocks the demo experience. ----
  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) return;

    (async () => {
      try {
        const { data: sessionData } = await supabase.auth.getSession();
        if (!sessionData.session) {
          await supabase.auth.signInAnonymously();
        }

        const [dbLeads, dbArticles, dbWidgets, dbLogs, dbSettings] = await Promise.all([
          db.fetchLeads(),
          db.fetchArticles(),
          db.fetchWidgets(),
          db.fetchLogs(),
          db.fetchSettings(),
        ]);

        // First-ever run for this user: seed the DB with the starter demo rows
        // so the dashboard isn't empty, and so future loads pull from Supabase.
        if (dbLeads && dbLeads.length === 0) await db.upsertLeads(INITIAL_LEADS);
        else if (dbLeads) setLeads(dbLeads);

        if (dbArticles && dbArticles.length === 0) {
          await Promise.all(INITIAL_ARTICLES.map((a) => db.upsertArticle(a)));
        } else if (dbArticles) setArticles(dbArticles);

        if (dbWidgets && dbWidgets.length === 0) {
          await Promise.all(INITIAL_WIDGETS.map((w) => db.upsertWidget(w)));
        } else if (dbWidgets) setWidgets(dbWidgets);

        if (dbLogs && dbLogs.length > 0) setLogs(dbLogs);
        if (dbSettings) setSettings((prev) => ({ ...prev, ...dbSettings }));

        setIsBackendReady(true);
      } catch (err) {
        console.error('Backend bootstrap failed, staying in mock mode:', err);
        setIsBackendReady(true);
      }
    })();
  }, []);

  const addLog = (agentName: 'LeadFinder' | 'ContentEngine' | 'WhiteLabelSaaS' | 'System', level: 'info' | 'success' | 'warning' | 'error', message: string) => {
    const timeStr = new Date().toLocaleTimeString('en-US', { hour12: false });
    const newLog: ExecutionLog = {
      id: `log-${Date.now()}`,
      timestamp: timeStr,
      agentName,
      level,
      message
    };
    setLogs((prev) => [newLog, ...prev.slice(0, 40)]);
    db.insertLog(newLog);
  };

  // Trigger Feed Scan for LeadFinder
  const handleScanFeeds = async () => {
    addLog('LeadFinder', 'info', 'Connecting to Upwork, RemoteOK & GitHub public job feeds...');
    const newLeads = await fetchLiveLeads(settings.minLeadBudget);
    setLeads(newLeads);
    addLog('LeadFinder', 'success', `Scraped ${newLeads.length} active high-budget opportunity RFPs.`);
  };

  // Run Specific Agent Manually
  const handleRunAgent = async (agentName: string) => {
    if (agentName === 'LeadFinder') {
      await handleScanFeeds();
    } else if (agentName === 'ContentEngine') {
      addLog('ContentEngine', 'info', 'Researching trending keywords in AI SaaS niche...');
      const newArt = await generateSEOArticle('Automated Python Scraping Pipelines', 'Developer Productivity');
      setArticles((prev) => [newArt, ...prev]);
      addLog('ContentEngine', 'success', `Published SEO Draft "${newArt.title}" with affiliate commissions.`);
    } else if (agentName === 'WhiteLabelSaaS') {
      addLog('WhiteLabelSaaS', 'info', 'Polling active client widget endpoints...');
      setWidgets((prev) =>
        prev.map((w, idx) =>
          idx === 0 ? { ...w, activeLeadsCaptured: w.activeLeadsCaptured + 2 } : w
        )
      );
      addLog('WhiteLabelSaaS', 'success', 'Captured 2 new high-intent consultation leads for Apex Real Estate.');
    }
  };

  // Execute All Agents
  const handleRunAllAgents = () => {
    addLog('System', 'info', 'Executing full multi-agent cycle across all 3 revenue channels...');
    handleRunAgent('LeadFinder');
    setTimeout(() => handleRunAgent('ContentEngine'), 1200);
    setTimeout(() => handleRunAgent('WhiteLabelSaaS'), 2400);
  };

  // Sync-on-change: whenever leads/articles/widgets/settings change (including
  // edits made directly inside child components), push the full array to
  // Supabase. Upserts are id-keyed so this is safe to call repeatedly.
  // Skipped until the initial backend load completes, so we don't clobber
  // freshly-fetched DB rows with the pre-load in-memory state.
  useEffect(() => {
    if (!isSupabaseConfigured || !isBackendReady) return;
    db.upsertLeads(leads);
  }, [leads, isBackendReady]);

  useEffect(() => {
    if (!isSupabaseConfigured || !isBackendReady) return;
    articles.forEach((a) => db.upsertArticle(a));
  }, [articles, isBackendReady]);

  useEffect(() => {
    if (!isSupabaseConfigured || !isBackendReady) return;
    widgets.forEach((w) => db.upsertWidget(w));
  }, [widgets, isBackendReady]);

  useEffect(() => {
    if (!isSupabaseConfigured || !isBackendReady) return;
    db.saveSettings(settings);
  }, [settings, isBackendReady]);

  // AutoPilot Loop (Interval trigger when active)
  useEffect(() => {
    if (!autoPilot) return;
    const interval = setInterval(() => {
      const agents: ('LeadFinder' | 'ContentEngine' | 'WhiteLabelSaaS')[] = ['LeadFinder', 'ContentEngine', 'WhiteLabelSaaS'];
      const randomAgent = agents[Math.floor(Math.random() * agents.length)];
      handleRunAgent(randomAgent);
    }, 25000); // Trigger subtle autopilot event every 25s

    return () => clearInterval(interval);
  }, [autoPilot, settings]);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-dark)' }}>
      {/* Sidebar Navigation */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} mrr={revenueMetrics.monthlyRecurringRevenue} />

      {/* Main Content Viewport */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <Header
          metrics={revenueMetrics}
          autoPilot={autoPilot}
          setAutoPilot={setAutoPilot}
          onOpenSettings={() => setIsSettingsOpen(true)}
          onRunAllAgents={handleRunAllAgents}
        />

        <main style={{ flex: 1, overflowY: 'auto' }}>
          {activeTab === 'dashboard' && (
            <Dashboard
              metrics={revenueMetrics}
              leads={leads}
              articles={articles}
              widgets={widgets}
              logs={logs}
              setActiveTab={setActiveTab}
              onRunAgent={handleRunAgent}
            />
          )}

          {activeTab === 'lead-finder' && (
            <LeadFinderAgent
              leads={leads}
              setLeads={setLeads}
              onScanFeeds={handleScanFeeds}
              onAddLog={addLog}
            />
          )}

          {activeTab === 'content-engine' && (
            <ContentEngineAgent
              articles={articles}
              setArticles={setArticles}
              onAddLog={addLog}
            />
          )}

          {activeTab === 'white-label' && (
            <EmbeddableWidget
              widgets={widgets}
              setWidgets={setWidgets}
              onAddLog={addLog}
            />
          )}

          {activeTab === 'agent-terminal' && (
            <AgentRunnerTerminal
              logs={logs}
              onClearLogs={() => setLogs([])}
              onRunAgent={handleRunAgent}
              autoPilot={autoPilot}
              setAutoPilot={setAutoPilot}
            />
          )}

          {activeTab === 'settings' && (
            <div style={{ padding: '28px' }}>
              <div className="glass-panel" style={{ padding: '32px', maxWidth: '700px' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#f8fafc', marginBottom: '12px' }}>
                  Platform Settings & Credentials
                </h2>
                <p style={{ fontSize: '0.88rem', color: '#94a3b8', marginBottom: '24px' }}>
                  Configure your LLM provider keys and automated lead qualification criteria.
                </p>
                <button onClick={() => setIsSettingsOpen(true)} className="btn-emerald">
                  Open Config Modal
                </button>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        setSettings={setSettings}
      />
    </div>
  );
};

export default App;
