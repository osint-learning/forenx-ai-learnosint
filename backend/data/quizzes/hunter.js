const quizQuestions = [
  {
    "question": "What is Hunter.io primarily designed for in OSINT and reconnaissance workflows?",
    "options": [
      "Finding, verifying, and mapping professional corporate email addresses associated with a domain",
      "Cracking password hashes stored in Active Directory databases",
      "Scanning web servers for SQL injection flaws",
      "Tracking physical shipments using carrier tracking numbers"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Hunter.io is an OSINT platform designed to discover, verify, and identify email naming patterns for corporate domain names.",
    "difficulty": "Beginner",
    "order": 1
  },
  {
    "question": "What is the 'Domain Search' feature in Hunter.io used to retrieve?",
    "options": [
      "All indexed professional email addresses, employee names, and job roles associated with a target domain",
      "The full DNS zone file of the target domain",
      "The domain registrar's corporate financial balance sheet",
      "A list of all open TCP ports on the domain's web server"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Domain Search returns all public email addresses found on the web associated with the queried domain, along with names and roles.",
    "difficulty": "Beginner",
    "order": 2
  },
  {
    "question": "What does Hunter.io's 'Email Pattern' indicator (e.g., `{first}.{last}@company.com - 85%`) signify?",
    "options": [
      "The dominant standard format used by the organization for constructing employee email addresses",
      "The probability that the company's email server is vulnerable to spam",
      "The percentage of employee emails that have been leaked in data breaches",
      "The level of encryption applied to outbound corporate emails"
    ],
    "correctAnswerIndex": 0,
    "explanation": "The Email Pattern identifies the dominant convention (e.g., first.last, flast, first) used by the target company for email addresses.",
    "difficulty": "Intermediate",
    "order": 3
  },
  {
    "question": "How does Hunter.io substantiate the existence of a discovered email address?",
    "options": [
      "By listing the public web pages and sources where the email address was extracted and verified",
      "By sending automated test emails to the recipient's inbox",
      "By querying private government tax authority databases",
      "By authenticating directly to the company's webmail portal"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Hunter.io provides clickable source URLs showing the exact public web pages where the email address was indexed.",
    "difficulty": "Intermediate",
    "order": 4
  },
  {
    "question": "An investigator knows a Chief Information Security Officer's name is John Doe at `targetcorp.com` where the pattern is `{f}{last}@targetcorp.com`. What is the likely email?",
    "options": [
      "jdoe@targetcorp.com",
      "john.doe@targetcorp.com",
      "johndoe@targetcorp.com",
      "doe.j@targetcorp.com"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Applying the `{f}{last}` pattern (first initial + full last name) produces `jdoe@targetcorp.com`.",
    "difficulty": "Beginner",
    "order": 5
  }
];

module.exports = quizQuestions;
