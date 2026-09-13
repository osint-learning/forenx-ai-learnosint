const quizQuestions = [
  {
    "question": "What service does crt.sh provide to OSINT investigators?",
    "options": [
      "A searchable public web interface for Certificate Transparency (CT) logs",
      "An automated vulnerability scanner for web servers",
      "A private domain name registration service",
      "A tool for creating self-signed TLS certificates"
    ],
    "correctAnswerIndex": 0,
    "explanation": "crt.sh is a free, publicly accessible search engine for Certificate Transparency logs operated by Sectigo.",
    "difficulty": "Beginner",
    "order": 1
  },
  {
    "question": "Which wildcard query on crt.sh discovers all logged certificates for subdomains of `example.com`?",
    "options": [
      "%.example.com",
      "*.example.com",
      "subdomains:example.com",
      "example.com/*"
    ],
    "correctAnswerIndex": 0,
    "explanation": "crt.sh uses SQL LIKE syntax where the `%` wildcard matches all subdomains (e.g., `%.example.com`).",
    "difficulty": "Beginner",
    "order": 2
  },
  {
    "question": "Why are Certificate Transparency logs considered a reliable, authoritative source for subdomain discovery?",
    "options": [
      "Public Certificate Authorities are required to log all issued TLS certificates into append-only, publicly auditable logs",
      "They are updated manually by corporate security officers",
      "They contain private database login credentials",
      "They bypass the need for any DNS resolution globally"
    ],
    "correctAnswerIndex": 0,
    "explanation": "CT logs are cryptographically assured, append-only records of all public certificates issued by trusted Certificate Authorities.",
    "difficulty": "Intermediate",
    "order": 3
  },
  {
    "question": "What type of infrastructure often leaks into crt.sh logs before public deployment?",
    "options": [
      "Staging, development, testing, and internal API subdomains",
      "Employee home Wi-Fi router passwords",
      "Corporate bank account numbers",
      "Physical office door access codes"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Engineers frequently acquire public TLS certificates for pre-production, staging, and internal servers, exposing names to CT logs.",
    "difficulty": "Intermediate",
    "order": 4
  },
  {
    "question": "An analyst discovers a certificate logged yesterday for `vpn-staging.corp.com` on crt.sh. What intelligence does this provide?",
    "options": [
      "A new VPN staging asset was recently provisioned and secured with a public certificate",
      "The company's primary firewall was breached yesterday",
      "The domain registration for corp.com was cancelled",
      "All employee VPN credentials were leaked online"
    ],
    "correctAnswerIndex": 0,
    "explanation": "The recent certificate timestamp confirms the active deployment of a new staging VPN endpoint within the target's attack surface.",
    "difficulty": "Beginner",
    "order": 5
  }
];

module.exports = quizQuestions;
