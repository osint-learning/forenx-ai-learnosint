const quizQuestions = [
  {
    "question": "What is the primary function of WhatWeb in web reconnaissance?",
    "options": [
      "Identifying content management systems, blogging platforms, JavaScript libraries, and web servers",
      "Intercepting encrypted web socket traffic in real time",
      "Brute-forcing administrative login forms on web portals",
      "Generating synthetic web traffic to conduct stress testing"
    ],
    "correctAnswerIndex": 0,
    "explanation": "WhatWeb identifies websites, profiling content management systems (CMS), blogging platforms, JavaScript libraries, and web servers.",
    "difficulty": "Beginner",
    "order": 1
  },
  {
    "question": "What does WhatWeb's aggression level `-a 3` (Aggressive) execute?",
    "options": [
      "Performs aggressive probing by requesting specific plugin paths and analyzing complex response patterns",
      "Launches distributed denial of service floods against the target",
      "Attempts to crack SSH credentials on port 22",
      "Overwrites remote web server index files"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Aggression level 3 (Aggressive) sends additional HTTP requests to check specific plugin files and uncover detailed version numbers.",
    "difficulty": "Intermediate",
    "order": 2
  },
  {
    "question": "How does WhatWeb identify underlying web technologies on a target site?",
    "options": [
      "By matching HTTP headers, HTML body signatures, cookies, and URL patterns against its plugin database",
      "By establishing an SSH tunnel to the host operating system",
      "By querying local network ARP tables",
      "By executing remote memory buffer overflow probes"
    ],
    "correctAnswerIndex": 0,
    "explanation": "WhatWeb uses over 1,800 plugins to inspect HTTP headers, page body patterns, meta tags, and script paths for technology signatures.",
    "difficulty": "Intermediate",
    "order": 3
  },
  {
    "question": "Why is web technology profiling essential during the early stages of a security assessment?",
    "options": [
      "It reveals outdated CMS platforms, frameworks, and plugins with known public CVE vulnerabilities",
      "It guarantees immediate root administrative access to the web server",
      "It bypasses all cloud-based anti-virus protections",
      "It changes the target website's domain registration records"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Identifying exact software names and version numbers allows analysts to check for known vulnerabilities and exploit paths.",
    "difficulty": "Beginner",
    "order": 4
  },
  {
    "question": "An analyst executes `whatweb -v example.com`. What does the `-v` flag output?",
    "options": [
      "Verbose output detailing plugin descriptions, matched strings, and categorized technology information",
      "The software version of the local WhatWeb installation only",
      "A video screen recording of the website rendering in a browser",
      "Valid SSL/TLS certificate private key files"
    ],
    "correctAnswerIndex": 0,
    "explanation": "The `-v` (verbose) option prints detailed breakdown reports showing plugin names, descriptions, and the exact strings matched.",
    "difficulty": "Beginner",
    "order": 5
  }
];

module.exports = quizQuestions;
