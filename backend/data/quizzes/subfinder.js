const quizQuestions = [
  {
    "question": "What is the core design philosophy of Subfinder in subdomain discovery?",
    "options": [
      "Fast, passive subdomain discovery using curated online APIs without direct target probing",
      "Active network exploitation and vulnerability weaponization",
      "Deep packet inspection of encrypted TLS handshakes",
      "Local filesystem forensic artifact recovery"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Subfinder is engineered for passive subdomain discovery, querying dozens of external APIs and OSINT services without contacting target servers.",
    "difficulty": "Beginner",
    "order": 1
  },
  {
    "question": "Which command runs Subfinder for a domain and writes the findings to a text file?",
    "options": [
      "subfinder -d example.com -o subdomains.txt",
      "subfinder --target example.com --write subdomains.txt",
      "subfinder -u example.com > save.txt",
      "subfinder scan example.com -file subdomains.txt"
    ],
    "correctAnswerIndex": 0,
    "explanation": "The `-d` option specifies the target domain and `-o` outputs the discovered subdomains to a text file.",
    "difficulty": "Beginner",
    "order": 2
  },
  {
    "question": "Why is passive reconnaissance with Subfinder preferred during stealth OSINT operations?",
    "options": [
      "It leaves zero network traffic or log entries on the target organization's infrastructure",
      "It modifies the target's firewall rules to prevent detection",
      "It automatically routes all packets through encrypted onion relays",
      "It disables the target's security information and event management (SIEM) systems"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Passive querying relies entirely on third-party repositories and APIs, meaning no packets ever touch the target's servers.",
    "difficulty": "Beginner",
    "order": 3
  },
  {
    "question": "Where does Subfinder store API provider credentials to unlock premium data sources?",
    "options": [
      "~/.config/subfinder/provider-config.yaml",
      "/etc/subfinder/keys.json",
      "/var/log/subfinder.conf",
      "~/.subfinder_passwords.txt"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Subfinder reads API keys from `~/.config/subfinder/provider-config.yaml` to query authenticated sources like SecurityTrails and Shodan.",
    "difficulty": "Intermediate",
    "order": 4
  },
  {
    "question": "An analyst wants to pipe Subfinder output directly into httpx. Which flag suppresses banners and extra text?",
    "options": [
      "-silent",
      "-quiet",
      "-no-banner",
      "-raw"
    ],
    "correctAnswerIndex": 0,
    "explanation": "The `-silent` flag suppresses ASCII art, progress metrics, and logs, outputting only clean subdomain lines for piping.",
    "difficulty": "Beginner",
    "order": 5
  }
];

module.exports = quizQuestions;
