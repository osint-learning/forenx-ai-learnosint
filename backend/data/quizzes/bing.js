const quizQuestions = [
  {
    "question": "What unique search operator in Microsoft Bing is especially valuable for reverse IP address lookups?",
    "options": [
      "ip:",
      "host:",
      "server:",
      "address:"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Bing supports the `ip:` operator (e.g., `ip:203.0.113.10`), which returns websites hosted on the specified IP address.",
    "difficulty": "Beginner",
    "order": 1
  },
  {
    "question": "What does the query `ip:198.51.100.45` in Bing search reveal?",
    "options": [
      "Websites and hostnames indexed by Bing that are hosted on that specific IP address",
      "The physical home address of the server administrator",
      "The root password of the server at that IP",
      "The real-time network traffic passing through that IP"
    ],
    "correctAnswerIndex": 0,
    "explanation": "The `ip:` operator queries Bing's index to identify domains sharing that specific web server or virtual host IP.",
    "difficulty": "Intermediate",
    "order": 2
  },
  {
    "question": "Which operator combination in Bing locates subdomains while excluding the main `www` website?",
    "options": [
      "site:target.com -site:www.target.com",
      "subdomain:target.com",
      "target.com NOT www",
      "inurl:target.com without www"
    ],
    "correctAnswerIndex": 0,
    "explanation": "`site:target.com -site:www.target.com` queries target.com while filtering out the primary www subdomain.",
    "difficulty": "Intermediate",
    "order": 3
  },
  {
    "question": "Which operator in Bing allows investigators to search for pages linked to a specific filetype?",
    "options": [
      "filetype: (or contains:)",
      "format:",
      "ext_only:",
      "download:"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Bing supports `filetype:` and `contains:` to search for documents and specific file formats.",
    "difficulty": "Beginner",
    "order": 4
  },
  {
    "question": "An investigator wants to find pages in French hosted in Canada on Bing. Which operator can restrict by region or language?",
    "options": [
      "loc:CA or language:fr",
      "country:Canada --lang:French",
      "region=CA & french",
      "geo:Canada language=fr"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Bing supports `loc:` (location) and `language:` operators to filter results by geographic country and document language.",
    "difficulty": "Intermediate",
    "order": 5
  }
];

module.exports = quizQuestions;
