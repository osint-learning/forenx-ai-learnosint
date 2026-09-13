const quizQuestions = [
  {
    "question": "What makes OWASP Amass one of the most comprehensive asset discovery frameworks?",
    "options": [
      "It integrates passive OSINT, active DNS enumeration, Certificate Transparency, and graph database modeling",
      "It contains built-in zero-day exploits for all web application firewalls",
      "It replaces standard operating system network stacks",
      "It automatically cracks password hashes found in web pages"
    ],
    "correctAnswerIndex": 0,
    "explanation": "OWASP Amass provides in-depth attack surface mapping by combining numerous passive sources, active techniques, and graph databases.",
    "difficulty": "Beginner",
    "order": 1
  },
  {
    "question": "Which Amass subcommand performs attack surface mapping and subdomain discovery?",
    "options": [
      "amass enum",
      "amass scan",
      "amass discover",
      "amass map"
    ],
    "correctAnswerIndex": 0,
    "explanation": "The `amass enum` subcommand initiates network and subdomain asset enumeration.",
    "difficulty": "Beginner",
    "order": 2
  },
  {
    "question": "What is the function of the `-passive` flag in `amass enum`?",
    "options": [
      "Restricts data gathering strictly to passive OSINT sources without sending direct DNS queries",
      "Reduces CPU usage to 10%",
      "Disables internet connectivity entirely",
      "Outputs scan findings in encrypted format"
    ],
    "correctAnswerIndex": 0,
    "explanation": "The `-passive` flag ensures Amass gathers intelligence solely from third-party databases and APIs without active DNS resolution.",
    "difficulty": "Beginner",
    "order": 3
  },
  {
    "question": "What is the primary benefit of Amass storing asset relationships in a graph database?",
    "options": [
      "It visualizes complex associations between domains, IP ranges, ASNs, and netblocks across assessments",
      "It automatically cleans hard drive temporary files",
      "It compiles C++ source code into native executables",
      "It prevents remote servers from detecting brute-force scans"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Amass's graph architecture tracks infrastructure relationships and allows comparison between historical scans.",
    "difficulty": "Intermediate",
    "order": 4
  },
  {
    "question": "An analyst runs `amass enum -d example.com -src`. What does the `-src` flag display?",
    "options": [
      "The specific data source or API feed that discovered each asset",
      "The raw C source code of the Amass binary",
      "The source IP address of the scanning machine",
      "The HTML source code of the target website"
    ],
    "correctAnswerIndex": 0,
    "explanation": "The `-src` flag prints the data source (e.g., Shodan, Censys, AlienVault) next to each discovered subdomain.",
    "difficulty": "Intermediate",
    "order": 5
  }
];

module.exports = quizQuestions;
