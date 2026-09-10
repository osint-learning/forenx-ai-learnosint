const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Tool = require("../models/Tool");

dotenv.config();

const tools = [
  // =========================================================
  // 1. WHOIS
  // =========================================================
  {
    name: "WHOIS",
    category: "Domain Investigation",
    shortDescription:
      "Retrieve domain registration and registrar information.",
    description:
      "WHOIS is a domain registration lookup service used to investigate registration-related information for Internet domains. Depending on the registrar, registry, privacy settings, and resource type, results may include registrar information, registration dates, expiration dates, domain status, nameservers, and other registration metadata. In OSINT investigations, WHOIS is commonly used as an early pivot from a domain to additional infrastructure and historical clues.",
    purpose:
      "Use WHOIS to establish the registration context of a domain and identify useful investigation pivots such as registrar, nameservers, registration dates, and domain status.",
    whenToUse:
      "Use WHOIS during initial domain reconnaissance, infrastructure investigation, brand impersonation investigations, phishing analysis, and when establishing the history or administrative context of a domain.",
    difficulty: "Beginner",
    syntax: "whois <domain>",
    installation:
      "Windows: install a WHOIS client or use a reputable web-based WHOIS service. Linux: sudo apt install whois.",
    commands: [
      {
        command: "whois example.com",
        description:
          "Retrieve registration information for the specified domain.",
        expectedOutput:
          "Registrar, creation date, expiry date, domain status and nameserver information."
      },
      {
        command: "whois example.com | findstr /I \"Registrar Creation Expiry Name Server\"",
        description:
          "On Windows, filter important registration fields from command output.",
        expectedOutput:
          "Selected registrar, creation, expiry and nameserver fields."
      }
    ],
    examples: [
      "whois example.com",
      "whois example.org"
    ],
    sampleOutput:
      "Registrar: Example Registrar\nCreation Date: 2024-01-15\nRegistry Expiry Date: 2027-01-15\nName Server: ns1.example.net",
    outputExplanation:
      "Registrar identifies the registrar responsible for the domain. Creation and expiry dates provide timeline context. Nameservers can reveal hosting or DNS infrastructure relationships. Domain status values may indicate operational or transfer restrictions.",
    advantages: [
      "Useful during initial reconnaissance",
      "Provides domain timeline information",
      "Can reveal registrar and nameserver relationships",
      "Easy for beginners to understand"
    ],
    limitations: [
      "Privacy protection may hide registrant information",
      "Results vary between registries and registrars",
      "Registration information does not prove ownership",
      "Historical information may require separate services"
    ],
    bestPractices: [
      "Record the lookup date and time",
      "Correlate WHOIS with DNS and certificate data",
      "Do not treat registration data as identity proof",
      "Preserve original results when used as evidence"
    ],
    tags: ["whois", "domain", "registration", "registrar", "recon"],
    relatedTools: ["dnslookup", "crtsh", "securitytrails"]
  },

  // =========================================================
  // 2. DNS LOOKUP
  // =========================================================
  {
    name: "DNS Lookup",
    category: "Domain Investigation",
    shortDescription:
      "Inspect DNS records associated with a domain.",
    description:
      "DNS Lookup is used to examine records published for a domain. Common records include A, AAAA, MX, NS, TXT, CNAME and SOA. DNS information helps investigators understand how a domain is connected to IP addresses, mail infrastructure, nameservers, verification services and other domains.",
    purpose:
      "Map domain names to infrastructure and identify useful DNS-based investigation pivots.",
    whenToUse:
      "Use DNS lookup after identifying a domain and whenever you need to understand its hosting, mail, nameserver or verification infrastructure.",
    difficulty: "Beginner",
    syntax: "nslookup <domain>",
    installation:
      "Windows: nslookup is normally included with Windows. Linux: use dig or install dnsutils.",
    commands: [
      {
        command: "nslookup example.com",
        description: "Resolve the domain to an IP address.",
        expectedOutput: "Name and associated IP address."
      },
      {
        command: "nslookup -type=MX example.com",
        description: "Retrieve mail exchange records.",
        expectedOutput: "MX hostnames and priorities."
      },
      {
        command: "nslookup -type=NS example.com",
        description: "Retrieve authoritative nameservers.",
        expectedOutput: "Nameserver hostnames."
      },
      {
        command: "nslookup -type=TXT example.com",
        description: "Retrieve TXT records.",
        expectedOutput: "Text records such as SPF or verification values."
      }
    ],
    examples: [
      "nslookup example.com",
      "nslookup -type=MX example.com",
      "nslookup -type=NS example.com",
      "nslookup -type=TXT example.com"
    ],
    sampleOutput:
      "Name: example.com\nAddress: 93.184.216.34",
    outputExplanation:
      "A and AAAA records map names to IPv4 and IPv6 addresses. MX records identify mail servers. NS records identify authoritative DNS servers. TXT records can contain SPF, verification or other published information.",
    advantages: [
      "Built into many operating systems",
      "Fast infrastructure discovery",
      "Useful for multiple DNS record types",
      "Excellent first reconnaissance step"
    ],
    limitations: [
      "DNS results can change frequently",
      "Some records may not be publicly available",
      "DNS alone does not prove ownership",
      "CDNs can obscure origin infrastructure"
    ],
    bestPractices: [
      "Check several record types",
      "Record DNS results with timestamps",
      "Compare results from multiple resolvers when appropriate",
      "Correlate IPs with certificate and hosting information"
    ],
    tags: ["dns", "records", "a", "mx", "ns", "txt"],
    relatedTools: ["whois", "dig", "dnsrecon"]
  },

  // =========================================================
  // 3. THEHARVESTER
  // =========================================================
  {
    name: "theHarvester",
    category: "Email Investigation",
    shortDescription:
      "Collect public emails, hosts, names and subdomains.",
    description:
      "theHarvester is an OSINT collection tool designed to gather publicly available information related to a target domain. Depending on configured sources, it can discover email addresses, hostnames, subdomains, employee names and other externally visible information. It is particularly useful during early reconnaissance because it helps establish an organization's publicly exposed footprint.",
    purpose:
      "Build an initial external footprint of an organization from publicly available sources.",
    whenToUse:
      "Use it during authorized reconnaissance when you need public email addresses, subdomains, hostnames or related organizational information.",
    difficulty: "Beginner",
    syntax: "theHarvester -d <domain> -b <source>",
    installation:
      "Clone the official project repository and install its Python dependencies. Follow the current project documentation for supported installation methods.",
    commands: [
      {
        command: "theHarvester -d example.com -b google",
        description: "Search a selected public source for target information.",
        expectedOutput: "Discovered emails, hosts or related public information."
      },
      {
        command: "theHarvester -d example.com -b all",
        description: "Use available configured sources.",
        expectedOutput: "Aggregated public reconnaissance results."
      }
    ],
    examples: [
      "theHarvester -d example.com -b google",
      "theHarvester -d example.com -b bing"
    ],
    sampleOutput:
      "Emails found: 8\nHosts found: 14\nwww.example.com\nmail.example.com",
    outputExplanation:
      "Emails provide potential organizational identifiers, while hosts and subdomains expand the investigation scope. Every discovered item should be verified independently before being treated as a confirmed finding.",
    advantages: [
      "Automates multiple reconnaissance tasks",
      "Useful for email discovery",
      "Can identify additional hosts",
      "Good beginner reconnaissance tool"
    ],
    limitations: [
      "Source availability changes",
      "Results may contain false positives",
      "Some sources require API keys",
      "Rate limits can affect collection"
    ],
    bestPractices: [
      "Use only authorized targets",
      "Verify discovered emails and hosts",
      "Record the source of every finding",
      "Avoid assuming discovered employees are current"
    ],
    tags: ["email", "recon", "harvesting", "subdomain"],
    relatedTools: ["whois", "subfinder", "hunter"]
  },

  // =========================================================
  // 4. SHERLOCK
  // =========================================================
  {
    name: "Sherlock",
    category: "Username Investigation",
    shortDescription:
      "Search for usernames across many public social platforms.",
    description:
      "Sherlock is a username enumeration tool that checks whether a supplied username appears on a large collection of websites. It can help investigators identify possible account reuse and generate leads for further verification. A positive result should be considered a lead rather than proof that the same person controls every account.",
    purpose:
      "Discover possible reuse of a username across public websites.",
    whenToUse:
      "Use during authorized username investigations, digital footprint analysis and identity research involving publicly available information.",
    difficulty: "Beginner",
    syntax: "sherlock <username>",
    installation:
      "Install Sherlock using its current official Python installation instructions.",
    commands: [
      {
        command: "sherlock username123",
        description: "Search the username across supported websites.",
        expectedOutput: "List of possible profile URLs."
      },
      {
        command: "sherlock username123 --print-found",
        description: "Display found profiles.",
        expectedOutput: "Potential matching profiles."
      }
    ],
    examples: [
      "sherlock analyst01",
      "sherlock cyberstudent"
    ],
    sampleOutput:
      "[+] GitHub: https://github.com/username123\n[+] Reddit: https://reddit.com/u/username123",
    outputExplanation:
      "Each result represents a possible username match. Investigators should compare profile metadata, profile images, writing style, dates and other independent indicators before linking accounts.",
    advantages: [
      "Fast username enumeration",
      "Broad website coverage",
      "Simple command-line interface",
      "Useful for OSINT pivoting"
    ],
    limitations: [
      "Username collisions are common",
      "Websites change their behavior",
      "False positives are possible",
      "A result does not establish identity"
    ],
    bestPractices: [
      "Treat results as leads",
      "Manually verify important matches",
      "Compare multiple independent attributes",
      "Respect platform terms and privacy expectations"
    ],
    tags: ["username", "social-media", "identity", "osint"],
    relatedTools: ["maigret", "whatsmyname", "holehe"]
  },

  // =========================================================
  // 5. VIRUSTOTAL
  // =========================================================
  {
    name: "VirusTotal",
    category: "Threat Intelligence",
    shortDescription:
      "Analyze domains, URLs, IP addresses and file indicators.",
    description:
      "VirusTotal is a threat intelligence platform that aggregates information from multiple security engines and datasets. Investigators can use it to examine indicators such as domains, URLs, IP addresses and file hashes. It can provide detection results, relationships, historical observations and community intelligence depending on the indicator and available data.",
    purpose:
      "Enrich suspicious indicators with threat intelligence from multiple sources.",
    whenToUse:
      "Use when investigating suspicious domains, URLs, IP addresses or file hashes and when validating whether an indicator has previous security observations.",
    difficulty: "Beginner",
    syntax: "Use the VirusTotal web interface or API.",
    installation:
      "No local installation is required for the web interface. API usage requires an API key and follows VirusTotal's current API documentation.",
    commands: [
      {
        command: "Search VirusTotal for example.com",
        description: "Review intelligence associated with a domain.",
        expectedOutput: "Detection, reputation and relationship information."
      },
      {
        command: "Search VirusTotal for an IP address",
        description: "Inspect intelligence associated with an IP indicator.",
        expectedOutput: "Reputation and observed relationships."
      }
    ],
    examples: [
      "Investigate a suspicious domain",
      "Check a file hash",
      "Review URL detections"
    ],
    sampleOutput:
      "Detection ratio: 2/90\nCommunity reputation: suspicious\nRelated URLs: available",
    outputExplanation:
      "Detection counts indicate how many participating engines classified an indicator. A low or zero detection count does not prove that an indicator is safe.",
    advantages: [
      "Multiple intelligence sources",
      "Supports several indicator types",
      "Useful for enrichment",
      "Provides historical relationships for some indicators"
    ],
    limitations: [
      "Detection results can disagree",
      "Fresh indicators may have little history",
      "Some information requires account/API access",
      "Community content requires careful validation"
    ],
    bestPractices: [
      "Never rely on a single detection",
      "Compare timestamps",
      "Correlate with other intelligence sources",
      "Avoid uploading sensitive files without authorization"
    ],
    tags: ["virustotal", "threat-intelligence", "ioc", "malware"],
    relatedTools: ["shodan", "urlscan", "censys"]
  },

  // =========================================================
  // 6. NSLOOKUP
  // =========================================================
  {
    name: "nslookup",
    category: "Domain Investigation",
    shortDescription: "Query DNS records from the command line.",
    description:
      "nslookup is a command-line DNS diagnostic utility available on Windows and other systems. It can query DNS records, identify DNS servers and help troubleshoot name resolution. For OSINT, it provides a lightweight way to inspect domain-to-infrastructure relationships.",
    purpose:
      "Perform quick DNS resolution and record inspection.",
    whenToUse:
      "Use for quick domain resolution, MX/NS/TXT checks and basic DNS troubleshooting.",
    difficulty: "Beginner",
    syntax: "nslookup [-type=record] <domain>",
    installation:
      "Usually included with Windows. Linux systems may provide it through the dnsutils package.",
    commands: [
      {
        command: "nslookup example.com",
        description: "Resolve a domain.",
        expectedOutput: "DNS server and resolved IP address."
      },
      {
        command: "nslookup -type=MX example.com",
        description: "Query MX records.",
        expectedOutput: "Mail server records."
      }
    ],
    examples: [
      "nslookup example.com",
      "nslookup -type=NS example.com",
      "nslookup -type=TXT example.com"
    ],
    sampleOutput:
      "Name: example.com\nAddress: 93.184.216.34",
    outputExplanation:
      "The returned address represents the DNS resolution observed by the selected resolver.",
    advantages: ["Built into Windows", "Fast", "Easy to learn"],
    limitations: ["Limited compared with specialized DNS tools", "Resolver-dependent results"],
    bestPractices: ["Record resolver information", "Check multiple record types"],
    tags: ["dns", "windows", "lookup"],
    relatedTools: ["dig", "dnsrecon", "fierce"]
  },

  // =========================================================
  // 7. DIG
  // =========================================================
  {
    name: "dig",
    category: "Domain Investigation",
    shortDescription: "Perform detailed DNS queries and diagnostics.",
    description:
      "dig is a flexible DNS query utility commonly used by security professionals and administrators. It provides detailed DNS response information including answer sections, authority information, TTL values and DNS server details. Its structured output makes it useful for deeper DNS analysis.",
    purpose:
      "Perform detailed and controlled DNS queries.",
    whenToUse:
      "Use when basic DNS lookup is insufficient and you need detailed DNS response information.",
    difficulty: "Intermediate",
    syntax: "dig <domain> <record-type>",
    installation:
      "Linux: install dnsutils or the equivalent package. Windows users can use a compatible DNS utility or WSL.",
    commands: [
      {
        command: "dig example.com A",
        description: "Query IPv4 address records.",
        expectedOutput: "A record answer with TTL."
      },
      {
        command: "dig example.com MX",
        description: "Query mail exchange records.",
        expectedOutput: "MX records and priorities."
      },
      {
        command: "dig example.com NS",
        description: "Query nameservers.",
        expectedOutput: "Authoritative nameserver records."
      }
    ],
    examples: [
      "dig example.com A",
      "dig example.com MX",
      "dig example.com TXT"
    ],
    sampleOutput:
      "example.com. 300 IN A 93.184.216.34",
    outputExplanation:
      "TTL indicates how long a response can normally be cached. Record type and value describe the relationship being queried.",
    advantages: ["Detailed output", "Flexible", "Excellent DNS troubleshooting"],
    limitations: ["Less beginner-friendly", "Usually requires Linux/WSL on Windows"],
    bestPractices: ["Understand record types", "Compare authoritative and recursive responses"],
    tags: ["dns", "dig", "records", "recon"],
    relatedTools: ["nslookup", "dnsrecon", "dnsenum"]
  },

  // =========================================================
  // 8. DNSRECON
  // =========================================================
  {
    name: "dnsrecon",
    category: "Domain Investigation",
    shortDescription: "Automate DNS reconnaissance and enumeration.",
    description:
      "dnsrecon automates several DNS reconnaissance activities including record enumeration and discovery of DNS-related information. It can help investigators organize DNS findings more efficiently than performing every query manually.",
    purpose:
      "Automate structured DNS reconnaissance.",
    whenToUse:
      "Use during authorized domain reconnaissance when multiple DNS record types need to be collected efficiently.",
    difficulty: "Intermediate",
    syntax: "dnsrecon -d <domain>",
    installation:
      "Install dnsrecon according to the current project documentation and Python environment requirements.",
    commands: [
      {
        command: "dnsrecon -d example.com",
        description: "Perform standard DNS enumeration.",
        expectedOutput: "Discovered DNS records and nameservers."
      }
    ],
    examples: [
      "dnsrecon -d example.com"
    ],
    sampleOutput:
      "[*] A example.com 93.184.216.34\n[*] NS ns1.example.com",
    outputExplanation:
      "Each record represents a DNS relationship discovered during enumeration.",
    advantages: ["Automates repetitive queries", "Useful for reconnaissance"],
    limitations: ["Active techniques may generate traffic", "Results depend on DNS configuration"],
    bestPractices: ["Use only authorized domains", "Prefer passive collection when appropriate"],
    tags: ["dns", "enumeration", "recon"],
    relatedTools: ["dnsenum", "fierce", "amass"]
  },

  // =========================================================
  // 9. DNSENUM
  // =========================================================
  {
    name: "dnsenum",
    category: "Domain Investigation",
    shortDescription: "Enumerate DNS infrastructure and related records.",
    description:
      "dnsenum is a DNS enumeration utility designed to gather domain DNS information and identify related infrastructure. It can assist with nameserver discovery, record collection and subdomain-related reconnaissance.",
    purpose:
      "Collect DNS information and expand a domain's visible infrastructure.",
    whenToUse:
      "Use during authorized DNS enumeration and infrastructure mapping.",
    difficulty: "Intermediate",
    syntax: "dnsenum <domain>",
    installation:
      "Install through the package manager available on your operating system or follow the current project documentation.",
    commands: [
      {
        command: "dnsenum example.com",
        description: "Perform DNS enumeration.",
        expectedOutput: "DNS records and discovered infrastructure."
      }
    ],
    examples: ["dnsenum example.com"],
    sampleOutput:
      "NS records, MX records, A records and discovered hosts.",
    outputExplanation:
      "The output provides multiple DNS relationships that can be used as investigation pivots.",
    advantages: ["Automated enumeration", "Useful for DNS mapping"],
    limitations: ["May generate network traffic", "Some features depend on environment"],
    bestPractices: ["Use authorized targets", "Verify findings independently"],
    tags: ["dns", "enumeration"],
    relatedTools: ["dnsrecon", "fierce", "dig"]
  },

  // =========================================================
  // 10. FIERCE
  // =========================================================
  {
    name: "Fierce",
    category: "Domain Investigation",
    shortDescription: "Perform DNS reconnaissance and discover related hosts.",
    description:
      "Fierce is a DNS reconnaissance tool designed to help discover DNS infrastructure and related hosts associated with a target domain. It is useful for building an external attack-surface view during authorized reconnaissance.",
    purpose:
      "Discover DNS-related hosts and expand the known domain infrastructure.",
    whenToUse:
      "Use during authorized domain reconnaissance when DNS-based host discovery is required.",
    difficulty: "Intermediate",
    syntax: "fierce --domain <domain>",
    installation:
      "Install Fierce using its current official project instructions.",
    commands: [
      {
        command: "fierce --domain example.com",
        description: "Perform DNS reconnaissance.",
        expectedOutput: "Nameservers and discovered host information."
      }
    ],
    examples: ["fierce --domain example.com"],
    sampleOutput:
      "Found nameserver: ns1.example.com\nFound host: mail.example.com",
    outputExplanation:
      "Discovered hosts should be validated through DNS and other independent sources.",
    advantages: ["Useful DNS reconnaissance", "Can expand infrastructure visibility"],
    limitations: ["Some techniques can be active", "DNS configuration affects results"],
    bestPractices: ["Use authorized domains", "Prefer passive methods where appropriate"],
    tags: ["dns", "recon", "hosts"],
    relatedTools: ["dnsrecon", "dnsenum", "amass"]
  },

  // =========================================================
  // 11. SUBFINDER
  // =========================================================
  {
    name: "Subfinder",
    category: "Domain Investigation",
    shortDescription: "Discover subdomains using passive sources.",
    description:
      "Subfinder is a passive subdomain discovery tool that aggregates results from supported public sources. It is useful for building an initial inventory of subdomains without relying primarily on direct probing of the target.",
    purpose:
      "Discover publicly known subdomains and expand the visible attack surface.",
    whenToUse:
      "Use during authorized reconnaissance when you need a passive subdomain inventory.",
    difficulty: "Beginner",
    syntax: "subfinder -d <domain>",
    installation:
      "Install the current release using the official project instructions.",
    commands: [
      {
        command: "subfinder -d example.com",
        description: "Discover subdomains for a domain.",
        expectedOutput: "List of discovered subdomains."
      }
    ],
    examples: [
      "subfinder -d example.com",
      "subfinder -d example.com -silent"
    ],
    sampleOutput:
      "api.example.com\nmail.example.com\nportal.example.com",
    outputExplanation:
      "Each hostname expands the known domain footprint and can become a pivot for additional analysis.",
    advantages: ["Passive discovery", "Fast", "Good source aggregation"],
    limitations: ["Coverage depends on data sources", "Results require validation"],
    bestPractices: ["Validate discovered names", "Record source and timestamp"],
    tags: ["subdomain", "passive", "recon"],
    relatedTools: ["amass", "assetfinder", "dnsrecon"]
  },

  // =========================================================
  // 12. AMASS
  // =========================================================
  {
    name: "Amass",
    category: "Domain Investigation",
    shortDescription: "Map external assets and discover subdomains.",
    description:
      "Amass is a comprehensive attack-surface and asset discovery framework. It can combine multiple passive and active discovery techniques to identify domains, subdomains, addresses and relationships. Its broader discovery capabilities make it suitable for more advanced reconnaissance workflows.",
    purpose:
      "Build a comprehensive map of an organization's externally visible domain infrastructure.",
    whenToUse:
      "Use for authorized attack-surface discovery and deeper domain enumeration.",
    difficulty: "Advanced",
    syntax: "amass enum -passive -d <domain>",
    installation:
      "Install the current Amass release using official project instructions.",
    commands: [
      {
        command: "amass enum -passive -d example.com",
        description: "Perform passive enumeration.",
        expectedOutput: "Discovered subdomains and related names."
      }
    ],
    examples: [
      "amass enum -passive -d example.com"
    ],
    sampleOutput:
      "api.example.com\nvpn.example.com\ndev.example.com",
    outputExplanation:
      "The discovered assets can be correlated with DNS, certificates and technology information.",
    advantages: ["Broad discovery", "Passive and active modes", "Relationship mapping"],
    limitations: ["More complex", "Some techniques are active", "Configuration can be extensive"],
    bestPractices: ["Understand passive versus active modes", "Use authorized targets"],
    tags: ["amass", "subdomain", "attack-surface"],
    relatedTools: ["subfinder", "assetfinder", "crtsh"]
  },

  // =========================================================
  // 13. ASSETFINDER
  // =========================================================
  {
    name: "Assetfinder",
    category: "Domain Investigation",
    shortDescription: "Find related domains and subdomains.",
    description:
      "Assetfinder is a lightweight reconnaissance tool for discovering domains and subdomains related to a target organization. It is useful as a quick first-pass asset discovery utility.",
    purpose:
      "Quickly collect known related hostnames and domains.",
    whenToUse:
      "Use during initial authorized reconnaissance before deeper enumeration.",
    difficulty: "Beginner",
    syntax: "assetfinder <domain>",
    installation:
      "Install the current release following the project's official instructions.",
    commands: [
      {
        command: "assetfinder example.com",
        description: "Search for related assets.",
        expectedOutput: "Related domains and subdomains."
      }
    ],
    examples: ["assetfinder example.com"],
    sampleOutput:
      "api.example.com\nblog.example.com",
    outputExplanation:
      "Results represent candidate assets that should be verified.",
    advantages: ["Fast", "Simple", "Useful for initial discovery"],
    limitations: ["Smaller scope than comprehensive frameworks", "Results require validation"],
    bestPractices: ["Combine with other passive sources"],
    tags: ["assetfinder", "domains", "subdomains"],
    relatedTools: ["subfinder", "amass", "crtsh"]
  },

  // =========================================================
  // 14. MAIGRET
  // =========================================================
  {
    name: "Maigret",
    category: "Username Investigation",
    shortDescription: "Search usernames across many websites.",
    description:
      "Maigret performs username searches across a large set of websites and can collect information associated with potential profile matches. It is useful for digital footprint investigations and username pivoting.",
    purpose:
      "Identify possible online accounts associated with a username.",
    whenToUse:
      "Use when a username is known and authorized OSINT research requires identifying possible public profiles.",
    difficulty: "Intermediate",
    syntax: "maigret <username>",
    installation:
      "Install Maigret according to its current Python project documentation.",
    commands: [
      {
        command: "maigret username123",
        description: "Search supported sites.",
        expectedOutput: "Potential account matches."
      }
    ],
    examples: ["maigret username123"],
    sampleOutput:
      "GitHub: found\nReddit: found\nForum: not found",
    outputExplanation:
      "Results should be manually validated because identical usernames can belong to unrelated people.",
    advantages: ["Broad site coverage", "Useful username pivoting"],
    limitations: ["False positives", "Site changes can affect detection"],
    bestPractices: ["Correlate profile attributes", "Never assume identity from username alone"],
    tags: ["username", "social", "identity"],
    relatedTools: ["sherlock", "whatsmyname"]
  },

  // =========================================================
  // 15. WHATS MY NAME
  // =========================================================
  {
    name: "WhatsMyName",
    category: "Username Investigation",
    shortDescription: "Check username availability across online services.",
    description:
      "WhatsMyName is a username investigation resource that helps researchers determine whether a username may exist across numerous online services. It is useful for generating leads in digital footprint investigations.",
    purpose:
      "Identify possible reuse of a username across public services.",
    whenToUse:
      "Use when investigating a known username and building a list of potential online identities.",
    difficulty: "Beginner",
    syntax: "Search username through the WhatsMyName service.",
    installation:
      "No traditional installation is required for the web resource.",
    commands: [],
    examples: [
      "Search for username123",
      "Compare discovered profiles"
    ],
    sampleOutput:
      "Potential matches across multiple services.",
    outputExplanation:
      "A match indicates that a username appears to exist on a service; additional evidence is required to associate it with a specific person.",
    advantages: ["Easy to use", "Broad username coverage"],
    limitations: ["Username collisions", "Results can become outdated"],
    bestPractices: ["Verify profiles independently"],
    tags: ["username", "osint", "social"],
    relatedTools: ["sherlock", "maigret"]
  },

  // =========================================================
  // 16. HOLEHE
  // =========================================================
  {
    name: "Holehe",
    category: "Email Investigation",
    shortDescription: "Check whether an email may be registered on services.",
    description:
      "Holehe is designed to investigate whether an email address is associated with accounts on supported online services using publicly observable account-recovery or registration behavior. It can generate leads during authorized email investigations.",
    purpose:
      "Identify possible service associations for an email address.",
    whenToUse:
      "Use during authorized digital footprint research involving an email address.",
    difficulty: "Intermediate",
    syntax: "holehe <email>",
    installation:
      "Install Holehe according to the current project instructions.",
    commands: [
      {
        command: "holehe example@example.com",
        description: "Check supported services.",
        expectedOutput: "Service-by-service availability results."
      }
    ],
    examples: ["holehe analyst@example.com"],
    sampleOutput:
      "example-service: registered\nanother-service: not found",
    outputExplanation:
      "Results indicate observable account behavior, not necessarily confirmed ownership.",
    advantages: ["Automates email pivoting", "Useful for investigations"],
    limitations: ["Services change workflows", "False positives/negatives possible"],
    bestPractices: ["Use only authorized addresses", "Treat results as leads"],
    tags: ["email", "account", "osint"],
    relatedTools: ["hunter", "theharvester"]
  },

  // =========================================================
  // 17. PHONEINFOGA
  // =========================================================
  {
    name: "PhoneInfoga",
    category: "Phone Investigation",
    shortDescription: "Gather publicly available information about phone numbers.",
    description:
      "PhoneInfoga assists with phone number reconnaissance by collecting publicly available information and identifying possible metadata such as country, carrier or number type depending on available sources.",
    purpose:
      "Perform initial OSINT reconnaissance on a phone number.",
    whenToUse:
      "Use during authorized phone-number investigations where publicly available information is being assessed.",
    difficulty: "Intermediate",
    syntax: "phoneinfoga scan -n <number>",
    installation:
      "Install the current PhoneInfoga release using official project instructions.",
    commands: [
      {
        command: "phoneinfoga scan -n +15551234567",
        description: "Perform reconnaissance on a phone number.",
        expectedOutput: "Country, carrier or related public information where available."
      }
    ],
    examples: [
      "phoneinfoga scan -n +15551234567"
    ],
    sampleOutput:
      "Country: US\nCarrier: Example Carrier\nType: mobile",
    outputExplanation:
      "Returned metadata can help establish context but should not be interpreted as proof of the person's identity or location.",
    advantages: ["Phone-focused reconnaissance", "Useful pivot"],
    limitations: ["Coverage depends on sources", "Privacy protections limit results"],
    bestPractices: ["Use lawful authorization", "Do not infer sensitive attributes from limited metadata"],
    tags: ["phone", "osint", "carrier"],
    relatedTools: ["truecaller", "theharvester"]
  },

  // =========================================================
  // 18. GOOGLE DORKING
  // =========================================================
  {
    name: "Google Dorking",
    category: "Google Dorking",
    shortDescription: "Use advanced search operators for targeted discovery.",
    description:
      "Google Dorking refers to using advanced search operators to narrow public search results. Operators such as site:, filetype:, intitle:, inurl: and exact-phrase searches can help researchers locate publicly indexed information more efficiently. Dorking should be used responsibly and only for lawful OSINT research.",
    purpose:
      "Perform precise searches across publicly indexed web content.",
    whenToUse:
      "Use when normal keyword searches produce too many results or when a specific website, file type, URL pattern or phrase needs to be investigated.",
    difficulty: "Beginner",
    syntax: "operator:value keyword",
    installation:
      "No installation required; use a supported search engine.",
    commands: [
      {
        command: "site:example.com security",
        description: "Limit results to a specific domain.",
        expectedOutput: "Search results from example.com."
      },
      {
        command: "site:example.com filetype:pdf report",
        description: "Find indexed PDF documents.",
        expectedOutput: "PDF results related to the search term."
      },
      {
        command: "site:example.com inurl:login",
        description: "Search indexed URLs containing a pattern.",
        expectedOutput: "Potentially matching indexed pages."
      }
    ],
    examples: [
      "site:example.com filetype:pdf",
      "site:example.com intitle:report",
      "site:example.com inurl:login"
    ],
    sampleOutput:
      "Search engine results matching the specified operators.",
    outputExplanation:
      "Operators constrain the search engine's index. Results depend on what the search engine has indexed and can change over time.",
    advantages: ["Powerful discovery", "No installation", "Beginner-friendly"],
    limitations: ["Only indexed content is discoverable", "Search syntax changes", "Results can be incomplete"],
    bestPractices: ["Use precise queries", "Respect website policies", "Do not attempt unauthorized access"],
    tags: ["google", "dorking", "search", "osint"],
    relatedTools: ["google", "bing", "duckduckgo"]
  },

  // =========================================================
  // 19. GOOGLE LENS
  // =========================================================
  {
    name: "Google Lens",
    category: "Metadata Analysis",
    shortDescription: "Perform visual search and image-based investigation.",
    description:
      "Google Lens provides visual search capabilities that can identify objects, locate visually similar images, recognize text and connect images with web information. In OSINT, it can assist with image verification, source discovery and visual context analysis.",
    purpose:
      "Use visual information as a search pivot.",
    whenToUse:
      "Use when an image is available but its source, context, location or related online appearances are unknown.",
    difficulty: "Beginner",
    syntax: "Upload or provide an image through Google Lens.",
    installation: "No local installation required.",
    commands: [],
    examples: [
      "Reverse-search a public image",
      "Extract visible text from an image",
      "Find visually similar images"
    ],
    sampleOutput:
      "Visually similar images, extracted text and related web results.",
    outputExplanation:
      "Similarity results are leads. Investigators should compare image content, timestamps, cropping and source context.",
    advantages: ["Easy visual searching", "Text recognition", "Useful for image pivots"],
    limitations: ["Similarity does not prove source", "Results depend on index coverage"],
    bestPractices: ["Compare multiple sources", "Preserve original image", "Record search date"],
    tags: ["image", "reverse-search", "visual-osint"],
    relatedTools: ["exiftool", "wayback", "google"]
  },

  // =========================================================
  // 20. EXIFTOOL
  // =========================================================
  {
    name: "ExifTool",
    category: "Metadata Analysis",
    shortDescription: "Extract metadata from images, documents and media.",
    description:
      "ExifTool is a powerful metadata reading and writing utility supporting many file formats. It can reveal metadata such as timestamps, camera information, software, GPS coordinates, document authors and other embedded attributes when those fields are present.",
    purpose:
      "Extract and analyze metadata from digital evidence files.",
    whenToUse:
      "Use when investigating images, PDFs, office documents or other files where metadata may provide useful contextual information.",
    difficulty: "Beginner",
    syntax: "exiftool <file>",
    installation:
      "Download the current ExifTool release for Windows or install it through your operating system package manager.",
    commands: [
      {
        command: "exiftool image.jpg",
        description: "Display available metadata.",
        expectedOutput: "Metadata fields and values."
      },
      {
        command: "exiftool -gpslatitude -gpslongitude image.jpg",
        description: "Display GPS-related metadata when present.",
        expectedOutput: "GPS latitude and longitude fields."
      },
      {
        command: "exiftool -a -u -g1 file.pdf",
        description: "Display a broader set of metadata fields.",
        expectedOutput: "Grouped metadata information."
      }
    ],
    examples: [
      "exiftool image.jpg",
      "exiftool -gpslatitude -gpslongitude image.jpg",
      "exiftool document.pdf"
    ],
    sampleOutput:
      "Camera Model Name: Example Camera\nCreate Date: 2026:01:10 12:30:00",
    outputExplanation:
      "Metadata fields describe information embedded in the file. Their reliability depends on how the file was created, transferred and modified.",
    advantages: ["Very broad format support", "Powerful CLI", "Detailed metadata"],
    limitations: ["Metadata may be removed", "Fields can be modified", "Not every file contains useful metadata"],
    bestPractices: ["Preserve original evidence", "Hash original files", "Do not modify evidence during analysis"],
    tags: ["metadata", "exif", "gps", "forensics"],
    relatedTools: ["googlelens", "wayback"]
  },

  // =========================================================
  // 21. WHATWEB
  // =========================================================
  {
    name: "WhatWeb",
    category: "Domain Investigation",
    shortDescription: "Identify technologies used by websites.",
    description:
      "WhatWeb is a web technology fingerprinting tool that identifies technologies, frameworks, server software, plugins and other characteristics exposed by websites. It can help investigators understand the technology stack associated with an Internet-facing service.",
    purpose:
      "Identify publicly observable web technologies.",
    whenToUse:
      "Use during authorized web reconnaissance and attack-surface assessment.",
    difficulty: "Intermediate",
    syntax: "whatweb <url>",
    installation:
      "Install WhatWeb according to its current project documentation.",
    commands: [
      {
        command: "whatweb https://example.com",
        description: "Fingerprint the target website.",
        expectedOutput: "Detected technologies and server information."
      }
    ],
    examples: ["whatweb https://example.com"],
    sampleOutput:
      "HTTPServer, HTML5, JavaScript framework and detected web technologies.",
    outputExplanation:
      "Technology fingerprints are indicators rather than absolute proof because websites can hide or spoof technology signatures.",
    advantages: ["Fast fingerprinting", "Useful for reconnaissance"],
    limitations: ["Fingerprints can be inaccurate", "Some technologies are hidden"],
    bestPractices: ["Correlate with HTTP headers and source code", "Use authorized targets"],
    tags: ["technology", "web", "fingerprinting"],
    relatedTools: ["wappalyzer", "nmap"]
  },

  // =========================================================
  // 22. WAPPALYZER
  // =========================================================
  {
    name: "Wappalyzer",
    category: "Domain Investigation",
    shortDescription: "Identify web technologies and services.",
    description:
      "Wappalyzer analyzes websites and identifies technologies such as content management systems, JavaScript frameworks, analytics platforms, hosting services and other detectable components. It is useful for quickly understanding the visible technology stack of a website.",
    purpose:
      "Build a technology profile of a website.",
    whenToUse:
      "Use during web reconnaissance, technology profiling and investigation of exposed software components.",
    difficulty: "Beginner",
    syntax: "Analyze a website using Wappalyzer.",
    installation: "Use the web service or browser extension.",
    commands: [],
    examples: [
      "Analyze https://example.com",
      "Compare technology stacks of related domains"
    ],
    sampleOutput:
      "CMS: Example CMS\nAnalytics: Example Analytics\nFramework: Example Framework",
    outputExplanation:
      "Detected technologies represent observable fingerprints and should be validated using additional evidence.",
    advantages: ["Easy interface", "Fast technology discovery"],
    limitations: ["Detection can be incomplete", "Technology signatures can change"],
    bestPractices: ["Cross-check with WhatWeb and HTTP headers"],
    tags: ["technology", "web", "cms"],
    relatedTools: ["whatweb", "nmap"]
  },

  // =========================================================
  // 23. NMAP
  // =========================================================
  {
    name: "Nmap",
    category: "Threat Intelligence",
    shortDescription: "Discover hosts, ports and network services.",
    description:
      "Nmap is a network discovery and security auditing tool. It can identify reachable hosts, open ports, services and other network characteristics. Because some Nmap scans generate direct traffic, it must only be used against systems for which scanning is authorized.",
    purpose:
      "Understand the exposed network services of an authorized target.",
    whenToUse:
      "Use during authorized network security assessments and controlled lab environments.",
    difficulty: "Intermediate",
    syntax: "nmap <target>",
    installation:
      "Windows: install the official Nmap Windows package. Linux: install through the distribution package manager.",
    commands: [
      {
        command: "nmap example.com",
        description: "Perform a basic port scan.",
        expectedOutput: "Open ports and detected services."
      },
      {
        command: "nmap -sV example.com",
        description: "Attempt service version detection.",
        expectedOutput: "Service names and possible versions."
      }
    ],
    examples: [
      "nmap example.com",
      "nmap -sV example.com"
    ],
    sampleOutput:
      "PORT  STATE SERVICE\n80/tcp open http\n443/tcp open https",
    outputExplanation:
      "Open ports indicate services responding to network probes. Service detection attempts to identify the software behind those services.",
    advantages: ["Industry-standard scanner", "Extensive options", "Useful in labs"],
    limitations: ["Active scanning generates traffic", "Results can be affected by firewalls"],
    bestPractices: ["Scan only authorized systems", "Start with low-impact scans", "Document scan scope"],
    tags: ["nmap", "ports", "network", "services"],
    relatedTools: ["shodan", "censys", "whatweb"]
  },

  // =========================================================
  // 24. SHODAN
  // =========================================================
  {
    name: "Shodan",
    category: "Threat Intelligence",
    shortDescription: "Search Internet-exposed services and devices.",
    description:
      "Shodan is an Internet intelligence search engine that indexes information about publicly observable Internet-connected services. It can provide information about exposed ports, banners, certificates, organizations, locations and technologies depending on available data.",
    purpose:
      "Discover publicly indexed Internet-facing infrastructure.",
    whenToUse:
      "Use for authorized external attack-surface intelligence and infrastructure research.",
    difficulty: "Intermediate",
    syntax: "Search Shodan using filters and keywords.",
    installation: "No local installation required for the web interface.",
    commands: [],
    examples: [
      "Search for an organization",
      "Search an IP address",
      "Search a domain"
    ],
    sampleOutput:
      "IP address, port, service banner, organization and location information.",
    outputExplanation:
      "Shodan observations represent information collected by its crawlers and sensors and may not reflect the current state of a host.",
    advantages: ["Large Internet index", "Excellent infrastructure intelligence"],
    limitations: ["Data may be stale", "Some features require subscription"],
    bestPractices: ["Check observation dates", "Correlate with current DNS data"],
    tags: ["shodan", "internet", "iot", "attack-surface"],
    relatedTools: ["censys", "virustotal", "nmap"]
  },

  // =========================================================
  // 25. CENSYS
  // =========================================================
  {
    name: "Censys",
    category: "Threat Intelligence",
    shortDescription: "Search Internet hosts, services and certificates.",
    description:
      "Censys provides Internet intelligence focused on hosts, services and certificates. It can help investigators identify exposed infrastructure and connect systems through observable network and certificate relationships.",
    purpose:
      "Investigate Internet-facing infrastructure and certificate relationships.",
    whenToUse:
      "Use during authorized external attack-surface and infrastructure research.",
    difficulty: "Intermediate",
    syntax: "Search Censys using host, service or certificate queries.",
    installation: "No local installation required for the web interface.",
    commands: [],
    examples: [
      "Search for a public IP",
      "Search for a certificate",
      "Search for exposed services"
    ],
    sampleOutput:
      "Host, service, port and certificate observations.",
    outputExplanation:
      "Censys observations provide intelligence about publicly observable infrastructure and should be interpreted with timestamps.",
    advantages: ["Strong certificate intelligence", "Infrastructure search"],
    limitations: ["Index may differ from current state", "Some capabilities require account access"],
    bestPractices: ["Correlate with DNS and certificate transparency"],
    tags: ["censys", "certificates", "hosts"],
    relatedTools: ["shodan", "crtsh"]
  },

  // =========================================================
  // 26. CRT.SH
  // =========================================================
  {
    name: "crt.sh",
    category: "Domain Investigation",
    shortDescription: "Search certificate transparency records.",
    description:
      "crt.sh provides access to publicly logged TLS certificate information from Certificate Transparency logs. Investigators can use certificate names to discover domains and subdomains that may not appear in ordinary DNS enumeration.",
    purpose:
      "Discover domain names and infrastructure through certificate transparency.",
    whenToUse:
      "Use when investigating domains, subdomains and historical certificate relationships.",
    difficulty: "Beginner",
    syntax: "Search %.example.com on crt.sh.",
    installation: "No local installation required.",
    commands: [],
    examples: [
      "Search %.example.com",
      "Review certificate issuer and validity dates"
    ],
    sampleOutput:
      "Certificate entries containing domain and subdomain names.",
    outputExplanation:
      "Certificate transparency records show names included in publicly logged certificates. They do not necessarily indicate that every listed hostname is currently active.",
    advantages: ["Excellent subdomain discovery", "Historical certificate visibility"],
    limitations: ["Certificates can contain unused names", "Not every certificate relationship proves current hosting"],
    bestPractices: ["Validate discovered names through DNS"],
    tags: ["crtsh", "certificate", "subdomain", "tls"],
    relatedTools: ["censys", "securitytrails", "subfinder"]
  },

  // =========================================================
  // 27. SECURITYTRAILS
  // =========================================================
  {
    name: "SecurityTrails",
    category: "Domain Investigation",
    shortDescription: "Investigate DNS and historical infrastructure data.",
    description:
      "SecurityTrails provides DNS, domain and historical infrastructure intelligence. It can help investigators identify historical DNS records, subdomains and infrastructure relationships that may not be visible through current DNS queries.",
    purpose:
      "Investigate current and historical DNS relationships.",
    whenToUse:
      "Use when historical infrastructure information is required.",
    difficulty: "Intermediate",
    syntax: "Search domain information through SecurityTrails.",
    installation: "No local installation required for the web service.",
    commands: [],
    examples: [
      "Review historical DNS records",
      "Investigate subdomains"
    ],
    sampleOutput:
      "Historical DNS records, subdomains and related infrastructure.",
    outputExplanation:
      "Historical data helps reconstruct infrastructure changes over time.",
    advantages: ["Historical DNS", "Useful attack-surface intelligence"],
    limitations: ["Some features require subscription/API access", "Historical coverage varies"],
    bestPractices: ["Record observation dates", "Cross-check important findings"],
    tags: ["dns", "historical", "subdomain"],
    relatedTools: ["crtsh", "whois", "amass"]
  },

  // =========================================================
  // 28. URLSCAN.IO
  // =========================================================
  {
    name: "URLScan.io",
    category: "Threat Intelligence",
    shortDescription: "Analyze publicly submitted web page scans.",
    description:
      "URLScan.io provides automated web page scans that capture information about URLs, requests, domains, resources, screenshots and page behavior. It is useful for investigating suspicious websites and understanding relationships between web resources.",
    purpose:
      "Analyze web pages and network resources through captured scans.",
    whenToUse:
      "Use for authorized investigation of suspicious or publicly observable URLs.",
    difficulty: "Intermediate",
    syntax: "Search or submit a URL through URLScan.io.",
    installation: "No local installation required.",
    commands: [],
    examples: [
      "Search a domain",
      "Inspect a URL scan",
      "Review requested resources"
    ],
    sampleOutput:
      "Screenshot, requested domains, IP information and page resources.",
    outputExplanation:
      "The scan represents the environment and time when the page was analyzed.",
    advantages: ["Visual evidence", "Network request visibility", "Useful phishing investigation"],
    limitations: ["Scans are time-dependent", "Public submissions require care"],
    bestPractices: ["Avoid submitting sensitive URLs", "Record scan timestamp"],
    tags: ["urlscan", "phishing", "web", "network"],
    relatedTools: ["virustotal", "wayback"]
  },

  // =========================================================
  // 29. HAVE I BEEN PWNED
  // =========================================================
  {
    name: "Have I Been Pwned",
    category: "Email Investigation",
    shortDescription: "Check public breach exposure of an email address.",
    description:
      "Have I Been Pwned is a service that allows users to check whether an email address has appeared in known data breaches. It is useful for defensive awareness and authorized investigations involving exposure history.",
    purpose:
      "Assess whether an email address has appeared in known breach datasets.",
    whenToUse:
      "Use for account security awareness, authorized investigations and defensive exposure assessment.",
    difficulty: "Beginner",
    syntax: "Search an email address using the HIBP service.",
    installation: "No local installation required.",
    commands: [],
    examples: [
      "Check a corporate email",
      "Review listed breach events"
    ],
    sampleOutput:
      "Breach names and dates where an address appears in available breach data.",
    outputExplanation:
      "A breach listing indicates exposure in a known dataset; it does not necessarily mean the account is currently compromised.",
    advantages: ["Simple exposure check", "Useful defensive intelligence"],
    limitations: ["Not every breach is known", "Data availability is limited by service policy"],
    bestPractices: ["Use only authorized addresses", "Never attempt to access leaked credentials"],
    tags: ["breach", "email", "security"],
    relatedTools: ["holehe", "hunter"]
  },

  // =========================================================
  // 30. WAYBACK MACHINE
  // =========================================================
  {
    name: "Wayback Machine",
    category: "Domain Investigation",
    shortDescription: "Investigate historical versions of public websites.",
    description:
      "The Wayback Machine stores historical snapshots of publicly accessible web pages. Investigators can use archived pages to understand how websites changed over time, recover previously published information and establish historical context.",
    purpose:
      "Analyze historical web content and changes.",
    whenToUse:
      "Use when current website content differs from historical evidence or when reconstructing a website timeline.",
    difficulty: "Beginner",
    syntax: "Search a URL through the Wayback Machine.",
    installation: "No local installation required.",
    commands: [],
    examples: [
      "Search example.com",
      "Compare historical snapshots"
    ],
    sampleOutput:
      "Archived snapshots with dates and archived URLs.",
    outputExplanation:
      "Each snapshot represents content captured at a particular time and may be incomplete.",
    advantages: ["Historical context", "Useful evidence source"],
    limitations: ["Not every page is archived", "Snapshots may be incomplete"],
    bestPractices: ["Record snapshot URL and date", "Compare multiple snapshots"],
    tags: ["archive", "history", "website"],
    relatedTools: ["urlscan", "googlelens"]
  },

  // =========================================================
  // 31. SPIDERFOOT
  // =========================================================
  {
    name: "SpiderFoot",
    category: "Threat Intelligence",
    shortDescription: "Automate broad OSINT collection and correlation.",
    description:
      "SpiderFoot automates OSINT collection by connecting many data sources and investigation modules. It can gather information about domains, IP addresses, emails, names and other entities, then present relationships between discovered data.",
    purpose:
      "Automate repetitive OSINT collection and identify relationships between findings.",
    whenToUse:
      "Use for authorized reconnaissance and investigations where many sources need to be queried systematically.",
    difficulty: "Intermediate",
    syntax: "python sf.py -s <target>",
    installation:
      "Install SpiderFoot and its dependencies according to the current project documentation.",
    commands: [
      {
        command: "python sf.py -s example.com",
        description: "Start an OSINT scan.",
        expectedOutput: "Collected entities and relationships."
      }
    ],
    examples: [
      "Scan a domain",
      "Scan an IP address",
      "Investigate an email"
    ],
    sampleOutput:
      "Discovered domains, IPs, DNS information, emails and relationships.",
    outputExplanation:
      "SpiderFoot aggregates many observations. Analysts should verify important findings and understand the source behind each result.",
    advantages: ["Automation", "Many modules", "Relationship discovery"],
    limitations: ["Large result volumes", "Source/API availability varies"],
    bestPractices: ["Start with focused modules", "Validate high-value findings"],
    tags: ["spiderfoot", "automation", "correlation"],
    relatedTools: ["amass", "shodan", "theharvester"]
  },

  // =========================================================
  // 32. HUNTER.IO
  // =========================================================
  {
    name: "Hunter.io",
    category: "Email Investigation",
    shortDescription: "Find and verify publicly associated business email information.",
    description:
      "Hunter provides tools for discovering professional email patterns and addresses associated with organizations. It can assist authorized researchers in understanding publicly exposed organizational contact structures.",
    purpose:
      "Investigate publicly available business email patterns.",
    whenToUse:
      "Use during authorized organizational OSINT and contact discovery.",
    difficulty: "Beginner",
    syntax: "Search a domain through Hunter.",
    installation: "No local installation required for the web interface.",
    commands: [],
    examples: [
      "Search example.com",
      "Review email pattern information"
    ],
    sampleOutput:
      "Possible business email addresses and domain email pattern information.",
    outputExplanation:
      "Results represent information collected from public sources and should be verified.",
    advantages: ["Useful email discovery", "Domain-focused"],
    limitations: ["Coverage varies", "Some features require account access"],
    bestPractices: ["Use for legitimate research", "Do not use discovered addresses for unsolicited abuse"],
    tags: ["email", "domain", "business"],
    relatedTools: ["theharvester", "holehe"]
  },

  // =========================================================
  // 33. GOOGLE
  // =========================================================
  {
    name: "Google",
    category: "Search Engines",
    shortDescription: "General-purpose web search engine for OSINT discovery.",
    description:
      "Google is a general-purpose search engine that indexes publicly accessible web content. In OSINT investigations, it can be used for discovery, source identification, historical context and targeted searches using advanced operators.",
    purpose:
      "Discover publicly indexed information.",
    whenToUse:
      "Use as a primary discovery and verification source throughout an OSINT investigation.",
    difficulty: "Beginner",
    syntax: "keyword or advanced search operators",
    installation: "No installation required.",
    commands: [],
    examples: [
      "Search an organization name",
      "Search a domain",
      "Use site: and filetype: operators"
    ],
    sampleOutput:
      "Ranked public search results.",
    outputExplanation:
      "Search rankings reflect the search engine's indexing and ranking systems and can change over time.",
    advantages: ["Huge index", "Powerful operators", "Easy to use"],
    limitations: ["Not all public content is indexed", "Results vary by location and time"],
    bestPractices: ["Use multiple queries", "Verify important claims"],
    tags: ["google", "search", "osint"],
    relatedTools: ["bing", "duckduckgo", "google dorking"]
  },

  // =========================================================
  // 34. BING
  // =========================================================
  {
    name: "Bing",
    category: "Search Engines",
    shortDescription: "Web search engine useful for alternative OSINT discovery.",
    description:
      "Bing is a major web search engine that provides an alternative index to other search engines. Using multiple search engines can improve discovery because their indexes, ranking systems and indexed content can differ.",
    purpose:
      "Perform web discovery using an alternative search index.",
    whenToUse:
      "Use when validating Google results or looking for content that may rank differently across search engines.",
    difficulty: "Beginner",
    syntax: "keyword or advanced search operators",
    installation: "No installation required.",
    commands: [],
    examples: [
      "site:example.com",
      "filetype:pdf example report",
      "\"exact phrase\" example"
    ],
    sampleOutput:
      "Search results from Bing's index.",
    outputExplanation:
      "Different ranking and indexing can produce results not immediately visible through other search engines.",
    advantages: ["Alternative index", "Useful cross-check"],
    limitations: ["Index coverage differs", "Results change over time"],
    bestPractices: ["Cross-check important searches with other engines"],
    tags: ["bing", "search", "osint"],
    relatedTools: ["google", "duckduckgo", "brave"]
  },

  // =========================================================
  // 35. DUCKDUCKGO
  // =========================================================
  {
    name: "DuckDuckGo",
    category: "Search Engines",
    shortDescription: "Privacy-oriented search engine for OSINT research.",
    description:
      "DuckDuckGo provides web search with a privacy-focused product design. Investigators can use it as an alternative search source and compare results with other search engines.",
    purpose:
      "Perform alternative web searches and reduce dependence on one search index.",
    whenToUse:
      "Use for cross-engine validation and privacy-conscious searching.",
    difficulty: "Beginner",
    syntax: "keyword or advanced search query",
    installation: "No installation required.",
    commands: [],
    examples: [
      "\"exact phrase\"",
      "site:example.com report"
    ],
    sampleOutput: "Ranked search results.",
    outputExplanation:
      "Search results depend on available indexes and search algorithms.",
    advantages: ["Easy to use", "Alternative search source"],
    limitations: ["Coverage differs from other engines"],
    bestPractices: ["Compare results across multiple engines"],
    tags: ["duckduckgo", "search", "privacy"],
    relatedTools: ["google", "bing", "brave"]
  },

  // =========================================================
  // 36. YANDEX
  // =========================================================
  {
    name: "Yandex",
    category: "Search Engines",
    shortDescription: "Search engine useful for alternative web and image discovery.",
    description:
      "Yandex is a search engine that can provide an alternative index and image-search perspective. In OSINT, alternative search engines can be valuable when investigating multilingual content, regional sources or images.",
    purpose:
      "Expand search coverage beyond a single search engine.",
    whenToUse:
      "Use when researching multilingual, regional or image-related information.",
    difficulty: "Beginner",
    syntax: "keyword or image search",
    installation: "No installation required.",
    commands: [],
    examples: [
      "Search an organization name",
      "Search a domain",
      "Perform image-based discovery"
    ],
    sampleOutput: "Web or image search results.",
    outputExplanation:
      "Results reflect Yandex's available index and ranking systems.",
    advantages: ["Alternative index", "Useful image discovery"],
    limitations: ["Regional coverage varies", "Results change"],
    bestPractices: ["Verify results independently"],
    tags: ["yandex", "search", "image"],
    relatedTools: ["google", "googlelens"]
  },

  // =========================================================
  // 37. BRAVE SEARCH
  // =========================================================
  {
    name: "Brave Search",
    category: "Search Engines",
    shortDescription: "Independent search engine for alternative web discovery.",
    description:
      "Brave Search provides an alternative web search index and can be useful for cross-checking OSINT queries. Using multiple search engines reduces dependence on the ranking behavior of a single provider.",
    purpose:
      "Provide an additional independent search source.",
    whenToUse:
      "Use when comparing search results or looking for alternative indexed sources.",
    difficulty: "Beginner",
    syntax: "keyword search",
    installation: "No installation required.",
    commands: [],
    examples: [
      "Search an organization",
      "Search a domain",
      "Search an exact phrase"
    ],
    sampleOutput: "Search results from Brave Search.",
    outputExplanation:
      "Results depend on Brave's indexing and ranking mechanisms.",
    advantages: ["Alternative search source", "Simple interface"],
    limitations: ["Coverage differs from other engines"],
    bestPractices: ["Cross-check important findings"],
    tags: ["brave", "search", "osint"],
    relatedTools: ["google", "bing", "mojeek"]
  },

  // =========================================================
  // 38. MOJEEK
  // =========================================================
  {
    name: "Mojeek",
    category: "Search Engines",
    shortDescription: "Independent web search engine for OSINT discovery.",
    description:
      "Mojeek is an independent search engine with its own web index. It can be used as an additional discovery source when investigators want to compare results across different search indexes.",
    purpose:
      "Expand search coverage using an independent search engine.",
    whenToUse:
      "Use for cross-engine searches and discovery of alternative indexed content.",
    difficulty: "Beginner",
    syntax: "keyword search",
    installation: "No installation required.",
    commands: [],
    examples: [
      "Search a domain",
      "Search an exact phrase",
      "Compare results with other engines"
    ],
    sampleOutput: "Ranked search results.",
    outputExplanation:
      "Results reflect Mojeek's own index and ranking system.",
    advantages: ["Independent index", "Useful cross-check"],
    limitations: ["Smaller coverage than some major engines"],
    bestPractices: ["Use alongside other search engines"],
    tags: ["mojeek", "search", "osint"],
    relatedTools: ["google", "bing", "brave"]
  }
];

async function seedTools() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected");

    for (const tool of tools) {
      await Tool.findOneAndUpdate(
        { name: tool.name },
        {
          $set: {
            ...tool,
            isPublished: true
          }
        },
        {
          upsert: true,
          new: true,
          setDefaultsOnInsert: true
        }
      );

      console.log(`Updated: ${tool.name}`);
    }

    console.log(`\n✅ ${tools.length} tools updated successfully.`);
    process.exit(0);
  } catch (error) {
    console.error("❌ Tool seeding failed:", error);
    process.exit(1);
  }
}

seedTools();