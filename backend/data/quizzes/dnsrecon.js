const quizQuestions = [
  {
    "question": "What is the primary function of DNSRecon in OSINT and penetration testing?",
    "options": [
      "Automating DNS enumeration, zone transfers, brute-forcing, and cache snooping",
      "Exploiting buffer overflows in Apache web servers",
      "Sniffing unencrypted credentials on local Wi-Fi",
      "Encrypting DNS packets with custom cryptographic keys"
    ],
    "correctAnswerIndex": 0,
    "explanation": "DNSRecon is an advanced DNS enumeration and reconnaissance tool capable of zone transfers, record discovery, and dictionary brute-forcing.",
    "difficulty": "Beginner",
    "order": 1
  },
  {
    "question": "Which DNSRecon switch specifies the target domain name for enumeration?",
    "options": [
      "-d",
      "-t",
      "-u",
      "-r"
    ],
    "correctAnswerIndex": 0,
    "explanation": "The `-d` option specifies the target domain to scan in DNSRecon.",
    "difficulty": "Beginner",
    "order": 2
  },
  {
    "question": "What technique does DNSRecon use with the `-t brt` option?",
    "options": [
      "Subdomain brute-forcing using a dictionary wordlist",
      "SQL injection against DNS databases",
      "Network packet sniffing on interface eth0",
      "TLS certificate revocation checking"
    ],
    "correctAnswerIndex": 0,
    "explanation": "The `-t brt` type executes brute-force subdomain enumeration against the domain using a supplied or default wordlist.",
    "difficulty": "Intermediate",
    "order": 3
  },
  {
    "question": "What is DNS cache snooping in DNSRecon used to determine?",
    "options": [
      "Whether a specific domain was recently resolved and cached by the target DNS server",
      "The root password of the caching nameserver",
      "The physical serial number of the DNS appliance",
      "The total bandwidth consumed by the caching resolver"
    ],
    "correctAnswerIndex": 0,
    "explanation": "DNS cache snooping checks if a target nameserver has specific domain records in its cache, revealing past user activity.",
    "difficulty": "Intermediate",
    "order": 4
  },
  {
    "question": "An analyst executes `dnsrecon -d target.com -t std`. What does standard enumeration (`-t std`) retrieve?",
    "options": [
      "SOA, NS, A, AAAA, MX, and TXT records, plus a zone transfer check",
      "Only IPv6 reverse lookup records",
      "Complete source code repository backups",
      "Server CPU and memory performance statistics"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Standard enumeration (-t std) checks SOA, NS, A, AAAA, MX, and TXT records, and automatically attempts a zone transfer.",
    "difficulty": "Beginner",
    "order": 5
  }
];

module.exports = quizQuestions;
