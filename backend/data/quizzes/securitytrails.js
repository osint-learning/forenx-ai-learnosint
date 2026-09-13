const quizQuestions = [
  {
    "question": "What core intelligence feature distinguishes SecurityTrails in OSINT research?",
    "options": [
      "Extensive historical DNS records, historical WHOIS data, and domain relationship tracking",
      "Live network packet injection into target web applications",
      "Cracking hashed passwords using cloud computing clusters",
      "Decrypting end-to-end encrypted messaging applications"
    ],
    "correctAnswerIndex": 0,
    "explanation": "SecurityTrails maintains massive archives of historical DNS changes, past WHOIS records, and domain relationship mappings.",
    "difficulty": "Beginner",
    "order": 1
  },
  {
    "question": "How does historical DNS data in SecurityTrails aid in uncovering origin servers behind Cloudflare?",
    "options": [
      "By displaying previous A records pointing to hosting servers prior to CDN proxy adoption",
      "By sending exploit payloads directly through Cloudflare's WAF",
      "By forcing Cloudflare to disable proxying on the domain",
      "By extracting the origin server IP from the DNS root zone"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Domains often point directly to origin hosting IPs before putting a CDN proxy in front; historical A records preserve these IP addresses.",
    "difficulty": "Intermediate",
    "order": 2
  },
  {
    "question": "What does the 'Associated Domains' feature in SecurityTrails reveal?",
    "options": [
      "Other domain names registered by the same entity or sharing identical historical registrar attributes",
      "All domains hosted in the same geographic country",
      "Every domain name containing similar English keywords",
      "Websites using the same web hosting control panel"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Associated Domains links different domains owned by the same organization based on shared historical WHOIS data and SSL attributes.",
    "difficulty": "Intermediate",
    "order": 3
  },
  {
    "question": "Why is historical WHOIS data critical in cybercrime investigations when current records are privacy-redacted?",
    "options": [
      "Historical records often capture original registrant names, physical addresses, and emails before privacy protection was enabled",
      "Historical WHOIS records can overwrite current domain ownership",
      "Historical records contain plain-text database root passwords",
      "Privacy protection laws do not apply to older domains"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Registrants frequently register domains with real contact details before enabling privacy redaction or GDPR masking later.",
    "difficulty": "Intermediate",
    "order": 4
  },
  {
    "question": "An analyst queries `target.com` and finds that its A record moved to a CDN 6 months ago from `198.51.100.25`. What should the analyst check?",
    "options": [
      "Whether `198.51.100.25` is still hosting the application and responds directly to HTTP host headers",
      "Whether `198.51.100.25` can be reassigned to the analyst's workstation",
      "Whether the CDN service can be sued for hosting the domain",
      "Whether `198.51.100.25` is an invalid IPv4 address"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Testing if the old origin server still responds directly bypasses CDN security controls if the server was not properly restricted.",
    "difficulty": "Intermediate",
    "order": 5
  }
];

module.exports = quizQuestions;
