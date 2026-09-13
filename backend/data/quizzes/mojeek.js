const quizQuestions = [
  {
    "question": "What is Mojeek's primary architectural distinction in the search engine landscape?",
    "options": [
      "An independent, crawler-based search engine with its own web index and a strict no-tracking privacy policy",
      "A metasearch engine that queries Google and Yahoo simultaneously",
      "A peer-to-peer torrent file search index",
      "A browser extension that scrapes local files"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Mojeek is a fully independent search engine that builds its own index from scratch using autonomous crawlers without tracking users.",
    "difficulty": "Beginner",
    "order": 1
  },
  {
    "question": "Why is searching an independent index like Mojeek valuable in OSINT reconnaissance?",
    "options": [
      "It surfaces unique websites and unranked web pages that mainstream algorithmic ranking suppresses",
      "It provides root access to server file systems",
      "It cracks password protection on private web portals",
      "It bypasses all international copyright restrictions"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Because Mojeek maintains an independent index, it uncovers niche and alternative sources that major search engines filter out.",
    "difficulty": "Intermediate",
    "order": 2
  },
  {
    "question": "What unique emotional search filter does Mojeek provide for querying content by sentiment?",
    "options": [
      "Mojeek Emotions",
      "Sentiment Ranker",
      "Mood Match",
      "Tone Detector"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Mojeek Emotions allows users to search and filter web results based on specific emotional tones (e.g., happy, sad, angry).",
    "difficulty": "Beginner",
    "order": 3
  },
  {
    "question": "How does Mojeek ensure zero user tracking during investigations?",
    "options": [
      "It does not use tracking cookies, does not log IP addresses, and does not record user query history",
      "It forces all users to browse via encrypted onion proxies",
      "It scrambles the search text with randomized characters",
      "It deletes the user's operating system pagefile"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Mojeek strictly avoids user tracking, session profiling, and IP logging, ensuring total search query privacy.",
    "difficulty": "Beginner",
    "order": 4
  },
  {
    "question": "An investigator seeks alternative sources regarding a corporate controversy that appears buried on mainstream engines. Why use Mojeek?",
    "options": [
      "Mojeek's independent crawler provides unbiased algorithmic ranking free from mainstream search engine bubble filters",
      "Mojeek automatically hacks internal corporate email servers",
      "Mojeek only displays documents marked 'top secret'",
      "Mojeek bypasses all web application firewalls"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Mojeek's distinct crawler index surfaces non-curated, independent content unencumbered by mainstream SEO manipulation.",
    "difficulty": "Intermediate",
    "order": 5
  }
];

module.exports = quizQuestions;
