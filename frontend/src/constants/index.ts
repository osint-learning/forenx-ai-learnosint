import type { OsintTool, LearningCapsule, PracticeLab, ThreatMarker, UserProfile, ToolCategory } from '../types';

export const TOOL_CATEGORIES: ToolCategory[] = [
  'Domain Investigation',
  'Email Investigation',
  'Metadata',
  'Social Media',
  'Network Intelligence',
  'Threat Intelligence',
  'Dark Web',
  'Digital Forensics'
];
// TODO: Remove after backend integration is complete.
/*
export const INITIAL_TOOLS: OsintTool[] = [
  {
    id: 'whois',
    name: 'WHOIS',
    category: 'Domain Investigation',
    tagline: 'Domain Registration & Ownership Query',
    description: 'Protocol and utility for querying databases that store registered users or assignees of an Internet resource such as a domain name, IP address block, or autonomous system.',
    installation: 'apt-get install whois # Debian/Ubuntu\nbrew install whois    # macOS',
    commands: [
      {
        command: 'whois target-domain.com',
        description: 'Query registrar details, creation/expiration dates, and name servers.',
        expectedOutput: 'Domain Name: TARGET-DOMAIN.COM\nRegistrar: SafeNames Ltd\nCreation Date: 2018-03-15T11:00:00Z\nName Server: NS1.CYBERSEC.IO'
      },
      {
        command: 'whois -h whois.radb.net 192.0.2.1',
        description: 'Query IP routing registry details.',
        expectedOutput: 'route: 192.0.2.0/24\ndescr: Cybersec Autonomous System\norigin: AS65534'
      }
    ],
    examples: ['whois google.com', 'whois 8.8.8.8'],
    lessons: [
      'Understanding Registrar Privacy and WHOIS Redaction',
      'Historical WHOIS analysis to track past owners',
      'Identifying Autonomous System Numbers (ASN)'
    ],
    quiz: [
      {
        id: 'q1',
        question: 'What does GDPR redaction hide in modern WHOIS queries?',
        options: ['Domain expiration date', 'Registrant PII (Name, Email, Address)', 'Name servers', 'Registrar name'],
        correctAnswerIndex: 1,
        explanation: 'GDPR and ICANN privacy policies mandate redacting personally identifiable information (PII) of domain registrants.'
      }
    ],
    relatedTools: ['amass', 'subfinder', 'theharvester'],
    icon: 'Globe',
    orbitalRingIndex: 0,
    complexity: 'Beginner',
    status: 'Active',
    popularity: 98
  },
  {
    id: 'shodan',
    name: 'Shodan',
    category: 'Threat Intelligence',
    tagline: 'Search Engine for Internet-Connected Devices',
    description: 'The world\'s first search engine for Internet-connected devices. Discover open ports, industrial control systems, webcams, servers, and IoT vulnerabilities.',
    installation: 'pip install shodan\nshodan init YOUR_API_KEY',
    commands: [
      {
        command: 'shodan host 8.8.8.8',
        description: 'Get detailed host information including open ports and vulnerabilities.',
        expectedOutput: 'Host: 8.8.8.8\nCity: Mountain View\nPorts: 53, 443\nHTTP Server: gws'
      },
      {
        command: 'shodan search "product:Apache port:443 org:\'Target Corp\'"',
        description: 'Search target infrastructure using specific filters.',
        expectedOutput: 'Found 42 results for filter Apache + Port 443...'
      }
    ],
    examples: ['shodan search "port:21 anonymous"', 'shodan stats --facets port org:Google'],
    lessons: [
      'Formulating advanced Shodan search dorks',
      'Scanning for unauthenticated MongoDB & Elasticsearch nodes',
      'Monitoring organization attack surfaces'
    ],
    quiz: [
      {
        id: 'q1',
        question: 'Which Shodan filter restricts results to a specific Autonomous System?',
        options: ['asn:', 'org:', 'net:', 'country:'],
        correctAnswerIndex: 0,
        explanation: 'The `asn:` filter narrows results to a specific Autonomous System Number (e.g. `asn:AS15169`).'
      }
    ],
    relatedTools: ['censys', 'nmap', 'spiderfoot'],
    icon: 'Eye',
    orbitalRingIndex: 5,
    complexity: 'Intermediate',
    status: 'Active',
    popularity: 99
  },
  {
    id: 'amass',
    name: 'OWASP Amass',
    category: 'Domain Investigation',
    tagline: 'In-Depth Subdomain & Attack Surface Mapping',
    description: 'OWASP Amass project performs network mapping of attack surfaces and external asset discovery using open-source information gathering and active reconnaissance techniques.',
    installation: 'go install -v github.com/owasp-amass/amass/v4/...@latest',
    commands: [
      {
        command: 'amass enum -d target-domain.com -active',
        description: 'Perform active subdomain enumeration with DNS resolve checks.',
        expectedOutput: '[DNS] api.target-domain.com 192.0.2.45\n[DNS] dev.target-domain.com 192.0.2.89'
      },
      {
        command: 'amass viz -d3 -d target-domain.com',
        description: 'Generate interactive 3D HTML network graph visualization.',
        expectedOutput: 'Generated visualization files in output directory.'
      }
    ],
    examples: ['amass enum -passive -d tesla.com'],
    lessons: [
      'Combining passive DNS sources with certificate transparency logs',
      'Graph database querying for asset correlation',
      'Integrating Amass into CI/CD security pipelines'
    ],
    quiz: [
      {
        id: 'q1',
        question: 'What is the primary difference between `amass enum -passive` and `-active`?',
        options: ['Passive queries local cache only', 'Passive sends zero direct requests to target infrastructure', 'Active is faster', 'Passive uses brute-force DNS'],
        correctAnswerIndex: 1,
        explanation: 'Passive mode relies exclusively on third-party aggregators and APIs without sending any traffic to the target domain.'
      }
    ],
    relatedTools: ['subfinder', 'theharvester', 'maltego'],
    icon: 'Network',
    orbitalRingIndex: 0,
    complexity: 'Advanced',
    status: 'Active',
    popularity: 95
  },
  {
    id: 'spiderfoot',
    name: 'SpiderFoot',
    category: 'Network Intelligence',
    tagline: 'Automated OSINT Intelligence Collection',
    description: 'Automates OSINT collection by querying over 200 data sources simultaneously to gather intelligence on IP addresses, domain names, e-mail addresses, and names.',
    installation: 'git clone https://github.com/smicallef/spiderfoot.git\ncd spiderfoot && pip install -r requirements.txt\npython sf.py -l 127.0.0.1:5001',
    commands: [
      {
        command: 'python sf.py -s target-domain.com -m sfp_whois,sfp_shodan,sfp_dns',
        description: 'Run targeted scan modules from command line.',
        expectedOutput: '[+] Scan started for target-domain.com using 3 modules...'
      }
    ],
    examples: ['python sf.py -s admin@target.com -m sfp_haveibeenpwned'],
    lessons: [
      'Automating asset footprinting',
      'Correlation rules for threat hunting',
      'Exporting STIX/TAXII threat intelligence feeds'
    ],
    quiz: [
      {
        id: 'q1',
        question: 'What type of interface does SpiderFoot provide by default when run locally?',
        options: ['CLI only', 'Web-based GUI on port 5001', 'Electron app', 'Telnet daemon'],
        correctAnswerIndex: 1,
        explanation: 'SpiderFoot launches a local Web UI on port 5001 for managing scans and viewing entity correlation graphs.'
      }
    ],
    relatedTools: ['maltego', 'shodan', 'theharvester'],
    icon: 'Radar',
    orbitalRingIndex: 4,
    complexity: 'Intermediate',
    status: 'Active',
    popularity: 92
  },
  {
    id: 'theharvester',
    name: 'theHarvester',
    category: 'Email Investigation',
    tagline: 'E-mail, Subdomain, and Name Harvester',
    description: 'Gather emails, subdomains, hosts, employee names, open ports and banners from different public sources like search engines, PGP key servers and SHODAN database.',
    installation: 'git clone https://github.com/laramies/theHarvester.git\ncd theHarvester && pip install -r requirements.txt',
    commands: [
      {
        command: 'theHarvester -d company.com -b google,bing,linkedin,dnsdumpster',
        description: 'Harvest emails and subdomains across specified passive engines.',
        expectedOutput: '[*] Emails found: 14\n[*] Hosts found: 52\nadmin@company.com\nsecops@company.com'
      }
    ],
    examples: ['theHarvester -d target.org -b all'],
    lessons: [
      'Targeted spear-phishing risk assessment',
      'Exposing corporate email patterns and leaked employee lists'
    ],
    quiz: [
      {
        id: 'q1',
        question: 'Why is harvesting corporate email patterns critical during penetration testing?',
        options: ['It breaks WAF firewalls', 'It aids social engineering & credential spray attacks', 'It decrypts HTTPS traffic', 'It bypasses MFA'],
        correctAnswerIndex: 1,
        explanation: 'Discovered email addresses and naming structures allow security auditors to test password spray resistance and social engineering risks.'
      }
    ],
    relatedTools: ['whois', 'amass', 'sherlock'],
    icon: 'Mail',
    orbitalRingIndex: 1,
    complexity: 'Beginner',
    status: 'Active',
    popularity: 94
  },
  {
    id: 'exiftool',
    name: 'ExifTool',
    category: 'Metadata',
    tagline: 'Read & Edit Image/Document Metadata',
    description: 'A platform-independent Perl library and command-line application for reading, writing and editing meta information in a wide variety of files including JPEG, PNG, PDF, and Office docs.',
    installation: 'apt-get install libimage-exiftool-perl # Debian/Ubuntu\nbrew install exiftool                   # macOS',
    commands: [
      {
        command: 'exiftool suspicious_image.jpg',
        description: 'Extract all embedded metadata (GPS coordinates, camera model, timestamp).',
        expectedOutput: 'Camera Model Name: iPhone 14 Pro\nGPS Latitude: 37 deg 46\' 29.88" N\nGPS Longitude: 122 deg 25\' 9.84" W\nCreate Date: 2024:06:12 14:22:01'
      },
      {
        command: 'exiftool -all= photo.jpg',
        description: 'Sanitize image by stripping all EXIF metadata for privacy.',
        expectedOutput: '1 image files updated'
      }
    ],
    examples: ['exiftool -gpslatitude -gpslongitude image.jpg', 'exiftool -csv ./images_dir > meta.csv'],
    lessons: [
      'Geolocation analysis through EXIF coordinates',
      'Document author tracking via PDF/Docx metadata',
      'Steganography & hidden data payload detection'
    ],
    quiz: [
      {
        id: 'q1',
        question: 'Which tag family in digital images contains precise latitude and longitude values?',
        options: ['XMP-Author', 'GPS', 'IPTC-Keywords', 'JFIF-Thumbnail'],
        correctAnswerIndex: 1,
        explanation: 'The EXIF GPS tag family records geographic location recorded by camera sensors or smartphones.'
      }
    ],
    relatedTools: ['foca', 'binwalk'],
    icon: 'FileText',
    orbitalRingIndex: 2,
    complexity: 'Beginner',
    status: 'Active',
    popularity: 96
  },
  {
    id: 'maltego',
    name: 'Maltego',
    category: 'Digital Forensics',
    tagline: 'Link Analysis & Visual Data Mining',
    description: 'Interactive visual link analysis tool for graph-based OSINT investigations. Connects domains, IPs, social accounts, organizations, and infrastructure relationships.',
    installation: 'Download Maltego Desktop Client from maltego.com',
    commands: [
      {
        command: 'Run transform: "To Domain [DNS]" on Entity: IP Address',
        description: 'Executes transform in GUI to discover related infrastructure.',
        expectedOutput: 'Graph updated with 12 connected Domain entities.'
      }
    ],
    examples: ['Transform: To Social Network Account', 'Transform: To DNS Name - MX'],
    lessons: [
      'Building complex investigation graphs',
      'Writing custom Maltego Local Transforms in Python',
      'Entity relationship mapping'
    ],
    quiz: [
      {
        id: 'q1',
        question: 'In Maltego terminology, what is a "Transform"?',
        options: ['A file converter', 'A piece of code that queries a data source to expand graph nodes', 'A 3D rotation filter', 'An encryption cipher'],
        correctAnswerIndex: 1,
        explanation: 'Transforms are mini-scripts or API callers that query data sources and return connected entities on the visual graph.'
      }
    ],
    relatedTools: ['spiderfoot', 'amass'],
    icon: 'Share2',
    orbitalRingIndex: 7,
    complexity: 'Advanced',
    status: 'Active',
    popularity: 97
  },
  {
    id: 'nmap',
    name: 'Nmap',
    category: 'Network Intelligence',
    tagline: 'Network Exploration & Vulnerability Scanner',
    description: 'Nmap (Network Mapper) is a free and open source utility for network discovery and security auditing, using raw IP packets to determine available hosts and service versions.',
    installation: 'apt-get install nmap # Linux\nbrew install nmap    # macOS',
    commands: [
      {
        command: 'nmap -sV -sC -p- 192.168.1.1',
        description: 'Full port scan with service version detection and default NSE scripts.',
        expectedOutput: 'PORT    STATE SERVICE VERSION\n22/tcp  open  ssh     OpenSSH 8.9p1\n80/tcp  open  http    nginx 1.18.0\n443/tcp open  ssl/http nginx 1.18.0'
      },
      {
        command: 'nmap --script vuln target-domain.com',
        description: 'Run NSE vulnerability detection scripts against target.',
        expectedOutput: '| http-vuln-cve2017-5638:\n|   VULNERABLE:\n|   Apache Struts Remote Code Execution'
      }
    ],
    examples: ['nmap -sn 192.168.1.0/24', 'nmap -O target.com'],
    lessons: [
      'TCP SYN stealth scanning vs Connect scanning',
      'Nmap Scripting Engine (NSE) automation',
      'Bypassing stateless firewall filters'
    ],
    quiz: [
      {
        id: 'q1',
        question: 'What is the default scan type when Nmap is executed with root/sudo privileges?',
        options: ['TCP Connect scan (-sT)', 'SYN Stealth scan (-sS)', 'UDP scan (-sU)', 'FIN scan (-sF)'],
        correctAnswerIndex: 1,
        explanation: 'With root privileges, Nmap defaults to SYN Stealth scan (-sS), which creates raw packets without completing the TCP 3-way handshake.'
      }
    ],
    relatedTools: ['shodan', 'masscan', 'amass'],
    icon: 'Terminal',
    orbitalRingIndex: 4,
    complexity: 'Intermediate',
    status: 'Active',
    popularity: 100
  }
];*/

