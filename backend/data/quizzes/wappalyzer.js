const quizQuestions = [
  {
    "question": "What is Wappalyzer primarily used for by security analysts and OSINT researchers?",
    "options": [
      "Detecting web software stacks, CMS platforms, analytics tools, web servers, and frameworks on websites",
      "Scanning internal corporate firewalls for open TCP ports",
      "Intercepting and decrypting mobile cellular data traffic",
      "Creating automated social engineering phishing templates"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Wappalyzer is a technology profiler that uncovers technologies used on websites such as CMSs, frameworks, analytics, and ecommerce tools.",
    "difficulty": "Beginner",
    "order": 1
  },
  {
    "question": "How does the Wappalyzer browser extension detect client-side technologies in real time?",
    "options": [
      "By inspecting DOM elements, JavaScript global variables, HTTP headers, and script source URLs",
      "By sending active port scans to the visitor's local router",
      "By injecting tracking cookies into the user's operating system registry",
      "By downloading and decompiling web server binaries"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Wappalyzer examines HTML elements, JavaScript variables, cookies, and HTTP response headers loaded in the browser.",
    "difficulty": "Intermediate",
    "order": 2
  },
  {
    "question": "What is a major operational advantage of using Wappalyzer during passive reconnaissance?",
    "options": [
      "It gathers technology details during regular browsing without sending anomalous scanning traffic",
      "It automatically cracks password-protected admin directories",
      "It hides the investigator's MAC address from local switches",
      "It grants free access to commercial threat intelligence feeds"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Wappalyzer passively analyzes the content returned during standard page browsing without triggering security alarms or generating noise.",
    "difficulty": "Beginner",
    "order": 3
  },
  {
    "question": "What intelligence does Wappalyzer reveal when it detects third-party analytics and advertising trackers?",
    "options": [
      "Marketing tools and tracking IDs (e.g., Google Analytics ID) that can connect related websites owned by the same entity",
      "The server's physical CPU temperature and hardware chassis model",
      "The database root credentials for the hosting environment",
      "The private encryption keys used by site visitors"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Analytics and tracking scripts often contain unique account identifiers that allow investigators to link multiple websites together.",
    "difficulty": "Intermediate",
    "order": 4
  },
  {
    "question": "An analyst inspects a site with Wappalyzer and discovers `WordPress 6.4.1` with `WooCommerce 8.3.0`. What does this indicate?",
    "options": [
      "The site is an e-commerce platform running on the WordPress CMS with the WooCommerce plugin",
      "The web server is running an unmanaged Linux kernel without a firewall",
      "The domain name is currently expired and parked by a domain registrar",
      "The website is hosted on an isolated mainframe computer"
    ],
    "correctAnswerIndex": 0,
    "explanation": "The detected technologies show the site is built on the WordPress CMS and utilizes WooCommerce to handle online store functionality.",
    "difficulty": "Beginner",
    "order": 5
  }
];

module.exports = quizQuestions;
