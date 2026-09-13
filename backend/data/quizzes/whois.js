const whoisQuiz = [
  {
    question: "What information does WHOIS primarily provide?",
    options: [
      "Domain registration details",
      "Website source code",
      "Network traffic",
      "Passwords"
    ],
    correctAnswerIndex: 0,
    explanation:
      "WHOIS provides domain registration and ownership-related information.",
    difficulty: "Beginner",
    order: 1
  },
  {
    question: "Which command retrieves WHOIS information?",
    options: [
      "ping example.com",
      "whois example.com",
      "nslookup example.com",
      "dig example.com"
    ],
    correctAnswerIndex: 1,
    explanation:
      "The whois command is used to query domain registration information.",
    difficulty: "Beginner",
    order: 2
  },
  {
    question: "Which field indicates when a domain registration is expected to end?",
    options: [
      "Creation Date",
      "Registrar",
      "Expiry Date",
      "Status"
    ],
    correctAnswerIndex: 2,
    explanation:
      "The expiry date indicates when the current domain registration period is expected to end.",
    difficulty: "Beginner",
    order: 3
  },
  {
    question: "Why should WHOIS results be verified with other sources?",
    options: [
      "WHOIS is always wrong",
      "Data may be hidden, outdated, or privacy-protected",
      "WHOIS never returns information",
      "WHOIS is illegal to use"
    ],
    correctAnswerIndex: 1,
    explanation:
      "WHOIS information can be affected by privacy protection, incomplete records, or outdated registration data.",
    difficulty: "Intermediate",
    order: 4
  },
  {
    question: "WHOIS is mainly used during which OSINT phase?",
    options: [
      "Exploitation",
      "Reconnaissance",
      "Persistence",
      "Privilege Escalation"
    ],
    correctAnswerIndex: 1,
    explanation:
      "WHOIS is commonly used during reconnaissance to collect domain registration and related information.",
    difficulty: "Beginner",
    order: 5
  }
];

module.exports = whoisQuiz;