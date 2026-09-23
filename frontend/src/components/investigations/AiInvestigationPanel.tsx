import React, { useState, useEffect } from 'react';
import { GlassCard } from '../ui/GlassCard';
import { GlowButton } from '../ui/GlowButton';
import { Badge } from '../ui/Badge';
import {
  Sparkles,
  Wrench,
  HelpCircle,
  MessageSquare,
  Lightbulb,
  Compass,
  Loader2,
  Copy,
  Check,
  Send,
  ArrowRight,
  ShieldAlert,
  Globe,
  Lock,
  FileCode,
  Layers,
  Tag
} from 'lucide-react';
import { OsintService } from '../../services/api';
import type {
  InvestigationRecord,
  InvestigationToolRecommendation,
  InvestigationOutputAnalysis,
  InvestigationAiHint,
  InvestigationNextStep,
  InvestigationAiMessage
} from '../../types';

interface AiInvestigationPanelProps {
  investigation: InvestigationRecord;
  onActionLogged?: (actionType: string, description: string, target?: string) => void;
}

export const AiInvestigationPanel: React.FC<AiInvestigationPanelProps> = ({
  investigation,
  onActionLogged
}) => {
  const [activeTab, setActiveTab] = useState<'tools' | 'analysis' | 'mentor' | 'hints' | 'nextStep'>('tools');

  // Tool recommendations state
  const [tools, setTools] = useState<InvestigationToolRecommendation[]>([]);
  const [loadingTools, setLoadingTools] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  // Output analysis state
  const [selectedSection, setSelectedSection] = useState('dns');
  const customQuery = '';
  const [analysis, setAnalysis] = useState<InvestigationOutputAnalysis | null>(null);
  const [loadingAnalysis, setLoadingAnalysis] = useState(false);

  // Mentor chat state
  const [chatHistory, setChatHistory] = useState<InvestigationAiMessage[]>(investigation.aiChatHistory || []);
  const [chatInput, setChatInput] = useState('');
  const [sendingChat, setSendingChat] = useState(false);

  // Hints state
  const [unlockedHints, setUnlockedHints] = useState<InvestigationAiHint[]>(investigation.unlockedHints || []);
  const [loadingHintLevel, setLoadingHintLevel] = useState<number | null>(null);

  // Next-step state
  const [nextStep, setNextStep] = useState<InvestigationNextStep | null>(null);
  const [loadingNextStep, setLoadingNextStep] = useState(false);

  // Sync state when investigation changes
  useEffect(() => {
    setChatHistory(investigation.aiChatHistory || []);
    setUnlockedHints(investigation.unlockedHints || []);
    setTools([]);
    setAnalysis(null);
    setNextStep(null);
  }, [investigation._id]);

  // Load Tool Recommendations
  const fetchToolRecommendations = async () => {
    try {
      setLoadingTools(true);
      const data = await OsintService.getInvestigationToolRecommendations(investigation._id);
      setTools(data || []);
      onActionLogged?.('Tool Recommendation', 'Requested AI tool suggestions for target ' + investigation.target, investigation.target);
    } catch (err) {
      console.error('Failed to load tool recommendations:', err);
    } finally {
      setLoadingTools(false);
    }
  };

  // Load Output Analysis
  const handleRunAnalysis = async (section: string) => {
    try {
      setSelectedSection(section);
      setLoadingAnalysis(true);
      const data = await OsintService.analyzeInvestigationReconSection(investigation._id, section, customQuery);
      setAnalysis(data);
      onActionLogged?.('Output Analysis', 'Analyzed ' + section + ' recon output for ' + investigation.target, section);
    } catch (err) {
      console.error('Failed to run output analysis:', err);
    } finally {
      setLoadingAnalysis(false);
    }
  };

  // Send Mentor Chat
  const handleSendMentorChat = async (e?: React.FormEvent, preset?: string) => {
    if (e) e.preventDefault();
    const msgToSend = preset || chatInput;
    if (!msgToSend.trim()) return;

    const userMsg: InvestigationAiMessage = {
      role: 'user',
      message: msgToSend.trim(),
      timestamp: new Date().toISOString()
    };

    setChatHistory(prev => [...prev, userMsg]);
    if (!preset) setChatInput('');

    try {
      setSendingChat(true);
      const res = await OsintService.askInvestigationMentor(investigation._id, msgToSend);
      if (res && res.chatHistory) {
        setChatHistory(res.chatHistory);
      } else if (res && res.reply) {
        setChatHistory(prev => [...prev, {
          role: 'assistant',
          message: res.reply,
          timestamp: new Date().toISOString()
        }]);
      }
      onActionLogged?.('Mentor Consultation', 'Asked AI mentor: ' + msgToSend.slice(0, 40) + '...', investigation.target);
    } catch (err) {
      console.error('Failed to chat with mentor:', err);
    } finally {
      setSendingChat(false);
    }
  };

  // Unlock Progressive Hint
  const handleUnlockHint = async (level: number) => {
    try {
      setLoadingHintLevel(level);
      const res = await OsintService.getInvestigationHint(investigation._id, level);
      if (res && res.unlockedHints) {
        setUnlockedHints(res.unlockedHints);
      } else if (res && res.hint) {
        setUnlockedHints(prev => [...prev.filter(h => h.level !== level), res.hint]);
      }
      onActionLogged?.('Hint Unlocked', 'Unlocked Level ' + level + ' investigation hint', investigation.target);
    } catch (err) {
      console.error('Failed to unlock hint:', err);
    } finally {
      setLoadingHintLevel(null);
    }
  };

  // Fetch Next Step
  const fetchNextStep = async () => {
    try {
      setLoadingNextStep(true);
      const data = await OsintService.getInvestigationNextStep(investigation._id);
      setNextStep(data);
      onActionLogged?.('Next Step Inquiry', 'Requested recommended next investigation step', investigation.target);
    } catch (err) {
      console.error('Failed to fetch next step:', err);
    } finally {
      setLoadingNextStep(false);
    }
  };

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <GlassCard glow="cyan" className="p-6 border border-[#00ff99]/30 relative overflow-hidden">
      {/* Header with Navigation Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4 mb-6">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#00ff99]/10 border border-[#00ff99]/40 flex items-center justify-center text-[#00ff99] shadow-[0_0_10px_rgba(0,255,153,0.2)]">
            <Sparkles size={18} />
          </div>
          <div>
            <h2 className="text-base font-bold font-mono text-white flex items-center gap-2">
              AI INVESTIGATION ASSISTANT
              <Badge variant="emerald" className="text-[10px]">PHASE 5</Badge>
            </h2>
            <p className="text-xs text-slate-400 font-mono">
              Grounded in active reconnaissance on <span className="text-[#00ff99] font-semibold">{investigation.target}</span>
            </p>
          </div>
        </div>

        {/* Tab Buttons */}
        <div className="flex flex-wrap gap-1.5 p-1 bg-black/60 rounded-lg border border-white/10 text-xs font-mono">
          <button
            onClick={() => { setActiveTab('tools'); if (tools.length === 0) fetchToolRecommendations(); }}
            className={`px-3 py-1.5 rounded-md flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'tools'
                ? 'bg-[#00ff99]/20 text-[#00ff99] font-bold border border-[#00ff99]/40 shadow-[0_0_8px_rgba(0,255,153,0.15)]'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Wrench size={13} /> Tool Selection
          </button>

          <button
            onClick={() => { setActiveTab('analysis'); if (!analysis) handleRunAnalysis('dns'); }}
            className={`px-3 py-1.5 rounded-md flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'analysis'
                ? 'bg-[#00ff99]/20 text-[#00ff99] font-bold border border-[#00ff99]/40 shadow-[0_0_8px_rgba(0,255,153,0.15)]'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <HelpCircle size={13} /> Output Analysis
          </button>

          <button
            onClick={() => setActiveTab('mentor')}
            className={`px-3 py-1.5 rounded-md flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'mentor'
                ? 'bg-[#00ff99]/20 text-[#00ff99] font-bold border border-[#00ff99]/40 shadow-[0_0_8px_rgba(0,255,153,0.15)]'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <MessageSquare size={13} /> AI Mentor
          </button>

          <button
            onClick={() => setActiveTab('hints')}
            className={`px-3 py-1.5 rounded-md flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'hints'
                ? 'bg-[#00ff99]/20 text-[#00ff99] font-bold border border-[#00ff99]/40 shadow-[0_0_8px_rgba(0,255,153,0.15)]'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Lightbulb size={13} /> Hints ({unlockedHints.length}/3)
          </button>

          <button
            onClick={() => { setActiveTab('nextStep'); if (!nextStep) fetchNextStep(); }}
            className={`px-3 py-1.5 rounded-md flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'nextStep'
                ? 'bg-[#00ff99]/20 text-[#00ff99] font-bold border border-[#00ff99]/40 shadow-[0_0_8px_rgba(0,255,153,0.15)]'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Compass size={13} /> Next Step
          </button>
        </div>
      </div>

      {/* TAB 1: TOOL SELECTION */}
      {activeTab === 'tools' && (
        <div className="space-y-4 font-mono">
          <div className="flex items-center justify-between">
            <p className="text-xs text-slate-300">
              Suggested OSINT CLI tools mapped to the active findings on <span className="text-[#00ff99]">{investigation.target}</span>:
            </p>
            <GlowButton variant="secondary" onClick={fetchToolRecommendations} className="!py-1 text-xs" icon={<Wrench size={13} />}>
              Refresh Tools
            </GlowButton>
          </div>

          {loadingTools ? (
            <div className="p-8 text-center space-y-2">
              <Loader2 size={24} className="animate-spin text-[#00ff99] mx-auto" />
              <p className="text-xs text-[#00ff99]">Analyzing recon data for tool recommendations...</p>
            </div>
          ) : tools.length === 0 ? (
            <div className="p-6 bg-black/40 border border-white/10 rounded-xl text-center space-y-3">
              <p className="text-xs text-slate-400">Click below to generate tool recommendations based on actual Recon data.</p>
              <GlowButton variant="primary" onClick={fetchToolRecommendations} icon={<Wrench size={14} />}>
                Generate Tool Recommendations
              </GlowButton>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {tools.map((item, idx) => (
                <div key={idx} className="bg-black/50 border border-white/10 hover:border-[#00ff99]/40 rounded-xl p-4 space-y-2.5 transition-all">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-white uppercase">{item.toolName}</span>
                      <Badge variant="cyan" className="text-[10px]">{item.category}</Badge>
                    </div>
                    <Badge variant={item.priority === 'High' ? 'emerald' : 'purple'} className="text-[9px]">
                      {item.priority} Priority
                    </Badge>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">{item.rationale}</p>

                  <div className="bg-black/80 border border-white/10 rounded-lg p-2 flex items-center justify-between gap-2 text-xs">
                    <code className="text-[#00ff99] truncate">{item.command}</code>
                    <button
                      onClick={() => handleCopy(item.command, idx)}
                      className="text-slate-400 hover:text-white p-1 rounded hover:bg-white/10 cursor-pointer shrink-0"
                      title="Copy Command"
                    >
                      {copiedIndex === idx ? <Check size={14} className="text-[#00ff99]" /> : <Copy size={14} />}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: OUTPUT ANALYSIS */}
      {activeTab === 'analysis' && (
        <div className="space-y-4 font-mono">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-slate-400">Select Recon Section to Analyze:</span>
            {[
              { key: 'dns', label: 'DNS & Infrastructure', icon: Globe },
              { key: 'ssl', label: 'SSL/TLS Certificate', icon: Lock },
              { key: 'headers', label: 'Security Headers', icon: ShieldAlert },
              { key: 'tech', label: 'Technology Stack', icon: Layers },
              { key: 'robots', label: 'robots.txt Crawl Rules', icon: FileCode },
              { key: 'metadata', label: 'Web Page Metadata', icon: Tag },
            ].map(sec => {
              const Icon = sec.icon;
              const isSel = selectedSection === sec.key;
              return (
                <button
                  key={sec.key}
                  onClick={() => handleRunAnalysis(sec.key)}
                  className={`px-2.5 py-1.5 rounded-lg border text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
                    isSel
                      ? 'bg-[#00ff99]/20 border-[#00ff99] text-[#00ff99] font-bold'
                      : 'bg-black/50 border-white/10 text-slate-400 hover:text-white hover:border-white/30'
                  }`}
                >
                  <Icon size={13} />
                  {sec.label}
                </button>
              );
            })}
          </div>

          {loadingAnalysis ? (
            <div className="p-8 text-center space-y-2">
              <Loader2 size={24} className="animate-spin text-[#00ff99] mx-auto" />
              <p className="text-xs text-[#00ff99]">Analyzing {selectedSection} reconnaissance data...</p>
            </div>
          ) : analysis ? (
            <div className="bg-black/60 border border-[#00ff99]/30 rounded-xl p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Sparkles size={16} className="text-[#00ff99]" /> {analysis.title}
                </h3>
                <Badge variant="emerald" className="text-[10px] uppercase">{analysis.section}</Badge>
              </div>

              <p className="text-xs text-slate-200 leading-relaxed italic bg-white/5 p-3 rounded-lg border border-white/5">
                "{analysis.summary}"
              </p>

              <div className="space-y-2">
                <span className="text-xs text-[#00ff99] font-bold uppercase tracking-wider">Key Technical Findings:</span>
                <ul className="space-y-1 text-xs text-slate-300 list-disc list-inside">
                  {analysis.technicalDetails.map((det, i) => (
                    <li key={i} className="leading-relaxed">{det}</li>
                  ))}
                </ul>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 border-t border-white/10 text-xs">
                <div className="bg-cyan-950/20 border border-cyan-500/30 rounded-lg p-3 space-y-1">
                  <span className="text-cyan-400 font-bold uppercase flex items-center gap-1">
                    <ShieldAlert size={12} /> Security Implication:
                  </span>
                  <p className="text-slate-300 leading-relaxed">{analysis.securityImplication}</p>
                </div>

                <div className="bg-[#00ff99]/10 border border-[#00ff99]/30 rounded-lg p-3 space-y-1">
                  <span className="text-[#00ff99] font-bold uppercase flex items-center gap-1">
                    <ArrowRight size={12} /> Recommended Action:
                  </span>
                  <p className="text-slate-200 leading-relaxed">{analysis.recommendedAction}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-6 bg-black/40 border border-white/10 rounded-xl text-center space-y-2">
              <p className="text-xs text-slate-400">Select a section above to generate educational output analysis.</p>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: AI INVESTIGATION MENTOR */}
      {activeTab === 'mentor' && (
        <div className="space-y-4 font-mono">
          {/* Preset Prompts */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="text-slate-400">Ask Mentor:</span>
            {[
              "What does the DNS routing tell us about origin security?",
              "Are there any dangerous disallowed paths in robots.txt?",
              "What risks do the missing security headers pose?",
              "How should I correlate the web stack with known vulnerabilities?"
            ].map((preset, pIdx) => (
              <button
                key={pIdx}
                onClick={() => handleSendMentorChat(undefined, preset)}
                className="bg-black/50 hover:bg-[#00ff99]/10 border border-white/10 hover:border-[#00ff99]/40 text-slate-300 hover:text-white px-2.5 py-1 rounded-md text-[11px] transition-all cursor-pointer"
              >
                {preset}
              </button>
            ))}
          </div>

          {/* Chat Feed */}
          <div className="bg-black/70 border border-white/10 rounded-xl p-4 min-h-[220px] max-h-[350px] overflow-y-auto space-y-3">
            {chatHistory.length === 0 ? (
              <div className="text-center py-8 space-y-2">
                <MessageSquare size={28} className="text-slate-500 mx-auto" />
                <p className="text-xs text-slate-400">Ask any investigative question about <strong className="text-white">{investigation.target}</strong>.</p>
              </div>
            ) : (
              chatHistory.map((msg, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-lg text-xs leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-cyan-950/40 border border-cyan-500/30 text-cyan-200 ml-8'
                      : 'bg-[#00ff99]/10 border border-[#00ff99]/30 text-slate-200 mr-8'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1 text-[10px] text-slate-400 uppercase font-bold">
                    <span>{msg.role === 'user' ? 'Student' : 'ForenX AI Mentor'}</span>
                    {msg.timestamp && <span>{new Date(msg.timestamp).toLocaleTimeString()}</span>}
                  </div>
                  <div className="whitespace-pre-wrap">{msg.message}</div>
                </div>
              ))
            )}
            {sendingChat && (
              <div className="bg-[#00ff99]/10 border border-[#00ff99]/30 p-3 rounded-lg text-xs text-[#00ff99] flex items-center gap-2 mr-8 animate-pulse">
                <Loader2 size={13} className="animate-spin" />
                <span>Mentor is reviewing reconnaissance data...</span>
              </div>
            )}
          </div>

          {/* Input Form */}
          <form onSubmit={e => handleSendMentorChat(e)} className="flex gap-2">
            <input
              type="text"
              placeholder="Ask mentor about DNS, headers, technologies, or evidence correlation..."
              value={chatInput}
              onChange={e => setChatInput(e.target.value)}
              className="flex-1 bg-black/80 border border-white/20 focus:border-[#00ff99] rounded-lg px-3.5 py-2 text-xs text-white placeholder-slate-500 font-mono focus:outline-none"
            />
            <GlowButton type="submit" variant="primary" disabled={sendingChat || !chatInput.trim()} icon={<Send size={14} />}>
              Send
            </GlowButton>
          </form>
        </div>
      )}

      {/* TAB 4: PROGRESSIVE HINTS */}
      {activeTab === 'hints' && (
        <div className="space-y-4 font-mono">
          <p className="text-xs text-slate-300">
            Progressive hints guide your investigation without spoiling the final conclusion:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {[1, 2, 3].map(lvl => {
              const unlocked = unlockedHints.find(h => h.level === lvl);
              const isLoading = loadingHintLevel === lvl;

              return (
                <div
                  key={lvl}
                  className={`rounded-xl p-4 border transition-all ${
                    unlocked
                      ? 'bg-[#00ff99]/10 border-[#00ff99]/50 shadow-[0_0_12px_rgba(0,255,153,0.1)]'
                      : 'bg-black/50 border-white/10'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-white uppercase">
                      Level {lvl} {lvl === 1 ? '• Direction' : lvl === 2 ? '• Focus' : '• Correlation'}
                    </span>
                    <Badge variant={unlocked ? 'emerald' : 'purple'} className="text-[9px]">
                      {unlocked ? 'UNLOCKED' : 'LOCKED'}
                    </Badge>
                  </div>

                  {unlocked ? (
                    <div className="space-y-2 text-xs">
                      <p className="text-slate-200 leading-relaxed font-semibold">{unlocked.hint}</p>
                      {unlocked.guidance && (
                        <p className="text-slate-400 text-[11px] leading-relaxed border-t border-white/10 pt-1.5">
                          💡 <strong className="text-slate-300">Guidance:</strong> {unlocked.guidance}
                        </p>
                      )}
                      {unlocked.nextStep && (
                        <p className="text-[#00ff99] text-[11px] leading-relaxed pt-1">
                          👉 <strong className="text-[#00ff99]">Next:</strong> {unlocked.nextStep}
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-3 text-center py-4">
                      <p className="text-[11px] text-slate-400">
                        {lvl === 1 ? 'General direction to examine.' : lvl === 2 ? 'Specific finding to inspect.' : 'Advanced correlation strategy.'}
                      </p>
                      <GlowButton
                        variant="secondary"
                        onClick={() => handleUnlockHint(lvl)}
                        disabled={isLoading}
                        className="!py-1 text-xs mx-auto"
                        icon={isLoading ? <Loader2 size={12} className="animate-spin" /> : <Lightbulb size={12} />}
                      >
                        {isLoading ? 'Unlocking...' : 'Unlock Level ' + lvl}
                      </GlowButton>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 5: NEXT STEP */}
      {activeTab === 'nextStep' && (
        <div className="space-y-4 font-mono">
          {loadingNextStep ? (
            <div className="p-8 text-center space-y-2">
              <Loader2 size={24} className="animate-spin text-[#00ff99] mx-auto" />
              <p className="text-xs text-[#00ff99]">Computing optimal next investigative step...</p>
            </div>
          ) : nextStep ? (
            <div className="bg-black/60 border border-[#00ff99]/40 rounded-xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Compass size={18} className="text-[#00ff99]" />
                  <h3 className="text-sm font-bold text-white uppercase">{nextStep.stepTitle}</h3>
                </div>
                <Badge variant={nextStep.priority === 'High' ? 'emerald' : 'cyan'}>
                  {nextStep.priority} Priority
                </Badge>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed bg-white/5 p-3 rounded-lg border border-white/5">
                {nextStep.rationale}
              </p>

              <div className="bg-[#00ff99]/10 border border-[#00ff99]/30 rounded-lg p-3 text-xs flex items-start gap-2">
                <ArrowRight size={14} className="text-[#00ff99] shrink-0 mt-0.5" />
                <div>
                  <span className="text-[#00ff99] font-bold block mb-0.5">Suggested Action:</span>
                  <span className="text-slate-200">{nextStep.suggestedAction}</span>
                </div>
              </div>

              <div className="text-[11px] text-slate-400 pt-1 flex items-center justify-between border-t border-white/10">
                <span>Investigation Progress:</span>
                <span className="text-[#00ff99] font-bold">{nextStep.progress}</span>
              </div>
            </div>
          ) : (
            <div className="p-6 bg-black/40 border border-white/10 rounded-xl text-center space-y-3">
              <p className="text-xs text-slate-400">Click below to assess completed objectives and get the next recommended investigation action.</p>
              <GlowButton variant="primary" onClick={fetchNextStep} icon={<Compass size={14} />}>
                Get Next Action Recommendation
              </GlowButton>
            </div>
          )}
        </div>
      )}
    </GlassCard>
  );
};
