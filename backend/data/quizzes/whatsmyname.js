const quizQuestions = [
  {
    "question": "What is WhatsMyName in the OSINT community?",
    "options": [
      "A curated project and database of detection signatures for enumerating usernames across web services",
      "A proprietary facial recognition surveillance camera system",
      "An encrypted messaging client for anonymous communications",
      "A tool for spoofing email sender headers"
    ],
    "correctAnswerIndex": 0,
    "explanation": "WhatsMyName is an open-source project maintaining structured signature patterns to check username existence across hundreds of websites.",
    "difficulty": "Beginner",
    "order": 1
  },
  {
    "question": "What underlying data format does WhatsMyName use to define platform detection signatures?",
    "options": [
      "JSON",
      "XML",
      "YAML",
      "CSV"
    ],
    "correctAnswerIndex": 0,
    "explanation": "WhatsMyName signatures are maintained in a structured `wmn-data.json` file defining endpoints, check types, and response criteria.",
    "difficulty": "Beginner",
    "order": 2
  },
  {
    "question": "How does a WhatsMyName signature determine if a target username exists on a specific site?",
    "options": [
      "By matching defined HTTP status codes and platform-specific error/existence strings",
      "By attempting to brute-force the target account's password",
      "By querying private internal corporate LDAP servers",
      "By executing client-side JavaScript exploit payloads"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Signatures check for specific HTTP status codes (e.g., 200 vs 404) and presence/absence of key text strings on the profile page.",
    "difficulty": "Intermediate",
    "order": 3
  },
  {
    "question": "Why is the WhatsMyName project widely utilized by other OSINT tools and frameworks?",
    "options": [
      "Its standardized, community-maintained JSON schema allows easy integration into custom automated scripts",
      "It provides free unlimited access to dark web financial records",
      "It acts as a VPN service for masking investigator IP addresses",
      "It guarantees 100% bypass of all website CAPTCHAs"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Its open, well-structured schema makes it the foundational data source for numerous third-party username enumeration tools.",
    "difficulty": "Intermediate",
    "order": 4
  },
  {
    "question": "An investigator inspects a signature with `\"check_type\": \"status_code\"` and `\"e_code\": 200`. What does this mean?",
    "options": [
      "An HTTP 200 response indicates that the user profile exists on the site",
      "An HTTP 200 response indicates the account is suspended or banned",
      "The scanner encountered an unrecoverable server error",
      "The website requires CAPTCHA verification before proceeding"
    ],
    "correctAnswerIndex": 0,
    "explanation": "`e_code: 200` means receiving an HTTP status code 200 confirms the existence of the username on that platform.",
    "difficulty": "Intermediate",
    "order": 5
  }
];

module.exports = quizQuestions;
