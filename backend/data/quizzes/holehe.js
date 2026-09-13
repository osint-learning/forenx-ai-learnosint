const quizQuestions = [
  {
    "question": "What specific intelligence does Holehe uncover during an OSINT investigation?",
    "options": [
      "Checks if an email address is registered to accounts on 120+ web services without alerting the owner",
      "Dumps cleartext email passwords from webmail servers",
      "Monitors incoming emails to a target inbox in real time",
      "Injects malware into email attachment files"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Holehe checks if an email address is associated with accounts across over 120 platforms without sending notifications to the target.",
    "difficulty": "Beginner",
    "order": 1
  },
  {
    "question": "Which command runs Holehe against a target email address?",
    "options": [
      "holehe target@example.com",
      "holehe --scan target@example.com --all",
      "holehe check target@example.com",
      "holehe -u target@example.com"
    ],
    "correctAnswerIndex": 0,
    "explanation": "The standard Holehe command syntax is `holehe <email@example.com>`.",
    "difficulty": "Beginner",
    "order": 2
  },
  {
    "question": "How does Holehe verify account registration without triggering password reset emails?",
    "options": [
      "By inspecting password recovery and registration endpoints for service-specific API responses",
      "By authenticating directly using stolen master API tokens",
      "By intercepting SMS one-time passwords over cellular networks",
      "By executing SQL injection against authentication databases"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Holehe queries password reset and sign-up endpoints to observe subtle API error messages indicating account presence without finalizing resets.",
    "difficulty": "Intermediate",
    "order": 3
  },
  {
    "question": "What OSINT pivot becomes possible after Holehe confirms an email is registered on GitHub and Twitter?",
    "options": [
      "Investigating those specific platforms for public repositories, usernames, activity logs, and social connections",
      "Remotely resetting the target's operating system password",
      "Accessing the target's private bank account portal",
      "Intercepting the target's physical postal mail"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Knowing which platforms the target uses allows analysts to focus username and social media reconnaissance on verified platforms.",
    "difficulty": "Intermediate",
    "order": 4
  },
  {
    "question": "In Holehe's terminal output, what does a green `[+]` symbol indicate next to a service name?",
    "options": [
      "An account registered with the queried email address exists on that service",
      "The service is offline or unreachable",
      "The email address is definitely not registered on that service",
      "The service requires CAPTCHA resolution to complete the check"
    ],
    "correctAnswerIndex": 0,
    "explanation": "A green `[+]` indicates a positive match confirming an account is registered with that email address on the service.",
    "difficulty": "Beginner",
    "order": 5
  }
];

module.exports = quizQuestions;
