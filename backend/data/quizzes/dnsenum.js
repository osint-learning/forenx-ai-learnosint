const quizQuestions = [
  {
    "question": "What is the primary function of dnsenum?",
    "options": [
      "Automating multi-step DNS enumeration, zone transfers, scraping, and brute forcing",
      "Cracking Wi-Fi WPA handshakes using GPU acceleration",
      "Intercepting HTTP proxy requests in web browsers",
      "Generating TLS certificates for local servers"
    ],
    "correctAnswerIndex": 0,
    "explanation": "dnsenum is an automated Perl script designed to enumerate DNS information, scrap search engines, brute-force subdomains, and check zone transfers.",
    "difficulty": "Beginner",
    "order": 1
  },
  {
    "question": "Which option in dnsenum defines a custom wordlist file for subdomain brute forcing?",
    "options": [
      "-f",
      "-w",
      "-d",
      "-l"
    ],
    "correctAnswerIndex": 0,
    "explanation": "The `-f` (or `--file`) switch specifies the wordlist file containing subdomains to brute force.",
    "difficulty": "Beginner",
    "order": 2
  },
  {
    "question": "How does dnsenum expand subdomain discovery beyond static wordlists?",
    "options": [
      "By scraping Google search results and performing reverse lookups on discovered IP ranges",
      "By decompiling local DNS client binaries",
      "By establishing backdoor connections to root nameservers",
      "By injecting malicious BGP routing updates"
    ],
    "correctAnswerIndex": 0,
    "explanation": "dnsenum queries Google search for additional subdomains and runs reverse lookups against contiguous network blocks.",
    "difficulty": "Intermediate",
    "order": 3
  },
  {
    "question": "Which switch in dnsenum exports the gathered enumeration results into an XML file?",
    "options": [
      "-o",
      "-x",
      "--save",
      "-e"
    ],
    "correctAnswerIndex": 0,
    "explanation": "The `-o` (or `--output`) option writes scan results to an XML file for structured reporting and tool ingestion.",
    "difficulty": "Beginner",
    "order": 4
  },
  {
    "question": "An investigator wants to skip reverse lookup operations to speed up a dnsenum scan. Which flag should be used?",
    "options": [
      "--noreverse",
      "--fast",
      "--skip-ptr",
      "--no-lookup"
    ],
    "correctAnswerIndex": 0,
    "explanation": "The `--noreverse` flag disables reverse DNS lookups, significantly accelerating execution.",
    "difficulty": "Intermediate",
    "order": 5
  }
];

module.exports = quizQuestions;
