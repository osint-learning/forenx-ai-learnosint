const toolLessons = [
  {
    lessonNumber: 1,
    title: "SpiderFoot Fundamentals for Automated OSINT",
    shortDescription:
      "Understand SpiderFoot, automated OSINT collection, scan targets, modules, events, and how automated reconnaissance fits into a structured investigation.",
    objectives: [
      "Understand what SpiderFoot is",
      "Understand automated OSINT collection",
      "Learn the concept of SpiderFoot modules",
      "Understand targets and scan scopes",
      "Learn how SpiderFoot represents findings",
      "Understand responsible automated reconnaissance"
    ],
    content: `
      <h2>1. Introduction to SpiderFoot</h2>

      <p>SpiderFoot is an automated open-source intelligence and reconnaissance platform designed to collect information from a wide range of public sources. Instead of requiring an investigator to manually visit many individual services, SpiderFoot can automate portions of the collection process and organize the resulting observations.</p>

      <p>This makes SpiderFoot particularly useful for cybersecurity education because it demonstrates how multiple OSINT sources can be combined into a larger investigation workflow.</p>

      <p>ForenX AI LearnOSINT can use SpiderFoot as an example of automated OSINT collection while teaching students an important principle: automation can collect information quickly, but the investigator remains responsible for understanding, validating, correlating, and reporting the results.</p>

      <h2>2. What Makes SpiderFoot Different?</h2>

      <p>A traditional OSINT investigation might involve manually using separate tools:</p>

      <pre><code>WHOIS
DNS
Search Engines
Certificates
Threat Intelligence
Subdomains
Email Sources
Historical Data</code></pre>

      <p>SpiderFoot can coordinate many types of collection through modules.</p>

      <pre><code>Target
   ↓
SpiderFoot
   ↓
Multiple Modules
   ↓
Collected Events
   ↓
Relationships
   ↓
Investigation Results</code></pre>

      <h2>3. What Is Automated OSINT?</h2>

      <p>Automated OSINT means using software to perform repetitive collection and organization tasks that would otherwise require manual effort.</p>

      <p>Automation can help with:</p>

      <ul>
        <li>Querying multiple sources</li>
        <li>Collecting DNS information</li>
        <li>Finding related domains</li>
        <li>Identifying IP addresses</li>
        <li>Collecting hostname information</li>
        <li>Checking public threat-intelligence sources</li>
        <li>Identifying relationships between findings</li>
        <li>Organizing large amounts of collected data</li>
      </ul>

      <h2>4. SpiderFoot Modules</h2>

      <p>SpiderFoot uses modules to perform different collection or analysis tasks. Each module generally has a particular purpose and may consume one type of data while producing another.</p>

      <pre><code>Target
  ↓
Module A → Domain Information
  ↓
Module B → DNS Information
  ↓
Module C → IP Information
  ↓
Module D → Related Infrastructure
  ↓
Module E → Threat Intelligence</code></pre>

      <p>This modular architecture allows SpiderFoot to expand the investigation beyond the original target.</p>

      <h2>5. Targets</h2>

      <p>A target is the starting point of a SpiderFoot investigation. Depending on the configuration and investigation purpose, a target may be a domain, IP address, hostname, email address, username, or another supported entity.</p>

      <p>For educational work, students should use domains and infrastructure belonging to their own laboratory environment, fictional scenarios, or targets explicitly authorized for investigation.</p>

      <h2>6. Events</h2>

      <p>SpiderFoot represents collected information as events or observations. An event may describe something discovered about a target or a related entity.</p>

      <pre><code>Target:
example.com

Event:
IP address associated with target

Event:
Hostname discovered

Event:
Certificate relationship

Event:
Related domain</code></pre>

      <p>Events can become investigation pivots.</p>

      <h2>7. SpiderFoot as a Graph-Like Investigation</h2>

      <pre><code>Domain
 |
 +---- IP
 |      |
 |      +---- Hostname
 |
 +---- Certificate
 |
 +---- Subdomain
 |
 +---- Related Entity
</code></pre>

      <p>This relationship-oriented approach is one of SpiderFoot's most useful characteristics for OSINT investigations.</p>

      <h2>8. Automation Does Not Mean Accuracy</h2>

      <p>One of the most important lessons is that automated collection can produce false positives, duplicate information, stale records, or ambiguous relationships.</p>

      <p>Therefore:</p>

      <pre><code>Automation
    ↓
Collection
    ↓
Validation
    ↓
Correlation
    ↓
Human Interpretation
    ↓
Conclusion</code></pre>

      <h2>9. SpiderFoot and Manual OSINT</h2>

      <p>Manual investigation provides detailed control over every search. SpiderFoot provides scale and automation.</p>

      <table>
        <thead>
          <tr>
            <th>Approach</th>
            <th>Strength</th>
            <th>Limitation</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Manual OSINT</td>
            <td>Detailed investigator control</td>
            <td>Time-consuming</td>
          </tr>
          <tr>
            <td>SpiderFoot</td>
            <td>Automated multi-source collection</td>
            <td>Requires validation</td>
          </tr>
        </tbody>
      </table>

      <h2>10. Why SpiderFoot Matters to Cybersecurity</h2>

      <p>Organizations can have large external attack surfaces. Automated OSINT can help defenders identify assets, relationships, and publicly visible information more efficiently.</p>

      <h2>11. Defensive Uses</h2>

      <ul>
        <li>External asset discovery</li>
        <li>Domain intelligence</li>
        <li>Subdomain discovery</li>
        <li>Infrastructure mapping</li>
        <li>Threat-intelligence enrichment</li>
        <li>Exposure assessment</li>
        <li>Security investigations</li>
      </ul>

      <h2>12. Responsible Use</h2>

      <p>SpiderFoot may query many external services. Investigators must therefore understand the scope and behavior of the modules they enable.</p>

      <p>Students should never assume that because a tool automates a task, every discovered system is authorized for further interaction.</p>

      <h2>13. Beginner Example</h2>

      <p>Consider a fictional training domain:</p>

      <pre><code>training.example</code></pre>

      <p>A SpiderFoot scan may discover relationships such as:</p>

      <pre><code>training.example
      ↓
www.training.example
      ↓
203.0.113.10
      ↓
Certificate
      ↓
Related hostname</code></pre>

      <p>The student then validates important relationships using independent sources.</p>

      <h2>14. Core Principle</h2>

      <p>SpiderFoot is best understood as an automation framework for OSINT collection. Its value is not simply the number of results it produces but the ability to organize many observations into an investigation that can subsequently be validated and interpreted.</p>
    `,
    keyPoints: [
      "SpiderFoot automates portions of OSINT collection",
      "Modules perform different collection or analysis tasks",
      "Targets provide the starting point of an investigation",
      "Events represent collected observations",
      "Automation does not guarantee accuracy",
      "Human validation remains essential"
    ],
    example:
      "Scan an authorized or fictional domain with appropriate SpiderFoot modules, review discovered events, and validate important relationships independently.",
    estimatedTime: 50,
    order: 1,
    difficulty: "Beginner",
    prerequisites: []
  },

  {
    lessonNumber: 2,
    title: "SpiderFoot Installation, Interface, Targets, and Scan Configuration",
    shortDescription:
      "Learn how SpiderFoot is organized, how scans are configured, how targets are selected, and how module selection affects collection.",
    objectives: [
      "Understand SpiderFoot deployment",
      "Understand the SpiderFoot interface",
      "Create an authorized scan",
      "Configure scan modules",
      "Understand scan scope",
      "Interpret scan configuration"
    ],
    content: `
      <h2>1. SpiderFoot Deployment</h2>

      <p>SpiderFoot can be used as a self-hosted OSINT platform. The exact installation process depends on the version and operating system, so students should follow the official documentation for the current release.</p>

      <p>For a cybersecurity learning environment, a local installation is useful because it allows students to experiment with scan configuration and result analysis without depending entirely on external hosted systems.</p>

      <h2>2. SpiderFoot Interface</h2>

      <p>The SpiderFoot interface is designed around managing scans and reviewing collected information. A typical workflow includes selecting a target, choosing scan modules, starting the scan, and examining the resulting data.</p>

      <pre><code>SpiderFoot
   |
   +---- New Scan
   |
   +---- Target
   |
   +---- Modules
   |
   +---- Scan
   |
   +---- Results
   |
   +---- Analysis</code></pre>

      <h2>3. Choosing a Target</h2>

      <p>The target should be selected according to the investigation objective.</p>

      <p>For example:</p>

      <pre><code>Objective:
Map a fictional organization's external infrastructure

Target:
training.example</code></pre>

      <p>The target should be explicitly authorized or part of a controlled training scenario.</p>

      <h2>4. Scan Scope</h2>

      <p>Scope determines what information the investigator is trying to collect. A narrow investigation might focus on DNS and infrastructure. A broader assessment might involve additional public intelligence sources.</p>

      <h2>5. Module Selection</h2>

      <p>SpiderFoot's modular architecture allows investigators to select modules according to the investigation.</p>

      <pre><code>Investigation Goal
       ↓
Select Relevant Modules
       ↓
Run Scan
       ↓
Review Events</code></pre>

      <p>Using every available module is not always the best approach. A focused scan can produce cleaner and more understandable results.</p>

      <h2>6. Why Module Selection Matters</h2>

      <p>Different modules can produce different types of events and may interact with external services. Selecting only appropriate modules helps maintain scope and reduce unnecessary collection.</p>

      <h2>7. API Keys</h2>

      <p>Some SpiderFoot modules can integrate with external services that require API keys. Students should understand which services require accounts, whether usage limits apply, and how credentials are stored.</p>

      <p>API credentials should never be hard-coded into public repositories.</p>

      <h2>8. Scan Configuration</h2>

      <p>A professional scan configuration should document:</p>

      <ul>
        <li>Target</li>
        <li>Objective</li>
        <li>Selected modules</li>
        <li>Excluded modules</li>
        <li>External services used</li>
        <li>Authorization scope</li>
        <li>Investigation date</li>
      </ul>

      <h2>9. Starting a Scan</h2>

      <p>After configuration, the scan can be started from the SpiderFoot interface.</p>

      <p>The investigator should avoid changing the scope during the scan unless the change has been documented and authorized.</p>

      <h2>10. Monitoring Progress</h2>

      <p>Automated scans may generate many events. Investigators should understand that the number of events does not necessarily indicate investigation quality.</p>

      <pre><code>100 Events
    ≠
100 Important Findings</code></pre>

      <h2>11. Scan Completion</h2>

      <p>After the scan completes, the investigator should review the results systematically instead of immediately accepting every event as a confirmed fact.</p>

      <h2>12. Basic Result Workflow</h2>

      <pre><code>All Events
    ↓
Remove Duplicates
    ↓
Group Related Events
    ↓
Identify Important Observations
    ↓
Cross-Check
    ↓
Findings</code></pre>

      <h2>13. Practical Configuration Exercise</h2>

      <p>Create a fictional training scan with:</p>

      <pre><code>Target:
training.example

Goal:
External infrastructure mapping

Focus:
Domain
DNS
Hostnames
IP addresses
Certificates</code></pre>

      <p>Select modules that support these objectives and avoid unrelated collection.</p>

      <h2>14. Configuration Documentation</h2>

      <pre><code>Scan ID:
SF-001

Target:
training.example

Objective:
Infrastructure mapping

Modules:
Documented selected modules

Start:
Recorded timestamp

End:
Recorded timestamp</code></pre>

      <h2>15. Security Considerations</h2>

      <p>Because SpiderFoot can automate interactions with external sources, students should understand that a scan may produce more activity than a single manual search. This makes scope management especially important.</p>

      <h2>16. Core Principle</h2>

      <p>Good SpiderFoot configuration starts with the investigation question. Select only the modules necessary to answer that question and document the configuration so that the investigation remains reproducible.</p>
    `,
    keyPoints: [
      "SpiderFoot can be self-hosted",
      "Targets should be explicitly authorized",
      "Module selection should match the investigation objective",
      "External API services may require credentials",
      "Scan configuration should be documented",
      "More events do not automatically mean better intelligence"
    ],
    example:
      "Create an authorized SpiderFoot scan for a fictional training domain and select only modules needed for domain, DNS, hostname, IP, and certificate intelligence.",
    estimatedTime: 55,
    order: 2,
    difficulty: "Beginner",
    prerequisites: [
      "SpiderFoot Fundamentals for Automated OSINT"
    ]
  },

  {
    lessonNumber: 3,
    title: "SpiderFoot Modules, Events, and Result Analysis",
    shortDescription:
      "Understand SpiderFoot's module-driven architecture, event types, relationships, duplicate results, confidence, and systematic result analysis.",
    objectives: [
      "Understand module relationships",
      "Understand event types",
      "Analyze SpiderFoot results",
      "Identify duplicate information",
      "Build investigation pivots",
      "Evaluate confidence"
    ],
    content: `
      <h2>1. Module-Driven Architecture</h2>

      <p>SpiderFoot's strength comes from its modular design. Individual modules can gather or process different forms of information, and the results can feed other parts of the investigation.</p>

      <pre><code>Input
 ↓
Module
 ↓
Event
 ↓
New Entity
 ↓
Another Module
 ↓
Additional Event</code></pre>

      <p>This creates an expanding investigation graph.</p>

      <h2>2. Event Concept</h2>

      <p>An event is a structured observation generated during the investigation. Events can represent different entity types or relationships.</p>

      <p>Examples include:</p>

      <ul>
        <li>Domain discovered</li>
        <li>Subdomain discovered</li>
        <li>IP address identified</li>
        <li>Hostname identified</li>
        <li>DNS information</li>
        <li>Certificate information</li>
        <li>Technology information</li>
        <li>Threat-intelligence observation</li>
      </ul>

      <h2>3. Event Relationships</h2>

      <pre><code>Domain
 |
 +---- Subdomain
 |       |
 |       +---- IP
 |
 +---- Certificate
 |
 +---- DNS
</code></pre>

      <p>Each relationship can become a pivot.</p>

      <h2>4. Entity Types</h2>

      <p>OSINT investigations commonly move between different entity types:</p>

      <pre><code>Domain
 ↓
Hostname
 ↓
IP
 ↓
ASN
 ↓
Organization
</code></pre>

      <p>SpiderFoot can automate portions of this relationship discovery.</p>

      <h2>5. Duplicate Results</h2>

      <p>Multiple modules may discover the same information. This is not necessarily a problem. Independent sources can actually increase confidence.</p>

      <pre><code>Module A:
203.0.113.10

Module B:
203.0.113.10

Result:
Same observation from multiple sources</code></pre>

      <p>The investigator should distinguish duplicate observations from independent confirmation.</p>

      <h2>6. False Positives</h2>

      <p>Automated tools can produce incorrect or ambiguous relationships. A discovered hostname does not automatically mean that it is currently owned or controlled by the investigated organization.</p>

      <h2>7. Validation</h2>

      <pre><code>SpiderFoot Event
       ↓
Independent Source
       ↓
Agreement?
   /       \\
 Yes       No
 ↓          ↓
Increase   Investigate
Confidence Discrepancy</code></pre>

      <h2>8. Confidence</h2>

      <p>Investigators can classify observations using confidence levels.</p>

      <table>
        <thead>
          <tr>
            <th>Level</th>
            <th>Meaning</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>High</td>
            <td>Multiple independent sources support the relationship.</td>
          </tr>
          <tr>
            <td>Medium</td>
            <td>SpiderFoot observation has supporting context.</td>
          </tr>
          <tr>
            <td>Low</td>
            <td>Single or ambiguous observation.</td>
          </tr>
        </tbody>
      </table>

      <h2>9. Result Filtering</h2>

      <p>Large scans may generate many events. Investigators should prioritize events that directly support the investigation objective.</p>

      <pre><code>All Events
 ↓
Relevant Events
 ↓
Important Entities
 ↓
Relationships
 ↓
Validated Findings</code></pre>

      <h2>10. Finding a Pivot</h2>

      <p>A pivot is an entity that can lead to additional information.</p>

      <p>For example:</p>

      <pre><code>New Hostname
     ↓
DNS Lookup
     ↓
IP
     ↓
Certificate
     ↓
Related Hostname</code></pre>

      <h2>11. Example Event Chain</h2>

      <pre><code>training.example
       ↓
www.training.example
       ↓
203.0.113.10
       ↓
HTTPS
       ↓
Certificate
       ↓
Additional hostname</code></pre>

      <p>This chain represents relationships that should be validated before being used as final findings.</p>

      <h2>12. Temporal Considerations</h2>

      <p>OSINT information changes over time. DNS records can change, domains can expire, certificates can be replaced, and IP addresses can be reassigned.</p>

      <p>Always record when the information was collected.</p>

      <h2>13. Source Attribution</h2>

      <p>A professional investigation should preserve which module or source produced each observation. This allows another investigator to reproduce or challenge the result.</p>

      <h2>14. Practical Exercise</h2>

      <p>Take a fictional SpiderFoot scan and classify 20 events into:</p>

      <ul>
        <li>Direct observations</li>
        <li>Pivots</li>
        <li>Duplicate observations</li>
        <li>Potentially relevant findings</li>
        <li>Low-confidence observations</li>
      </ul>

      <h2>15. Core Principle</h2>

      <p>SpiderFoot's large volume of automated results should be treated as a collection of leads and observations. The investigator's job is to reduce that information into validated, relevant, and explainable findings.</p>
    `,
    keyPoints: [
      "SpiderFoot modules produce structured events",
      "Events can create new investigation pivots",
      "Duplicate observations can provide independent confirmation",
      "Automated results can contain false positives",
      "Confidence should reflect evidence quality",
      "Timestamps and source attribution are important"
    ],
    example:
      "Domain event → hostname event → IP event → certificate event → independent validation → structured finding.",
    estimatedTime: 65,
    order: 3,
    difficulty: "Intermediate",
    prerequisites: [
      "SpiderFoot Installation, Interface, Targets, and Scan Configuration"
    ]
  },

  {
    lessonNumber: 4,
    title: "SpiderFoot for Infrastructure, Domains, Emails, and Threat Intelligence",
    shortDescription:
      "Learn how SpiderFoot can connect domains, infrastructure, email intelligence, public threat data, and other OSINT observations into a broader investigation.",
    objectives: [
      "Map external infrastructure",
      "Understand domain relationships",
      "Understand email intelligence",
      "Use threat-intelligence context",
      "Connect different entity types",
      "Avoid over-attribution"
    ],
    content: `
      <h2>1. Infrastructure Mapping</h2>

      <p>One major use of SpiderFoot is external infrastructure mapping. A domain can become the starting point for discovering related hostnames, addresses, certificates, and other public information.</p>

      <pre><code>Domain
 ↓
Subdomains
 ↓
Hostnames
 ↓
IP Addresses
 ↓
Network Information
 ↓
Related Infrastructure</code></pre>

      <h2>2. Domain Intelligence</h2>

      <p>Domain information can include relationships to other domains, hostnames, DNS records, and certificates.</p>

      <p>The investigator should distinguish between:</p>

      <ul>
        <li>Directly observed domain relationships</li>
        <li>Third-party references</li>
        <li>Historical relationships</li>
        <li>Potentially related domains</li>
      </ul>

      <h2>3. Subdomains</h2>

      <p>Subdomains can reveal the structure of an organization's public services.</p>

      <pre><code>example.com
 |
 +---- www.example.com
 +---- mail.example.com
 +---- vpn.example.com
 +---- portal.example.com</code></pre>

      <p>Not every discovered hostname is necessarily active or owned by the same operational team.</p>

      <h2>4. IP Infrastructure</h2>

      <p>IP addresses can be used as infrastructure pivots.</p>

      <pre><code>Hostname
 ↓
IP
 ↓
ASN
 ↓
Network Provider
 ↓
Infrastructure Context</code></pre>

      <p>Cloud providers and shared hosting can make direct attribution difficult.</p>

      <h2>5. Email Intelligence</h2>

      <p>Depending on configured modules and available sources, SpiderFoot can collect public information related to email addresses.</p>

      <p>Email intelligence can help identify:</p>

      <ul>
        <li>Publicly exposed addresses</li>
        <li>Domain relationships</li>
        <li>Public account references</li>
        <li>Threat-intelligence associations</li>
      </ul>

      <p>Investigators must avoid attempting account access or password-based attacks.</p>

      <h2>6. Username and Identity Relationships</h2>

      <p>Public usernames can sometimes connect identities across services. Automated discovery should always be treated as a lead because username collisions are common.</p>

      <pre><code>Username
 ↓
Possible Account
 ↓
Check Context
 ↓
Independent Validation</code></pre>

      <h2>7. Threat Intelligence</h2>

      <p>SpiderFoot can integrate with threat-intelligence sources depending on configuration. These sources can provide context about IP addresses, domains, hashes, or other indicators.</p>

      <p>A threat-intelligence hit should be validated because reputation databases can contain false positives, stale information, or different confidence levels.</p>

      <h2>8. Indicator Classification</h2>

      <table>
        <thead>
          <tr>
            <th>Indicator</th>
            <th>Example Interpretation</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>IP</td>
            <td>Infrastructure identifier</td>
          </tr>
          <tr>
            <td>Domain</td>
            <td>Internet naming identifier</td>
          </tr>
          <tr>
            <td>Email</td>
            <td>Public identity/contact indicator</td>
          </tr>
          <tr>
            <td>Hash</td>
            <td>File identifier</td>
          </tr>
          <tr>
            <td>Threat hit</td>
            <td>Security intelligence lead</td>
          </tr>
        </tbody>
      </table>

      <h2>9. Avoiding Attribution Errors</h2>

      <p>Finding a domain on an IP address does not always prove ownership of the entire server. Similarly, finding an email address on a public website does not prove that every account using that address belongs to the same person.</p>

      <p>Attribution requires context.</p>

      <h2>10. Cross-Source Validation</h2>

      <pre><code>SpiderFoot
 ↓
Potential Relationship
 ↓
DNS / WHOIS / Certificate
 ↓
Independent Evidence
 ↓
Confidence Assessment</code></pre>

      <h2>11. Example Infrastructure Investigation</h2>

      <pre><code>Target:
training.example

SpiderFoot:
subdomain discovered

DNS:
subdomain resolves to IP

Certificate:
same hostname appears

Result:
Multiple sources support relationship</code></pre>

      <h2>12. Threat-Intelligence Example</h2>

      <p>Suppose an IP appears in a threat-intelligence source. The correct response is not immediately to declare the organization malicious.</p>

      <p>Instead investigate:</p>

      <ul>
        <li>What indicator was reported?</li>
        <li>When was it reported?</li>
        <li>Who reported it?</li>
        <li>What behavior was associated with it?</li>
        <li>Is the indicator still relevant?</li>
        <li>Does independent evidence support it?</li>
      </ul>

      <h2>13. Evidence Classification</h2>

      <pre><code>Threat Intelligence Hit
        ↓
Indicator Observation
        ↓
Contextual Investigation
        ↓
Validation
        ↓
Risk Assessment</code></pre>

      <h2>14. Practical Exercise</h2>

      <p>Use a fictional domain and construct an infrastructure map containing at least:</p>

      <ul>
        <li>One domain</li>
        <li>Two hostnames</li>
        <li>One IP address</li>
        <li>One certificate relationship</li>
        <li>One external intelligence observation</li>
      </ul>

      <p>Label each relationship according to confidence.</p>

      <h2>15. Core Principle</h2>

      <p>SpiderFoot can connect many different OSINT categories, but automation should never replace attribution analysis. Every relationship should be evaluated according to source quality, timing, context, and independent evidence.</p>
    `,
    keyPoints: [
      "SpiderFoot can map domains and infrastructure",
      "Subdomains provide useful investigation pivots",
      "IP attribution can be complicated by cloud and shared hosting",
      "Email and username results require contextual validation",
      "Threat-intelligence hits are leads requiring assessment",
      "Cross-source validation improves confidence"
    ],
    example:
      "Domain → subdomain → IP → certificate → threat-intelligence context → independent validation.",
    estimatedTime: 70,
    order: 4,
    difficulty: "Intermediate",
    prerequisites: [
      "SpiderFoot Modules, Events, and Result Analysis"
    ]
  },

  {
    lessonNumber: 5,
    title: "Advanced SpiderFoot Pivoting, Correlation, and Investigation Strategy",
    shortDescription:
      "Build structured SpiderFoot investigations using pivots, relationship analysis, temporal context, source validation, and cross-tool correlation.",
    objectives: [
      "Understand advanced pivoting",
      "Build entity relationships",
      "Analyze temporal changes",
      "Resolve conflicting observations",
      "Correlate SpiderFoot with other tools",
      "Create high-confidence findings"
    ],
    content: `
      <h2>1. Advanced Pivoting</h2>

      <p>Advanced OSINT investigations use multiple pivots rather than following a single linear path. SpiderFoot is particularly useful for this because automated modules can discover relationships between different entity types.</p>

      <pre><code>Domain
 ↓
Hostname
 ↓
IP
 ↓
Certificate
 ↓
Related Hostname
 ↓
Second IP
 ↓
ASN
 ↓
Organization</code></pre>

      <h2>2. Pivot Selection</h2>

      <p>Not every discovered entity is equally valuable. A good pivot should have a clear relationship to the investigation and a reasonable probability of producing additional useful evidence.</p>

      <p>Useful pivots can include:</p>

      <ul>
        <li>Unique hostnames</li>
        <li>Specific IP addresses</li>
        <li>Certificate names</li>
        <li>Distinctive domains</li>
        <li>Public infrastructure identifiers</li>
      </ul>

      <h2>3. Relationship Strength</h2>

      <table>
        <thead>
          <tr>
            <th>Relationship</th>
            <th>Typical Strength</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>DNS domain → current IP</td>
            <td>Strong observation</td>
          </tr>
          <tr>
            <td>Certificate → hostname</td>
            <td>Strong technical relationship</td>
          </tr>
          <tr>
            <td>IP → organization</td>
            <td>Requires provider context</td>
          </tr>
          <tr>
            <td>Username → account</td>
            <td>Requires identity validation</td>
          </tr>
        </tbody>
      </table>

      <h2>4. Temporal OSINT</h2>

      <p>Infrastructure changes over time. A hostname that resolved to an IP last month may resolve somewhere else today.</p>

      <pre><code>January:
Domain → IP-A

March:
Domain → IP-B

Observation:
Infrastructure changed</code></pre>

      <p>The change itself can be valuable intelligence.</p>

      <h2>5. Historical Relationships</h2>

      <p>Historical data should be labeled as historical rather than presented as current infrastructure.</p>

      <h2>6. Conflicting Sources</h2>

      <pre><code>SpiderFoot:
IP-A

DNS:
IP-B

Possible reasons:
- Time difference
- DNS changes
- Multiple records
- Data collection delay
- Provider changes</code></pre>

      <p>The correct response is to investigate the discrepancy.</p>

      <h2>7. SpiderFoot and WHOIS</h2>

      <p>WHOIS or RDAP information can provide registration context while SpiderFoot provides broader automated relationships.</p>

      <pre><code>Domain
 ↓
SpiderFoot Relationships
 +
Registration Context
 ↓
Combined Investigation</code></pre>

      <h2>8. SpiderFoot and DNS Tools</h2>

      <p>Dedicated DNS tools can independently validate relationships discovered by SpiderFoot.</p>

      <pre><code>SpiderFoot:
Hostname → IP

DNS Lookup:
Hostname → IP

Result:
Independent confirmation</code></pre>

      <h2>9. SpiderFoot and Shodan</h2>

      <p>Shodan can provide indexed service observations while SpiderFoot can provide broader entity relationships.</p>

      <pre><code>SpiderFoot:
Domain → IP

Shodan:
IP → Indexed Service

Correlation:
Infrastructure relationship</code></pre>

      <h2>10. SpiderFoot and Nmap</h2>

      <p>In an explicitly authorized environment, Nmap can provide current active observations while SpiderFoot may provide public or previously collected intelligence.</p>

      <pre><code>SpiderFoot:
Service relationship

Nmap:
Current authorized scan

Compare:
Consistent / Changed / Uncertain</code></pre>

      <h2>11. Correlation Engine</h2>

      <p>ForenX can represent SpiderFoot results as structured entities and connect them with results from other tools.</p>

      <pre><code>SpiderFoot
    +
DNS
    +
WHOIS
    +
Shodan
    +
Certificate
    +
Nmap
    ↓
Correlation Engine
    ↓
Unified Investigation</code></pre>

      <h2>12. Example Correlation Rule</h2>

      <p>A defensive correlation rule could state:</p>

      <blockquote>
        If SpiderFoot discovers a hostname associated with an investigation domain, DNS resolves that hostname to an IP, and an independent source reports the same relationship, increase confidence in the infrastructure association.
      </blockquote>

      <p>This is an evidence-correlation rule rather than an automatic vulnerability rule.</p>

      <h2>13. Investigation Graph</h2>

      <pre><code>Organization
 |
 +---- Domain
 |       |
 |       +---- Subdomain
 |               |
 |               +---- IP
 |                     |
 |                     +---- Shodan
 |
 +---- Certificate
 |
 +---- DNS</code></pre>

      <p>Graph thinking helps investigators understand how individual observations relate.</p>

      <h2>14. Stopping Conditions</h2>

      <p>Automated OSINT can continue producing additional relationships indefinitely. Investigators should define stopping conditions.</p>

      <p>Examples:</p>

      <ul>
        <li>Investigation objective answered</li>
        <li>Scope exhausted</li>
        <li>New pivots no longer produce relevant information</li>
        <li>Evidence reaches sufficient confidence</li>
        <li>Further collection becomes repetitive</li>
      </ul>

      <h2>15. Core Principle</h2>

      <p>Advanced SpiderFoot work is not about maximizing the number of discovered entities. It is about building meaningful relationships, validating important observations, understanding temporal differences, and stopping when the investigation objective has been satisfied.</p>
    `,
    keyPoints: [
      "Advanced investigations use multiple pivots",
      "Relationship strength differs by entity type",
      "Temporal changes can explain conflicting observations",
      "SpiderFoot can complement DNS, Shodan, WHOIS, certificates, and Nmap",
      "ForenX can correlate SpiderFoot observations",
      "Investigations should have defined stopping conditions"
    ],
    example:
      "SpiderFoot hostname → DNS IP → Shodan service → certificate → authorized Nmap comparison → correlated finding.",
    estimatedTime: 75,
    order: 5,
    difficulty: "Advanced",
    prerequisites: [
      "SpiderFoot for Infrastructure, Domains, Emails, and Threat Intelligence",
      "SpiderFoot Modules, Events, and Result Analysis"
    ]
  },

  {
    lessonNumber: 6,
    title: "SpiderFoot in ForenX AI LearnOSINT",
    shortDescription:
      "Learn how SpiderFoot can integrate with ForenX's Tool Explorer, AI Mentor, Recon Engine, Correlation Engine, investigation missions, and reporting workflow.",
    objectives: [
      "Understand SpiderFoot's role in ForenX",
      "Integrate automated OSINT into investigations",
      "Use AI to explain SpiderFoot results",
      "Build correlation rules",
      "Use simulation mode",
      "Generate structured reports"
    ],
    content: `
      <h2>1. SpiderFoot Within ForenX</h2>

      <p>ForenX AI LearnOSINT is designed to combine learning, practical OSINT tools, AI guidance, investigation workflows, and reporting. SpiderFoot fits naturally into this architecture because it demonstrates how multiple OSINT collection activities can be automated and correlated.</p>

      <h2>2. Tool Explorer</h2>

      <p>The Tool Explorer can teach SpiderFoot through structured lessons covering:</p>

      <ul>
        <li>Automated OSINT concepts</li>
        <li>Module architecture</li>
        <li>Scan configuration</li>
        <li>Event interpretation</li>
        <li>Pivoting</li>
        <li>Validation</li>
        <li>Evidence preservation</li>
      </ul>

      <h2>3. AI Mentor</h2>

      <p>The AI Mentor can explain SpiderFoot events in beginner-friendly language.</p>

      <pre><code>User:
SpiderFoot found an IP address. What does it mean?

AI Mentor:
It means the scan identified an IP relationship
associated with the investigation target. Verify
the relationship using an independent source and
consider the collection timestamp.</code></pre>

      <h2>4. AI Result Summarization</h2>

      <p>A SpiderFoot scan can produce many events. ForenX can summarize the results into categories.</p>

      <pre><code>Raw Events
 ↓
AI Classification
 ↓
Domains
IPs
Hostnames
Certificates
Threat Intelligence
 ↓
Investigator Review</code></pre>

      <p>The AI should summarize evidence rather than invent facts.</p>

      <h2>5. AI Pivot Suggestions</h2>

      <p>Based on an observed entity, the AI Mentor can suggest the next logical investigation step.</p>

      <pre><code>Finding:
Hostname discovered

Suggested Pivot:
Perform DNS validation

Next:
Review certificate relationships</code></pre>

      <p>Suggestions should remain within the investigation scope.</p>

      <h2>6. Recon Engine Integration</h2>

      <p>SpiderFoot can complement ForenX's custom Recon Engine.</p>

      <pre><code>Recon Engine
 |
 +---- Domain
 +---- DNS
 +---- SSL
 +---- Technology
 |
SpiderFoot
 |
 +---- Automated OSINT
 +---- Relationships
 +---- Additional Intelligence</code></pre>

      <h2>7. Correlation Engine</h2>

      <p>The Correlation Engine can combine SpiderFoot events with observations from other tools.</p>

      <pre><code>SpiderFoot
+
WHOIS
+
DNS
+
Shodan
+
Certificate
+
URLScan
+
Nmap
↓
Correlation
↓
Unified Finding</code></pre>

      <h2>8. Simulation Mode</h2>

      <p>Simulation Mode can provide a fictional SpiderFoot scan so students can learn result analysis without interacting with real infrastructure.</p>

      <pre><code>Fictional Domain
      ↓
Simulated SpiderFoot Scan
      ↓
Events
      ↓
Student Analysis
      ↓
AI Feedback
      ↓
Score</code></pre>

      <h2>9. Story-Based Mission</h2>

      <p>A ForenX mission might present a fictional organization and ask students to map its external digital footprint.</p>

      <p>Students could receive:</p>

      <ul>
        <li>Organization name</li>
        <li>Domain</li>
        <li>Initial IP</li>
        <li>Investigation objective</li>
      </ul>

      <p>The student uses SpiderFoot to collect relationships and then validates important findings using other tools.</p>

      <h2>10. Evidence Notebook</h2>

      <p>Each SpiderFoot event can be converted into an evidence record.</p>

      <pre><code>Evidence ID:
SF-E001

Source:
SpiderFoot

Entity:
Hostname

Observation:
Hostname associated with target

Timestamp:
Recorded time

Confidence:
Medium

Validation:
DNS source

Related Evidence:
DNS-E001</code></pre>

      <h2>11. Correlation Rule Example</h2>

      <p>A ForenX rule could identify when the same IP is reported by multiple independent tools.</p>

      <pre><code>SpiderFoot:
IP-A

DNS:
IP-A

Certificate:
Hostname associated with IP-A

Result:
Infrastructure relationship strengthened</code></pre>

      <h2>12. AI Uncertainty Detection</h2>

      <p>AI can also help identify uncertainty.</p>

      <pre><code>Observation:
IP associated with organization

AI Assessment:
Attribution may involve a hosting provider.
Additional validation recommended.</code></pre>

      <p>This is more useful than an AI system that simply produces confident statements.</p>

      <h2>13. Reporting</h2>

      <p>ForenX can generate a structured investigation report containing:</p>

      <ol>
        <li>Objective</li>
        <li>Scope</li>
        <li>SpiderFoot configuration</li>
        <li>Important events</li>
        <li>Pivots</li>
        <li>Validation sources</li>
        <li>Correlation results</li>
        <li>Confidence</li>
        <li>Limitations</li>
        <li>Conclusion</li>
      </ol>

      <h2>14. Learning Analytics</h2>

      <p>The platform can track whether students understand:</p>

      <ul>
        <li>Automated OSINT</li>
        <li>Modules</li>
        <li>Events</li>
        <li>Pivoting</li>
        <li>Validation</li>
        <li>Correlation</li>
        <li>Evidence preservation</li>
      </ul>

      <h2>15. Core Principle</h2>

      <p>Within ForenX, SpiderFoot can demonstrate how automation, AI assistance, and human investigation can work together. The AI should help students understand and organize evidence rather than replace the investigator's responsibility for validation.</p>
    `,
    keyPoints: [
      "SpiderFoot fits naturally into ForenX automated OSINT workflows",
      "AI can summarize and explain SpiderFoot events",
      "AI can suggest logical pivots within scope",
      "Simulation Mode enables safe training",
      "Correlation Engine can combine SpiderFoot with other tools",
      "Reports should preserve evidence and uncertainty"
    ],
    example:
      "Simulated SpiderFoot scan → AI event summary → student validation → Correlation Engine → evidence notebook → final report.",
    estimatedTime: 70,
    order: 6,
    difficulty: "Advanced",
    prerequisites: [
      "Advanced SpiderFoot Pivoting, Correlation, and Investigation Strategy"
    ]
  },

  {
    lessonNumber: 7,
    title: "SpiderFoot Evidence Preservation and Practical OSINT Lab",
    shortDescription:
      "Complete a controlled SpiderFoot investigation and learn how to document scan configuration, events, pivots, validation, confidence, and final findings.",
    objectives: [
      "Plan a SpiderFoot investigation",
      "Configure an authorized scan",
      "Analyze automated events",
      "Validate important findings",
      "Preserve evidence",
      "Produce a professional report"
    ],
    content: `
      <h2>1. Laboratory Overview</h2>

      <p>This practical exercise teaches students how to conduct a structured SpiderFoot investigation using a fictional or explicitly authorized target.</p>

      <p>The purpose is to learn automated OSINT collection and evidence analysis. Students should not attempt unauthorized access to systems discovered during the scan.</p>

      <h2>2. Scenario</h2>

      <p>Use the fictional organization:</p>

      <pre><code>Organization:
BlueShield Training Labs

Domain:
training.example

Objective:
Map the publicly visible infrastructure.</code></pre>

      <h2>3. Investigation Plan</h2>

      <pre><code>Target
 ↓
SpiderFoot Scan
 ↓
Events
 ↓
Entity Extraction
 ↓
Pivots
 ↓
Validation
 ↓
Correlation
 ↓
Report</code></pre>

      <h2>4. Step One — Define Scope</h2>

      <p>Write the target and investigation objective before beginning.</p>

      <pre><code>Target:
training.example

Allowed:
Public OSINT collection

Goal:
Infrastructure mapping</code></pre>

      <h2>5. Step Two — Configure Modules</h2>

      <p>Select modules relevant to:</p>

      <ul>
        <li>Domain information</li>
        <li>DNS</li>
        <li>Hostnames</li>
        <li>IP addresses</li>
        <li>Certificates</li>
        <li>Other appropriate public intelligence</li>
      </ul>

      <p>Document the selected modules.</p>

      <h2>6. Step Three — Start Scan</h2>

      <p>Start the scan from the SpiderFoot interface and record the start time.</p>

      <pre><code>Scan ID:
SF-LAB-001

Target:
training.example

Start:
Recorded timestamp</code></pre>

      <h2>7. Step Four — Review Events</h2>

      <p>After collection, group the results by entity type.</p>

      <table>
        <thead>
          <tr>
            <th>Category</th>
            <th>Examples</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Domains</td>
            <td>Domain and related domains</td>
          </tr>
          <tr>
            <td>Hosts</td>
            <td>Hostnames</td>
          </tr>
          <tr>
            <td>Network</td>
            <td>IP addresses</td>
          </tr>
          <tr>
            <td>Certificates</td>
            <td>Certificate relationships</td>
          </tr>
          <tr>
            <td>Threat Intelligence</td>
            <td>Indicator observations</td>
          </tr>
        </tbody>
      </table>

      <h2>8. Step Five — Identify Pivots</h2>

      <p>Select three useful pivots.</p>

      <pre><code>Hostname
   ↓
DNS

IP
   ↓
Shodan

Certificate
   ↓
Related Hostname</code></pre>

      <h2>9. Step Six — Validate</h2>

      <p>Use independent sources where appropriate.</p>

      <pre><code>SpiderFoot:
Hostname → IP

Independent DNS:
Hostname → IP

Result:
Relationship supported</code></pre>

      <h2>10. Step Seven — Handle Conflicts</h2>

      <p>If two sources disagree, record the discrepancy.</p>

      <pre><code>SpiderFoot:
IP-A

DNS:
IP-B

Status:
Unresolved discrepancy

Possible cause:
Temporal infrastructure change</code></pre>

      <h2>11. Step Eight — Evidence Preservation</h2>

      <p>Record:</p>

      <ul>
        <li>Scan identifier</li>
        <li>Target</li>
        <li>Configuration</li>
        <li>Modules</li>
        <li>Start time</li>
        <li>End time</li>
        <li>Important events</li>
        <li>Source information</li>
        <li>Validation results</li>
        <li>Confidence</li>
      </ul>

      <h2>12. Evidence Table</h2>

      <pre><code>Evidence ID: SF-E001
Entity: Hostname
Source: SpiderFoot
Observation: Hostname discovered
Validation: DNS
Confidence: High

Evidence ID: SF-E002
Entity: IP
Source: SpiderFoot
Observation: IP associated with hostname
Validation: Independent source
Confidence: Medium</code></pre>

      <h2>13. Step Nine — Build Investigation Graph</h2>

      <pre><code>training.example
      |
      +---- hostname
      |       |
      |       +---- IP
      |              |
      |              +---- service
      |
      +---- certificate</code></pre>

      <h2>14. Step Ten — Findings</h2>

      <p>Each finding should contain:</p>

      <ul>
        <li>Observation</li>
        <li>Evidence</li>
        <li>Source</li>
        <li>Timestamp</li>
        <li>Validation</li>
        <li>Confidence</li>
        <li>Interpretation</li>
      </ul>

      <h2>15. Example Finding</h2>

      <blockquote>
        A hostname associated with the authorized training domain was identified by SpiderFoot. Independent DNS data resolved the hostname to the same IP address. The relationship is therefore supported by two sources.
      </blockquote>

      <h2>16. Step Eleven — Correlation</h2>

      <p>Compare SpiderFoot observations with other ForenX modules.</p>

      <pre><code>SpiderFoot:
Hostname

DNS:
Same hostname → IP

Certificate:
Same hostname

Result:
Correlated infrastructure relationship</code></pre>

      <h2>17. Step Twelve — Final Report</h2>

      <p>The report should contain:</p>

      <ol>
        <li>Objective</li>
        <li>Scope</li>
        <li>Target</li>
        <li>SpiderFoot configuration</li>
        <li>Important events</li>
        <li>Investigation graph</li>
        <li>Validation</li>
        <li>Findings</li>
        <li>Confidence</li>
        <li>Limitations</li>
        <li>Conclusion</li>
      </ol>

      <h2>18. Reflection Questions</h2>

      <ol>
        <li>Why is automation useful in OSINT?</li>
        <li>Why should every SpiderFoot event not be treated as a finding?</li>
        <li>What makes a good pivot?</li>
        <li>Why is independent validation important?</li>
        <li>How can timestamps explain conflicting results?</li>
        <li>How can SpiderFoot integrate with ForenX?</li>
      </ol>

      <h2>19. Core Principle</h2>

      <p>The goal of the lab is not to collect the maximum number of events. The goal is to transform automated observations into a small set of relevant, validated, reproducible findings.</p>
    `,
    keyPoints: [
      "Begin with a clearly defined investigation objective",
      "Document selected SpiderFoot modules",
      "Group and prioritize events",
      "Use discovered entities as pivots",
      "Validate important observations independently",
      "Preserve scan configuration and timestamps",
      "Record confidence and limitations"
    ],
    example:
      "Authorized or fictional domain → SpiderFoot scan → events → pivots → independent validation → evidence → correlation → report.",
    estimatedTime: 85,
    order: 7,
    difficulty: "Advanced",
    prerequisites: [
      "SpiderFoot in ForenX AI LearnOSINT",
      "Advanced SpiderFoot Pivoting, Correlation, and Investigation Strategy"
    ]
  },

  {
    lessonNumber: 8,
    title: "Complete SpiderFoot Investigation and Final Assessment",
    shortDescription:
      "Master the complete SpiderFoot workflow from objective definition and automated collection to event analysis, correlation, evidence preservation, and professional reporting.",
    objectives: [
      "Plan a complete SpiderFoot investigation",
      "Configure automated OSINT collection",
      "Analyze and prioritize events",
      "Perform multi-source correlation",
      "Assess confidence and uncertainty",
      "Create a professional OSINT report"
    ],
    content: `
      <h2>1. Complete SpiderFoot Methodology</h2>

      <p>A professional SpiderFoot investigation follows a structured process. Automation can significantly increase collection speed, but the investigator must control scope, understand modules, validate results, and document conclusions.</p>

      <pre><code>Objective
 ↓
Scope
 ↓
Target
 ↓
Module Selection
 ↓
Automated Collection
 ↓
Event Analysis
 ↓
Pivoting
 ↓
Validation
 ↓
Correlation
 ↓
Confidence Assessment
 ↓
Evidence Preservation
 ↓
Reporting</code></pre>

      <h2>2. Phase One — Define Objective</h2>

      <p>Start with a clear question.</p>

      <ul>
        <li>What infrastructure belongs to the authorized organization?</li>
        <li>What public information is associated with the domain?</li>
        <li>Are there unexpected external assets?</li>
        <li>What technical relationships require investigation?</li>
      </ul>

      <h2>3. Phase Two — Define Scope</h2>

      <p>Scope may include a specific domain, IP, hostname, or fictional investigation target. Do not allow automated discovery to silently expand the investigation beyond what is permitted.</p>

      <h2>4. Phase Three — Select Modules</h2>

      <p>Select modules according to the objective.</p>

      <pre><code>Objective:
Infrastructure Mapping

Relevant Areas:
DNS
Domains
Hostnames
IPs
Certificates
Public Intelligence</code></pre>

      <p>Module selection should be documented.</p>

      <h2>5. Phase Four — Run Collection</h2>

      <p>Start the SpiderFoot scan and record:</p>

      <ul>
        <li>Target</li>
        <li>Configuration</li>
        <li>Modules</li>
        <li>Start time</li>
        <li>End time</li>
      </ul>

      <h2>6. Phase Five — Analyze Events</h2>

      <p>Do not read events randomly. Group them by entity and relationship.</p>

      <pre><code>Events
 ↓
Domains
Hosts
IPs
Certificates
Threat Intelligence
 ↓
Relationships</code></pre>

      <h2>7. Phase Six — Identify Important Findings</h2>

      <p>Prioritize observations that:</p>

      <ul>
        <li>Directly answer the investigation objective</li>
        <li>Reveal important infrastructure</li>
        <li>Provide useful pivots</li>
        <li>Are supported by independent sources</li>
        <li>Reveal unexpected exposure</li>
      </ul>

      <h2>8. Phase Seven — Pivot</h2>

      <pre><code>Domain
 ↓
Hostname
 ↓
IP
 ↓
Certificate
 ↓
Related Hostname
 ↓
Independent Validation</code></pre>

      <p>Every pivot should have a reason.</p>

      <h2>9. Phase Eight — Validate</h2>

      <p>Important observations should be checked using independent sources whenever possible.</p>

      <pre><code>SpiderFoot
      +
DNS
      +
Certificate
      ↓
Relationship Confidence</code></pre>

      <h2>10. Phase Nine — Temporal Analysis</h2>

      <p>Record when information was observed. A historical relationship should not be presented as current without supporting evidence.</p>

      <h2>11. Phase Ten — Correlation</h2>

      <pre><code>SpiderFoot
   |
   +---- Domain
   +---- Hostname
   +---- IP
   +---- Certificate

ForenX
   |
   +---- DNS
   +---- WHOIS
   +---- Shodan
   +---- URLScan
   +---- Nmap

       ↓

Correlation Engine
       ↓
Unified Investigation Context</code></pre>

      <h2>12. Example Correlation</h2>

      <p>Suppose SpiderFoot discovers a hostname. DNS resolves the hostname to an IP, certificate information contains the hostname, and Shodan has an indexed service on the same IP.</p>

      <pre><code>SpiderFoot:
hostname.example

DNS:
hostname.example → 203.0.113.10

Certificate:
hostname.example

Shodan:
203.0.113.10 → HTTPS

Conclusion:
Strong infrastructure relationship</code></pre>

      <p>This is a good example of evidence correlation because several independent observations support the relationship.</p>

      <h2>13. Phase Eleven — Threat Intelligence Interpretation</h2>

      <p>If SpiderFoot reports a threat-intelligence association, investigate the context.</p>

      <pre><code>Indicator Hit
 ↓
Source
 ↓
Timestamp
 ↓
Reason
 ↓
Independent Evidence
 ↓
Risk Assessment</code></pre>

      <p>A threat-intelligence hit should not automatically be interpreted as proof of malicious activity.</p>

      <h2>14. Phase Twelve — Confidence</h2>

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
            <td>Multiple independent current sources agree.</td>
          </tr>
          <tr>
            <td>Medium</td>
            <td>SpiderFoot observation supported by contextual evidence.</td>
          </tr>
          <tr>
            <td>Low</td>
            <td>Single, stale, or ambiguous observation.</td>
          </tr>
        </tbody>
      </table>

      <h2>15. Phase Thirteen — Evidence Preservation</h2>

      <p>Preserve:</p>

      <ul>
        <li>Objective</li>
        <li>Scope</li>
        <li>Target</li>
        <li>SpiderFoot version where relevant</li>
        <li>Scan configuration</li>
        <li>Selected modules</li>
        <li>Start and end times</li>
        <li>Important events</li>
        <li>Source information</li>
        <li>Validation evidence</li>
        <li>Confidence assessment</li>
        <li>Limitations</li>
      </ul>

      <h2>16. Phase Fourteen — Professional Reporting</h2>

      <p>A professional SpiderFoot report can follow this structure:</p>

      <ol>
        <li>Executive Summary</li>
        <li>Investigation Objective</li>
        <li>Scope and Authorization</li>
        <li>Methodology</li>
        <li>SpiderFoot Configuration</li>
        <li>Important Events</li>
        <li>Infrastructure Relationships</li>
        <li>Cross-Tool Correlation</li>
        <li>Evidence</li>
        <li>Confidence</li>
        <li>Limitations</li>
        <li>Recommendations</li>
        <li>Conclusion</li>
      </ol>

      <h2>17. Common Beginner Mistakes</h2>

      <ul>
        <li>Running every available module without understanding it</li>
        <li>Treating every event as a confirmed finding</li>
        <li>Ignoring timestamps</li>
        <li>Failing to validate automated results</li>
        <li>Assuming IP ownership proves organizational ownership</li>
        <li>Ignoring cloud and shared infrastructure</li>
        <li>Overstating threat-intelligence results</li>
        <li>Failing to preserve configuration</li>
        <li>Continuing collection without a stopping condition</li>
      </ul>

      <h2>18. Final Assessment Questions</h2>

      <ol>
        <li>What is SpiderFoot?</li>
        <li>What is automated OSINT?</li>
        <li>What is a SpiderFoot module?</li>
        <li>What is an event?</li>
        <li>Why are targets and scope important?</li>
        <li>Why should module selection match the objective?</li>
        <li>Why are automated results not automatically facts?</li>
        <li>What is a pivot?</li>
        <li>Why is independent validation important?</li>
        <li>How can timestamps affect interpretation?</li>
        <li>How can SpiderFoot complement Shodan?</li>
        <li>How can SpiderFoot complement Nmap?</li>
        <li>How can certificates validate infrastructure relationships?</li>
        <li>How can ForenX's Correlation Engine use SpiderFoot results?</li>
        <li>What information should be preserved as evidence?</li>
        <li>Why should threat-intelligence hits be interpreted carefully?</li>
        <li>What should a professional SpiderFoot report contain?</li>
      </ol>

      <h2>19. Final Practical Challenge</h2>

      <p>Conduct a complete investigation against a fictional or explicitly authorized target.</p>

      <ol>
        <li>Define the objective</li>
        <li>Define scope</li>
        <li>Select the target</li>
        <li>Choose appropriate modules</li>
        <li>Run the scan</li>
        <li>Group events</li>
        <li>Identify useful pivots</li>
        <li>Validate important relationships</li>
        <li>Analyze temporal context</li>
        <li>Correlate with other ForenX tools</li>
        <li>Assign confidence</li>
        <li>Preserve evidence</li>
        <li>Document limitations</li>
        <li>Generate the final report</li>
      </ol>

      <h2>20. Professional Checklist</h2>

      <ul>
        <li>☐ Define investigation objective</li>
        <li>☐ Confirm authorization</li>
        <li>☐ Define scope</li>
        <li>☐ Select target</li>
        <li>☐ Select appropriate modules</li>
        <li>☐ Record configuration</li>
        <li>☐ Record timestamps</li>
        <li>☐ Review events</li>
        <li>☐ Group related entities</li>
        <li>☐ Identify pivots</li>
        <li>☐ Validate important observations</li>
        <li>☐ Investigate conflicting evidence</li>
        <li>☐ Correlate with other tools</li>
        <li>☐ Assign confidence</li>
        <li>☐ Preserve evidence</li>
        <li>☐ Document limitations</li>
        <li>☐ Generate final report</li>
      </ul>

      <h2>21. Final Takeaway</h2>

      <p>SpiderFoot demonstrates how OSINT can move from manual collection toward automated, relationship-oriented investigation. Its modular architecture allows investigators to collect information from many public sources and connect the resulting observations into a broader intelligence picture.</p>

      <p>However, automation introduces an important responsibility. A large number of results does not necessarily mean a high-quality investigation. Automated results can be duplicated, stale, ambiguous, or incorrect. The investigator must therefore validate important observations, understand source limitations, preserve timestamps, and distinguish evidence from inference.</p>

      <p>SpiderFoot becomes especially powerful when combined with other tools. DNS can validate hostname relationships, certificates can connect domains and infrastructure, Shodan can provide indexed service observations, Nmap can provide current observations in authorized environments, and ForenX's Correlation Engine can combine these sources into a unified investigation context.</p>

      <p>Within ForenX AI LearnOSINT, SpiderFoot can also demonstrate the value of AI-assisted investigation. The AI Mentor can summarize events, explain technical relationships, suggest logical pivots, identify uncertainty, and help learners construct evidence-based reports.</p>

      <p>The complete SpiderFoot methodology can be remembered as:</p>

      <blockquote>
        <strong>Objective → Scope → Target → Configure → Collect → Analyze → Pivot → Validate → Correlate → Preserve → Report.</strong>
      </blockquote>

      <p>The most important professional principle is simple: automation should make investigation more efficient, not less rigorous. SpiderFoot can accelerate collection, but the investigator remains responsible for determining what the evidence actually proves.</p>
    `,
    keyPoints: [
      "SpiderFoot automates multi-source OSINT collection",
      "Investigation quality depends on objective-driven configuration",
      "Events should be analyzed and validated rather than blindly accepted",
      "Pivoting connects discovered entities into investigation relationships",
      "Temporal context is essential for changing infrastructure",
      "ForenX can correlate SpiderFoot with DNS, certificates, Shodan, and Nmap",
      "Evidence preservation makes automated investigations reproducible",
      "Automation should improve efficiency without replacing human judgment"
    ],
    example:
      "Objective → scope → SpiderFoot configuration → automated collection → event analysis → pivoting → independent validation → cross-tool correlation → evidence preservation → professional report.",
    estimatedTime: 95,
    order: 8,
    difficulty: "Advanced",
    prerequisites: [
      "SpiderFoot Fundamentals for Automated OSINT",
      "SpiderFoot Installation, Interface, Targets, and Scan Configuration",
      "SpiderFoot Modules, Events, and Result Analysis",
      "SpiderFoot for Infrastructure, Domains, Emails, and Threat Intelligence",
      "Advanced SpiderFoot Pivoting, Correlation, and Investigation Strategy",
      "SpiderFoot in ForenX AI LearnOSINT",
      "SpiderFoot Evidence Preservation and Practical OSINT Lab"
    ]
  }
];

module.exports = toolLessons;