const quizQuestions = [
  {
    "question": "What core capability does VirusTotal provide for threat intelligence and OSINT?",
    "options": [
      "Aggregating multi-engine file, URL, domain, and IP threat telemetry",
      "Disinfecting local operating systems from malware infections",
      "Hosting underground cybercrime forums",
      "Serving as a private encrypted communication platform"
    ],
    "correctAnswerIndex": 0,
    "explanation": "VirusTotal aggregates threat analysis from dozens of antivirus engines and security tools to analyze files, URLs, domains, and IPs.",
    "difficulty": "Beginner",
    "order": 1
  },
  {
    "question": "What intelligence is primarily found under VirusTotal's 'Relations' tab for a domain?",
    "options": [
      "Passive DNS resolutions, communicating files, and associated SSL certificates",
      "Credit card numbers used to register the domain",
      "Internal company salary spreadsheets",
      "Source code of proprietary desktop software"
    ],
    "correctAnswerIndex": 0,
    "explanation": "The Relations tab displays passive DNS history, communicating malware samples, embedded URLs, and related digital certificates.",
    "difficulty": "Intermediate",
    "order": 2
  },
  {
    "question": "What does a high detection ratio (e.g., 45/70) on a VirusTotal URL scan indicate?",
    "options": [
      "The URL is confirmed malicious by 45 independent security vendors",
      "The URL has 45 open ports accessible to the public",
      "The URL received 45 gigabytes of web traffic today",
      "The website requires 45 milliseconds to load"
    ],
    "correctAnswerIndex": 0,
    "explanation": "A 45/70 detection ratio means 45 out of 70 scanning engines flagged the submitted item as malicious or suspicious.",
    "difficulty": "Beginner",
    "order": 3
  },
  {
    "question": "How can an investigator track changes in adversary infrastructure over time on VirusTotal?",
    "options": [
      "By reviewing historical passive DNS records and SSL certificate associations",
      "By modifying the remote DNS records in VirusTotal's database",
      "By intercepting BGP routing tables directly",
      "By decrypting TLS handshakes in real time"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Historical passive DNS data on VirusTotal reveals which IP addresses a domain resolved to across past campaigns.",
    "difficulty": "Intermediate",
    "order": 4
  },
  {
    "question": "Why should analysts exercise caution before uploading internal proprietary files to public VirusTotal?",
    "options": [
      "Uploaded files become downloadable to VirusTotal Enterprise subscribers and partners",
      "VirusTotal immediately deletes files without scanning them",
      "Uploading files permanently corrupts local hard drive sectors",
      "VirusTotal automatically sues file submitters"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Files uploaded to VirusTotal are shared with the security community and enterprise subscribers, potentially exposing sensitive data.",
    "difficulty": "Intermediate",
    "order": 5
  }
];

module.exports = quizQuestions;
