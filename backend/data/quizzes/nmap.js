const quizQuestions = [
  {
    "question": "What is the primary function of Nmap in network security and OSINT reconnaissance?",
    "options": [
      "Network discovery, port scanning, service version detection, and operating system fingerprinting",
      "Brute-forcing Wi-Fi WPA2 pre-shared keys",
      "Automated phishing email generation",
      "Editing DNS zone files on remote root servers"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Nmap (Network Mapper) is an open-source utility for network discovery, port scanning, and vulnerability detection.",
    "difficulty": "Beginner",
    "order": 1
  },
  {
    "question": "Which Nmap scan flag initiates a TCP SYN (Stealth) scan?",
    "options": [
      "-sS",
      "-sT",
      "-sU",
      "-sA"
    ],
    "correctAnswerIndex": 0,
    "explanation": "The `-sS` flag performs a TCP SYN scan, which sends SYN packets without completing full three-way handshakes.",
    "difficulty": "Beginner",
    "order": 2
  },
  {
    "question": "What does a port state of 'filtered' mean in Nmap scan output?",
    "options": [
      "A firewall or network packet filter is blocking probes from reaching the target port",
      "An application is actively listening and accepting connections on that port",
      "The port is closed and replied with an explicit RST packet",
      "The port has been physically disconnected from the server motherboard"
    ],
    "correctAnswerIndex": 0,
    "explanation": "'Filtered' means Nmap cannot determine if the port is open because packet filtering prevents probes from reaching it.",
    "difficulty": "Intermediate",
    "order": 3
  },
  {
    "question": "Which Nmap flag enables OS detection, version detection, script scanning, and traceroute simultaneously?",
    "options": [
      "-A",
      "-sV",
      "-O",
      "-Pn"
    ],
    "correctAnswerIndex": 0,
    "explanation": "The `-A` flag enables aggressive scan options: OS detection (-O), version scanning (-sV), script scanning (-sC), and traceroute.",
    "difficulty": "Beginner",
    "order": 4
  },
  {
    "question": "An investigator runs `nmap -sV -p 80,443 target.com`. What does the `-sV` flag determine?",
    "options": [
      "Probes open ports to determine service and software version details",
      "Suppresses verbose output to run silently",
      "Performs a vulnerability exploit against port 80 and 443",
      "Verifies the SSL certificate expiration date only"
    ],
    "correctAnswerIndex": 0,
    "explanation": "The `-sV` flag enables service version detection to identify the software and version running on open ports.",
    "difficulty": "Beginner",
    "order": 5
  }
];

module.exports = quizQuestions;
