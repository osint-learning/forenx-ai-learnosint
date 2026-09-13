const quizQuestions = [
  {
    "question": "What is the primary function of PhoneInfoga in OSINT investigations?",
    "options": [
      "Scanning, analyzing, and gathering intelligence on international phone numbers",
      "Tapping mobile phone voice conversations in real time",
      "Cloning physical SIM cards over cellular networks",
      "Sending automated SMS phishing blasts"
    ],
    "correctAnswerIndex": 0,
    "explanation": "PhoneInfoga is an advanced OSINT tool dedicated to gathering reconnaissance on international phone numbers.",
    "difficulty": "Beginner",
    "order": 1
  },
  {
    "question": "Which standard international format should be used when supplying a phone number to PhoneInfoga?",
    "options": [
      "E.164 format with country code (e.g., +14155552671)",
      "Local national format without country prefix",
      "Hexadecimal encoded phone string",
      "URL encoded carrier routing identifier"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Phone numbers should be formatted in standard E.164 notation including the leading plus sign and country code.",
    "difficulty": "Beginner",
    "order": 2
  },
  {
    "question": "What baseline metadata does PhoneInfoga extract using Google's libphonenumber library?",
    "options": [
      "Country of origin, carrier name, line type (e.g., mobile vs VoIP), and number validity",
      "Real-time GPS coordinates of the subscriber's handset",
      "The handset's Wi-Fi MAC address and Bluetooth pairing logs",
      "Stored SMS text message archives and call history"
    ],
    "correctAnswerIndex": 0,
    "explanation": "libphonenumber provides country info, valid number structure, original telco carrier, and line type (mobile, landline, VoIP).",
    "difficulty": "Intermediate",
    "order": 3
  },
  {
    "question": "How does PhoneInfoga leverage search engines to discover online footprints of a phone number?",
    "options": [
      "By generating targeted Google dorks to find paste sites, social profiles, and public mentions",
      "By injecting search engine database records",
      "By purchasing private cellular records from telecommunications providers",
      "By scraping encrypted mobile instant messaging backups"
    ],
    "correctAnswerIndex": 0,
    "explanation": "PhoneInfoga generates search engine dorks to discover where the phone number appears across websites, directories, and data dumps.",
    "difficulty": "Intermediate",
    "order": 4
  },
  {
    "question": "An investigator analyzes a suspicious number and PhoneInfoga reports the line type as 'VoIP'. What is the investigative implication?",
    "options": [
      "The number is virtual/cloud-based and may lack a direct link to a physical mobile SIM card",
      "The number cannot send or receive text messages",
      "The phone number is guaranteed to belong to a government agency",
      "The phone number was deactivated more than 10 years ago"
    ],
    "correctAnswerIndex": 0,
    "explanation": "VoIP numbers are internet-based virtual numbers often used via apps (e.g., Google Voice, burner apps) and are easily acquired anonymously.",
    "difficulty": "Intermediate",
    "order": 5
  }
];

module.exports = quizQuestions;
