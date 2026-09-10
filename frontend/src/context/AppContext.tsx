import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';

import type {
  OsintTool,
  ToolCategory,
  UserProfile,
  PracticeLab,
} from '../types';

import { INITIAL_LABS } from '../constants';
import { OsintService } from '../services/api';


// ============================================================
// CHAT MESSAGE
// ============================================================

interface ChatMessage {
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
}


// ============================================================
// APP CONTEXT TYPE
// ============================================================

interface AppContextType {
  tools: OsintTool[];

  selectedTool: OsintTool | null;
  setSelectedTool: (tool: OsintTool | null) => void;

  activeCategory: ToolCategory | 'All';
  setActiveCategory: (cat: ToolCategory | 'All') => void;

  userProfile: UserProfile;

  addXp: (amount: number) => void;

  completedLabIds: string[];

  completeLab: (
    labId: string,
    xpReward: number
  ) => void;

  isAiMentorOpen: boolean;
  setIsAiMentorOpen: (open: boolean) => void;

  aiMessages: ChatMessage[];

  sendAiMessage: (
    userText: string
  ) => void;

  activeLab: PracticeLab | null;

  setActiveLab: (
    lab: PracticeLab | null
  ) => void;
}


// ============================================================
// CONTEXT
// ============================================================

const AppContext =
  createContext<AppContextType | undefined>(
    undefined
  );


// ============================================================
// APP PROVIDER
// ============================================================

