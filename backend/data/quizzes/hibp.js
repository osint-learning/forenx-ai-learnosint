const quizQuestions = [
  {
    "question": "What is the primary function of Have I Been Pwned (HIBP)?",
    "options": [
      "Checking if email addresses, usernames, or passwords have been exposed in known data breaches",
      "Distributing stolen credentials to security researchers",
      "Recovering lost email accounts from third-party providers",
      "Launching automated credential stuffing attacks against web portals"
    ],
    "correctAnswerIndex": 0,
    "explanation": "HIBP allows individuals and investigators to query whether email addresses or passwords have been compromised in data breaches.",
    "difficulty": "Beginner",
    "order": 1
  },
  {
    "question": "What details does HIBP provide when an email address is identified in a breach?",
    "options": [
      "The breach name, breach date, compromised data classes (e.g., passwords, emails), and breach description",
      "The cleartext password and full credit card number of the account holder",
      "The IP address of the hacker who committed the breach",
      "The current active session tokens for the affected account"
    ],
    "correctAnswerIndex": 0,
    "explanation": "HIBP lists the breached service name, incident date, compromised data types, and background context without sharing plain passwords.",
    "difficulty": "Beginner",
    "order": 2
  },
  {
    "question": "How does the 'Pwned Passwords' feature check passwords securely without exposing the plaintext password to the server?",
    "options": [
      "By utilizing a k-Anonymity model where only the first 5 characters of the SHA-1 hash are sent to the API",
      "By encrypting the password with the user's master password",
      "By hashing the password locally with MD5 and sending the full hash",
      "By transmitting the password over a private VPN tunnel"
    ],
    "correctAnswerIndex": 0,
    "explanation": "k-Anonymity sends only the first 5 characters of the SHA-1 hash; the API returns matching hash suffixes for local comparison.",
    "difficulty": "Intermediate",
    "order": 3
  },
  {
    "question": "How do investigators utilize HIBP breach listings when profiling a person of interest?",
    "options": [
      "To identify platforms where the target held accounts and map historical online service usage over time",
      "To gain unauthorized access to the target's current active email accounts",
      "To delete historical records of the target's online presence",
      "To intercept the target's password reset emails"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Breach entries reveal the specific websites and services the individual subscribed to across past years.",
    "difficulty": "Intermediate",
    "order": 4
  },
  {
    "question": "An investigator queries an email on HIBP and finds breaches for Adobe (2013), Dropbox (2012), and MyFitnessPal (2018). What does this establish?",
    "options": [
      "The target identity was actively using these services around or before those breach dates",
      "The email address was created in 2018",
      "The target has never used password protection on their accounts",
      "All three services share identical backend database servers"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Historical breach appearances establish a verified timeline of user activity across specific web platforms.",
    "difficulty": "Intermediate",
    "order": 5
  }
];

module.exports = quizQuestions;
