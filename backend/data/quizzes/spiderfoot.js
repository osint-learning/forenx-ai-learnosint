const quizQuestions = [
  {
    "question": "What is SpiderFoot in the context of OSINT reconnaissance?",
    "options": [
      "An automated OSINT framework integrating hundreds of modules to map attack surfaces and threat intelligence",
      "A hardware device for tapping Ethernet cables",
      "A web browser extension for taking scrolling screenshots",
      "A tool for creating steganographic images with hidden payloads"
    ],
    "correctAnswerIndex": 0,
    "explanation": "SpiderFoot is an automated OSINT reconnaissance platform that executes hundreds of modules against targets to discover assets and threats.",
    "difficulty": "Beginner",
    "order": 1
  },
  {
    "question": "Which target seed types can be supplied to initiate a SpiderFoot scan?",
    "options": [
      "Domain names, IP addresses, CIDR subnets, email addresses, phone numbers, usernames, and human names",
      "Only compiled C++ executable binaries",
      "Only physical GPS coordinates",
      "Only Wi-Fi network SSID names"
    ],
    "correctAnswerIndex": 0,
    "explanation": "SpiderFoot accepts diverse targets including domains, IPs, subnets, ASNs, email addresses, phone numbers, and usernames.",
    "difficulty": "Beginner",
    "order": 2
  },
  {
    "question": "How does SpiderFoot's event-driven module architecture function during a scan?",
    "options": [
      "Modules produce data elements that automatically trigger subsequent modules, recursively expanding the intelligence graph",
      "Modules run strictly one at a time and delete previous findings",
      "Modules require manual user approval for every single DNS query",
      "Modules compile findings into proprietary binary firmware images"
    ],
    "correctAnswerIndex": 0,
    "explanation": "When a module discovers a new data element (e.g., an IP from a domain), it emits an event that other modules consume automatically.",
    "difficulty": "Intermediate",
    "order": 3
  },
  {
    "question": "What is the difference between 'Passive' and 'Active' scan configurations in SpiderFoot?",
    "options": [
      "Passive queries third-party databases only, while Active communicates directly with target infrastructure",
      "Passive scans run on Linux, while Active scans run exclusively on Windows",
      "Passive scans are completely free, while Active scans require paid subscriptions",
      "Passive scans do not generate log files, while Active scans generate text logs"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Passive mode queries OSINT feeds without contacting the target; Active mode sends direct requests, port scans, and web crawls.",
    "difficulty": "Beginner",
    "order": 4
  },
  {
    "question": "An organization needs to continuously monitor for leaked API keys, dark web mentions, and exposed cloud buckets. Why is SpiderFoot suitable?",
    "options": [
      "It automates data collection across specialized leak, breach, code repository, and cloud storage modules simultaneously",
      "It automatically deploys honeypots inside adversary networks",
      "It modifies dark web forum posts to censor leaked data",
      "It prevents employees from typing passwords into browsers"
    ],
    "correctAnswerIndex": 0,
    "explanation": "SpiderFoot includes modules specifically dedicated to querying paste sites, GitHub repos, leak databases, and public S3 buckets.",
    "difficulty": "Intermediate",
    "order": 5
  }
];

module.exports = quizQuestions;
