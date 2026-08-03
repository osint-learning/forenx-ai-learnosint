import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Bot, X, Send, Sparkles, Terminal, HelpCircle } from 'lucide-react';
import { GlowButton } from '../ui/GlowButton';

export const AiMentorDrawer: React.FC = () => {
  const { isAiMentorOpen, setIsAiMentorOpen, aiMessages, sendAiMessage } = useApp();
  const [inputText, setInputText] = useState('');

  if (!isAiMentorOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    sendAiMessage(inputText);
    setInputText('');
  };

  return (
    <div className="fixed bottom-6 right-6 w-full max-w-md bg-[#030303]/95 backdrop-blur-2xl border border-[#00ff99]/40 rounded-2xl shadow-[0_0_50px_rgba(0,255,153,0.3)] z-50 overflow-hidden flex flex-col h-[520px]">
      {/* Header */}
      <div className="p-4 bg-[#052d1d]/80 border-b border-[#00ff99]/30 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-[#00ff99]/20 text-[#00ff99] border border-[#00ff99]/50 shadow-[0_0_15px_rgba(0,255,153,0.4)]">
            <Bot size={20} />
          </div>
          <div>
            <h3 className="font-mono font-bold text-white text-sm">ForenX AI Mentor</h3>
            <p className="text-[10px] font-mono text-[#00ff99] flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00ff99] animate-pulse" />
              Active Intelligence Assistant
            </p>
          </div>
        </div>
        <button
          onClick={() => setIsAiMentorOpen(false)}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
        >
          <X size={18} />
        </button>
      </div>

      {/* Messages Feed */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3 font-mono text-xs">
        {aiMessages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] p-3 rounded-xl ${
                msg.sender === 'user'
                  ? 'bg-[#00ff99]/20 text-[#00ff99] border border-[#00ff99]/40 rounded-br-none'
                  : 'bg-white/5 text-slate-200 border border-white/10 rounded-bl-none'
              }`}
            >
              <div className="flex items-center justify-between gap-2 mb-1 opacity-60 text-[10px]">
                <span>{msg.sender === 'user' ? 'AGENT' : 'AI MENTOR'}</span>
                <span>{msg.timestamp}</span>
              </div>
              <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Prompts */}
      <div className="px-4 py-2 bg-black/40 border-t border-white/5 flex gap-2 overflow-x-auto text-[10px] font-mono">
        <button
          onClick={() => sendAiMessage("Explain WHOIS syntax")}
          className="shrink-0 px-2 py-1 rounded bg-white/5 text-slate-300 hover:text-[#00ff99] border border-white/10 cursor-pointer"
        >
          Explain WHOIS
        </button>
        <button
          onClick={() => sendAiMessage("Give lab hint")}
          className="shrink-0 px-2 py-1 rounded bg-white/5 text-slate-300 hover:text-[#00ff99] border border-white/10 cursor-pointer"
        >
          Lab Hint
        </button>
        <button
          onClick={() => sendAiMessage("How to use Shodan dorks?")}
          className="shrink-0 px-2 py-1 rounded bg-white/5 text-slate-300 hover:text-[#00ff99] border border-white/10 cursor-pointer"
        >
          Shodan Dorks
        </button>
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-3 bg-black/80 border-t border-[#00ff99]/30 flex items-center gap-2">
        <input
          type="text"
          placeholder="Ask AI Mentor..."
          value={inputText}
          onChange={e => setInputText(e.target.value)}
          className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder:text-slate-500 font-mono focus:outline-none focus:border-[#00ff99]"
        />
        <GlowButton type="submit" variant="primary" icon={<Send size={14} />} className="!p-2">
          Send
        </GlowButton>
      </form>
    </div>
  );
};
