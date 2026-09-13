const quizQuestions = [
  {
    "question": "What is DNSDumpster in the domain research and OSINT toolkit?",
    "options": [
      "A free domain research tool that maps DNS records, subdomains, and network infrastructure visually",
      "A utility for deleting unallocated DNS records from root servers",
      "A password cracking framework for DNS servers",
      "A physical hardware shredder for old hard drives"
    ],
    "correctAnswerIndex": 0,
    "explanation": "DNSDumpster is a domain research service that discovers DNS records, subdomains, and renders visual network relationship maps.",
    "difficulty": "Beginner",
    "order": 1
  },
  {
    "question": "What unique visual deliverable does DNSDumpster generate for queried domains?",
    "options": [
      "An interactive network topology map and graph showing DNS, MX, and host relationships",
      "A 3D satellite view of the hosting datacenter",
      "A live webcam stream of the server room",
      "A thermal diagram of server CPU temperatures"
    ],
    "correctAnswerIndex": 0,
    "explanation": "DNSDumpster generates a visual network mapping graph illustrating connections between nameservers, mail servers, and subdomains.",
    "difficulty": "Beginner",
    "order": 2
  },
  {
    "question": "What record types does DNSDumpster automatically categorize in its report table?",
    "options": [
      "DNS Servers, MX Records, TXT Records, and Host (A/CNAME) records",
      "Credit card numbers and bank accounts",
      "Internal Active Directory user passwords",
      "Local Wi-Fi WPA2 pre-shared keys"
    ],
    "correctAnswerIndex": 0,
    "explanation": "DNSDumpster organizes findings into DNS servers, MX records, TXT records, and discovered subdomains with IP and ASN details.",
    "difficulty": "Beginner",
    "order": 3
  },
  {
    "question": "Which export format is provided by DNSDumpster for offline spreadsheet analysis?",
    "options": [
      "Excel (.xlsx) spreadsheet",
      "Encrypted SQLite database only",
      "Raw binary PCAP capture",
      "PDF file with DRM protection"
    ],
    "correctAnswerIndex": 0,
    "explanation": "DNSDumpster allows users to download discovered host records directly as an Excel (.xlsx) file.",
    "difficulty": "Beginner",
    "order": 4
  },
  {
    "question": "An investigator inputs a target domain into DNSDumpster and observes an MX record pointing to `mail.protection.outlook.com`. What does this indicate?",
    "options": [
      "The target organization utilizes Microsoft 365 (Exchange Online) for corporate email handling",
      "The target organization hosts their own on-premise Postfix mail server",
      "The target organization has disabled all email communications",
      "The target domain is vulnerable to open mail relay exploitation"
    ],
    "correctAnswerIndex": 0,
    "explanation": "`mail.protection.outlook.com` is Microsoft's inbound mail gateway for Microsoft 365 / Exchange Online mailboxes.",
    "difficulty": "Intermediate",
    "order": 5
  }
];

module.exports = quizQuestions;
