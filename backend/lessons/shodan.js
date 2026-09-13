const toolLessons = [
  {
    lessonNumber: 1,
    title: "Shodan Fundamentals for OSINT",
    shortDescription:
      "Understand Shodan as an Internet-connected device search engine and learn how its indexed data can support defensive OSINT investigations.",
    objectives: [
      "Understand what Shodan is",
      "Understand Internet-connected service indexing",
      "Learn the concept of banners",
      "Differentiate Shodan from Nmap",
      "Understand responsible Shodan usage",
      "Learn how Shodan results support OSINT investigations"
    ],
    content: `
      <h2>1. Introduction to Shodan</h2>

      <p>Shodan is a search engine designed to discover and index information about Internet-connected devices and services. Unlike traditional search engines that primarily index web pages, Shodan focuses on technical information exposed by network-connected systems.</p>

      <p>Shodan can provide information about servers, network devices, industrial systems, databases, webcams, Internet-of-Things devices, and other publicly reachable services depending on what its crawlers can observe.</p>

      <p>For cybersecurity students, Shodan is particularly useful because it demonstrates how much technical information can become publicly searchable when services are exposed to the Internet.</p>

      <h2>2. Traditional Search Engines vs Shodan</h2>

      <pre><code>Traditional Search Engine
        ↓
Web Pages
Documents
Images
News
Public Websites

Shodan
        ↓
Internet-Connected Services
Ports
Service Banners
Certificates
Network Metadata</code></pre>

      <p>This difference makes Shodan highly relevant to technical OSINT.</p>

      <h2>3. What Is a Banner?</h2>

      <p>A banner is information returned by a network service that can describe the service, software, protocol, or other characteristics of the endpoint.</p>

      <p>A simplified example might look like:</p>

      <pre><code>IP: 203.0.113.10
Port: 80
Service: HTTP
Product: Example Web Server
Version: Example Version</code></pre>

      <p>The exact information available depends on the service and what Shodan was able to observe.</p>

      <h2>4. Why Banners Matter</h2>

      <p>Banners can reveal technical information that is useful for defensive security analysis.</p>

      <ul>
        <li>Service type</li>
        <li>Port</li>
        <li>Product information</li>
        <li>Version information</li>
        <li>HTTP metadata</li>
        <li>SSL/TLS information</li>
        <li>Geographic information</li>
        <li>Organization information</li>
        <li>Autonomous System information</li>
      </ul>

      <p>However, banner information should not automatically be treated as proof of a vulnerability. A displayed version may be inaccurate, incomplete, modified, or protected by vendor patching.</p>

      <h2>5. Shodan and Passive OSINT</h2>

      <p>Shodan is often used as a source of passive technical intelligence because investigators can search information already collected and indexed by the platform instead of directly probing the target themselves.</p>

      <p>This is an important distinction from Nmap.</p>

      <pre><code>Shodan
Search Existing Indexed Information
        ↓
Passive Technical Intelligence

Nmap
Send Network Probes
        ↓
Active Reconnaissance</code></pre>

      <h2>6. Shodan vs Nmap</h2>

      <table>
        <thead>
          <tr>
            <th>Feature</th>
            <th>Shodan</th>
            <th>Nmap</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Primary purpose</td>
            <td>Search indexed Internet services</td>
            <td>Network discovery and enumeration</td>
          </tr>
          <tr>
            <td>Typical operation</td>
            <td>Search existing data</td>
            <td>Send probes to targets</td>
          </tr>
          <tr>
            <td>Data freshness</td>
            <td>Depends on Shodan's collection</td>
            <td>Observed during the scan</td>
          </tr>
          <tr>
            <td>Use case</td>
            <td>Internet-wide technical OSINT</td>
            <td>Authorized network assessment</td>
          </tr>
        </tbody>
      </table>

      <h2>7. Internet Exposure</h2>

      <p>One of the most important lessons from Shodan is that Internet exposure itself can become an intelligence source.</p>

      <p>An organization may unintentionally expose information about:</p>

      <ul>
        <li>Web servers</li>
        <li>Remote administration services</li>
        <li>Mail services</li>
        <li>VPN services</li>
        <li>Databases</li>
        <li>IoT devices</li>
        <li>Network infrastructure</li>
      </ul>

      <h2>8. Responsible Usage</h2>

      <p>Searching Shodan does not automatically authorize interaction with the systems discovered through it. Students should use search results for observation and defensive analysis and must not attempt unauthorized login, exploitation, or data access.</p>

      <h2>9. Basic Search Concept</h2>

      <p>Shodan supports searches based on technical characteristics. A beginner can start by searching for a service or product name and then progressively narrow the results using documented filters.</p>

      <pre><code>Example concept:

web server

        ↓

Review returned services

        ↓

Identify organization / location / technology

        ↓

Create investigation pivot</code></pre>

      <h2>10. Shodan as an OSINT Pivot</h2>

      <p>Suppose an investigator begins with an organization name. Public information can reveal a domain. DNS information may reveal an IP address. Shodan can then provide indexed information associated with that IP.</p>

      <pre><code>Organization
     ↓
Domain
     ↓
DNS
     ↓
IP Address
     ↓
Shodan
     ↓
Indexed Services
     ↓
Technical Intelligence</code></pre>

      <h2>11. Limitations</h2>

      <ul>
        <li>Indexed data may not represent the current state.</li>
        <li>Services can change after the last observation.</li>
        <li>Banner information can be incomplete.</li>
        <li>IP ownership can change.</li>
        <li>Shared hosting can complicate attribution.</li>
        <li>Search results require contextual interpretation.</li>
      </ul>

      <h2>12. Core Principle</h2>

      <p>Shodan should be understood as a technical OSINT search engine. Its greatest educational value is showing how publicly reachable infrastructure can expose searchable technical metadata.</p>
    `,
    keyPoints: [
      "Shodan searches indexed Internet-connected services",
      "Shodan differs from traditional web search engines",
      "Banners can contain valuable technical metadata",
      "Shodan differs from Nmap because it searches collected data",
      "Search results may become outdated",
      "Technical observations must be interpreted carefully"
    ],
    example:
      "Search an authorized organization's public infrastructure in Shodan, review indexed service information, and record the observation without attempting unauthorized access.",
    estimatedTime: 50,
    order: 1,
    difficulty: "Beginner",
    prerequisites: []
  },

  {
    lessonNumber: 2,
    title: "Shodan Search and Query Construction",
    shortDescription:
      "Learn how to construct effective Shodan searches using services, ports, products, organizations, locations, and other documented search concepts.",
    objectives: [
      "Understand Shodan search syntax",
      "Learn common filters",
      "Search for technical characteristics",
      "Understand query refinement",
      "Reduce irrelevant results",
      "Document search methodology"
    ],
    content: `
      <h2>1. Why Query Construction Matters</h2>

      <p>Large Internet-scale datasets can produce a huge number of results. Effective Shodan investigation therefore depends on query construction and result filtering.</p>

      <p>A weak query may produce thousands of unrelated results, while a well-constructed query can narrow the investigation to a useful set of observations.</p>

      <h2>2. Basic Search</h2>

      <p>A simple search can begin with a product, service, technology, organization, or other technical characteristic.</p>

      <pre><code>Example Web Server</code></pre>

      <p>The investigator can then inspect the returned results and identify useful pivots.</p>

      <h2>3. Search Filters</h2>

      <p>Shodan supports filters that allow investigators to narrow results according to attributes such as:</p>

      <ul>
        <li>IP address</li>
        <li>Port</li>
        <li>Organization</li>
        <li>Country</li>
        <li>City</li>
        <li>Product</li>
        <li>Operating system</li>
        <li>Hostname</li>
        <li>Domain</li>
        <li>Autonomous System</li>
      </ul>

      <p>Filter names and supported syntax can change over time, so investigators should verify current syntax in Shodan's documentation.</p>

      <h2>4. Port Filtering</h2>

      <p>Port filtering can narrow results to services exposed through a specific port.</p>

      <pre><code>port:443</code></pre>

      <p>This can help identify services associated with HTTPS, although the port alone does not prove the application type.</p>

      <h2>5. Country Filtering</h2>

      <p>A country filter can be useful when an investigation has a defined geographic scope.</p>

      <pre><code>country:IN</code></pre>

      <p>The result should not be interpreted as proof that an organization physically operates the infrastructure in that country. IP geolocation is an estimate and infrastructure may be hosted by third-party providers.</p>

      <h2>6. Organization Filtering</h2>

      <p>Organization-based searches can help identify infrastructure associated with a particular network owner.</p>

      <pre><code>org:"Example Organization"</code></pre>

      <p>Organization names should be interpreted carefully because ownership, hosting, and service providers can introduce ambiguity.</p>

      <h2>7. Hostname Filtering</h2>

      <p>Hostname information can provide useful pivots.</p>

      <pre><code>hostname:"example.com"</code></pre>

      <p>When investigating an authorized or publicly documented domain, hostname results can help identify related indexed services.</p>

      <h2>8. Domain Filtering</h2>

      <p>Domain-related searches can help connect services with a domain namespace.</p>

      <pre><code>domain:"example.com"</code></pre>

      <p>This should be treated as an intelligence lead rather than absolute ownership proof.</p>

      <h2>9. Product Searching</h2>

      <p>Product information can be used to identify systems reporting a particular technology.</p>

      <pre><code>product:"Example Product"</code></pre>

      <p>Product strings should be validated against other sources when used in an investigation.</p>

      <h2>10. Combining Filters</h2>

      <p>Filters can be combined to narrow the search.</p>

      <pre><code>port:443 country:IN</code></pre>

      <p>This conceptually searches for HTTPS-associated services indexed in India.</p>

      <h2>11. Query Refinement</h2>

      <pre><code>Broad Query
     ↓
Review Results
     ↓
Identify Useful Attribute
     ↓
Add Filter
     ↓
Review Again
     ↓
Document Finding</code></pre>

      <p>This iterative approach is often more effective than trying to construct a perfect query immediately.</p>

      <h2>12. Search Noise</h2>

      <p>Common sources of noise include:</p>

      <ul>
        <li>Shared hosting</li>
        <li>Cloud providers</li>
        <li>CDNs</li>
        <li>Dynamic IP allocation</li>
        <li>Generic service banners</li>
        <li>Stale records</li>
        <li>Third-party infrastructure</li>
      </ul>

      <h2>13. Search Documentation</h2>

      <p>A professional investigator should record the query used.</p>

      <pre><code>Query:
port:443 country:IN

Purpose:
Identify indexed HTTPS services within the selected
geographic scope.

Timestamp:
Investigation timestamp

Result:
Relevant observations recorded separately.</code></pre>

      <h2>14. Avoiding Overclaiming</h2>

      <p>If a result shows an organization name, the correct conclusion is that Shodan associated the indexed observation with that organization at collection time. It does not automatically prove that the organization currently owns or operates the service.</p>

      <h2>15. Practical Exercise</h2>

      <p>Create three queries:</p>

      <ol>
        <li>A broad technology query</li>
        <li>A query narrowed by port</li>
        <li>A query narrowed by an organization or domain in an authorized investigation</li>
      </ol>

      <p>Compare the number and relevance of results.</p>

      <h2>16. Core Principle</h2>

      <p>Effective Shodan searching is an iterative process: start broad, identify useful technical attributes, narrow carefully, and document the query used to obtain the evidence.</p>
    `,
    keyPoints: [
      "Query construction reduces investigation noise",
      "Filters can narrow results by technical attributes",
      "Port numbers do not prove application identity",
      "Organization and geographic attribution require caution",
      "Hostname and domain results are useful pivots",
      "Always record the query and timestamp"
    ],
    example:
      "port:443 country:IN",
    estimatedTime: 60,
    order: 2,
    difficulty: "Beginner",
    prerequisites: [
      "Shodan Fundamentals for OSINT"
    ]
  },

  {
    lessonNumber: 3,
    title: "Shodan Filters, Banners, Certificates, and Technical Intelligence",
    shortDescription:
      "Explore deeper Shodan intelligence including banners, certificates, host metadata, ASN information, and technical pivots.",
    objectives: [
      "Understand banner fields",
      "Analyze service metadata",
      "Understand certificate information",
      "Use IP and ASN pivots",
      "Correlate multiple technical attributes",
      "Evaluate confidence in Shodan findings"
    ],
    content: `
      <h2>1. From Search Results to Intelligence</h2>

      <p>A Shodan result can contain considerably more information than an IP address. Depending on the indexed service, the record may contain port information, protocol details, banners, hostnames, certificates, organization information, ASN data, geographic information, and other metadata.</p>

      <p>The investigator's task is to transform these individual fields into meaningful relationships.</p>

      <h2>2. IP Address</h2>

      <p>An IP address identifies a network endpoint at a particular point in time. IP ownership can change, and cloud or hosting infrastructure may be shared.</p>

      <p>Therefore, an IP address should normally be treated as an infrastructure pivot rather than automatic proof of organizational ownership.</p>

      <h2>3. Ports</h2>

      <p>Port information indicates where a service was observed.</p>

      <pre><code>IP: 203.0.113.10

80/tcp
443/tcp
22/tcp</code></pre>

      <p>The investigator can use these observations to construct a high-level exposure profile.</p>

      <h2>4. Service Metadata</h2>

      <p>A service record may include information about the protocol and software associated with the endpoint.</p>

      <pre><code>Port: 443
Transport: TCP
Service: HTTPS
Product: Example Web Server</code></pre>

      <p>Again, product identification should be treated as an observation requiring contextual validation.</p>

      <h2>5. Certificate Intelligence</h2>

      <p>SSL/TLS certificates can provide useful OSINT pivots. Certificate data may contain names, domains, issuers, validity periods, and other metadata.</p>

      <pre><code>Certificate
    ↓
Hostname
    ↓
Domain
    ↓
Related Infrastructure</code></pre>

      <p>This makes certificate intelligence particularly valuable when combined with other sources.</p>

      <h2>6. Hostname Pivot</h2>

      <p>If a Shodan result contains a hostname, the hostname can become the next investigation pivot.</p>

      <pre><code>IP
 ↓
Hostname
 ↓
Domain
 ↓
DNS Records
 ↓
Related Infrastructure</code></pre>

      <h2>7. ASN Intelligence</h2>

      <p>Autonomous System Numbers, or ASNs, represent routing organizations on the Internet. ASN information can help investigators understand which network or provider announces an address range.</p>

      <p>ASN data can be especially useful for infrastructure mapping.</p>

      <pre><code>Organization
      ↓
ASN
      ↓
Network Prefixes
      ↓
Observed Hosts</code></pre>

      <h2>8. Organization Information</h2>

      <p>Shodan may associate infrastructure with an organization or network provider. This can provide a useful starting point, but third-party hosting means the displayed organization may represent the infrastructure provider rather than the ultimate service owner.</p>

      <h2>9. Geographic Information</h2>

      <p>Geographic fields can help establish broad location context. They should not be treated as exact physical-location evidence because IP geolocation is inherently approximate.</p>

      <h2>10. Banner Analysis</h2>

      <p>Banner analysis should focus on what is actually observed.</p>

      <pre><code>Observed:
HTTP response identifies Example Server

Inference:
Likely web service

Requires validation:
Exact software deployment and current version</code></pre>

      <h2>11. Cross-Checking</h2>

      <p>Important Shodan findings should be cross-checked using independent sources such as:</p>

      <ul>
        <li>WHOIS/RDAP</li>
        <li>DNS records</li>
        <li>Certificate transparency</li>
        <li>URLScan</li>
        <li>Public company documentation</li>
        <li>Technology-detection tools</li>
        <li>Historical archives</li>
      </ul>

      <h2>12. Confidence Levels</h2>

      <table>
        <thead>
          <tr>
            <th>Confidence</th>
            <th>Example</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>High</td>
            <td>Multiple independent sources agree.</td>
          </tr>
          <tr>
            <td>Medium</td>
            <td>Shodan observation supported by contextual evidence.</td>
          </tr>
          <tr>
            <td>Low</td>
            <td>Single stale or ambiguous observation.</td>
          </tr>
        </tbody>
      </table>

      <h2>13. Historical Context</h2>

      <p>Internet infrastructure changes frequently. A Shodan observation may describe a service that was exposed during an earlier crawl but is no longer accessible.</p>

      <p>This is why timestamps are essential.</p>

      <h2>14. Example Investigation</h2>

      <pre><code>Domain:
example.com

DNS:
203.0.113.10

Shodan:
443/tcp observed

Certificate:
example.com

Technology:
Example Web Server</code></pre>

      <p>The relationship between these observations is stronger than relying on one source alone.</p>

      <h2>15. Core Principle</h2>

      <p>Shodan becomes most valuable when individual fields are treated as pivots and correlated with independent evidence rather than viewed as isolated facts.</p>
    `,
    keyPoints: [
      "IP addresses are infrastructure pivots",
      "Ports describe observed service endpoints",
      "Certificates can reveal hostname and domain relationships",
      "ASN information helps map network ownership",
      "Organization attribution may involve hosting providers",
      "Timestamp and independent validation improve confidence"
    ],
    example:
      "IP → Shodan service → certificate hostname → domain → DNS → independent validation.",
    estimatedTime: 65,
    order: 3,
    difficulty: "Intermediate",
    prerequisites: [
      "Shodan Search and Query Construction"
    ]
  },

  {
    lessonNumber: 4,
    title: "Shodan for Infrastructure and Attack-Surface Analysis",
    shortDescription:
      "Learn how to use Shodan observations to understand Internet-facing infrastructure, exposed services, technology patterns, and defensive attack-surface risks.",
    objectives: [
      "Understand Internet-facing attack surface",
      "Identify exposed services",
      "Analyze infrastructure patterns",
      "Recognize risky exposure patterns",
      "Differentiate exposure from vulnerability",
      "Create defensive findings"
    ],
    content: `
      <h2>1. Understanding Attack Surface</h2>

      <p>An organization's Internet-facing attack surface includes systems and services that can be reached from outside the organization's internal network.</p>

      <pre><code>Organization
     ↓
Public Domains
     ↓
DNS
     ↓
IP Addresses
     ↓
Internet Services
     ↓
Attack Surface</code></pre>

      <p>Shodan can provide an external perspective of this surface by showing what its crawlers have observed.</p>

      <h2>2. Service Exposure</h2>

      <p>An exposed service is not necessarily a security flaw. Organizations intentionally expose web servers, mail servers, VPN gateways, and other services.</p>

      <p>The security question is whether the exposure is expected, properly configured, maintained, and appropriately protected.</p>

      <h2>3. Unexpected Services</h2>

      <p>Unexpected services can be valuable defensive findings.</p>

      <ul>
        <li>Development servers</li>
        <li>Old applications</li>
        <li>Temporary services</li>
        <li>Administrative interfaces</li>
        <li>Unexpected database exposure</li>
        <li>Legacy protocols</li>
      </ul>

      <p>These observations should be reported as review items rather than automatically classified as vulnerabilities.</p>

      <h2>4. Technology Exposure</h2>

      <p>Technology banners can reveal software families and service types. Security teams can use this information to compare external observations against their asset inventory.</p>

      <pre><code>Internal Asset Inventory
        +
External Shodan Observation
        ↓
Exposure Verification</code></pre>

      <h2>5. Shadow IT</h2>

      <p>Shadow IT refers to technology deployed without appropriate organizational visibility or governance.</p>

      <p>Shodan can sometimes help defenders discover externally visible infrastructure that was not included in expected inventories.</p>

      <h2>6. Cloud Infrastructure</h2>

      <p>Cloud environments can make attribution more complicated because IP addresses may belong to large providers. A Shodan record should therefore be combined with DNS, certificate, hostname, and organizational evidence.</p>

      <h2>7. Development Systems</h2>

      <p>Development and staging systems can accidentally become Internet-accessible. If such a system appears in an authorized defensive investigation, the security team should verify whether exposure is intended.</p>

      <h2>8. Administrative Services</h2>

      <p>Remote administration services can represent sensitive exposure depending on organizational architecture. The presence of an administration-related service should trigger contextual review rather than automatic exploitation.</p>

      <h2>9. Databases</h2>

      <p>Internet-visible database services deserve careful defensive attention. The investigator should record the observed service and verify whether the organization intentionally exposes it.</p>

      <p>No unauthorized login or data access should be attempted.</p>

      <h2>10. Vulnerability Misinterpretation</h2>

      <pre><code>Shodan:
Product Version Observed

Incorrect:
Therefore vulnerable

Correct:
Version observed
        ↓
Check vendor information
        ↓
Check patch context
        ↓
Assess applicability
        ↓
Validate if authorized</code></pre>

      <h2>11. Exposure Timeline</h2>

      <p>Repeated observations can help defenders understand whether a service has appeared or disappeared over time.</p>

      <pre><code>Month 1:
HTTPS only

Month 2:
HTTPS + additional service

Month 3:
HTTPS only

Observation:
Temporary service exposure</code></pre>

      <h2>12. Defensive Use</h2>

      <p>Security teams can use Shodan for:</p>

      <ul>
        <li>External attack-surface discovery</li>
        <li>Asset inventory validation</li>
        <li>Unexpected service detection</li>
        <li>Technology exposure review</li>
        <li>Security monitoring</li>
        <li>Third-party exposure assessment</li>
      </ul>

      <h2>13. Investigation Workflow</h2>

      <pre><code>Organization
 ↓
Domain
 ↓
DNS
 ↓
IP
 ↓
Shodan
 ↓
Service Exposure
 ↓
Cross-Check
 ↓
Risk Context
 ↓
Report</code></pre>

      <h2>14. Example Defensive Finding</h2>

      <p><strong>Finding:</strong> An Internet-facing service was observed on an infrastructure address associated with the organization.</p>

      <p><strong>Evidence:</strong> Shodan indexed the service during the observed collection period.</p>

      <p><strong>Assessment:</strong> Verify whether the service is authorized and required.</p>

      <p><strong>Recommendation:</strong> Compare the observation against the organization's external asset inventory.</p>

      <h2>15. Core Principle</h2>

      <p>Shodan is especially powerful for defensive attack-surface analysis because it provides an external view of Internet-facing infrastructure. Its observations become meaningful when compared against what an organization expects to expose.</p>
    `,
    keyPoints: [
      "Internet exposure is not automatically a vulnerability",
      "Unexpected services can indicate asset-management issues",
      "Cloud infrastructure complicates attribution",
      "Shodan can support shadow-IT discovery",
      "Version information requires validation",
      "Defensive analysis should compare external observations with asset inventories"
    ],
    example:
      "Compare an organization's approved external asset inventory with Shodan observations and flag unexpected services for defensive review.",
    estimatedTime: 70,
    order: 4,
    difficulty: "Intermediate",
    prerequisites: [
      "Shodan Filters, Banners, Certificates, and Technical Intelligence"
    ]
  },

  {
    lessonNumber: 5,
    title: "Shodan Pivoting and Cross-Tool Correlation",
    shortDescription:
      "Build multi-step OSINT investigations by connecting Shodan with WHOIS, DNS, certificates, URLScan, Nmap, and other ForenX tools.",
    objectives: [
      "Understand pivot-based investigation",
      "Connect Shodan with DNS",
      "Use certificate pivots",
      "Correlate Shodan with Nmap",
      "Build multi-source findings",
      "Evaluate conflicting evidence"
    ],
    content: `
      <h2>1. What Is Pivoting?</h2>

      <p>Pivoting means using one discovered piece of information to locate related information from another source.</p>

      <pre><code>Domain
 ↓
IP
 ↓
Shodan
 ↓
Hostname
 ↓
Certificate
 ↓
Related Domain
 ↓
DNS
 ↓
Additional Infrastructure</code></pre>

      <p>Pivoting is one of the most important OSINT skills because investigations rarely end with the first result.</p>

      <h2>2. WHOIS to Shodan</h2>

      <p>An investigation may begin with domain registration information. The investigator can identify infrastructure information and use appropriate public technical data as a pivot into Shodan.</p>

      <pre><code>WHOIS / RDAP
     ↓
Domain
     ↓
DNS
     ↓
IP
     ↓
Shodan</code></pre>

      <h2>3. DNS to Shodan</h2>

      <p>DNS records can identify IP addresses associated with hostnames. Shodan can then provide indexed service information associated with those addresses.</p>

      <h2>4. Certificate to Shodan</h2>

      <p>Certificate transparency can reveal hostnames. Those hostnames can become search pivots for Shodan investigation.</p>

      <pre><code>Certificate
 ↓
Hostname
 ↓
Shodan
 ↓
IP
 ↓
Services</code></pre>

      <h2>5. Shodan to DNS</h2>

      <p>The reverse workflow is also useful. A Shodan result may reveal a hostname or domain that can be investigated through DNS.</p>

      <h2>6. Shodan and URLScan</h2>

      <p>URLScan can provide web-observation information while Shodan can provide network-service observations.</p>

      <pre><code>Shodan
 ↓
HTTPS Service
 ↓
IP / Hostname

URLScan
 ↓
Web Request
 ↓
Observed Domain / Resources

Correlation
 ↓
Same Infrastructure?</code></pre>

      <h2>7. Shodan and Nmap</h2>

      <p>Nmap and Shodan provide different perspectives.</p>

      <pre><code>Shodan
Historical / Indexed Observation

Nmap
Current Authorized Scan

Compare
 ↓
Potential Infrastructure Change</code></pre>

      <p>For example, Shodan may show that a service was indexed previously while an authorized Nmap scan does not currently observe it.</p>

      <p>This difference may indicate that the service was removed, filtered, moved, or simply not reachable during the Nmap assessment.</p>

      <h2>8. Conflicting Evidence</h2>

      <p>Conflicts should not simply be ignored.</p>

      <pre><code>Shodan:
Port observed

Nmap:
Port not observed

Possible explanations:
- Time difference
- Firewall changes
- Service removal
- Network filtering
- Dynamic infrastructure
- Different scan conditions</code></pre>

      <h2>9. Correlation Matrix</h2>

      <table>
        <thead>
          <tr>
            <th>Source</th>
            <th>Observation</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>DNS</td>
            <td>Hostname resolves to IP</td>
          </tr>
          <tr>
            <td>Shodan</td>
            <td>Service indexed on IP</td>
          </tr>
          <tr>
            <td>Certificate</td>
            <td>Hostname appears in certificate</td>
          </tr>
          <tr>
            <td>URLScan</td>
            <td>Web activity observed</td>
          </tr>
          <tr>
            <td>Nmap</td>
            <td>Service observed during authorized scan</td>
          </tr>
        </tbody>
      </table>

      <h2>10. Confidence Assessment</h2>

      <p>When multiple independent sources agree, confidence in the relationship increases.</p>

      <pre><code>One Source
   ↓
Lead

Two Sources
   ↓
Stronger Evidence

Multiple Independent Sources
   ↓
High-Confidence Relationship</code></pre>

      <h2>11. ForenX Correlation Engine</h2>

      <p>ForenX can automate relationships between tool outputs.</p>

      <pre><code>Shodan Result
      +
DNS Result
      +
Certificate Result
      +
Nmap Result
      ↓
Correlation Engine
      ↓
Unified Finding</code></pre>

      <h2>12. Example Rule</h2>

      <p>A defensive correlation rule could be:</p>

      <blockquote>
        If Shodan reports an indexed service for an IP associated with a known investigation domain and an independent DNS observation resolves the domain to that IP, create a correlated infrastructure observation.
      </blockquote>

      <p>This is a relationship rule, not a vulnerability rule.</p>

      <h2>13. Evidence Graph</h2>

      <pre><code>Organization
     |
     v
example.com
     |
     v
203.0.113.10
     |
     +---- Shodan
     |       |
     |       +---- HTTPS
     |
     +---- Certificate
     |
     +---- DNS
     |
     +---- URLScan</code></pre>

      <p>This graph structure is useful for investigation reports.</p>

      <h2>14. Core Principle</h2>

      <p>The strongest OSINT investigations rarely depend on one tool. Shodan becomes significantly more useful when its technical observations are correlated with DNS, certificates, web telemetry, authorized Nmap results, and other evidence.</p>
    `,
    keyPoints: [
      "Pivoting connects one discovery to another investigation source",
      "DNS and certificates are strong infrastructure pivots",
      "Shodan and Nmap provide different temporal perspectives",
      "Conflicting observations should be investigated",
      "Multiple independent sources increase confidence",
      "ForenX can represent correlations as structured findings"
    ],
    example:
      "DNS → IP → Shodan → certificate → URLScan → authorized Nmap → Correlation Engine.",
    estimatedTime: 75,
    order: 5,
    difficulty: "Advanced",
    prerequisites: [
      "Shodan for Infrastructure and Attack-Surface Analysis",
      "Shodan Filters, Banners, Certificates, and Technical Intelligence"
    ]
  },

  {
    lessonNumber: 6,
    title: "Shodan in ForenX AI LearnOSINT",
    shortDescription:
      "Learn how Shodan integrates into ForenX through the Tool Explorer, AI Mentor, Recon Engine, Correlation Engine, simulation mode, and reporting system.",
    objectives: [
      "Understand Shodan's role in ForenX",
      "Use AI explanations for Shodan results",
      "Design safe investigation workflows",
      "Understand correlation rules",
      "Use simulation-based learning",
      "Integrate Shodan findings into reports"
    ],
    content: `
      <h2>1. Shodan Within ForenX</h2>

      <p>ForenX AI LearnOSINT is designed to combine OSINT education, practical investigation, AI assistance, and cybersecurity workflows. Shodan can act as a technical infrastructure-intelligence source inside this ecosystem.</p>

      <p>The platform should teach students how to interpret Shodan rather than simply showing search results.</p>

      <h2>2. Tool Explorer</h2>

      <p>The Tool Explorer can provide students with:</p>

      <ul>
        <li>Shodan overview</li>
        <li>Search concepts</li>
        <li>Filter explanations</li>
        <li>Banner interpretation</li>
        <li>Certificate concepts</li>
        <li>Investigation examples</li>
        <li>Evidence-preservation guidance</li>
      </ul>

      <h2>3. AI Mentor</h2>

      <p>The AI Mentor can explain technical fields in beginner-friendly language.</p>

      <pre><code>User:
What does a Shodan banner mean?

AI Mentor:
A banner is information returned by a network
service that can describe the service or software.
It is an observation and should be validated before
drawing security conclusions.</code></pre>

      <h2>4. AI Search Guidance</h2>

      <p>The platform can teach students how to construct searches based on an investigation objective.</p>

      <pre><code>Objective:
Understand external web-service exposure

AI Guidance:
Start with a permitted domain or infrastructure
pivot, review indexed services, record relevant
observations, and cross-check important findings.</code></pre>

      <h2>5. Recon Engine Integration</h2>

      <p>The Recon Engine can combine passive infrastructure information with Shodan observations.</p>

      <pre><code>Domain
 ↓
DNS
 ↓
IP
 ↓
Shodan
 ↓
Service Metadata</code></pre>

      <h2>6. Correlation Engine</h2>

      <p>The Correlation Engine can connect Shodan records to other evidence.</p>

      <pre><code>Shodan
+
WHOIS
+
DNS
+
Certificate
+
URLScan
+
Nmap
↓
Correlation
↓
Unified Investigation Context</code></pre>

      <h2>7. Example Correlation</h2>

      <p>Suppose a domain resolves to an IP address, Shodan reports an HTTPS service on that IP, and certificate data contains the same hostname.</p>

      <pre><code>DNS:
example.com → 203.0.113.10

Shodan:
203.0.113.10 → HTTPS

Certificate:
example.com

Result:
Strong infrastructure relationship</code></pre>

      <h2>8. Simulation Mode</h2>

      <p>Simulation Mode is valuable because students do not need to investigate real organizations to learn the workflow.</p>

      <pre><code>Fictional Organization
       ↓
Fictional Domain
       ↓
Simulated DNS
       ↓
Simulated Shodan Data
       ↓
Student Investigation
       ↓
AI Feedback</code></pre>

      <h2>9. Investigation Missions</h2>

      <p>A story-based mission could ask students to investigate a fictional organization's external infrastructure.</p>

      <p>The student may be given:</p>

      <ul>
        <li>Organization name</li>
        <li>Domain</li>
        <li>Known hostname</li>
        <li>Initial IP address</li>
      </ul>

      <p>The student then uses Shodan and other permitted modules to build an infrastructure profile.</p>

      <h2>10. Evidence Notebook</h2>

      <p>Each Shodan observation can become an evidence item.</p>

      <pre><code>Evidence ID:
SHODAN-001

Source:
Shodan

Query:
Documented investigation query

Target:
Investigation infrastructure

Observation:
HTTPS service indexed

Timestamp:
Recorded by investigator

Confidence:
Medium

Related Evidence:
DNS-001
CERT-001</code></pre>

      <h2>11. Automated Explanation</h2>

      <p>ForenX can convert technical fields into beginner-readable explanations.</p>

      <pre><code>Technical:
ASN information

AI Explanation:
The ASN identifies the network organization
associated with the routing infrastructure. It does
not necessarily identify the final application owner.</code></pre>

      <h2>12. Report Generation</h2>

      <p>Shodan observations can be incorporated into an investigation report.</p>

      <pre><code>Executive Summary
        ↓
Infrastructure Overview
        ↓
Shodan Observations
        ↓
DNS Correlation
        ↓
Certificate Correlation
        ↓
Risk Context
        ↓
Recommendations</code></pre>

      <h2>13. Learning Analytics</h2>

      <p>ForenX can evaluate whether students understand:</p>

      <ul>
        <li>Shodan terminology</li>
        <li>Search filtering</li>
        <li>Banner analysis</li>
        <li>Infrastructure attribution</li>
        <li>Pivoting</li>
        <li>Evidence classification</li>
        <li>Correlation</li>
      </ul>

      <h2>14. Core Principle</h2>

      <p>ForenX should use Shodan as an educational intelligence source, not simply as a search box. The learning workflow should connect search skills, technical interpretation, correlation, evidence preservation, and professional reporting.</p>
    `,
    keyPoints: [
      "Shodan can be integrated into the ForenX Recon Engine",
      "AI Mentor can explain banners and technical metadata",
      "Simulation Mode enables safe fictional investigations",
      "Correlation Engine can connect Shodan with DNS and certificates",
      "Evidence notebooks preserve investigation context",
      "Shodan findings can become structured report sections"
    ],
    example:
      "Fictional domain → simulated DNS → Shodan observation → AI explanation → correlation → evidence notebook → report.",
    estimatedTime: 70,
    order: 6,
    difficulty: "Advanced",
    prerequisites: [
      "Shodan Pivoting and Cross-Tool Correlation"
    ]
  },

  {
    lessonNumber: 7,
    title: "Shodan Evidence Preservation and Practical Investigation Lab",
    shortDescription:
      "Perform a controlled Shodan investigation using a fictional or authorized target and document queries, observations, timestamps, pivots, and evidence.",
    objectives: [
      "Plan a Shodan investigation",
      "Construct search queries",
      "Analyze banners",
      "Perform technical pivots",
      "Preserve evidence",
      "Create structured findings"
    ],
    content: `
      <h2>1. Laboratory Objective</h2>

      <p>This practical laboratory teaches students how to conduct a responsible Shodan-based infrastructure investigation. Use a fictional training scenario or an organization and infrastructure for which investigation is explicitly authorized.</p>

      <p>The exercise focuses on searching and analyzing indexed information. Students must not attempt unauthorized authentication, exploitation, or access to discovered systems.</p>

      <h2>2. Scenario</h2>

      <p>Assume a fictional organization called <strong>Northwind Training Labs</strong> has provided a domain for a cybersecurity OSINT exercise.</p>

      <pre><code>Organization:
Northwind Training Labs

Domain:
training.example

Objective:
Create an external infrastructure profile</code></pre>

      <h2>3. Investigation Plan</h2>

      <pre><code>Organization
 ↓
Domain
 ↓
DNS
 ↓
IP
 ↓
Shodan
 ↓
Services
 ↓
Certificates
 ↓
Correlation
 ↓
Report</code></pre>

      <h2>4. Evidence Log</h2>

      <p>Create an evidence table before beginning.</p>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Source</th>
            <th>Observation</th>
            <th>Timestamp</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>SH-001</td>
            <td>Shodan</td>
            <td>Indexed service</td>
            <td>Recorded time</td>
          </tr>
          <tr>
            <td>DNS-001</td>
            <td>DNS</td>
            <td>Hostname resolution</td>
            <td>Recorded time</td>
          </tr>
          <tr>
            <td>CERT-001</td>
            <td>Certificate</td>
            <td>Hostname relationship</td>
            <td>Recorded time</td>
          </tr>
        </tbody>
      </table>

      <h2>5. Step One — Search</h2>

      <p>Begin with the authorized domain or investigation pivot.</p>

      <pre><code>hostname:"training.example"</code></pre>

      <p>Record the exact query and the date of the investigation.</p>

      <h2>6. Step Two — Review Results</h2>

      <p>For each relevant result, record:</p>

      <ul>
        <li>IP address</li>
        <li>Port</li>
        <li>Protocol</li>
        <li>Service</li>
        <li>Product</li>
        <li>Hostname</li>
        <li>Organization</li>
        <li>ASN</li>
        <li>Certificate details where available</li>
      </ul>

      <h2>7. Step Three — Identify Pivots</h2>

      <p>Choose useful fields for further investigation.</p>

      <pre><code>Shodan Result
 |
 +---- IP
 |
 +---- Hostname
 |
 +---- Domain
 |
 +---- Certificate
 |
 +---- ASN</code></pre>

      <h2>8. Step Four — Cross-Check</h2>

      <p>Use independent sources to validate important relationships.</p>

      <pre><code>Shodan:
203.0.113.10

DNS:
training.example → 203.0.113.10

Certificate:
training.example

Conclusion:
Multiple sources support the relationship.</code></pre>

      <h2>9. Step Five — Analyze Exposure</h2>

      <p>Ask:</p>

      <ul>
        <li>What services appear exposed?</li>
        <li>Are they expected?</li>
        <li>Is the information current?</li>
        <li>Does another source confirm it?</li>
        <li>Does the service require defensive review?</li>
      </ul>

      <h2>10. Step Six — Record Limitations</h2>

      <p>Possible limitations include:</p>

      <ul>
        <li>Shodan collection date</li>
        <li>Dynamic IP addresses</li>
        <li>Cloud hosting</li>
        <li>Shared infrastructure</li>
        <li>Incomplete banners</li>
        <li>Geolocation uncertainty</li>
      </ul>

      <h2>11. Step Seven — Build a Finding</h2>

      <pre><code>Finding ID:
SH-001

Observation:
HTTPS service indexed on infrastructure
associated with the investigation domain.

Evidence:
Shodan result + DNS + certificate

Confidence:
High

Assessment:
Infrastructure relationship confirmed by
multiple sources.

Recommendation:
Verify against authorized asset inventory.</code></pre>

      <h2>12. Step Eight — Create an Evidence Timeline</h2>

      <pre><code>10:00
Domain identified

10:05
DNS record collected

10:10
Shodan result reviewed

10:15
Certificate relationship identified

10:20
Correlation completed

10:30
Finding documented</code></pre>

      <h2>13. Practical Questions</h2>

      <ol>
        <li>What was the initial investigation pivot?</li>
        <li>Which Shodan query was used?</li>
        <li>What technical information was returned?</li>
        <li>Which fields became useful pivots?</li>
        <li>Which independent sources were used?</li>
        <li>What confidence level was assigned?</li>
        <li>What limitations affected the finding?</li>
      </ol>

      <h2>14. Final Report</h2>

      <p>The student should produce a short report containing:</p>

      <ol>
        <li>Objective</li>
        <li>Scope</li>
        <li>Queries</li>
        <li>Results</li>
        <li>Technical observations</li>
        <li>Correlations</li>
        <li>Evidence</li>
        <li>Limitations</li>
        <li>Conclusion</li>
      </ol>

      <h2>15. Safety Reminder</h2>

      <p>The purpose of this laboratory is OSINT analysis. Do not attempt to log into, exploit, modify, or access discovered systems unless the laboratory explicitly provides authorization for those actions.</p>

      <h2>16. Core Principle</h2>

      <p>A good Shodan investigation is reproducible. Another investigator should be able to understand which query was used, what was observed, when it was observed, how it was validated, and why the conclusion was reached.</p>
    `,
    keyPoints: [
      "Use fictional or explicitly authorized investigation targets",
      "Record exact queries",
      "Record timestamps",
      "Capture relevant technical fields",
      "Validate important observations independently",
      "Document limitations and confidence"
    ],
    example:
      "Authorized domain → Shodan query → indexed service → DNS validation → certificate validation → structured evidence finding.",
    estimatedTime: 85,
    order: 7,
    difficulty: "Advanced",
    prerequisites: [
      "Shodan in ForenX AI LearnOSINT",
      "Shodan Pivoting and Cross-Tool Correlation"
    ]
  },

  {
    lessonNumber: 8,
    title: "Complete Shodan Investigation and Final Assessment",
    shortDescription:
      "Master the complete Shodan OSINT workflow from search planning and query construction to infrastructure correlation, evidence preservation, and professional reporting.",
    objectives: [
      "Plan a complete Shodan investigation",
      "Construct effective queries",
      "Analyze technical metadata",
      "Perform infrastructure pivots",
      "Correlate multiple sources",
      "Produce a professional report"
    ],
    content: `
      <h2>1. Complete Shodan Investigation Methodology</h2>

      <p>A complete Shodan investigation combines search-engine skills, technical interpretation, infrastructure mapping, evidence preservation, and cross-source validation.</p>

      <pre><code>Objective
 ↓
Scope
 ↓
Initial Pivot
 ↓
Shodan Search
 ↓
Filter Results
 ↓
Analyze Banners
 ↓
Extract Pivots
 ↓
Cross-Validate
 ↓
Correlate
 ↓
Assess
 ↓
Preserve Evidence
 ↓
Report</code></pre>

      <h2>2. Phase One — Define the Objective</h2>

      <p>Begin with a specific question.</p>

      <ul>
        <li>What Internet-facing services are associated with an authorized asset?</li>
        <li>Does external infrastructure match the organization's inventory?</li>
        <li>Are unexpected services visible?</li>
        <li>What technology information is publicly exposed?</li>
      </ul>

      <h2>3. Phase Two — Define Scope</h2>

      <p>Specify the organization, domain, IP range, or fictional training target that is permitted for investigation.</p>

      <p>Do not expand the investigation to unrelated systems merely because Shodan makes them discoverable.</p>

      <h2>4. Phase Three — Initial Search</h2>

      <p>Start with the strongest known pivot.</p>

      <pre><code>Known Domain
     ↓
Hostname Search
     ↓
IP Search
     ↓
Service Search</code></pre>

      <h2>5. Phase Four — Query Refinement</h2>

      <p>Use filters to reduce noise.</p>

      <pre><code>Broad Search
 ↓
Organization
 ↓
Hostname
 ↓
Port
 ↓
Product
 ↓
Relevant Result</code></pre>

      <h2>6. Phase Five — Banner Analysis</h2>

      <p>For every important result, determine what the banner actually establishes.</p>

      <pre><code>Observed:
Service

Observed:
Product

Observed:
Version String

Not Automatically Established:
Vulnerability
Ownership
Current Availability</code></pre>

      <h2>7. Phase Six — Infrastructure Mapping</h2>

      <pre><code>Organization
      |
      +---- Domain
      |
      +---- Hostname
      |
      +---- IP
      |
      +---- ASN
      |
      +---- Services
      |
      +---- Certificates</code></pre>

      <p>This structure can become the basis for an infrastructure profile.</p>

      <h2>8. Phase Seven — Certificate Correlation</h2>

      <p>Certificate information can connect multiple hostnames and domains.</p>

      <pre><code>Certificate
   ↓
Hostname A
Hostname B
Hostname C
   ↓
Infrastructure Relationship
</code></pre>

      <p>Each relationship should be validated rather than assumed.</p>

      <h2>9. Phase Eight — DNS Correlation</h2>

      <p>DNS provides another independent source for confirming relationships between domains and IP addresses.</p>

      <pre><code>Domain
 ↓
DNS
 ↓
IP

Shodan
 ↓
Same IP
 ↓
Service

Conclusion:
Correlated observation</code></pre>

      <h2>10. Phase Nine — Compare With Nmap</h2>

      <p>When authorized, Nmap can provide a current active observation while Shodan provides indexed historical or collected information.</p>

      <pre><code>Shodan:
443 observed

Authorized Nmap:
443 currently observed

Correlation:
Consistent observation</code></pre>

      <p>If they differ, document the discrepancy rather than selecting the result that appears more convenient.</p>

      <h2>11. Phase Ten — Security Interpretation</h2>

      <p>Evaluate whether the exposure requires defensive review.</p>

      <ul>
        <li>Is the service expected?</li>
        <li>Is it documented?</li>
        <li>Is it necessary?</li>
        <li>Is the software maintained?</li>
        <li>Is sensitive metadata exposed?</li>
        <li>Is the infrastructure correctly attributed?</li>
      </ul>

      <h2>12. Phase Eleven — Confidence</h2>

      <pre><code>Single Shodan Observation
        ↓
Lead

Shodan + DNS
        ↓
Stronger Relationship

Shodan + DNS + Certificate
        ↓
High-Confidence Infrastructure Relationship</code></pre>

      <h2>13. Phase Twelve — Evidence Preservation</h2>

      <p>Preserve:</p>

      <ul>
        <li>Investigation objective</li>
        <li>Scope</li>
        <li>Search query</li>
        <li>Result URL or identifier where appropriate</li>
        <li>IP address</li>
        <li>Port</li>
        <li>Service</li>
        <li>Banner information</li>
        <li>Certificate metadata</li>
        <li>Timestamp</li>
        <li>Cross-source evidence</li>
        <li>Interpretation</li>
      </ul>

      <h2>14. Phase Thirteen — ForenX Correlation</h2>

      <pre><code>WHOIS
  |
DNS
  |
Certificate
  |
Shodan
  |
URLScan
  |
Nmap
  |
Recon Engine
  |
Correlation Engine
  |
Unified Finding</code></pre>

      <p>This is where Shodan becomes part of a broader investigation rather than an isolated tool.</p>

      <h2>15. Example Final Finding</h2>

      <p><strong>Finding:</strong> Internet-facing HTTPS service associated with an investigation domain was observed in Shodan.</p>

      <p><strong>Evidence:</strong> Shodan indexed the service on the identified IP. DNS independently resolved the domain to the same address, and certificate information contained the expected hostname.</p>

      <p><strong>Confidence:</strong> High for the infrastructure relationship.</p>

      <p><strong>Security assessment:</strong> The exposure should be compared against the authorized external asset inventory. The observation alone does not establish a vulnerability.</p>

      <h2>16. Common Mistakes</h2>

      <ul>
        <li>Assuming Shodan data is always current</li>
        <li>Assuming IP ownership equals application ownership</li>
        <li>Treating banners as guaranteed truth</li>
        <li>Calling every exposed service a vulnerability</li>
        <li>Ignoring timestamps</li>
        <li>Failing to cross-check important findings</li>
        <li>Ignoring cloud and shared hosting</li>
        <li>Attempting unauthorized access</li>
        <li>Failing to record the search query</li>
      </ul>

      <h2>17. Final Assessment Questions</h2>

      <ol>
        <li>What is Shodan?</li>
        <li>How does Shodan differ from Google?</li>
        <li>How does Shodan differ from Nmap?</li>
        <li>What is a service banner?</li>
        <li>Why can banner information be unreliable?</li>
        <li>What is the purpose of the port filter?</li>
        <li>Why should country information be interpreted cautiously?</li>
        <li>What is an ASN?</li>
        <li>How can certificates become investigation pivots?</li>
        <li>How can DNS validate Shodan findings?</li>
        <li>Why is timestamp information important?</li>
        <li>Why can Shodan and Nmap produce different results?</li>
        <li>What is infrastructure pivoting?</li>
        <li>How can Shodan support attack-surface management?</li>
        <li>Why is an exposed service not automatically a vulnerability?</li>
        <li>What evidence should be preserved?</li>
        <li>How can Shodan integrate with the ForenX Correlation Engine?</li>
      </ol>

      <h2>18. Final Practical Challenge</h2>

      <p>Using a fictional or explicitly authorized investigation scenario, construct a complete infrastructure profile.</p>

      <p>Your workflow should include:</p>

      <ol>
        <li>Define the investigation objective</li>
        <li>Define scope</li>
        <li>Select an initial pivot</li>
        <li>Construct a Shodan query</li>
        <li>Apply appropriate filters</li>
        <li>Review indexed services</li>
        <li>Analyze banners</li>
        <li>Extract IP and hostname pivots</li>
        <li>Review certificate relationships</li>
        <li>Cross-check DNS</li>
        <li>Compare with other permitted intelligence sources</li>
        <li>Classify observations</li>
        <li>Assign confidence</li>
        <li>Preserve evidence</li>
        <li>Create a professional report</li>
      </ol>

      <h2>19. Professional Checklist</h2>

      <ul>
        <li>☐ Define objective</li>
        <li>☐ Confirm scope</li>
        <li>☐ Select initial pivot</li>
        <li>☐ Record exact query</li>
        <li>☐ Record timestamp</li>
        <li>☐ Review relevant results</li>
        <li>☐ Analyze service banners</li>
        <li>☐ Identify technical pivots</li>
        <li>☐ Check certificate information</li>
        <li>☐ Validate DNS relationships</li>
        <li>☐ Compare independent sources</li>
        <li>☐ Record conflicting evidence</li>
        <li>☐ Assign confidence</li>
        <li>☐ Preserve evidence</li>
        <li>☐ Separate observations from conclusions</li>
        <li>☐ Generate final report</li>
      </ul>

      <h2>20. Final Takeaway</h2>

      <p>Shodan demonstrates an important principle of modern cybersecurity: Internet-facing infrastructure can expose technical information that becomes searchable and useful for intelligence gathering.</p>

      <p>The tool is valuable for understanding services, banners, certificates, network ownership, infrastructure relationships, and external attack surface. However, the information must always be interpreted with awareness of collection time, infrastructure ownership, cloud hosting, shared services, and other sources of uncertainty.</p>

      <p>The strongest Shodan investigations use it as one component of a larger OSINT workflow. DNS, WHOIS/RDAP, certificates, URLScan, technology detection, and authorized Nmap observations can all contribute additional context.</p>

      <p>Within ForenX AI LearnOSINT, Shodan can become a powerful educational component because the platform can teach not only search syntax but also pivoting, evidence preservation, correlation, AI-assisted explanation, simulation, and professional reporting.</p>

      <p>Remember the complete workflow:</p>

      <blockquote>
        <strong>Objective → Scope → Search → Filter → Analyze → Pivot → Correlate → Validate → Preserve → Report.</strong>
      </blockquote>

      <p>Most importantly, discovering an Internet-facing system does not grant permission to interact with it. Professional OSINT begins with clear scope and ends with evidence-based conclusions.</p>
    `,
    keyPoints: [
      "A complete Shodan investigation follows a structured workflow",
      "Search results must be interpreted in temporal and infrastructure context",
      "Certificates, DNS, ASN, and hostnames provide useful pivots",
      "Shodan and Nmap can provide complementary perspectives",
      "Important findings should be independently validated",
      "Evidence preservation makes investigations reproducible",
      "ForenX can combine Shodan with its Recon and Correlation Engines",
      "Exposure should not automatically be classified as vulnerability"
    ],
    example:
      "Objective → scope → Shodan search → filters → banner analysis → infrastructure pivots → DNS/certificate correlation → evidence preservation → professional report.",
    estimatedTime: 90,
    order: 8,
    difficulty: "Advanced",
    prerequisites: [
      "Shodan Fundamentals for OSINT",
      "Shodan Search and Query Construction",
      "Shodan Filters, Banners, Certificates, and Technical Intelligence",
      "Shodan for Infrastructure and Attack-Surface Analysis",
      "Shodan Pivoting and Cross-Tool Correlation",
      "Shodan in ForenX AI LearnOSINT",
      "Shodan Evidence Preservation and Practical Investigation Lab"
    ]
  }
];

module.exports = toolLessons;