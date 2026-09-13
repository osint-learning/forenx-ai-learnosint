const quizQuestions = [
  {
    "question": "What role does Google Search play as a foundational OSINT tool?",
    "options": [
      "Providing fast access to billions of indexed web pages, cached documents, and publicly accessible data",
      "Executing automated network penetration exploits",
      "Decrypting HTTPS traffic passing through public Wi-Fi",
      "Hosting private underground intelligence forums"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Google Search is the world's largest web index, enabling researchers to discover indexed websites, files, and public information.",
    "difficulty": "Beginner",
    "order": 1
  },
  {
    "question": "What operator displays Googlebot's most recent cached version of a webpage?",
    "options": [
      "cache:",
      "saved:",
      "history:",
      "snapshot:"
    ],
    "correctAnswerIndex": 0,
    "explanation": "The `cache:` operator (e.g., `cache:example.com`) loads the cached version of the page saved by Google during indexing.",
    "difficulty": "Beginner",
    "order": 2
  },
  {
    "question": "What boolean logic is applied by default between separate search terms in a Google query?",
    "options": [
      "Logical AND",
      "Logical OR",
      "Logical NOT",
      "Logical XOR"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Google automatically combines adjacent search terms with an implicit logical AND operator.",
    "difficulty": "Beginner",
    "order": 3
  },
  {
    "question": "Which query syntax finds web pages containing the phrase 'security policy' while excluding any results from `target.com`?",
    "options": [
      "\"security policy\" -site:target.com",
      "\"security policy\" not:target.com",
      "\"security policy\" /exclude target.com",
      "site:target.com -\"security policy\""
    ],
    "correctAnswerIndex": 0,
    "explanation": "The minus sign `-` excludes terms or operators, so `\"security policy\" -site:target.com` omits results from target.com.",
    "difficulty": "Intermediate",
    "order": 4
  },
  {
    "question": "An investigator wants to find PDF documents mentioning 'budget' on university `.edu` domains. Which query is most effective?",
    "options": [
      "site:.edu filetype:pdf budget",
      "domain:edu +format:pdf +budget",
      "search edu pdf \"budget\"",
      "inurl:edu -> download pdf budget"
    ],
    "correctAnswerIndex": 0,
    "explanation": "`site:.edu filetype:pdf budget` restricts the search to .edu domains, PDF filetypes, and the keyword budget.",
    "difficulty": "Beginner",
    "order": 5
  }
];

module.exports = quizQuestions;
