import React, { createContext, useContext, useEffect, useState } from 'react';
import type { OsintTool, ToolCategory, UserProfile, PracticeLab } from '../types';
import { MOCK_USER_PROFILE, INITIAL_LABS } from '../constants';
import { OsintService } from '../services/api';
interface ChatMessage {
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
}

interface AppContextType {
  tools: OsintTool[];
  selectedTool: OsintTool | null;
  setSelectedTool: (tool: OsintTool | null) => void;
  activeCategory: ToolCategory | 'All';
  setActiveCategory: (cat: ToolCategory | 'All') => void;
  userProfile: UserProfile;
  addXp: (amount: number) => void;
  completedLabIds: string[];
  completeLab: (labId: string, xpReward: number) => void;
  isAiMentorOpen: boolean;
  setIsAiMentorOpen: (open: boolean) => void;
  aiMessages: ChatMessage[];
  sendAiMessage: (userText: string) => void;
  activeLab: PracticeLab | null;
  setActiveLab: (lab: PracticeLab | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tools, setTools] = useState<OsintTool[]>([]);

  const loadTools = async () => {
    try {
      const data = await OsintService.getTools();

      console.log("Loaded tools:", data);
      console.log("First Tool:", data[0]);
      console.log("First Tool ID:", data[0]?.id);

      setTools(data);
    } catch (error) {
      console.error("Failed to load tools:", error);
    }
  };

  useEffect(() => {
    loadTools();
  }, []);
  const [selectedTool, setSelectedTool] = useState<OsintTool | null>(null);
  const [activeCategory, setActiveCategory] = useState<ToolCategory | 'All'>('All');
  const [userProfile, setUserProfile] = useState<UserProfile>(MOCK_USER_PROFILE);
  const [completedLabIds, setCompletedLabIds] = useState<string[]>(['lab-phantom-domain']);
  const [isAiMentorOpen, setIsAiMentorOpen] = useState<boolean>(false);
  const [activeLab, setActiveLab] = useState<PracticeLab | null>(INITIAL_LABS[0]);
  const [aiMessages, setAiMessages] = useState<ChatMessage[]>([
    {
      sender: 'ai',
      text: 'Greetings Agent. I am your ForenX Intelligence AI Mentor. Ask me anything about OSINT tool syntax, domain mapping, or lab objectives.',
      timestamp: 'Just now'
    }
  ]);
  const addXp = (amount: number) => {
    setUserProfile(prev => {
      const newXp = prev.currentXp + amount;
      let newLevel = prev.level;
      let newNextXp = prev.nextLevelXp;
      if (newXp >= prev.nextLevelXp) {
        newLevel += 1;
        newNextXp += 5000;
      }
      return {
        ...prev,
        currentXp: newXp,
        level: newLevel,
        nextLevelXp: newNextXp
      };
    });
  };

  const completeLab = (labId: string, xpReward: number) => {
    if (!completedLabIds.includes(labId)) {
      setCompletedLabIds(prev => [...prev, labId]);
      addXp(xpReward);
    }
  };

  const sendAiMessage = (userText: string) => {
    if (!userText.trim()) return;

    const userMsg: ChatMessage = {
      sender: 'user',
      text: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setAiMessages(prev => [...prev, userMsg]);

    setTimeout(() => {
      let aiReply = "I have analyzed your query. To gather intelligence on this target, execute passive DNS enumeration first via OWASP Amass or query Shodan's API for host banners.";
      const lower = userText.toLowerCase();

      if (lower.includes('whois')) {
        aiReply = "WHOIS queries reveal domain registrar details, creation timestamps, and name servers. Note that GDPR redacts personal registrant info.";
      } else if (lower.includes('shodan')) {
        aiReply = "Shodan indexes raw banner outputs. Use filters like `port:443 org:'Company Name'` or `asn:AS15169` to narrow search results.";
      } else if (lower.includes('lab') || lower.includes('hint') || lower.includes('phantom')) {
        aiReply = "For Operation Phantom Domain, try inspecting the HTTP response headers in the Evidence tab. The secret staging subdomain is listed under `X-Internal-Staging`.";
      } else if (lower.includes('exif') || lower.includes('metadata')) {
        aiReply = "Use ExifTool to parse embedded metadata tags: `exiftool -gpslatitude -gpslongitude filename.jpg` extracts exact location coordinates.";
      }

      const aiMsg: ChatMessage = {
        sender: 'ai',
        text: aiReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setAiMessages(prev => [...prev, aiMsg]);
    }, 800);
  };

  return (
    <AppContext.Provider
      value={{
        tools,
        selectedTool,
        setSelectedTool,
        activeCategory,
        setActiveCategory,
        userProfile,
        addXp,
        completedLabIds,
        completeLab,
        isAiMentorOpen,
        setIsAiMentorOpen,
        aiMessages,
        sendAiMessage,
        activeLab,
        setActiveLab
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
