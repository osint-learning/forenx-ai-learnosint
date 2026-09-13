const quizQuestions = [
  {
    "question": "What is Shodan's primary function as an OSINT search engine?",
    "options": [
      "Indexing Internet-connected devices, servers, webcams, industrial systems, and open service banners",
      "Indexing textual webpage content for keyword searches like Google",
      "Providing private anonymous web browsing via proxy relays",
      "Generating synthetic passwords for security testing"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Shodan crawls the internet to discover and index internet-connected devices, open ports, and server service banners.",
    "difficulty": "Beginner",
    "order": 1
  },
  {
    "question": "Which Shodan search filter restricts queries to devices located in a specific country?",
    "options": [
      "country:",
      "geo:",
      "location:",
      "region:"
    ],
    "correctAnswerIndex": 0,
    "explanation": "The `country:` filter restricts Shodan search results to a two-letter country code (e.g., `country:US`).",
    "difficulty": "Beginner",
    "order": 2
  },
  {
    "question": "What is a service 'banner' in Shodan terminology?",
    "options": [
      "The textual metadata and headers returned by a server when a connection is initiated",
      "An advertisement image displayed on top of a website",
      "The physical serial number engraved on a network router",
      "The graphic logo of the internet service provider"
    ],
    "correctAnswerIndex": 0,
    "explanation": "A service banner is the response string sent by a service upon connection, containing software names, versions, and configurations.",
    "difficulty": "Intermediate",
    "order": 3
  },
  {
    "question": "How do investigators use Shodan to discover exposed Industrial Control Systems (ICS)?",
    "options": [
      "By searching for protocol-specific ports and headers such as `port:502` for Modbus or SCADA keywords",
      "By sending remote shutdown signals to power grids",
      "By downloading proprietary PLC firmware source code",
      "By intercepting encrypted SCADA radio frequencies"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Filtering for industrial protocols (like Modbus port 502, BACnet port 47808, or Siemens S7) identifies exposed ICS/SCADA devices.",
    "difficulty": "Intermediate",
    "order": 4
  },
  {
    "question": "An investigator queries `org:\"Target Corporation\" port:3389` in Shodan. What is the investigator looking for?",
    "options": [
      "Exposed Microsoft Remote Desktop Protocol (RDP) servers owned by Target Corporation",
      "Web servers hosting HTTPS websites for Target Corporation",
      "Encrypted database clusters on port 3389",
      "Target Corporation employee home Wi-Fi routers"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Port 3389 is the default port for Microsoft RDP; combining it with `org:` identifies exposed remote desktops belonging to the organization.",
    "difficulty": "Intermediate",
    "order": 5
  }
];

module.exports = quizQuestions;
