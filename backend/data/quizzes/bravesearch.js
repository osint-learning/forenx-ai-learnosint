const quizQuestions = [
  {
    "question": "What distinguishes Brave Search from search engines that syndicate results from Bing or Google?",
    "options": [
      "It builds and maintains its own independent, privacy-focused global web index",
      "It is hosted entirely on decentralized blockchain smart contracts",
      "It requires users to pay a fee in cryptocurrency for each query",
      "It only indexes websites that use the Brave browser"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Brave Search operates an independent web crawler and search index rather than relying on syndication feeds from Big Tech providers.",
    "difficulty": "Beginner",
    "order": 1
  },
  {
    "question": "What is Brave Search's 'Goggles' feature used for in OSINT research?",
    "options": [
      "Applying custom ranking rules and community filters to re-order search results for specialized investigative sources",
      "Viewing 3D virtual reality models of website server rooms",
      "Magnifying small text in webpage screenshots",
      "Translating spoken audio queries into written text"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Brave Goggles allow users to apply custom ranking criteria to filter and prioritize niche domains, blogs, or tech sites.",
    "difficulty": "Intermediate",
    "order": 2
  },
  {
    "question": "How does Brave Search maintain operational security (OPSEC) for researchers?",
    "options": [
      "By not collecting IP addresses, tracking search terms, or profiling user queries",
      "By routing all queries through government intelligence servers",
      "By deleting the local operating system browser history automatically",
      "By encrypting the investigator's physical computer monitor"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Brave Search does not track search terms, log user IPs, or create individual search profiles, preserving investigator privacy.",
    "difficulty": "Beginner",
    "order": 3
  },
  {
    "question": "What built-in Brave Search section aggregates community discussions from Reddit and web forums?",
    "options": [
      "Discussions",
      "Community Talk",
      "Forum Hub",
      "Social Stream"
    ],
    "correctAnswerIndex": 0,
    "explanation": "The Discussions filter highlights relevant conversations and troubleshooting threads from Reddit, forums, and discussion boards.",
    "difficulty": "Beginner",
    "order": 4
  },
  {
    "question": "An investigator applies a specialized 'Tech & Security Blogs' Goggle to a Brave Search query. What is the effect on the results?",
    "options": [
      "Results from independent security research blogs are prioritized while mainstream news aggregator sites are downranked",
      "All results outside the local city are blocked",
      "The search query is converted into binary machine code",
      "The target websites are automatically scanned for vulnerabilities"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Goggles alter ranking algorithms, boosting specialized technical blogs and suppressing generic search spam.",
    "difficulty": "Intermediate",
    "order": 5
  }
];

module.exports = quizQuestions;
