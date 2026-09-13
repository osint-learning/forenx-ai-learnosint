const quizQuestions = [
  {
    "question": "What is the primary function of the Internet Archive's Wayback Machine in OSINT?",
    "options": [
      "Viewing historical snapshots and past iterations of websites across time",
      "Encrypting current web pages for offline archival storage",
      "Accelerating live web page loading speeds via global caching",
      "Bypassing paywalls on current subscription news websites"
    ],
    "correctAnswerIndex": 0,
    "explanation": "The Wayback Machine archives snapshots of public web pages across history, allowing researchers to view past website content.",
    "difficulty": "Beginner",
    "order": 1
  },
  {
    "question": "What does the Wayback Machine calendar view display for a queried URL?",
    "options": [
      "A historical timeline and dates with circular markers indicating when crawlers captured snapshots",
      "The personal calendar appointments of the website administrator",
      "The expiration dates of the domain's TLS certificates",
      "A schedule of future planned web server maintenance windows"
    ],
    "correctAnswerIndex": 0,
    "explanation": "The calendar interface displays year, month, and day markers indicating the dates and times snapshots were saved.",
    "difficulty": "Beginner",
    "order": 2
  },
  {
    "question": "Why is the Wayback Machine particularly valuable when an organization alters or removes a webpage?",
    "options": [
      "It preserves historical text, leadership directories, press releases, and downloadable documents that were deleted",
      "It forces the live web server to restore the deleted files",
      "It notifies the organization's legal team of content modifications",
      "It generates legal copyright infringement notices automatically"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Deleted or edited content remains preserved in archived snapshots, allowing analysts to recover past organizational information.",
    "difficulty": "Beginner",
    "order": 3
  },
  {
    "question": "What is the purpose of the Wayback CDX Server API in automated investigations?",
    "options": [
      "Programmatically querying, filtering, and extracting lists of all archived URLs and file paths for a domain",
      "Executing remote shell commands on Internet Archive servers",
      "Uploading live video recordings directly to the web archive",
      "Scanning archived pages for unpatched SQL injection flaws"
    ],
    "correctAnswerIndex": 0,
    "explanation": "The CDX API allows analysts to search and retrieve structured lists of all captured URLs, mime-types, and timestamps for a domain.",
    "difficulty": "Intermediate",
    "order": 4
  },
  {
    "question": "A company recently scrubbed their 'Team' page to hide executive names. How can an investigator recover the past team list?",
    "options": [
      "Access the URL in the Wayback Machine and view a snapshot captured prior to the scrubbing date",
      "Send an HTTP POST request to the web server's login endpoint",
      "Perform a WHOIS query on the domain nameserver",
      "Run an Nmap port scan against port 80"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Selecting a snapshot from before the modification date displays the page exactly as it appeared with the original executive list.",
    "difficulty": "Beginner",
    "order": 5
  }
];

module.exports = quizQuestions;
