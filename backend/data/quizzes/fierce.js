const quizQuestions = [
  {
    "question": "What is the primary objective of the Fierce tool in OSINT reconnaissance?",
    "options": [
      "Locating non-contiguous IP spaces and subdomains across target corporate networks",
      "Conducting denial of service attacks against DNS resolvers",
      "Reverse-engineering compiled Windows malware binaries",
      "Decrypting HTTPS sessions on internal local networks"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Fierce is a reconnaissance tool designed to locate non-contiguous IP spaces and subdomains of target enterprise networks.",
    "difficulty": "Beginner",
    "order": 1
  },
  {
    "question": "Which command initiates basic subdomain enumeration against a domain using modern Fierce?",
    "options": [
      "fierce --domain target.com",
      "fierce -scan target.com",
      "fierce --target http://target.com",
      "fierce start target.com"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Modern Fierce syntax uses `fierce --domain <domain>` to start automated reconnaissance against a target domain.",
    "difficulty": "Beginner",
    "order": 2
  },
  {
    "question": "What is the first reconnaissance step Fierce automatically executes against target nameservers?",
    "options": [
      "Attempting DNS zone transfers (AXFR)",
      "Launching an intensive SYN port scan",
      "Sending phishing emails to registered WHOIS contacts",
      "Brute-forcing administrator login credentials"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Fierce first identifies the authoritative nameservers and tests them for misconfigured, open DNS zone transfers.",
    "difficulty": "Intermediate",
    "order": 3
  },
  {
    "question": "How does Fierce attempt to discover related infrastructure after finding valid subdomains?",
    "options": [
      "By scanning adjacent IP ranges nearby discovered hosts to uncover adjacent targets",
      "By modifying local hosts files on client workstations",
      "By exploiting unpatched WordPress plugins",
      "By issuing fraudulent SSL certificates"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Fierce checks nearby IP addresses around discovered subdomains to detect non-contiguous infrastructure and internal subnets.",
    "difficulty": "Intermediate",
    "order": 4
  },
  {
    "question": "Which argument allows an analyst to supply a custom subdomain dictionary list in Fierce?",
    "options": [
      "--subflist",
      "--wordlist",
      "-dict",
      "--file"
    ],
    "correctAnswerIndex": 0,
    "explanation": "The `--subflist` option in Fierce specifies a custom wordlist file for subdomain dictionary enumeration.",
    "difficulty": "Intermediate",
    "order": 5
  }
];

module.exports = quizQuestions;
