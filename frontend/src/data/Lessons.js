const lessons = [
  {
    id: 1,
    slug: "what-is-osint",
    title: "What is OSINT?",
    shortDescription:
      "Learn the fundamentals of Open Source Intelligence and why it is important.",

    objectives: [
      "Understand Open Source Intelligence",
      "Learn where OSINT is used",
      "Identify common OSINT sources"
    ],

    content: `
Open Source Intelligence (OSINT) is the process of collecting,
analyzing and using publicly available information to produce
valuable intelligence.

OSINT information comes from websites, search engines,
social media, public records, government databases,
news articles and many other public sources.

Cybersecurity professionals use OSINT during reconnaissance,
threat intelligence, penetration testing and digital investigations.
`,

    keyPoints: [
      "Information is publicly available",
      "No unauthorized access is performed",
      "Used during reconnaissance",
      "Widely used in cybersecurity"
    ],

    example:
      "Example: Searching WHOIS information of a domain or finding publicly available DNS records."
  },

  {
    id: 2,
    slug: "intelligence-cycle",
    title: "Intelligence Cycle",
    shortDescription:
      "Understand the six stages of the intelligence cycle.",

    objectives: [
      "Understand every phase",
      "Learn how investigations progress"
    ],

    content: `
The Intelligence Cycle consists of six stages:

Planning
Collection
Processing
Analysis
Dissemination
Feedback

These stages transform raw data into useful intelligence.
`,

    keyPoints: [
      "Planning defines objectives",
      "Collection gathers data",
      "Analysis converts information into intelligence"
    ],

    example:
      "Example: Collect WHOIS, DNS and Metadata before analyzing a suspicious domain."
  },

  {
    id: 3,
    slug: "investigation-workflow",
    title: "Investigation Workflow",
    shortDescription:
      "Learn how cybersecurity investigations are performed.",

    objectives: [
      "Understand investigation steps",
      "Learn documentation process"
    ],

    content: `
A typical investigation begins with defining objectives.

Investigators collect evidence using OSINT tools,
analyze findings, verify evidence,
prepare reports and document conclusions.
`,

    keyPoints: [
      "Collect evidence",
      "Verify findings",
      "Document investigation"
    ],

    example:
      "Example: Investigating a phishing domain using WHOIS, DNS Lookup and VirusTotal."
  },

  {
    id: 4,
    slug: "ethics-legal",
    title: "Ethics & Legal Guidelines",
    shortDescription:
      "Learn responsible and ethical OSINT practices.",

    objectives: [
      "Understand legal considerations",
      "Learn ethical investigation"
    ],

    content: `
OSINT should only collect publicly available information.

Investigators should respect privacy,
follow applicable laws and avoid unauthorized access.

Ethical investigations help maintain trust and professionalism.
`,

    keyPoints: [
      "Respect privacy",
      "Use only public information",
      "Follow laws",
      "Document responsibly"
    ],

    example:
      "Example: Avoid collecting private information without permission."
  }
];

export default lessons;