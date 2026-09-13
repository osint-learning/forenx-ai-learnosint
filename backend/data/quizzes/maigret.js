const quizQuestions = [
  {
    "question": "What is the primary function of Maigret in OSINT username investigations?",
    "options": [
      "Generating comprehensive dossiers on a username across thousands of sites with metadata parsing",
      "Cracking password hashes extracted from database dumps",
      "Sniffing unencrypted instant messaging traffic",
      "Bypassing two-factor authentication on social networks"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Maigret is an advanced username OSINT tool that checks accounts across thousands of platforms and extracts profile metadata.",
    "difficulty": "Beginner",
    "order": 1
  },
  {
    "question": "How does Maigret differ from standard username search utilities like Sherlock?",
    "options": [
      "It parses profile pages to extract metadata like real names, bios, avatars, and linked accounts",
      "It performs active SQL injection against target servers",
      "It sends direct automated password reset emails to victims",
      "It modifies social media account settings remotely"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Maigret extracts rich metadata (full names, locations, bios, avatar URLs, linked social handles) from discovered profiles.",
    "difficulty": "Intermediate",
    "order": 2
  },
  {
    "question": "Which Maigret option generates an interactive graphical HTML report of the investigation?",
    "options": [
      "--html",
      "-g",
      "--web-ui",
      "-report-graph"
    ],
    "correctAnswerIndex": 0,
    "explanation": "The `--html` (or `-T` for graph) option generates a comprehensive, interactive HTML dossier report of findings.",
    "difficulty": "Beginner",
    "order": 3
  },
  {
    "question": "What is Maigret's recursive search capability used for?",
    "options": [
      "Automatically searching for new usernames and aliases discovered in extracted profile metadata",
      "Running infinite loops to flood target social media servers",
      "Recursive file decompression on local disk partitions",
      "Rebuilding broken database indexes"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Recursive search extracts secondary usernames or handles found in profile bios and automatically launches new searches for them.",
    "difficulty": "Intermediate",
    "order": 4
  },
  {
    "question": "An investigator runs `maigret targetuser --tags crypto,gaming`. What does the `--tags` filter do?",
    "options": [
      "Limits the search to sites categorized under cryptocurrency and gaming platforms",
      "Labels the final PDF report with custom metadata tags",
      "Generates synthetic gaming forum usernames",
      "Scans for cryptocurrency wallet malware on the host machine"
    ],
    "correctAnswerIndex": 0,
    "explanation": "The `--tags` flag filters the site database to only query platforms categorized with the specified interest tags.",
    "difficulty": "Intermediate",
    "order": 5
  }
];

module.exports = quizQuestions;
