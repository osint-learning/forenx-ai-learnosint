const quizQuestions = [
  {
    "question": "What is nslookup primarily used for in network administration and reconnaissance?",
    "options": [
      "Querying DNS servers to resolve hostnames, IPs, and DNS resource records",
      "Inspecting HTTP response headers from web application firewalls",
      "Monitoring real-time bandwidth usage on network routers",
      "Capturing raw packet payloads passing through network switches"
    ],
    "correctAnswerIndex": 0,
    "explanation": "nslookup (Name Server Lookup) is a built-in network utility used to query DNS servers for domain name or IP address mapping.",
    "difficulty": "Beginner",
    "order": 1
  },
  {
    "question": "Which command inside interactive nslookup changes the query type to retrieve Mail Exchange records?",
    "options": [
      "set type=mx",
      "type = mail",
      "query=mx",
      "mode mx"
    ],
    "correctAnswerIndex": 0,
    "explanation": "In nslookup, entering `set type=mx` (or `set q=mx`) configures queries to specifically request MX records.",
    "difficulty": "Beginner",
    "order": 2
  },
  {
    "question": "What does a 'Non-authoritative answer' header indicate in nslookup output?",
    "options": [
      "The response was retrieved from a caching server rather than the authoritative nameserver",
      "The queried domain name does not exist on the internet",
      "The DNS server returned an invalid or corrupted packet",
      "The domain registration has expired and is pending deletion"
    ],
    "correctAnswerIndex": 0,
    "explanation": "A non-authoritative answer means the responding DNS server answered from its local cache rather than holding the authoritative zone data.",
    "difficulty": "Intermediate",
    "order": 3
  },
  {
    "question": "How can an investigator instruct nslookup to query a specific DNS server (e.g., 1.1.1.1)?",
    "options": [
      "nslookup example.com 1.1.1.1",
      "nslookup -server 1.1.1.1:example.com",
      "nslookup --target example.com --ip 1.1.1.1",
      "nslookup example.com -> 1.1.1.1"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Appending the DNS server IP as the second argument (`nslookup <domain> <server>`) directs queries to that specific server.",
    "difficulty": "Beginner",
    "order": 4
  },
  {
    "question": "An analyst in interactive nslookup executes `ls -d target.com`. What operation is being attempted?",
    "options": [
      "DNS Zone Transfer (AXFR)",
      "Listing files in the target web root directory",
      "Subnet ping sweep",
      "Port scan on the target server"
    ],
    "correctAnswerIndex": 0,
    "explanation": "In interactive nslookup, `ls -d domain.com` requests a complete DNS zone transfer from the connected nameserver.",
    "difficulty": "Intermediate",
    "order": 5
  }
];

module.exports = quizQuestions;
