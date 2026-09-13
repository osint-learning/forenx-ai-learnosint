const quizQuestions = [
  {
    "question": "What core privacy characteristic distinguishes DuckDuckGo from conventional search engines?",
    "options": [
      "It does not track user searches, create profiling cookies, or personalize search results",
      "It operates strictly on the dark web via Tor",
      "It blocks all images and video content from loading",
      "It encrypts all visited external websites automatically"
    ],
    "correctAnswerIndex": 0,
    "explanation": "DuckDuckGo prioritizes user privacy by not tracking search history, logging IP addresses, or building individual user search profiles.",
    "difficulty": "Beginner",
    "order": 1
  },
  {
    "question": "Why is the absence of search personalization beneficial during OSINT investigations?",
    "options": [
      "It ensures unbiased, neutral search results that are consistent and uninfluenced by previous browser activity",
      "It guarantees that every search result is 100% verified by law enforcement",
      "It prevents web servers from knowing their pages are being indexed",
      "It bypasses all corporate proxy authentication requirements"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Without algorithmic personalization or filter bubbles, investigators receive objective, consistent results across investigations.",
    "difficulty": "Intermediate",
    "order": 2
  },
  {
    "question": "What feature in DuckDuckGo allows users to redirect searches directly to external sites using shortcuts?",
    "options": [
      "!bang syntax (e.g., !w, !gh)",
      "QuickLinks",
      "SearchPivots",
      "DirectRoute"
    ],
    "correctAnswerIndex": 0,
    "explanation": "DuckDuckGo's !bang commands (e.g., `!w` for Wikipedia, `!gh` for GitHub) immediately redirect searches to external services.",
    "difficulty": "Beginner",
    "order": 3
  },
  {
    "question": "Which syntax enforces an exact phrase search in DuckDuckGo?",
    "options": [
      "Enclosing the phrase in quotation marks: \"exact phrase\"",
      "Adding the prefix exact:exact phrase",
      "Surrounding the phrase with parentheses: (exact phrase)",
      "Appending the keyword --strict"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Quotation marks (`\"exact phrase\"`) instruct DuckDuckGo to match the exact character sequence without stemming or synonyms.",
    "difficulty": "Beginner",
    "order": 4
  },
  {
    "question": "An investigator wants to search GitHub directly from DuckDuckGo for the repo 'recon-ng'. Which query achieves this?",
    "options": [
      "!gh recon-ng",
      "search github: recon-ng",
      "->github recon-ng",
      "duck:github/recon-ng"
    ],
    "correctAnswerIndex": 0,
    "explanation": "The `!gh` bang command sends the query `recon-ng` directly into GitHub's internal search engine.",
    "difficulty": "Beginner",
    "order": 5
  }
];

module.exports = quizQuestions;
