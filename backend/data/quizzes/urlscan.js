const quizQuestions = [
  {
    "question": "What is urlscan.io primarily used for by security and OSINT analysts?",
    "options": [
      "Scanning, analyzing, and archiving websites by executing a full browser visit in a sandbox",
      "Editing HTML source code of live remote websites",
      "Brute-forcing SSH server login credentials",
      "Generating synthetic credit card numbers for ecommerce testing"
    ],
    "correctAnswerIndex": 0,
    "explanation": "urlscan.io runs automated, sandboxed browser sessions to record network requests, DOM snapshots, certificates, and screenshots of websites.",
    "difficulty": "Beginner",
    "order": 1
  },
  {
    "question": "What crucial forensic artifacts are captured and displayed in a urlscan.io scan report?",
    "options": [
      "Full DOM snapshots, outbound network requests, cookies, loaded JavaScript files, and screenshots",
      "The server's physical motherboard serial number",
      "The website owner's personal bank account balance",
      "The private encryption keys of all site visitors"
    ],
    "correctAnswerIndex": 0,
    "explanation": "urlscan.io records page screenshots, DOM content, all contacted IPs/domains, HTTP requests/responses, and cookies.",
    "difficulty": "Intermediate",
    "order": 2
  },
  {
    "question": "What is the operational security (OPSEC) difference between a 'Public' and 'Private' scan on urlscan.io?",
    "options": [
      "Public scans are searchable by the global community, while Private scans remain restricted to the submitter's account",
      "Public scans scan the entire internet, while Private scans scan only local networks",
      "Public scans are encrypted with military-grade ciphers, while Private scans are unencrypted",
      "Public scans are free, while Private scans require installing local agent software"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Public scans appear in the public feed and index, potentially alerting adversaries that their domain is under investigation.",
    "difficulty": "Intermediate",
    "order": 3
  },
  {
    "question": "How does searching urlscan.io for specific Google Analytics or Tag Manager IDs assist an investigation?",
    "options": [
      "It connects separate websites that share identical tracking IDs, establishing common ownership",
      "It grants administrative access to the Google Analytics dashboard",
      "It deletes tracking scripts from target websites",
      "It decrypts user sessions tracked by the tag"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Shared analytics identifiers (e.g., UA-XXXXX or GTM-XXXXX) across multiple sites strongly suggest they are managed by the same entity.",
    "difficulty": "Intermediate",
    "order": 4
  },
  {
    "question": "An investigator needs to safely inspect a suspicious phishing page without triggering local malware execution. Why is urlscan.io appropriate?",
    "options": [
      "The page is loaded on urlscan.io's remote cloud sandbox, isolating the analyst's workstation from malicious payloads",
      "urlscan.io automatically disables all malware on the destination server",
      "urlscan.io redirects all phishing attacks to government servers",
      "urlscan.io converts the website into a plain text email message"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Running the scan on cloud infrastructure protects the investigator's local system from browser exploits and malware downloads.",
    "difficulty": "Beginner",
    "order": 5
  }
];

module.exports = quizQuestions;