export const INITIAL_CAPSULES: LearningCapsule[] = [
  {
    id: 'cap-1',
    title: 'Domain Infrastructure Footprinting',
    category: 'Domain Investigation',
    difficulty: 'Beginner',
    durationMinutes: 45,
    completionPercentage: 100,
    lessonsCount: 6,
    xpReward: 350,
    tags: ['WHOIS', 'DNS', 'Subdomains', 'Amass'],
    description: 'Learn how to exhaustively map domain infrastructure, passive DNS records, subdomains, and cloud bucket endpoints.'
  },
  {
    id: 'cap-2',
    title: 'Advanced Shodan Search Dorking',
    category: 'Threat Intelligence',
    difficulty: 'Intermediate',
    durationMinutes: 60,
    completionPercentage: 65,
    lessonsCount: 8,
    xpReward: 500,
    tags: ['Shodan', 'IoT', 'Open Ports', 'ICS'],
    description: 'Master Shodan operators to locate exposed industrial control panels, vulnerable database clusters, and misconfigured cameras.'
  },
  {
    id: 'cap-3',
    title: 'Digital Forensic Metadata Analysis',
    category: 'Metadata',
    difficulty: 'Beginner',
    durationMinutes: 30,
    completionPercentage: 40,
    lessonsCount: 5,
    xpReward: 250,
    tags: ['ExifTool', 'FOCA', 'Geolocation', 'Steganography'],
    description: 'Uncover hidden timestamps, camera serials, author accounts, and exact GPS coordinates embedded in media files.'
  },
  {
    id: 'cap-4',
    title: 'Visual Graph Threat Mapping',
    category: 'Digital Forensics',
    difficulty: 'Advanced',
    durationMinutes: 90,
    completionPercentage: 10,
    lessonsCount: 12,
    xpReward: 850,
    tags: ['Maltego', 'Transforms', 'Link Analysis', 'Correlation'],
    description: 'Construct multi-layered threat entity graphs linking compromised infrastructure to adversary personas.'
  }
];

