const toolLessons = [
  {
    lessonNumber: 1,
    title: "Nmap Fundamentals for OSINT and Network Reconnaissance",
    shortDescription:
      "Understand Nmap, network discovery, ports, services, scan concepts, and the difference between passive OSINT and authorized active reconnaissance.",
    objectives: [
      "Understand what Nmap is",
      "Understand hosts, ports, and services",
      "Differentiate passive OSINT from active reconnaissance",
      "Learn basic Nmap terminology",
      "Understand scan scope and authorization",
      "Interpret basic Nmap results"
    ],
    content: `
      <h2>1. Introduction to Nmap</h2>

      <p>Nmap, short for Network Mapper, is a network discovery and security auditing tool used to identify hosts, ports, services, and other characteristics of systems on a network. It is widely used by network administrators, penetration testers, security professionals, and cybersecurity students.</p>

      <p>Within an OSINT and digital-forensics learning platform such as ForenX AI LearnOSINT, Nmap is useful for teaching the difference between information discovered from public sources and information obtained through authorized active network reconnaissance.</p>

      <p>This distinction is extremely important. Search engines, WHOIS, certificate-transparency services, and public databases generally provide passive intelligence. Nmap, in contrast, sends network traffic to a target and therefore belongs to active reconnaissance.</p>

      <h2>2. Passive OSINT Versus Active Reconnaissance</h2>

      <pre><code>Passive OSINT
     ↓
Public Sources
     ↓
No Direct Target Probing

Active Reconnaissance
     ↓
Network Requests
     ↓
Target Responds
     ↓
Observed Network Information</code></pre>

      <p>Nmap should therefore only be used against systems for which the investigator has explicit authorization. For educational practice, students should use localhost, intentionally vulnerable virtual machines, CTF environments, or networks specifically provided for testing.</p>

      <h2>3. What Nmap Can Discover</h2>

      <p>Depending on the scan and network conditions, Nmap can help identify:</p>

      <ul>
        <li>Whether hosts appear reachable</li>
        <li>Open TCP ports</li>
        <li>Closed ports</li>
        <li>Filtered ports</li>
        <li>Services associated with ports</li>
        <li>Service versions</li>
        <li>Potential operating-system characteristics</li>
        <li>Network service information</li>
        <li>Results from supported NSE scripts</li>
      </ul>

      <h2>4. Understanding Hosts</h2>

      <p>A host is a network-connected system that can have one or more network interfaces and services. A host may be a server, workstation, virtual machine, router, IoT device, or another network-connected system.</p>

      <p>For example, in an authorized laboratory:</p>

      <pre><code>192.168.56.10
192.168.56.20
192.168.56.30</code></pre>

      <p>Each address can represent a separate laboratory host.</p>

      <h2>5. Understanding Ports</h2>

      <p>Ports provide logical communication endpoints. TCP and UDP use port numbers to distinguish services.</p>

      <p>Common examples include:</p>

      <ul>
        <li>22 — commonly associated with SSH</li>
        <li>25 — commonly associated with SMTP</li>
        <li>53 — commonly associated with DNS</li>
        <li>80 — commonly associated with HTTP</li>
        <li>443 — commonly associated with HTTPS</li>
        <li>3389 — commonly associated with RDP</li>
      </ul>

      <p>A port number alone does not prove which software is running. Nmap's service-detection capabilities can provide additional information.</p>

      <h2>6. Open, Closed, and Filtered</h2>

      <p>Nmap commonly categorizes ports using states such as open, closed, and filtered.</p>

      <p><strong>Open</strong> means an application appears to be actively accepting connections on the port.</p>

      <p><strong>Closed</strong> means the port is reachable but no application appears to be listening.</p>

      <p><strong>Filtered</strong> means network filtering prevents Nmap from determining whether the port is open.</p>

      <h2>7. Basic Scan</h2>

      <p>In an authorized laboratory, a basic scan can be performed against a permitted host:</p>

      <pre><code>nmap 192.168.56.10</code></pre>

      <p>The result can provide a basic view of reachable ports.</p>

      <h2>8. Reading Basic Output</h2>

      <pre><code>PORT     STATE    SERVICE
22/tcp   open     ssh
80/tcp   open     http
443/tcp  open     https</code></pre>

      <p>This result suggests that the host has services associated with TCP ports 22, 80, and 443.</p>

      <p>The investigator should document this as an observation rather than immediately concluding that the system is vulnerable.</p>

      <h2>9. Nmap Is Not a Vulnerability Scanner by Default</h2>

      <p>Nmap is primarily a network discovery and enumeration tool. Some NSE scripts can perform security checks, but discovering an open port is not equivalent to discovering a vulnerability.</p>

      <pre><code>Open Port
   ≠
Vulnerability</code></pre>

      <h2>10. Scope</h2>

      <p>Before scanning, define:</p>

      <ul>
        <li>Authorized IP addresses</li>
        <li>Authorized hostnames</li>
        <li>Allowed ports</li>
        <li>Allowed scan types</li>
        <li>Testing time window</li>
        <li>Rate or traffic limitations</li>
      </ul>

      <h2>11. Beginner Laboratory</h2>

      <p>Use a local virtual machine or localhost. Run a basic Nmap scan and record the command, target, timestamp, and observed ports.</p>

      <h2>12. Core Principle</h2>

      <p>Nmap provides active network observations. It should be used only within authorized boundaries and its results should be interpreted carefully rather than treated as automatic proof of security weaknesses.</p>
    `,
    keyPoints: [
      "Nmap is a network discovery and security auditing tool",
      "Nmap performs active reconnaissance",
      "Open ports indicate listening services, not automatic vulnerabilities",
      "Port states include open, closed, and filtered",
      "Use Nmap only against authorized systems",
      "Document scan scope and timestamps"
    ],
    example:
      "nmap 192.168.56.10",
    estimatedTime: 45,
    order: 1,
    difficulty: "Beginner",
    prerequisites: []
  },

  {
    lessonNumber: 2,
    title: "Nmap Host Discovery and Port Scanning",
    shortDescription:
      "Learn host discovery, TCP and UDP port concepts, port ranges, scan selection, and practical interpretation of Nmap results.",
    objectives: [
      "Understand host discovery",
      "Understand TCP and UDP scanning",
      "Learn common port-selection methods",
      "Understand port ranges",
      "Interpret scan results",
      "Use Nmap safely in a laboratory"
    ],
    content: `
      <h2>1. Host Discovery</h2>

      <p>Before examining services, an investigator may need to determine which systems appear reachable within an authorized network. Nmap provides host-discovery capabilities for this purpose.</p>

      <p>In a controlled laboratory network, a discovery scan might be performed against an explicitly authorized subnet:</p>

      <pre><code>nmap -sn 192.168.56.0/24</code></pre>

      <p>The <code>-sn</code> option performs host discovery without performing a traditional port scan.</p>

      <p>Only use network ranges that are explicitly authorized.</p>

      <h2>2. Why Host Discovery Matters</h2>

      <p>Network environments can contain many systems. Host discovery helps establish which addresses appear responsive before deeper enumeration.</p>

      <pre><code>Authorized Network
       ↓
Host Discovery
       ↓
Reachable Hosts
       ↓
Port Enumeration
       ↓
Service Identification</code></pre>

      <h2>3. TCP Ports</h2>

      <p>TCP is connection-oriented. Many common network services use TCP, including HTTP, HTTPS, SSH, and database services.</p>

      <p>A basic Nmap scan can inspect commonly selected TCP ports:</p>

      <pre><code>nmap 192.168.56.10</code></pre>

      <h2>4. Specific Ports</h2>

      <p>An investigator can specify particular ports in an authorized environment.</p>

      <pre><code>nmap -p 22,80,443 192.168.56.10</code></pre>

      <p>This is useful when the investigation specifically concerns a small set of services.</p>

      <h2>5. Port Ranges</h2>

      <p>Port ranges can also be specified.</p>

      <pre><code>nmap -p 1-1000 192.168.56.10</code></pre>

      <p>A broader scan produces more network traffic and can take longer. Scan scope should therefore match the authorized assessment requirements.</p>

      <h2>6. All TCP Ports</h2>

      <p>Nmap provides an option to scan all TCP ports:</p>

      <pre><code>nmap -p- 192.168.56.10</code></pre>

      <p>This can reveal services running on nonstandard ports. It should only be used when the authorized scope permits it.</p>

      <h2>7. UDP Scanning</h2>

      <p>UDP differs from TCP and can require different scanning techniques. Some services such as DNS commonly use UDP.</p>

      <pre><code>nmap -sU -p 53 192.168.56.10</code></pre>

      <p>UDP scanning can be slower and results can require careful interpretation.</p>

      <h2>8. Port State Interpretation</h2>

      <table>
        <thead>
          <tr>
            <th>State</th>
            <th>Meaning</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Open</td>
            <td>An application appears to accept connections.</td>
          </tr>
          <tr>
            <td>Closed</td>
            <td>The port is reachable but no application appears to listen.</td>
          </tr>
          <tr>
            <td>Filtered</td>
            <td>Filtering prevents a definitive determination.</td>
          </tr>
        </tbody>
      </table>

      <h2>9. Service Names</h2>

      <p>Nmap may display a service name based on the port number. This is a useful starting point but should not be treated as definitive software identification.</p>

      <pre><code>80/tcp open http</code></pre>

      <p>This indicates that Nmap associates the port with HTTP, but further detection may be needed to identify the actual application.</p>

      <h2>10. Multiple Targets</h2>

      <p>Authorized assessments can include multiple targets.</p>

      <pre><code>nmap 192.168.56.10 192.168.56.20</code></pre>

      <p>Targets should always be verified before scanning.</p>

      <h2>11. Excluding Hosts</h2>

      <p>In a properly defined assessment, certain systems may need to be excluded.</p>

      <pre><code>nmap 192.168.56.0/24 --exclude 192.168.56.1</code></pre>

      <p>Exclusion rules should reflect the assessment scope.</p>

      <h2>12. Practical Exercise</h2>

      <p>Create two local laboratory virtual machines. Perform host discovery, scan selected ports, and then scan a larger authorized range. Compare the results.</p>

      <h2>13. Questions</h2>

      <ol>
        <li>What is the difference between host discovery and port scanning?</li>
        <li>Why can UDP scanning behave differently from TCP scanning?</li>
        <li>What does a filtered port indicate?</li>
        <li>Why should nonstandard ports be considered?</li>
        <li>Why is scan scope important?</li>
      </ol>

      <h2>14. Core Principle</h2>

      <p>Port scanning is a controlled measurement of network behavior. The quality of the result depends on appropriate scan selection, scope, network conditions, and careful interpretation.</p>
    `,
    keyPoints: [
      "Host discovery identifies potentially reachable systems",
      "-sn performs host discovery without traditional port scanning",
      "Specific ports can be selected with -p",
      "-p- can scan all TCP ports",
      "UDP requires different scanning behavior",
      "Port state and service identification should be interpreted separately"
    ],
    example:
      "nmap -p 22,80,443 192.168.56.10",
    estimatedTime: 55,
    order: 2,
    difficulty: "Beginner",
    prerequisites: [
      "Nmap Fundamentals for OSINT and Network Reconnaissance"
    ]
  },

  {
    lessonNumber: 3,
    title: "Nmap Service Detection, OS Detection, and Scan Types",
    shortDescription:
      "Learn service-version detection, operating-system detection, TCP scan concepts, timing considerations, and result interpretation.",
    objectives: [
      "Understand service detection",
      "Learn version detection",
      "Understand OS detection",
      "Understand TCP SYN scanning",
      "Learn scan-output interpretation",
      "Understand scan limitations"
    ],
    content: `
      <h2>1. Why Service Detection Matters</h2>

      <p>Knowing that a port is open is only the beginning of network enumeration. Security professionals often need to understand what service is actually responding and, where possible, what software version is exposed.</p>

      <pre><code>Port
 ↓
Service
 ↓
Software
 ↓
Version
 ↓
Security Context</code></pre>

      <h2>2. Service and Version Detection</h2>

      <p>Nmap's <code>-sV</code> option enables service and version detection.</p>

      <pre><code>nmap -sV 192.168.56.10</code></pre>

      <p>The output may provide more information than the basic port scan.</p>

      <pre><code>PORT    STATE SERVICE VERSION
22/tcp  open  ssh     OpenSSH ...
80/tcp  open  http    Apache ...</code></pre>

      <p>The exact output depends on the target and network conditions.</p>

      <h2>3. Version Information and Risk</h2>

      <p>Software-version information can help administrators identify outdated components. However, an old-looking version string does not automatically mean that the system is vulnerable. Backported security fixes, vendor patches, configuration, and deployment context can change the actual security status.</p>

      <h2>4. TCP SYN Scan</h2>

      <p>Nmap's <code>-sS</code> option performs a TCP SYN scan when the required privileges and platform conditions allow it.</p>

      <pre><code>nmap -sS 192.168.56.10</code></pre>

      <p>Students should understand the concept rather than treating the option as a universal requirement. Operating systems and permissions can influence how scans are performed.</p>

      <h2>5. Connect Scan</h2>

      <p>The <code>-sT</code> scan uses the operating system's connection mechanism. It can be useful when raw-packet privileges required by other scan types are unavailable.</p>

      <pre><code>nmap -sT 192.168.56.10</code></pre>

      <h2>6. OS Detection</h2>

      <p>Nmap can attempt operating-system detection using the <code>-O</code> option.</p>

      <pre><code>nmap -O 192.168.56.10</code></pre>

      <p>OS detection is based on network-response characteristics. Results are therefore estimates rather than guaranteed identification.</p>

      <h2>7. Combined Detection</h2>

      <p>In an authorized lab, service and OS detection can be combined.</p>

      <pre><code>nmap -sV -O 192.168.56.10</code></pre>

      <p>This can provide a richer view of the target.</p>

      <h2>8. Aggressive Detection</h2>

      <p>Nmap provides the <code>-A</code> option for aggressive detection. It enables several discovery capabilities together, including service/version detection, OS detection, default scripting, and traceroute.</p>

      <pre><code>nmap -A 192.168.56.10</code></pre>

      <p>Because this produces more traffic and performs additional probes, it should be used only when explicitly allowed by the assessment scope.</p>

      <h2>9. Timing</h2>

      <p>Nmap provides timing templates that influence scan speed and behavior. Faster scanning can generate more traffic and may affect reliability or network stability.</p>

      <p>In professional assessments, scan speed should be selected according to authorization, network conditions, and operational requirements rather than simply choosing the fastest setting.</p>

      <h2>10. False Positives and Uncertainty</h2>

      <p>Nmap results are observations produced by network responses. Firewalls, proxies, load balancers, packet loss, NAT, and unusual configurations can affect results.</p>

      <p>Therefore:</p>

      <pre><code>Nmap Result
     ↓
Observation
     ↓
Validation
     ↓
Conclusion</code></pre>

      <h2>11. Practical Lab</h2>

      <p>Against an authorized local virtual machine, perform:</p>

      <pre><code>nmap 192.168.56.10

nmap -sV 192.168.56.10

nmap -O 192.168.56.10</code></pre>

      <p>Compare how much additional information each scan provides.</p>

      <h2>12. Evidence Recording</h2>

      <pre><code>Target:
192.168.56.10

Command:
nmap -sV 192.168.56.10

Timestamp:
Recorded by investigator

Finding:
TCP service identified

Confidence:
Observed

Next Step:
Review service context</code></pre>

      <h2>13. Core Principle</h2>

      <p>Nmap detection features provide increasingly detailed observations, but every result should be interpreted within the limitations of the scan and the network environment.</p>
    `,
    keyPoints: [
      "-sV performs service/version detection",
      "-O attempts operating-system detection",
      "-sS is a TCP SYN scan",
      "-sT uses TCP connect scanning",
      "-A combines several advanced detection capabilities",
      "Network conditions can affect scan accuracy"
    ],
    example:
      "nmap -sV -O 192.168.56.10",
    estimatedTime: 60,
    order: 3,
    difficulty: "Intermediate",
    prerequisites: [
      "Nmap Host Discovery and Port Scanning"
    ]
  },

  {
    lessonNumber: 4,
    title: "Nmap NSE and Advanced Enumeration",
    shortDescription:
      "Understand the Nmap Scripting Engine, script categories, safe laboratory usage, enumeration workflows, and responsible interpretation.",
    objectives: [
      "Understand the Nmap Scripting Engine",
      "Learn NSE script categories",
      "Understand default scripts",
      "Use scripts in authorized labs",
      "Interpret script output",
      "Understand the difference between enumeration and exploitation"
    ],
    content: `
      <h2>1. What Is NSE?</h2>

      <p>The Nmap Scripting Engine, commonly called NSE, extends Nmap with scripts that can perform additional discovery, enumeration, detection, and security-related tasks.</p>

      <p>NSE is one of the most powerful parts of Nmap because scripts can provide information that basic port scanning cannot reveal.</p>

      <h2>2. Script Categories</h2>

      <p>NSE scripts are organized into categories. Common categories include:</p>

      <ul>
        <li><strong>auth:</strong> Authentication-related checks</li>
        <li><strong>broadcast:</strong> Broadcast discovery</li>
        <li><strong>default:</strong> Scripts considered useful for standard scans</li>
        <li><strong>discovery:</strong> Additional discovery functionality</li>
        <li><strong>safe:</strong> Scripts intended to avoid intrusive behavior</li>
        <li><strong>version:</strong> Service-version-related functionality</li>
        <li><strong>vuln:</strong> Vulnerability-oriented scripts</li>
      </ul>

      <p>Script behavior varies, so students should read the documentation before using a script.</p>

      <h2>3. Default Scripts</h2>

      <p>The <code>-sC</code> option runs the default NSE script set.</p>

      <pre><code>nmap -sC 192.168.56.10</code></pre>

      <p>This can provide additional service information in an authorized lab.</p>

      <h2>4. Combining Service Detection and Default Scripts</h2>

      <pre><code>nmap -sC -sV 192.168.56.10</code></pre>

      <p>This combination is commonly useful during authorized service enumeration.</p>

      <h2>5. Individual Scripts</h2>

      <p>A specific script can be selected with the <code>--script</code> option.</p>

      <pre><code>nmap --script <script-name> 192.168.56.10</code></pre>

      <p>Students should replace the placeholder with a documented script appropriate for their authorized laboratory target.</p>

      <h2>6. Safe Scripts</h2>

      <p>The <code>safe</code> category contains scripts intended for safer information gathering, although "safe" does not mean that every network administrator will consider every script appropriate in every environment.</p>

      <pre><code>nmap --script safe 192.168.56.10</code></pre>

      <p>Always confirm that the assessment permits script-based enumeration.</p>

      <h2>7. Discovery Scripts</h2>

      <p>Discovery-oriented scripts can provide additional information about services or network environments.</p>

      <pre><code>nmap --script discovery 192.168.56.10</code></pre>

      <p>Because script collections can be broad, students should understand the traffic and purpose of the scripts they execute.</p>

      <h2>8. Vulnerability Scripts</h2>

      <p>NSE also contains scripts designed to check for particular vulnerability conditions. These should be used only in environments where such testing is explicitly authorized.</p>

      <p>A vulnerability-script result is not automatically proof of a vulnerability. It should be manually validated and interpreted according to the specific script documentation.</p>

      <h2>9. Enumeration Versus Exploitation</h2>

      <pre><code>Enumeration
    ↓
Information Collection

Exploitation
    ↓
Attempt to Use a Security Weakness</code></pre>

      <p>Nmap can perform enumeration and some security checks. It should not be treated as permission to exploit discovered weaknesses.</p>

      <h2>10. Script Output</h2>

      <pre><code>PORT   STATE SERVICE
80/tcp open  http

| http-title:
|_ Example Laboratory Server</code></pre>

      <p>This output provides additional context about the HTTP service.</p>

      <h2>11. Script Documentation</h2>

      <p>Before using an NSE script, learn:</p>

      <ul>
        <li>What the script does</li>
        <li>What traffic it generates</li>
        <li>What information it collects</li>
        <li>Whether it is intrusive</li>
        <li>What arguments it supports</li>
        <li>How to interpret its output</li>
      </ul>

      <h2>12. Practical Laboratory</h2>

      <p>Use an intentionally vulnerable local virtual machine. Perform a default-script scan and record the additional information discovered.</p>

      <pre><code>nmap -sC -sV 192.168.56.10</code></pre>

      <p>Do not run broad vulnerability scripts against systems outside the authorized laboratory.</p>

      <h2>13. Evidence Classification</h2>

      <p>Classify NSE findings as:</p>

      <ul>
        <li>Observed service information</li>
        <li>Potential configuration issue</li>
        <li>Potential vulnerability</li>
        <li>Validated vulnerability</li>
      </ul>

      <p>This prevents the common mistake of treating scanner output as final proof.</p>

      <h2>14. Core Principle</h2>

      <p>NSE turns Nmap from a basic port scanner into a flexible network-enumeration platform. Its power should be matched with careful scope control and understanding of what each script actually does.</p>
    `,
    keyPoints: [
      "NSE extends Nmap with scripts",
      "-sC runs default scripts",
      "--script selects scripts or categories",
      "Script behavior should be understood before execution",
      "Vulnerability-script output requires validation",
      "Enumeration is different from exploitation"
    ],
    example:
      "nmap -sC -sV 192.168.56.10",
    estimatedTime: 65,
    order: 4,
    difficulty: "Intermediate",
    prerequisites: [
      "Nmap Service Detection, OS Detection, and Scan Types"
    ]
  },

  {
    lessonNumber: 5,
    title: "Nmap Output Analysis and Security Interpretation",
    shortDescription:
      "Learn how to analyze Nmap output, identify attack-surface observations, distinguish findings from vulnerabilities, and document network intelligence.",
    objectives: [
      "Read Nmap output systematically",
      "Identify exposed services",
      "Understand service versions",
      "Evaluate security relevance",
      "Separate observations from conclusions",
      "Create structured findings"
    ],
    content: `
      <h2>1. Why Output Analysis Matters</h2>

      <p>Running a scanner is only one part of security assessment. The investigator must understand the output and determine which observations are relevant.</p>

      <p>A large Nmap output can contain many ports and service details. The goal is to transform raw output into structured findings.</p>

      <h2>2. Basic Output</h2>

      <pre><code>PORT     STATE SERVICE
22/tcp   open  ssh
80/tcp   open  http
443/tcp  open  https</code></pre>

      <p>This tells us that three TCP services appear accessible on the tested host.</p>

      <h2>3. Attack Surface</h2>

      <p>The collection of reachable services can be viewed as part of a host's network attack surface.</p>

      <pre><code>Host
 |
 +---- SSH
 |
 +---- HTTP
 |
 +---- HTTPS
 |
 +---- Other Services</code></pre>

      <p>Each service has its own configuration, authentication, software, and security considerations.</p>

      <h2>4. Service Version Analysis</h2>

      <pre><code>PORT    STATE SERVICE VERSION
80/tcp  open  http    Apache ...
</code></pre>

      <p>The version string can be useful for security research, but it must be interpreted carefully.</p>

      <p>Questions to ask include:</p>

      <ul>
        <li>Is the version information reliable?</li>
        <li>Is the software actually outdated?</li>
        <li>Does the vendor backport security patches?</li>
        <li>Is the service exposed intentionally?</li>
        <li>What configuration controls access?</li>
      </ul>

      <h2>5. Open Port Does Not Equal Vulnerability</h2>

      <p>This is one of the most important lessons in network reconnaissance.</p>

      <pre><code>Port 22 Open
     ↓
SSH Service
     ↓
Potential Attack Surface

NOT:

Port 22 Open
     ↓
Confirmed Vulnerability</code></pre>

      <h2>6. Example Finding</h2>

      <p>A poor report might state:</p>

      <blockquote>
        SSH is vulnerable because port 22 is open.
      </blockquote>

      <p>A better finding is:</p>

      <blockquote>
        TCP port 22 was observed open during the authorized scan and was identified as an SSH service. Further configuration and version assessment is required before determining whether a security weakness exists.
      </blockquote>

      <h2>7. Service Exposure</h2>

      <p>Investigators should determine whether a service is expected. A database service exposed to an internal management network may be normal, while the same service exposed beyond its intended boundary could require review.</p>

      <p>Security interpretation therefore requires environmental context.</p>

      <h2>8. HTTP and HTTPS</h2>

      <p>Web services can provide additional information through Nmap scripts and service detection.</p>

      <pre><code>80/tcp  open  http
443/tcp open  https</code></pre>

      <p>The investigator may then correlate the network observation with web-technology information obtained through authorized methods.</p>

      <h2>9. SSH</h2>

      <p>SSH is commonly used for remote administration. Its presence does not itself indicate a vulnerability. Security review may consider authentication methods, software version, exposure, and organizational requirements.</p>

      <h2>10. Databases</h2>

      <p>If an authorized scan identifies a database service, the finding should be documented as service exposure.</p>

      <p>The investigator should not attempt unauthorized authentication or data access.</p>

      <h2>11. Unexpected Services</h2>

      <p>An unexpected service can be a valuable security finding because it may indicate:</p>

      <ul>
        <li>Unnecessary software</li>
        <li>Configuration drift</li>
        <li>Temporary development services</li>
        <li>Legacy applications</li>
        <li>Unexpected network exposure</li>
      </ul>

      <p>Further investigation should remain within scope.</p>

      <h2>12. Comparing Scans</h2>

      <p>Repeated authorized scans can identify changes.</p>

      <pre><code>Day 1:
22, 80, 443

Day 7:
22, 80, 443, 8080

Change:
New service exposure on 8080</code></pre>

      <p>This is especially useful for change management and defensive monitoring.</p>

      <h2>13. Structured Finding</h2>

      <pre><code>Finding ID: NMAP-001
Target: Authorized Lab Host
Observation: TCP 8080 open
Service: HTTP-like service
Evidence: Nmap output
Timestamp: Recorded during scan
Severity: Requires contextual assessment
Recommendation: Verify whether service is intended</code></pre>

      <h2>14. Core Principle</h2>

      <p>Nmap output becomes valuable security intelligence only after it is interpreted within the target's architecture, purpose, configuration, and authorized assessment scope.</p>
    `,
    keyPoints: [
      "Raw scanner output must be interpreted",
      "Open services contribute to attack-surface analysis",
      "Service versions require contextual assessment",
      "An open port is not automatically a vulnerability",
      "Unexpected services can indicate configuration issues",
      "Structured findings improve reporting"
    ],
    example:
      "Finding: TCP 8080 observed open; service requires contextual review rather than being automatically classified as vulnerable.",
    estimatedTime: 65,
    order: 5,
    difficulty: "Intermediate",
    prerequisites: [
      "Nmap NSE and Advanced Enumeration"
    ]
  },

  {
    lessonNumber: 6,
    title: "Nmap in ForenX AI LearnOSINT and Recon Correlation",
    shortDescription:
      "Learn how Nmap findings can integrate with ForenX Recon Engine, Correlation Engine, AI Mentor, evidence notebooks, and investigation reports.",
    objectives: [
      "Understand Nmap's role in ForenX",
      "Correlate Nmap results with passive intelligence",
      "Use AI to explain scan output",
      "Create structured evidence",
      "Understand correlation rules",
      "Generate investigation reports"
    ],
    content: `
      <h2>1. Nmap Within ForenX</h2>

      <p>ForenX AI LearnOSINT combines OSINT education with practical cybersecurity investigation workflows. Nmap can serve as an active-reconnaissance module used only inside explicitly authorized laboratory or simulation environments.</p>

      <p>This distinction should be visible to students. The platform can teach passive intelligence first and then introduce controlled active reconnaissance.</p>

      <h2>2. Passive-to-Active Workflow</h2>

      <pre><code>Public Domain
     ↓
WHOIS / DNS
     ↓
Authorized Target Identification
     ↓
Nmap
     ↓
Open Services
     ↓
Service Analysis
     ↓
Correlation
     ↓
Report</code></pre>

      <p>The active step should only occur when the target is explicitly within scope.</p>

      <h2>3. Recon Engine</h2>

      <p>ForenX's Recon Engine can collect domain, DNS, technology, security-header, SSL, and metadata information. Nmap can add network-level observations when the assessment permits active scanning.</p>

      <pre><code>Recon Engine
 |
 +---- Domain
 +---- DNS
 +---- SSL
 +---- Technology
 +---- Security Headers
 |
 +---- Nmap
        |
        +---- Ports
        +---- Services
        +---- Versions</code></pre>

      <h2>4. Correlation Engine</h2>

      <p>The Correlation Engine can identify relationships between observations.</p>

      <p>For example, a passive source may identify a web server technology while Nmap identifies an HTTP service. These observations can be related without claiming that either one alone proves a vulnerability.</p>

      <pre><code>Public Technology Reference
          +
Nmap Service Observation
          ↓
Technology Correlation
          ↓
Review Required</code></pre>

      <h2>5. Example Correlation Rule</h2>

      <p>A hypothetical defensive rule could be:</p>

      <blockquote>
        If an authorized Nmap scan identifies a service version associated with an outdated software family and an independent technology source reports the same software family, flag the relationship for manual security review.
      </blockquote>

      <p>The rule should create a review flag rather than automatically declaring a vulnerability.</p>

      <h2>6. AI Mentor</h2>

      <p>The AI Mentor can explain Nmap output to beginners.</p>

      <pre><code>User:
What does 443/tcp open https mean?

AI Mentor:
TCP port 443 appears reachable and is associated
with HTTPS. This is an observation, not proof of
a vulnerability.</code></pre>

      <p>This style of explanation teaches the distinction between technical output and security conclusions.</p>

      <h2>7. AI Command Suggestions</h2>

      <p>ForenX can suggest commands within an authorized lab.</p>

      <pre><code>Objective:
Check common web ports on lab host

Suggested:
nmap -p 80,443 192.168.56.10</code></pre>

      <p>The platform should require the learner to select an authorized target rather than encouraging arbitrary scanning.</p>

      <h2>8. Evidence Notebook</h2>

      <p>Nmap findings can be recorded with:</p>

      <ul>
        <li>Target</li>
        <li>Authorization scope</li>
        <li>Command</li>
        <li>Timestamp</li>
        <li>Observed ports</li>
        <li>Service information</li>
        <li>Tool version</li>
        <li>Interpretation</li>
        <li>Confidence</li>
        <li>Related evidence</li>
      </ul>

      <h2>9. Simulation Mode</h2>

      <p>Simulation Mode is especially useful for teaching Nmap. ForenX can provide a fictional host and simulated scan output. Students can interpret results without generating traffic against real systems.</p>

      <pre><code>Fictional Host
     ↓
Simulated Nmap Output
     ↓
Student Analysis
     ↓
AI Feedback
     ↓
Score</code></pre>

      <h2>10. Investigation Reports</h2>

      <p>Nmap findings can be inserted into a structured report.</p>

      <pre><code>Target
 ↓
Scan Scope
 ↓
Command
 ↓
Results
 ↓
Interpretation
 ↓
Correlation
 ↓
Risk Assessment
 ↓
Recommendation</code></pre>

      <h2>11. Example Report Finding</h2>

      <p><strong>Observation:</strong> TCP port 8080 was observed open on the authorized laboratory host.</p>

      <p><strong>Service:</strong> HTTP-like service detected.</p>

      <p><strong>Correlation:</strong> Another authorized technology-detection module reports a related web technology.</p>

      <p><strong>Assessment:</strong> The service should be reviewed to determine whether the exposure is expected.</p>

      <h2>12. Learning Analytics</h2>

      <p>ForenX can evaluate whether a learner understands:</p>

      <ul>
        <li>Port states</li>
        <li>Service identification</li>
        <li>Version detection</li>
        <li>NSE concepts</li>
        <li>Evidence documentation</li>
        <li>Security interpretation</li>
      </ul>

      <h2>13. Core Principle</h2>

      <p>Nmap makes ForenX more practical by connecting OSINT concepts with controlled network reconnaissance. The platform should teach students not only how to run scans but also how to interpret, correlate, document, and responsibly report the results.</p>
    `,
    keyPoints: [
      "Nmap can complement ForenX passive reconnaissance",
      "Active scanning must remain within explicit authorization",
      "The Correlation Engine can connect Nmap with other modules",
      "AI can explain scan results",
      "Simulation Mode can provide safe Nmap training",
      "Reports should preserve command, scope, timestamp, and interpretation"
    ],
    example:
      "Authorized lab → Nmap service observation → Recon Engine correlation → AI explanation → evidence notebook → investigation report.",
    estimatedTime: 70,
    order: 6,
    difficulty: "Advanced",
    prerequisites: [
      "Nmap Output Analysis and Security Interpretation",
      "Nmap NSE and Advanced Enumeration"
    ]
  },

  {
    lessonNumber: 7,
    title: "Nmap Evidence Preservation and Practical Lab",
    shortDescription:
      "Perform a controlled Nmap laboratory investigation and document scope, commands, results, service observations, timestamps, and conclusions.",
    objectives: [
      "Conduct an authorized Nmap lab",
      "Perform host discovery",
      "Perform port and service enumeration",
      "Analyze scan results",
      "Preserve evidence",
      "Create a structured security finding"
    ],
    content: `
      <h2>1. Laboratory Overview</h2>

      <p>This practical laboratory uses an intentionally authorized local environment. Students should use localhost, a private virtual machine, or a deliberately provided cybersecurity laboratory system.</p>

      <p>Do not substitute an unrelated Internet host for the laboratory target.</p>

      <h2>2. Laboratory Objective</h2>

      <p>Identify reachable services on a permitted laboratory host, determine service information, document observations, and produce a professional finding.</p>

      <h2>3. Step One — Confirm Scope</h2>

      <pre><code>Authorized Target:
192.168.56.10

Allowed:
Host discovery
TCP port scanning
Service detection

Not Allowed:
Unauthorized exploitation
Credential attacks
Data access outside lab</code></pre>

      <h2>4. Step Two — Host Discovery</h2>

      <pre><code>nmap -sn 192.168.56.10</code></pre>

      <p>Record whether the host appears reachable.</p>

      <h2>5. Step Three — Basic Scan</h2>

      <pre><code>nmap 192.168.56.10</code></pre>

      <p>Record open, closed, or filtered ports shown by the scan.</p>

      <h2>6. Step Four — Selected Ports</h2>

      <pre><code>nmap -p 22,80,443 192.168.56.10</code></pre>

      <p>Compare this result with the basic scan.</p>

      <h2>7. Step Five — Service Detection</h2>

      <pre><code>nmap -sV 192.168.56.10</code></pre>

      <p>Record service and version information where available.</p>

      <h2>8. Step Six — Default Scripts</h2>

      <pre><code>nmap -sC -sV 192.168.56.10</code></pre>

      <p>Review additional information generated by default NSE scripts.</p>

      <h2>9. Step Seven — Output Analysis</h2>

      <p>For each open port, answer:</p>

      <ul>
        <li>What protocol is being used?</li>
        <li>What service is associated with the port?</li>
        <li>Was version information detected?</li>
        <li>Is the service expected in the laboratory?</li>
        <li>Does the result require further investigation?</li>
      </ul>

      <h2>10. Step Eight — Evidence Record</h2>

      <table>
        <thead>
          <tr>
            <th>Field</th>
            <th>Example</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Evidence ID</td>
            <td>NMAP-E001</td>
          </tr>
          <tr>
            <td>Target</td>
            <td>192.168.56.10</td>
          </tr>
          <tr>
            <td>Command</td>
            <td>nmap -sV 192.168.56.10</td>
          </tr>
          <tr>
            <td>Timestamp</td>
            <td>Investigation timestamp</td>
          </tr>
          <tr>
            <td>Observation</td>
            <td>TCP service detected</td>
          </tr>
          <tr>
            <td>Confidence</td>
            <td>Observed</td>
          </tr>
        </tbody>
      </table>

      <h2>11. Step Nine — Interpret Carefully</h2>

      <p>Do not write:</p>

      <blockquote>
        Port 80 is open, therefore the web server is vulnerable.
      </blockquote>

      <p>Instead write:</p>

      <blockquote>
        TCP port 80 was observed open and identified as an HTTP service during the authorized scan. Further application-level assessment is required to determine security impact.
      </blockquote>

      <h2>12. Step Ten — Compare Results</h2>

      <p>Compare the basic scan and service-detection scan.</p>

      <pre><code>Basic Scan:
80/tcp open http

Service Detection:
80/tcp open http Apache ...</code></pre>

      <p>Document what additional information was obtained.</p>

      <h2>13. Step Eleven — Correlation</h2>

      <p>If ForenX's technology module identifies the same web technology, record the relationship.</p>

      <pre><code>Nmap:
HTTP Service

Technology Module:
Apache

Correlation:
Consistent observation</code></pre>

      <p>Do not automatically assign a vulnerability based on this relationship.</p>

      <h2>14. Step Twelve — Final Finding</h2>

      <pre><code>Finding:
Web Service Exposure

Target:
Authorized Laboratory Host

Evidence:
Nmap scan output

Observation:
TCP 80 open

Assessment:
Expected/Unexpected service requires review

Recommendation:
Verify intended exposure and configuration</code></pre>

      <h2>15. Lab Deliverables</h2>

      <ol>
        <li>Scope definition</li>
        <li>Target information</li>
        <li>Host-discovery result</li>
        <li>Basic scan</li>
        <li>Service-detection result</li>
        <li>NSE result</li>
        <li>Evidence table</li>
        <li>At least three findings</li>
        <li>Correlation analysis</li>
        <li>Final report</li>
      </ol>

      <h2>16. Reflection Questions</h2>

      <ol>
        <li>What is the difference between an open port and a vulnerability?</li>
        <li>Why is service detection useful?</li>
        <li>What additional information did NSE provide?</li>
        <li>Which findings were observations rather than conclusions?</li>
        <li>How could the results be correlated with ForenX modules?</li>
      </ol>

      <h2>17. Safety Boundary</h2>

      <p>The entire exercise must remain within the authorized laboratory. Do not scan public systems or networks without explicit permission.</p>

      <h2>18. Core Principle</h2>

      <p>Good network reconnaissance is not simply about obtaining more results. It is about obtaining relevant observations within scope and converting them into accurate, reproducible findings.</p>
    `,
    keyPoints: [
      "Always confirm authorization before scanning",
      "Record exact commands and timestamps",
      "Compare basic and advanced scan results",
      "Service detection adds context",
      "NSE can provide additional enumeration",
      "Document observations separately from conclusions"
    ],
    example:
      "Authorized lab host → nmap -sV → service observation → evidence record → contextual assessment → final report.",
    estimatedTime: 80,
    order: 7,
    difficulty: "Advanced",
    prerequisites: [
      "Nmap in ForenX AI LearnOSINT and Recon Correlation",
      "Nmap Output Analysis and Security Interpretation"
    ]
  },

  {
    lessonNumber: 8,
    title: "Complete Nmap Investigation and Final Assessment",
    shortDescription:
      "Master the complete Nmap workflow from scope definition and host discovery through enumeration, service analysis, correlation, evidence preservation, and reporting.",
    objectives: [
      "Plan a complete Nmap assessment",
      "Perform host and port discovery",
      "Use service and script detection",
      "Analyze network observations",
      "Correlate Nmap findings with other intelligence",
      "Create a professional security report"
    ],
    content: `
      <h2>1. Complete Nmap Methodology</h2>

      <p>Nmap should be used as part of a structured and authorized network-reconnaissance methodology. The investigator should know what is being tested, why it is being tested, which techniques are permitted, and how the results will be documented.</p>

      <pre><code>Scope
 ↓
Host Discovery
 ↓
Port Discovery
 ↓
Service Detection
 ↓
Advanced Enumeration
 ↓
Analysis
 ↓
Correlation
 ↓
Evidence Preservation
 ↓
Reporting</code></pre>

      <h2>2. Phase One — Define Scope</h2>

      <p>Before scanning, establish the exact target range.</p>

      <ul>
        <li>IP addresses</li>
        <li>Hostnames</li>
        <li>Network ranges</li>
        <li>Allowed ports</li>
        <li>Permitted scan types</li>
        <li>Testing schedule</li>
        <li>Traffic restrictions</li>
      </ul>

      <p>Scope is a security control. An investigator should never assume that a discoverable system is automatically authorized for testing.</p>

      <h2>3. Phase Two — Host Discovery</h2>

      <pre><code>nmap -sn 192.168.56.0/24</code></pre>

      <p>Record hosts that appear reachable and compare them against the authorized asset list.</p>

      <h2>4. Phase Three — Port Enumeration</h2>

      <pre><code>nmap 192.168.56.10</code></pre>

      <p>Then, if authorized:</p>

      <pre><code>nmap -p- 192.168.56.10</code></pre>

      <p>Compare the common-port scan with the complete TCP-port scan.</p>

      <h2>5. Phase Four — Service Detection</h2>

      <pre><code>nmap -sV 192.168.56.10</code></pre>

      <p>Record detected services and version information.</p>

      <h2>6. Phase Five — Operating-System Detection</h2>

      <pre><code>nmap -O 192.168.56.10</code></pre>

      <p>Record the estimated OS information and confidence provided by Nmap. Treat OS detection as an inference based on network characteristics.</p>

      <h2>7. Phase Six — NSE Enumeration</h2>

      <pre><code>nmap -sC -sV 192.168.56.10</code></pre>

      <p>Review the additional script output and identify which information is useful for the investigation.</p>

      <h2>8. Phase Seven — Result Classification</h2>

      <p>Classify observations into categories:</p>

      <ul>
        <li>Host discovery</li>
        <li>Port exposure</li>
        <li>Service identification</li>
        <li>Version information</li>
        <li>Configuration observation</li>
        <li>Potential security issue</li>
        <li>Validated security issue</li>
      </ul>

      <p>This prevents raw scanner output from being incorrectly presented as confirmed vulnerabilities.</p>

      <h2>9. Phase Eight — Attack-Surface Mapping</h2>

      <pre><code>Host
 |
 +---- 22/tcp SSH
 |
 +---- 80/tcp HTTP
 |
 +---- 443/tcp HTTPS
 |
 +---- 8080/tcp Web Service</code></pre>

      <p>This representation makes it easier to understand the services exposed by the host.</p>

      <h2>10. Phase Nine — Correlation With ForenX</h2>

      <pre><code>Nmap
 |
 +---- Ports
 +---- Services
 +---- Versions

Recon Engine
 |
 +---- DNS
 +---- SSL
 +---- Technology
 +---- Security Headers

Correlation Engine
 |
 +---- Related Findings
 +---- Potential Review Flags
</code></pre>

      <p>Correlation can identify relationships between network and web intelligence.</p>

      <h2>11. Example Correlation</h2>

      <p>Suppose Nmap identifies an HTTPS service and a separate ForenX module identifies a certificate associated with the same hostname.</p>

      <pre><code>Nmap:
443/tcp open HTTPS

Certificate Module:
Certificate for same hostname

Correlation:
Network service and certificate relationship</code></pre>

      <p>This supports a technical relationship but does not automatically establish a vulnerability.</p>

      <h2>12. Phase Ten — Security Interpretation</h2>

      <p>Ask whether each exposed service is expected.</p>

      <ul>
        <li>Is the service necessary?</li>
        <li>Is it exposed to the correct network?</li>
        <li>Is authentication configured appropriately?</li>
        <li>Is the software maintained?</li>
        <li>Is the service documented?</li>
        <li>Does the organization intend the exposure?</li>
      </ul>

      <h2>13. Phase Eleven — Evidence Preservation</h2>

      <p>Preserve:</p>

      <ul>
        <li>Target</li>
        <li>Scope</li>
        <li>Nmap version</li>
        <li>Exact command</li>
        <li>Timestamp</li>
        <li>Raw output</li>
        <li>Relevant interpretation</li>
        <li>Related evidence</li>
      </ul>

      <h2>14. Phase Twelve — Reporting</h2>

      <p>A professional Nmap report can contain:</p>

      <ol>
        <li>Assessment objective</li>
        <li>Authorization and scope</li>
        <li>Methodology</li>
        <li>Tools and versions</li>
        <li>Targets</li>
        <li>Scan commands</li>
        <li>Open ports</li>
        <li>Service information</li>
        <li>OS observations</li>
        <li>NSE findings</li>
        <li>Correlation results</li>
        <li>Risk interpretation</li>
        <li>Recommendations</li>
        <li>Limitations</li>
        <li>Conclusion</li>
      </ol>

      <h2>15. Common Beginner Mistakes</h2>

      <ul>
        <li>Scanning systems without authorization</li>
        <li>Assuming every open port is dangerous</li>
        <li>Assuming service names are always accurate</li>
        <li>Treating version strings as automatic vulnerability proof</li>
        <li>Running aggressive scans without considering traffic</li>
        <li>Using NSE without understanding the script</li>
        <li>Failing to record commands</li>
        <li>Failing to record timestamps</li>
        <li>Reporting scanner output without interpretation</li>
        <li>Confusing reconnaissance with exploitation</li>
      </ul>

      <h2>16. Final Assessment Questions</h2>

      <ol>
        <li>What is Nmap?</li>
        <li>Why is Nmap considered an active reconnaissance tool?</li>
        <li>What is the difference between host discovery and port scanning?</li>
        <li>What do open, closed, and filtered mean?</li>
        <li>What does -sV provide?</li>
        <li>What does -O attempt to determine?</li>
        <li>What is NSE?</li>
        <li>What does -sC do?</li>
        <li>Why must NSE scripts be understood before execution?</li>
        <li>Why is an open port not automatically a vulnerability?</li>
        <li>Why can version information be misleading?</li>
        <li>Why is authorization essential?</li>
        <li>How can Nmap findings be correlated with DNS?</li>
        <li>How can Nmap findings be correlated with certificates?</li>
        <li>How can Nmap integrate with the ForenX Recon Engine?</li>
        <li>What information should be preserved as evidence?</li>
        <li>What should a professional Nmap report contain?</li>
      </ol>

      <h2>17. Final Practical Challenge</h2>

      <p>Using an intentionally vulnerable or otherwise authorized laboratory host, conduct a complete Nmap assessment.</p>

      <p>The assessment should include:</p>

      <ol>
        <li>Scope definition</li>
        <li>Host discovery</li>
        <li>Basic port scan</li>
        <li>Selected-port scan</li>
        <li>Service detection</li>
        <li>OS detection where appropriate</li>
        <li>Default NSE enumeration</li>
        <li>Structured evidence records</li>
        <li>Attack-surface map</li>
        <li>At least three findings</li>
        <li>Cross-tool correlation</li>
        <li>Risk interpretation</li>
        <li>Recommendations</li>
        <li>Final report</li>
      </ol>

      <h2>18. Professional Checklist</h2>

      <ul>
        <li>☐ Confirm authorization</li>
        <li>☐ Define exact target scope</li>
        <li>☐ Record exclusions</li>
        <li>☐ Perform host discovery</li>
        <li>☐ Enumerate appropriate ports</li>
        <li>☐ Identify services</li>
        <li>☐ Review versions</li>
        <li>☐ Perform OS detection where permitted</li>
        <li>☐ Review NSE output</li>
        <li>☐ Validate important findings</li>
        <li>☐ Correlate with other ForenX modules</li>
        <li>☐ Record commands</li>
        <li>☐ Record timestamps</li>
        <li>☐ Preserve raw output</li>
        <li>☐ Separate observations from conclusions</li>
        <li>☐ Document limitations</li>
        <li>☐ Produce a professional report</li>
      </ul>

      <h2>19. Final Takeaway</h2>

      <p>Nmap is much more than a command that lists open ports. It is a flexible network-discovery platform capable of identifying hosts, services, versions, operating-system characteristics, and additional information through NSE.</p>

      <p>For cybersecurity students, the most important skill is not simply remembering commands. It is understanding what every result means, what it does not mean, how reliable the observation is, and what additional evidence is required before making a security conclusion.</p>

      <p>Within ForenX AI LearnOSINT, Nmap can provide the active-reconnaissance component of a larger investigation workflow. Passive information from DNS, WHOIS, certificates, technology detection, and public sources can be combined with authorized Nmap observations through the Correlation Engine.</p>

      <p>The AI Mentor can explain scan results, recommend appropriate laboratory exercises, identify uncertainty, and guide students through evidence documentation. Simulation Mode can provide safe practice environments without requiring students to scan real systems.</p>

      <p>The complete methodology can be remembered as:</p>

      <blockquote>
        <strong>Scope → Discover → Enumerate → Identify → Analyze → Correlate → Validate → Preserve → Report.</strong>
      </blockquote>

      <p>Most importantly, Nmap should always be used responsibly. Network visibility does not imply permission to probe a system. Professional reconnaissance begins with authorization and ends with accurate, reproducible, and appropriately qualified reporting.</p>
    `,
    keyPoints: [
      "Nmap assessments must begin with explicit scope and authorization",
      "Host discovery and port enumeration provide the foundation",
      "Service and OS detection add contextual information",
      "NSE provides additional enumeration capabilities",
      "Scanner output requires human interpretation and validation",
      "Nmap findings can be correlated with ForenX passive intelligence",
      "Evidence should include scope, commands, timestamps, and raw output",
      "Professional reporting distinguishes observations from confirmed security issues"
    ],
    example:
      "Complete authorized workflow: scope → host discovery → port scan → service detection → NSE → analysis → ForenX correlation → evidence preservation → final report.",
    estimatedTime: 90,
    order: 8,
    difficulty: "Advanced",
    prerequisites: [
      "Nmap Fundamentals for OSINT and Network Reconnaissance",
      "Nmap Host Discovery and Port Scanning",
      "Nmap Service Detection, OS Detection, and Scan Types",
      "Nmap NSE and Advanced Enumeration",
      "Nmap Output Analysis and Security Interpretation",
      "Nmap in ForenX AI LearnOSINT and Recon Correlation",
      "Nmap Evidence Preservation and Practical Lab"
    ]
  }
];

module.exports = toolLessons;