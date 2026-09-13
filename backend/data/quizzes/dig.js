const quizQuestions = [
  {
    "question": "What is the primary advantage of `dig` over standard legacy DNS lookup tools?",
    "options": [
      "It provides flexible query options, detailed diagnostic sections, and clear protocol responses",
      "It can bypass all network firewalls automatically",
      "It crack password hashes stored in DNS TXT records",
      "It scans web servers for cross-site scripting vulnerabilities"
    ],
    "correctAnswerIndex": 0,
    "explanation": "dig (Domain Information Groper) is a powerful DNS diagnostic tool offering detailed output sections and extensive query customization.",
    "difficulty": "Beginner",
    "order": 1
  },
  {
    "question": "Which dig parameter produces a concise output containing only the answer IP address?",
    "options": [
      "+short",
      "+brief",
      "-quiet",
      "--minimal"
    ],
    "correctAnswerIndex": 0,
    "explanation": "The `+short` option suppresses comments and formatting, returning only the raw resolution data.",
    "difficulty": "Beginner",
    "order": 2
  },
  {
    "question": "Which section in standard dig output contains the authoritative DNS records satisfying the query?",
    "options": [
      "QUESTION SECTION",
      "ANSWER SECTION",
      "AUTHORITY SECTION",
      "ADDITIONAL SECTION"
    ],
    "correctAnswerIndex": 1,
    "explanation": "The ANSWER SECTION contains the resource records that directly answer the queried domain and record type.",
    "difficulty": "Beginner",
    "order": 3
  },
  {
    "question": "Which command tests for a full DNS zone transfer on a target nameserver using dig?",
    "options": [
      "dig @ns1.target.com target.com AXFR",
      "dig target.com +zone",
      "dig @ns1.target.com target.com -dump",
      "dig target.com --all-records"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Specifying the authoritative nameserver with `@server` and the query type `AXFR` initiates a DNS zone transfer request in dig.",
    "difficulty": "Intermediate",
    "order": 4
  },
  {
    "question": "An investigator queries reverse DNS with `dig -x 192.0.2.1`. What record type is being queried?",
    "options": [
      "PTR record",
      "A record",
      "CNAME record",
      "SOA record"
    ],
    "correctAnswerIndex": 0,
    "explanation": "The `-x` flag performs a reverse lookup, querying the PTR (Pointer) record in the in-addr.arpa domain.",
    "difficulty": "Intermediate",
    "order": 5
  }
];

module.exports = quizQuestions;
