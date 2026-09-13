const quizQuestions = [
  {
    "question": "What is the primary purpose of Assetfinder in reconnaissance pipelines?",
    "options": [
      "Quickly finding related domains and subdomains from passive sources with minimal overhead",
      "Exploiting remote code execution vulnerabilities on web servers",
      "Monitoring network traffic using raw socket packet capture",
      "Generating synthetic passwords for credential stuffing attacks"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Assetfinder is a fast, lightweight Go utility designed to discover subdomains and related domains from passive online sources.",
    "difficulty": "Beginner",
    "order": 1
  },
  {
    "question": "Which command-line flag restricts Assetfinder output strictly to subdomains of the target domain?",
    "options": [
      "--subs-only",
      "-s",
      "--only-domain",
      "-subdomain"
    ],
    "correctAnswerIndex": 0,
    "explanation": "The `--subs-only` flag filters output to include only subdomains belonging directly to the queried domain.",
    "difficulty": "Beginner",
    "order": 2
  },
  {
    "question": "Why is Assetfinder particularly well-suited for command-line Unix pipelines?",
    "options": [
      "It reads from stdin/arguments and outputs clean, newline-delimited text directly to stdout",
      "It includes a heavy built-in graphical user interface",
      "It automatically installs external Linux kernel drivers",
      "It runs exclusively on proprietary hardware appliances"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Assetfinder follows the Unix philosophy, accepting input and streaming clean plain-text results ideal for piping into tools like httprobe.",
    "difficulty": "Intermediate",
    "order": 3
  },
  {
    "question": "Which public sources does Assetfinder query during execution?",
    "options": [
      "Certificate Transparency logs, Wayback Machine, VirusTotal, and search engines",
      "Encrypted internal corporate Active Directory databases",
      "Private local area network switch CAM tables",
      "Tor hidden service onion directories exclusively"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Assetfinder queries public sources such as crt.sh, Wayback Machine, VirusTotal, and HackerTarget.",
    "difficulty": "Intermediate",
    "order": 4
  },
  {
    "question": "An analyst executes `assetfinder --subs-only target.com | sort -u > domains.txt`. What does `sort -u` achieve?",
    "options": [
      "Sorts the discovered subdomains alphabetically and removes duplicate entries",
      "Scans each domain for open UDP ports",
      "Resolves each subdomain to an IPv6 address",
      "Checks each subdomain against an antivirus database"
    ],
    "correctAnswerIndex": 0,
    "explanation": "`sort -u` sorts the piped subdomain list and eliminates duplicate lines before saving to the file.",
    "difficulty": "Beginner",
    "order": 5
  }
];

module.exports = quizQuestions;