export const INITIAL_LABS: PracticeLab[] = [
  {
    id: 'lab-phantom-domain',
    title: 'Operation Phantom Domain',
    category: 'Domain Investigation',
    difficulty: 'Easy',
    xpReward: 200,
    targetDomainOrIp: 'phantom-corp-sec.org',
    missionBrief: 'Intelligence agents report a rogue sub-domain belonging to Phantom Corp hosting unauthenticated API keys. Your mission is to enumerate subdomains and identify the leak.',
    objectives: [
      { id: 'o1', task: 'Query WHOIS records for phantom-corp-sec.org', completed: false, hint: 'Use the `whois` command', requiredCommandPattern: 'whois phantom-corp-sec.org' },
      { id: 'o2', task: 'Discover subdomains using active DNS enumeration', completed: false, hint: 'Use `amass enum -d phantom-corp-sec.org`', requiredCommandPattern: 'amass enum' },
      { id: 'o3', task: 'Identify the secret API staging subdomain', completed: false, hint: 'Look for subdomains containing "api" or "dev"', requiredCommandPattern: 'cat results.txt' }
    ],
    evidenceFiles: [
      { name: 'intercepted_headers.txt', content: 'HTTP/1.1 200 OK\nServer: nginx/1.19.2\nX-Internal-Staging: dev-api-v2.phantom-corp-sec.org\nAuthorization: Bearer ph_live_998127391823', type: 'text' }
    ],
    hints: ['Check the HTTP response headers in the evidence tab.', 'The WHOIS creation date provides clues about parent registrar.'],
    initialFilesystem: {
      'mission_brief.txt': 'Target: phantom-corp-sec.org. Priority: High.'
    }
  },
  {
    id: 'lab-shodan-recon',
    title: 'Exposed Core Reactor Scan',
    category: 'Threat Intelligence',
    difficulty: 'Medium',
    xpReward: 450,
    targetDomainOrIp: '198.51.100.44',
    missionBrief: 'A SCADA control system telemetry unit has been reported exposed to public routing. Discover open ports and version numbers.',
    objectives: [
      { id: 'o1', task: 'Execute Shodan host lookup on 198.51.100.44', completed: false, hint: 'Use `shodan host 198.51.100.44`', requiredCommandPattern: 'shodan host 198.51.100.44' },
      { id: 'o2', task: 'Port scan the SCADA Modbus service', completed: false, hint: 'Use `nmap -p 502 198.51.100.44`', requiredCommandPattern: 'nmap' }
    ],
    evidenceFiles: [
      { name: 'scada_dump.log', content: 'MODBUS/TCP Unit ID: 1\nFunction Code 03: Read Holding Registers\nRegister 40001: 0x41F0 (Core Temp 84.2C)', type: 'log' }
    ],
    hints: ['Modbus standard port is 502.', 'Shodan provides host banner information without sending traffic directly.']
  }
];

