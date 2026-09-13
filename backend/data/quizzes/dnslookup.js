const quizQuestions = [
  {
    "question": "What is the primary purpose of DNS lookup in OSINT investigations?",
    "options": [
      "Resolving domain names to IP addresses and retrieving associated resource records",
      "Cracking password hashes stored on remote nameservers",
      "Encrypting web traffic between client browsers and servers",
      "Scanning internal local network hardware adapters"
    ],
    "correctAnswerIndex": 0,
    "explanation": "DNS lookup queries the Domain Name System to map domain names to IP addresses and discover associated DNS records.",
    "difficulty": "Beginner",
    "order": 1
  },
  {
    "question": "Which DNS record type maps a domain name directly to an IPv4 address?",
    "options": [
      "AAAA record",
      "A record",
      "CNAME record",
      "PTR record"
    ],
    "correctAnswerIndex": 1,
    "explanation": "An 'A' (Address) record maps a fully qualified domain name to a 32-bit IPv4 address.",
    "difficulty": "Beginner",
    "order": 2
  },
  {
    "question": "What intelligence value do Mail Exchange (MX) records provide to an analyst?",
    "options": [
      "They list the physical GPS coordinates of the web server",
      "They identify the mail servers and third-party email providers handling domain email",
      "They display the administrative login passwords for webmail portals",
      "They encrypt outbound database traffic between mail servers"
    ],
    "correctAnswerIndex": 1,
    "explanation": "MX records specify the mail servers responsible for accepting email on behalf of a domain, revealing email infrastructure providers.",
    "difficulty": "Intermediate",
    "order": 3
  },
  {
    "question": "Why do OSINT analysts frequently inspect TXT records of a target domain?",
    "options": [
      "TXT records contain raw HTML source code of the website",
      "TXT records often reveal verification tokens, SPF, DKIM, and cloud service integrations",
      "TXT records store private SSL/TLS cryptographic keys",
      "TXT records execute remote shell commands on DNS resolvers"
    ],
    "correctAnswerIndex": 1,
    "explanation": "TXT records hold human-readable text and verification strings for services like SPF, DKIM, Google Workspace, and Microsoft 365.",
    "difficulty": "Intermediate",
    "order": 4
  },
  {
    "question": "An analyst discovers a CNAME pointing to an unclaimed cloud storage endpoint. What risk does this highlight?",
    "options": [
      "Subdomain takeover",
      "SQL injection",
      "Buffer overflow",
      "ARP poisoning"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Dangling CNAME records pointing to decommissioned external resources allow attackers to register the resource and take over the subdomain.",
    "difficulty": "Intermediate",
    "order": 5
  }
];

module.exports = quizQuestions;
