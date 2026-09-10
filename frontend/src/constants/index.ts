import type {
  LearningCapsule,
  PracticeLab,
  ThreatMarker,
  ToolCategory
} from '../types';


// ============================================================
// TOOL CATEGORIES
// ============================================================

export const TOOL_CATEGORIES: ToolCategory[] = [
  'Domain Investigation',
  'Email Investigation',
  'Username Investigation',
  'Phone Investigation',
  'Google Dorking',
  'Metadata Analysis',
  'Threat Intelligence',
  'Search Engines'
];


// ============================================================
// LEARNING CAPSULES
// ============================================================

export const INITIAL_CAPSULES: LearningCapsule[] = [

  {
    id: 'cap-1',

    title:
      'Domain Infrastructure Footprinting',

    category:
      'Domain Investigation',

    difficulty:
      'Beginner',

    durationMinutes:
      45,

    completionPercentage:
      100,

    lessonsCount:
      6,

    xpReward:
      350,

    tags: [
      'WHOIS',
      'DNS',
      'Subdomains',
      'Amass'
    ],

    description:
      'Learn how to exhaustively map domain infrastructure, passive DNS records, subdomains, and cloud bucket endpoints.'
  },


  {
    id: 'cap-2',

    title:
      'Advanced Shodan Search Dorking',

    category:
      'Threat Intelligence',

    difficulty:
      'Intermediate',

    durationMinutes:
      60,

    completionPercentage:
      65,

    lessonsCount:
      8,

    xpReward:
      500,

    tags: [
      'Shodan',
      'IoT',
      'Open Ports',
      'ICS'
    ],

    description:
      'Master Shodan operators to locate exposed industrial control panels, vulnerable database clusters, and misconfigured cameras.'
  },


  {
    id: 'cap-3',

    title:
      'Digital Forensic Metadata Analysis',

    category:
      'Metadata Analysis',

    difficulty:
      'Beginner',

    durationMinutes:
      30,

    completionPercentage:
      40,

    lessonsCount:
      5,

    xpReward:
      250,

    tags: [
      'ExifTool',
      'FOCA',
      'Geolocation',
      'Steganography'
    ],

    description:
      'Uncover hidden timestamps, camera serials, author accounts, and exact GPS coordinates embedded in media files.'
  },


  {
    id: 'cap-4',

    title:
      'Visual Graph Threat Mapping',

    category:
      'Threat Intelligence',

    difficulty:
      'Advanced',

    durationMinutes:
      90,

    completionPercentage:
      10,

    lessonsCount:
      12,

    xpReward:
      850,

    tags: [
      'Maltego',
      'Transforms',
      'Link Analysis',
      'Correlation'
    ],

    description:
      'Construct multi-layered threat entity graphs linking compromised infrastructure to adversary personas.'
  }

];


// ============================================================
// PRACTICE LABS
// ============================================================

export const INITIAL_LABS: PracticeLab[] = [

  {
    id:
      'lab-phantom-domain',

    title:
      'Operation Phantom Domain',

    category:
      'Domain Investigation',

    difficulty:
      'Easy',

    xpReward:
      200,

    targetDomainOrIp:
      'phantom-corp-sec.org',

    missionBrief:
      'Intelligence agents report a rogue sub-domain belonging to Phantom Corp hosting unauthenticated API keys. Your mission is to enumerate subdomains and identify the leak.',

    objectives: [

      {
        id:
          'o1',

        task:
          'Query WHOIS records for phantom-corp-sec.org',

        type:
          'command',

        completed:
          false,

        hint:
          'Use WHOIS to investigate the target domain.'
      },


      {
        id:
          'o2',

        task:
          'Discover subdomains using active DNS enumeration',

        type:
          'command',

        completed:
          false,

        hint:
          'Use DNS enumeration to discover additional subdomains.'
      },


      {
        id:
          'o3',

        task:
          'Identify the secret API staging subdomain',

        type:
          'command',

        completed:
          false,

        hint:
          'Analyze the discovered subdomains and identify the staging API host.'
      }

    ],

    evidenceFiles: [

      {
        name:
          'intercepted_headers.txt',

        content:
          'HTTP/1.1 200 OK\nServer: nginx/1.19.2\nX-Internal-Staging: dev-api-v2.phantom-corp-sec.org\nAuthorization: Bearer ph_live_998127391823',

        type:
          'text'
      }

    ],

    hints: [

      'Check the HTTP response headers in the evidence tab.',

      'The WHOIS creation date provides clues about parent registrar.'

    ],

    initialFilesystem: {

      'mission_brief.txt':
        'Target: phantom-corp-sec.org. Priority: High.'

    }

  },


  {
    id:
      'lab-shodan-recon',

    title:
      'Exposed Core Reactor Scan',

    category:
      'Threat Intelligence',

    difficulty:
      'Medium',

    xpReward:
      450,

    targetDomainOrIp:
      '198.51.100.44',

    missionBrief:
      'A SCADA control system telemetry unit has been reported exposed to public routing. Discover open ports and version numbers.',

    objectives: [

      {
        id:
          'o1',

        task:
          'Execute Shodan host lookup on 198.51.100.44',

        type:
          'command',

        completed:
          false,

        hint:
          'Use Shodan to investigate the target host.'
      },


      {
        id:
          'o2',

        task:
          'Port scan the SCADA Modbus service',

        type:
          'command',

        completed:
          false,

        hint:
          'Use a network scanning tool to identify the exposed Modbus service.'
      }

    ],

    evidenceFiles: [

      {
        name:
          'scada_dump.log',

        content:
          'MODBUS/TCP Unit ID: 1\nFunction Code 03: Read Holding Registers\nRegister 40001: 0x41F0 (Core Temp 84.2C)',

        type:
          'log'
      }

    ],

    hints: [

      'Modbus standard port is 502.',

      'Shodan provides host banner information without sending traffic directly.'

    ]

  }

];


// ============================================================
// THREAT MARKERS
// ============================================================

export const INITIAL_THREAT_MARKERS: ThreatMarker[] = [

  {
    id:
      'tm-1',

    lat:
      37.7749,

    lng:
      -122.4194,

    country:
      'USA',

    city:
      'San Francisco',

    threatLevel:
      'High',

    type:
      'Botnet C2 Node',

    ip:
      '192.0.2.14',

    targetSector:
      'Financial Services',

    timestamp:
      '12m ago'
  },


  {
    id:
      'tm-2',

    lat:
      51.5074,

    lng:
      -0.1278,

    country:
      'UK',

    city:
      'London',

    threatLevel:
      'Critical',

    type:
      'Zero-Day Exploit Burst',

    ip:
      '198.51.100.99',

    targetSector:
      'Government Infrastructure',

    timestamp:
      '4m ago'
  },


  {
    id:
      'tm-3',

    lat:
      35.6762,

    lng:
      139.6503,

    country:
      'Japan',

    city:
      'Tokyo',

    threatLevel:
      'Medium',

    type:
      'Credential Spray Probe',

    ip:
      '203.0.113.88',

    targetSector:
      'E-Commerce',

    timestamp:
      '22m ago'
  },


  {
    id:
      'tm-4',

    lat:
      52.5200,

    lng:
      13.4050,

    country:
      'Germany',

    city:
      'Berlin',

    threatLevel:
      'Low',

    type:
      'DNS Amplification Relay',

    ip:
      '198.51.100.12',

    targetSector:
      'Telecom',

    timestamp:
      '1h ago'
  }

];