export const INITIAL_THREAT_MARKERS: ThreatMarker[] = [
  { id: 'tm-1', lat: 37.7749, lng: -122.4194, country: 'USA', city: 'San Francisco', threatLevel: 'High', type: 'Botnet C2 Node', ip: '192.0.2.14', targetSector: 'Financial Services', timestamp: '12m ago' },
  { id: 'tm-2', lat: 51.5074, lng: -0.1278, country: 'UK', city: 'London', threatLevel: 'Critical', type: 'Zero-Day Exploit Burst', ip: '198.51.100.99', targetSector: 'Government Infrastructure', timestamp: '4m ago' },
  { id: 'tm-3', lat: 35.6762, lng: 139.6503, country: 'Japan', city: 'Tokyo', threatLevel: 'Medium', type: 'Credential Spray Probe', ip: '203.0.113.88', targetSector: 'E-Commerce', timestamp: '22m ago' },
  { id: 'tm-4', lat: 52.5200, lng: 13.4050, country: 'Germany', city: 'Berlin', threatLevel: 'Low', type: 'DNS Amplification Relay', ip: '198.51.100.12', targetSector: 'Telecom', timestamp: '1h ago' }
];

export const MOCK_USER_PROFILE: UserProfile = {
  username: 'antigravity_agent',
  codename: 'CYBER_PHANTOM_9',
  rank: 'OSINT Specialist',
  level: 14,
  currentXp: 7420,
  nextLevelXp: 10000,
  badges: [
    { id: 'b1', name: 'First Recon', icon: 'Shield', description: 'Completed initial domain footprinting mission', unlockedAt: '2026-07-20' },
    { id: 'b2', name: 'Shodan Master', icon: 'Eye', description: 'Formulated 50 successful Shodan dork queries', unlockedAt: '2026-07-25' },
    { id: 'b3', name: 'Evidence Detective', icon: 'Share2', description: 'Linked 20 correlated nodes on investigation wall', unlockedAt: '2026-07-30' },
    { id: 'b4', name: 'Terminal Warlord', icon: 'Terminal', description: 'Executed 100 successful lab terminal commands' }
  ],
  completedLabsCount: 18,
  accuracyRate: 94.2,
  streakDays: 12,
  rankPosition: 42
};
