const quizQuestions = [
  {
    "question": "What is the primary function of theHarvester in OSINT reconnaissance?",
    "options": [
      "Harvesting emails, subdomains, employee names, and open ports from public sources",
      "Performing automated exploitation of web application vulnerabilities",
      "Cracking Wi-Fi WPA2 pre-shared keys",
      "Decompiling binary executable files"
    ],
    "correctAnswerIndex": 0,
    "explanation": "theHarvester is an OSINT tool designed to gather emails, subdomains, hosts, employee names, and open ports from diverse public data sources.",
    "difficulty": "Beginner",
    "order": 1
  },
  {
    "question": "Which command-line parameter in theHarvester specifies the data source to query?",
    "options": [
      "-s",
      "-b",
      "-t",
      "-e"
    ],
    "correctAnswerIndex": 1,
    "explanation": "The -b flag (or --source) defines the search engine or data source, such as google, bing, or all.",
    "difficulty": "Beginner",
    "order": 2
  },
  {
    "question": "How does theHarvester collect intelligence without alerting the target organization?",
    "options": [
      "By querying public search engines and third-party databases passively",
      "By injecting rootkits into target DNS servers",
      "By intercepting ISP fiber-optic cables",
      "By running continuous high-speed SYN flood scans"
    ],
    "correctAnswerIndex": 0,
    "explanation": "theHarvester gathers intelligence passively by querying external search engines, PGP servers, and APIs without contacting the target directly.",
    "difficulty": "Beginner",
    "order": 3
  },
  {
    "question": "What investigative deliverable can be constructed directly from theHarvester's email and name findings?",
    "options": [
      "Network firewall routing tables",
      "A targeted employee directory for social engineering and phishing assessments",
      "Kernel crash dump analysis",
      "Database schema ER diagrams"
    ],
    "correctAnswerIndex": 1,
    "explanation": "Harvested employee names and email addresses allow investigators to map organizational structure and assess credential compromise exposure.",
    "difficulty": "Intermediate",
    "order": 4
  },
  {
    "question": "An analyst executes `theHarvester -d example.com -l 300 -b bing`. What does the `-l 300` argument define?",
    "options": [
      "Limits search results to 300 items",
      "Runs the scan for exactly 300 seconds",
      "Sends 300 concurrent threads per second",
      "Logs findings to line 300 of a file"
    ],
    "correctAnswerIndex": 0,
    "explanation": "The -l flag limits the number of search results processed from the selected data source.",
    "difficulty": "Intermediate",
    "order": 5
  }
];

module.exports = quizQuestions;
