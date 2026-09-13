const quizQuestions = [
  {
    "question": "What is the primary function of Sherlock in an OSINT investigation?",
    "options": [
      "Finding social media accounts across hundreds of websites by username",
      "Recovering lost user passwords through dictionary attacks",
      "Tracing GPS coordinates of mobile devices",
      "Scanning web servers for SQL injection flaws"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Sherlock is designed to search for accounts matching a specific username across hundreds of social networks and websites.",
    "difficulty": "Beginner",
    "order": 1
  },
  {
    "question": "Which command searches for the username 'targetuser' across all platforms using Sherlock?",
    "options": [
      "sherlock --find targetuser",
      "sherlock targetuser",
      "sherlock -u targetuser --all",
      "sherlock scan targetuser"
    ],
    "correctAnswerIndex": 1,
    "explanation": "The standard syntax to search for a target username with Sherlock is simply `sherlock <username>`.",
    "difficulty": "Beginner",
    "order": 2
  },
  {
    "question": "How does Sherlock determine if a username exists on a target platform?",
    "options": [
      "By sending HTTP requests and evaluating response codes and error signatures",
      "By intercepting database queries on the remote server",
      "By brute-forcing platform login portals",
      "By querying global WHOIS domain registries"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Sherlock queries site profile URLs and analyzes HTTP status codes, error messages, and response content against its site database.",
    "difficulty": "Intermediate",
    "order": 3
  },
  {
    "question": "When investigating a pseudonym, what key intelligence does Sherlock provide for pivoting?",
    "options": [
      "Discovers matching accounts on other platforms revealing photos, locations, and interests",
      "Extracts the target user's local operating system version",
      "Decrypts private end-to-end encrypted chat logs",
      "Provides direct root SSH access to user servers"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Uncovering identical usernames across various platforms helps investigators connect digital identities and build a comprehensive persona profile.",
    "difficulty": "Intermediate",
    "order": 4
  },
  {
    "question": "An investigator runs `sherlock suspect123 --csv`. What does the `--csv` flag do?",
    "options": [
      "Exports discovered profile URLs to a CSV file",
      "Converts the target password hash into CSV format",
      "Compresses the Sherlock script into a ZIP archive",
      "Restricts scanning to CSV-hosting repositories"
    ],
    "correctAnswerIndex": 0,
    "explanation": "The --csv option exports the detected account results into a structured CSV file for documentation and analysis.",
    "difficulty": "Beginner",
    "order": 5
  }
];

module.exports = quizQuestions;
