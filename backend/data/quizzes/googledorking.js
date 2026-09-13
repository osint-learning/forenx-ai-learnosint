const quizQuestions = [
  {
    "question": "What is Google Dorking (Google Hacking) in OSINT reconnaissance?",
    "options": [
      "Using advanced search operators to uncover sensitive data, exposed files, and misconfigurations indexed by Google",
      "Exploiting remote code execution zero-days in Google's cloud servers",
      "Creating fake Google accounts to send spam emails",
      "Bypassing search engine rate limits using distributed botnets"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Google Dorking utilizes specialized search operators to locate publicly indexed sensitive information, credentials, and open directories.",
    "difficulty": "Beginner",
    "order": 1
  },
  {
    "question": "Which Google search operator restricts search results strictly to a specific domain or host?",
    "options": [
      "site:",
      "domain:",
      "host:",
      "inurl:"
    ],
    "correctAnswerIndex": 0,
    "explanation": "The `site:` operator restricts results to pages hosted on the specified domain (e.g., `site:example.com`).",
    "difficulty": "Beginner",
    "order": 2
  },
  {
    "question": "What is the purpose of the `filetype:` operator in a Google search query?",
    "options": [
      "Filters results to specific document file extensions such as pdf, xlsx, or env",
      "Changes the font style of search results",
      "Downloads files automatically to the local downloads folder",
      "Scans files on Google Drive for computer viruses"
    ],
    "correctAnswerIndex": 0,
    "explanation": "The `filetype:` (or `ext:`) operator restricts results to files matching the specified extension (e.g., `filetype:pdf`).",
    "difficulty": "Beginner",
    "order": 3
  },
  {
    "question": "Which Google dork query finds exposed environment files containing database passwords on `target.com`?",
    "options": [
      "site:target.com filetype:env DB_PASSWORD",
      "site:target.com get passwords",
      "find target.com --show-env-passwords",
      "inurl:target.com show database credentials"
    ],
    "correctAnswerIndex": 0,
    "explanation": "`site:target.com filetype:env DB_PASSWORD` looks for .env configuration files containing database credentials on target.com.",
    "difficulty": "Intermediate",
    "order": 4
  },
  {
    "question": "An investigator wants to find pages where the exact phrase 'Confidential Report' is present in the HTML title tag. Which operator is used?",
    "options": [
      "intitle:\"Confidential Report\"",
      "intext:\"Confidential Report\"",
      "title:\"Confidential Report\"",
      "allinurl:\"Confidential Report\""
    ],
    "correctAnswerIndex": 0,
    "explanation": "The `intitle:` operator restricts results to pages that contain the specified string in their HTML `<title>` tag.",
    "difficulty": "Beginner",
    "order": 5
  }
];

module.exports = quizQuestions;