export const AppProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {

  // ==========================================================
  // TOOLS
  // ==========================================================

  const [tools, setTools] =
    useState<OsintTool[]>([]);


  // ==========================================================
  // USER PROFILE
  // ==========================================================

  const [userProfile, setUserProfile] =
    useState<UserProfile>({
      username: '',
      email: '',
      role: 'student',
      level: 1,
      currentXp: 0,
      completedLabsCount: 0,
      completedLessonsCount: 0,
      badges: [],
      createdAt: '',
    });


  // ==========================================================
  // OTHER APP STATE
  // ==========================================================

  const [selectedTool, setSelectedTool] =
    useState<OsintTool | null>(null);

  const [activeCategory, setActiveCategory] =
    useState<ToolCategory | 'All'>('All');

  const [completedLabIds, setCompletedLabIds] =
    useState<string[]>([]);

  const [isAiMentorOpen, setIsAiMentorOpen] =
    useState<boolean>(false);

  const [activeLab, setActiveLab] =
    useState<PracticeLab | null>(
      INITIAL_LABS[0] ?? null
    );

  const [aiMessages, setAiMessages] =
    useState<ChatMessage[]>([
      {
        sender: 'ai',

        text:
          'Greetings Agent. I am your ForenX Intelligence AI Mentor. Ask me anything about OSINT tool syntax, domain mapping, or lab objectives.',

        timestamp: 'Just now',
      },
    ]);


  // ==========================================================
  // LOAD TOOLS FROM BACKEND
  // ==========================================================

  const loadTools = async () => {

    try {

      const data =
        await OsintService.getTools();

      console.log(
        'Loaded tools:',
        data
      );

      console.log(
        'Total tools:',
        data.length
      );

      console.log(
        'First Tool:',
        data[0]
      );

      console.log(
        'First Tool ID:',
        data[0]?.id
      );

      setTools(data);

    } catch (error) {

      console.error(
        'Failed to load tools:',
        error
      );

    }
  };


  // ==========================================================
  // LOAD REAL LOGGED-IN USER PROFILE
  // ==========================================================

  const loadMyProfile = async () => {

    const token =
      sessionStorage.getItem('token') ||
      localStorage.getItem('token');


    // --------------------------------------------------------
    // No token
    // --------------------------------------------------------

    if (!token) {

      console.log(
        'No login token found. User profile cannot be loaded.'
      );

      return;
    }


    // --------------------------------------------------------
    // Get profile from backend
    // --------------------------------------------------------

    try {

      const response =
        await OsintService.getMyProfile();

      console.log(
        'REAL USER PROFILE:',
        response
      );


      if (
        response?.success &&
        response?.data
      ) {

        const user =
          response.data;


        // ----------------------------------------------------
        // Convert MongoDB User -> Frontend UserProfile
        // ----------------------------------------------------

        const realProfile: UserProfile = {

          username:
            user.fullName || '',

          email:
            user.email || '',

          role:
            user.role || 'student',

          level:
            user.level ?? 1,

          currentXp:
            user.xp ?? 0,

          completedLabsCount:
            Array.isArray(user.completedLabs)
              ? user.completedLabs.length
              : 0,

          completedLessonsCount:
            Array.isArray(user.completedLessons)
              ? user.completedLessons.length
              : 0,

          badges:
            Array.isArray(user.badges)
              ? user.badges
              : [],

          createdAt:
            user.createdAt || '',
        };


        // ----------------------------------------------------
        // Update React state
        // ----------------------------------------------------

        setUserProfile(
          realProfile
        );


        // ----------------------------------------------------
        // Synchronize completed labs
        // ----------------------------------------------------

        if (
          Array.isArray(
            user.completedLabs
          )
        ) {

          const labIds =
            user.completedLabs
              .map(
                (lab: any) =>
                  typeof lab === 'string'
                    ? lab
                    : lab?._id
              )
              .filter(Boolean);

          setCompletedLabIds(
            labIds
          );
        }


        console.log(
          'Mapped REAL USER PROFILE:',
          realProfile
        );
      }

    } catch (error) {

      console.error(
        'Failed to load user profile:',
        error
      );

    }
  };


  // ==========================================================
  // INITIAL DATA LOAD
  // ==========================================================

  useEffect(() => {

    loadTools();

    loadMyProfile();

  }, []);


  // ==========================================================
  // XP SYSTEM
  // ==========================================================

  const addXp = (
    amount: number
  ) => {

    setUserProfile(
      prev => {

        const newXp =
          prev.currentXp + amount;


        /*
         * Level calculation
         *
         * Level 1 -> 5000 XP
         * Level 2 -> 10000 XP
         * Level 3 -> 15000 XP
         *
         * This is currently frontend state.
         * Backend persistence can be connected later.
         */

        const newLevel =
          Math.max(
            1,
            Math.floor(
              newXp / 5000
            ) + 1
          );


        return {

          ...prev,

          currentXp:
            newXp,

          level:
            newLevel,
        };
      }
    );
  };


  // ==========================================================
  // COMPLETE LAB
  // ==========================================================

  const completeLab = (
    labId: string,
    xpReward: number
  ) => {

    if (
      completedLabIds.includes(
        labId
      )
    ) {
      return;
    }


    setCompletedLabIds(
      prev => [
        ...prev,
        labId,
      ]
    );


    setUserProfile(
      prev => ({

        ...prev,

        completedLabsCount:
          prev.completedLabsCount + 1,

      })
    );


    addXp(
      xpReward
    );
  };


  // ==========================================================
  // AI MENTOR
  // ==========================================================

  const sendAiMessage = (
    userText: string
  ) => {

    if (
      !userText.trim()
    ) {
      return;
    }


    // --------------------------------------------------------
    // User message
    // --------------------------------------------------------

    const userMsg: ChatMessage = {

      sender:
        'user',

      text:
        userText,

      timestamp:
        new Date().toLocaleTimeString(
          [],
          {
            hour:
              '2-digit',

            minute:
              '2-digit',
          }
        ),
    };


    setAiMessages(
      prev => [
        ...prev,
        userMsg,
      ]
    );


    // --------------------------------------------------------
    // AI response
    // --------------------------------------------------------

    setTimeout(
      () => {

        let aiReply =
          'I have analyzed your query. To gather intelligence on this target, execute passive DNS enumeration first using an appropriate OSINT tool or query Shodan for host information.';


        const lower =
          userText.toLowerCase();


        // WHOIS
        if (
          lower.includes(
            'whois'
          )
        ) {

          aiReply =
            'WHOIS queries reveal domain registration information such as registrar details, creation dates, expiration dates, and name servers. Modern WHOIS services may redact personal registrant information.';

        }


        // SHODAN
        else if (
          lower.includes(
            'shodan'
          )
        ) {

          aiReply =
            "Shodan indexes information about Internet-connected systems. Useful filters include `port:443`, `org:'Company Name'`, `asn:AS15169`, and `country:IN`.";

        }


        // LAB / HINT
        else if (
          lower.includes('lab') ||
          lower.includes('hint') ||
          lower.includes('phantom')
        ) {

          aiReply =
            'For Operation Phantom Domain, inspect the available evidence and HTTP response headers. Correlate discovered subdomains with the target domain and identify the staging infrastructure.';

        }


        // EXIF / METADATA
        else if (
          lower.includes('exif') ||
          lower.includes('metadata')
        ) {

          aiReply =
            'Use ExifTool to inspect embedded metadata. For example, `exiftool filename.jpg` can reveal available camera, timestamp, author, and GPS metadata.';

        }


        // DNS
        else if (
          lower.includes('dns') ||
          lower.includes('subdomain')
        ) {

          aiReply =
            'Start with passive DNS and subdomain enumeration. Tools such as DNS Lookup, Subfinder, Amass, and theHarvester can help identify related infrastructure.';

        }


        // DEFAULT
        else {

          aiReply =
            'For a structured OSINT investigation, begin with passive collection, identify the target infrastructure, correlate findings across multiple sources, validate important evidence, and document the investigation path.';
        }


        const aiMsg: ChatMessage = {

          sender:
            'ai',

          text:
            aiReply,

          timestamp:
            new Date().toLocaleTimeString(
              [],
              {
                hour:
                  '2-digit',

                minute:
                  '2-digit',
              }
            ),
        };


        setAiMessages(
          prev => [
            ...prev,
            aiMsg,
          ]
        );

      },

      800
    );
  };


  // ==========================================================
  // PROVIDER
  // ==========================================================

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

        setActiveLab,

      }}
    >

      {children}

    </AppContext.Provider>
  );
};


// ============================================================
// useApp HOOK
// ============================================================

export const useApp = () => {

  const context =
    useContext(
      AppContext
    );


  if (!context) {

    throw new Error(
      'useApp must be used within an AppProvider'
    );
  }


  return context;
};