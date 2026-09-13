const toolLessons = [
  {
    lessonNumber: 1,
    title: "Censys Fundamentals for OSINT",
    shortDescription:
      "Understand Censys, internet-wide asset discovery, hosts, services, certificates, and the role of Censys in passive reconnaissance.",
    objectives: [
      "Understand the purpose of Censys",
      "Learn the difference between hosts, services, and certificates",
      "Understand internet-wide asset discovery",
      "Learn how Censys can support passive OSINT",
      "Understand the difference between discovery and exploitation",
      "Recognize the limitations of internet-wide search datasets"
    ],
    content: `
      <h2>1. Introduction to Censys</h2>
      <p>Censys is a platform used to discover and analyze publicly observable Internet infrastructure. It is particularly useful for security research, asset discovery, threat intelligence, and passive reconnaissance. Instead of functioning primarily as a conventional web search engine, Censys organizes information about Internet-connected hosts, services, and certificates so that investigators can search for technical characteristics associated with publicly observable systems.</p>

      <p>For an OSINT investigator, this distinction is important. A normal search engine is generally optimized around web pages and textual information. Censys is oriented toward Internet infrastructure and the characteristics that can be observed from network services. This makes it useful when an investigation moves from an organization's public identity toward technical infrastructure.</p>

      <h2>2. Why Censys Is Relevant to OSINT</h2>
      <p>OSINT is not limited to social media, news articles, or search-engine results. Publicly observable technical infrastructure can also provide useful intelligence. Domains, IP addresses, certificates, service banners, protocols, and other metadata can help an investigator understand how an organization exposes infrastructure to the public Internet.</p>

      <p>Consider a fictional organization named <strong>Atlas Research Labs</strong>. A conventional search may identify its website. Censys can then become a technical pivot for studying publicly observable infrastructure associated with a known domain or IP address.</p>

      <pre><code>Organization
      ↓
Public Website
      ↓
Domain
      ↓
Censys
      ↓
Publicly Observable Hosts
      ↓
Services
      ↓
Certificates
      ↓
Additional Passive Pivots</code></pre>

      <p>This workflow illustrates why Censys belongs in an OSINT toolset. It can help connect an organization's public identity with technical infrastructure without requiring the investigator to actively exploit that infrastructure.</p>

      <h2>3. Internet-Wide Asset Discovery</h2>
      <p>Traditional reconnaissance often starts with a specific target and then attempts to enumerate associated systems. Internet-wide search platforms approach the problem differently. They maintain datasets representing observations of large portions of the public Internet and allow investigators to search those observations.</p>

      <p>This can make infrastructure discovery much faster. Instead of starting from scratch with every domain, an investigator may be able to search existing observations for characteristics such as an IP address, domain name, certificate attribute, protocol, or service property.</p>

      <p>However, an important limitation must be understood: an Internet-wide dataset is a snapshot or collection of observations, not a perfect real-time representation of the Internet. Infrastructure changes continuously. A service visible yesterday may be gone today, while a newly deployed service may not yet appear in the dataset.</p>

      <h2>4. Hosts</h2>
      <p>A host generally represents an Internet-connected system identified through an address such as an IP address. A host can expose one or more network services. From an investigative perspective, a host is an infrastructure entity that can be connected to other entities such as domains and certificates.</p>

      <p>For example, a fictional domain may resolve to an IP address. If that address is represented in Censys, the investigator may be able to examine publicly observable characteristics associated with that host.</p>

      <h2>5. Services</h2>
      <p>A service is a network-facing application or protocol available through a host. Common examples include HTTP, HTTPS, DNS, SSH, SMTP, and other protocols. Censys can provide information about publicly observable services and their characteristics.</p>

      <p>Service information can be useful for understanding an organization's public attack surface from a defensive or intelligence perspective. However, observing a service does not authorize interaction beyond the permitted scope of an investigation.</p>

      <h2>6. Certificates</h2>
      <p>TLS certificates are another important Censys intelligence source. Certificates are used to establish encrypted connections and contain metadata such as subject names, issuer information, validity periods, and alternative names.</p>

      <p>Certificate information can reveal relationships between domains and infrastructure. A certificate may contain several hostnames in its Subject Alternative Name field. Those names can become passive investigation pivots.</p>

      <h2>7. Censys Versus Conventional Search Engines</h2>

      <table>
        <thead>
          <tr>
            <th>Characteristic</th>
            <th>Conventional Search Engine</th>
            <th>Censys</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Primary focus</td>
            <td>Web information</td>
            <td>Internet infrastructure</td>
          </tr>
          <tr>
            <td>Common discovery</td>
            <td>Pages and documents</td>
            <td>Hosts and services</td>
          </tr>
          <tr>
            <td>Technical metadata</td>
            <td>Limited</td>
            <td>Important component</td>
          </tr>
          <tr>
            <td>Certificates</td>
            <td>Usually indirect</td>
            <td>Important investigation source</td>
          </tr>
        </tbody>
      </table>

      <h2>8. Passive Reconnaissance</h2>
      <p>Passive reconnaissance attempts to gather information without directly interacting with a target in a way that could be considered intrusive. Censys can support this type of research because investigators can use its existing observations instead of initiating arbitrary testing against a target.</p>

      <p>Nevertheless, investigators must understand their authorization boundaries. Passive availability of information does not automatically mean every subsequent action is authorized.</p>

      <h2>9. Important Limitations</h2>
      <ul>
        <li>Datasets may not represent the current state of infrastructure.</li>
        <li>Not every Internet-connected system is represented.</li>
        <li>IP ownership can change.</li>
        <li>Certificates can contain multiple unrelated or historical names.</li>
        <li>Shared hosting can make attribution difficult.</li>
        <li>Technical observations require contextual interpretation.</li>
      </ul>

      <h2>10. Beginner Exercise</h2>
      <p>Create a fictional organization and domain. Write down the organization's name, domain, and investigation objective. Explain how Censys could be used as a passive technical pivot after discovering the domain through a search engine.</p>

      <p>The objective of this exercise is not to attack or scan a system. It is to understand how public technical observations can be incorporated into an OSINT investigation.</p>

      <h2>11. Key Concept</h2>
      <p>Censys should be viewed as an infrastructure intelligence source. Its value comes from connecting public identifiers such as domains and certificates with observable Internet infrastructure and allowing investigators to analyze those relationships systematically.</p>
    `,
    keyPoints: [
      "Censys focuses on publicly observable Internet infrastructure",
      "Hosts, services, and certificates are important Censys concepts",
      "Censys can support passive reconnaissance",
      "Internet-wide datasets are observations rather than perfect real-time truth",
      "Technical findings require validation and context",
      "Discovery does not imply authorization to attack or exploit"
    ],
    example:
      "A fictional domain discovered through an OSINT search can be used as a starting point for passive Censys research into publicly observable infrastructure.",
    estimatedTime: 45,
    order: 1,
    difficulty: "Beginner",
    prerequisites: []
  },

  {
    lessonNumber: 2,
    title: "Censys Platform and Basic Searching",
    shortDescription:
      "Learn the fundamental workflow for using Censys to investigate hosts, domains, services, and certificates.",
    objectives: [
      "Understand the Censys search workflow",
      "Identify host and service information",
      "Search known IP addresses and domains",
      "Interpret basic infrastructure results",
      "Understand certificate-related information",
      "Record useful observations for OSINT investigations"
    ],
    content: `
      <h2>1. Starting a Censys Investigation</h2>
      <p>A Censys investigation should begin with a clearly defined objective. The investigator may already know an IP address, domain name, hostname, organization, or certificate identifier. The known identifier becomes the starting point for the investigation.</p>

      <p>For example, suppose a fictional investigation begins with <code>atlas.example</code>. The investigator should not immediately search for every possible technical characteristic. Start with the known domain and determine what relationships can be established.</p>

      <h2>2. Domain-Based Investigation</h2>
      <p>A domain is often one of the most useful starting points because it provides a human-readable identifier that can be correlated with infrastructure. A domain can be investigated through DNS tools first and then used as a pivot into Censys.</p>

      <pre><code>Domain
atlas.example
    ↓
DNS resolution
    ↓
IP address
    ↓
Censys host investigation</code></pre>

      <p>This workflow separates different evidence sources. DNS provides the relationship between the domain and address, while Censys can provide observations associated with the infrastructure.</p>

      <h2>3. IP Address Searching</h2>
      <p>An IP address can be a powerful technical identifier. If a legitimate investigation has identified an IP address, Censys can be used to examine publicly observable information associated with that address.</p>

      <p>The investigator should record the IP, the source that provided it, and the date on which it was observed. This is important because infrastructure ownership and DNS mappings can change over time.</p>

      <h2>4. Reading Host Information</h2>
      <p>A host result can contain multiple categories of information. Depending on the dataset and observation, an investigator may encounter information about services, protocols, certificates, software characteristics, or network metadata.</p>

      <p>The correct approach is to read the result as a collection of observations rather than as a complete security assessment.</p>

      <h2>5. Services and Ports</h2>
      <p>Public services are commonly associated with ports. For example, web services frequently use HTTP or HTTPS, while other protocols use their own conventional ports. A Censys result may indicate that a particular service was observed.</p>

      <p>Students should learn to distinguish between:</p>

      <ul>
        <li>Port number</li>
        <li>Transport protocol</li>
        <li>Application protocol</li>
        <li>Service metadata</li>
        <li>Observation timestamp</li>
      </ul>

      <p>A port number alone does not always prove what application is running. Services can use non-standard ports, and multiple technologies can produce similar observations.</p>

      <h2>6. HTTP and HTTPS Observations</h2>
      <p>Web-facing services can expose metadata such as protocol information, HTTP characteristics, TLS information, and server-related observations. Such information can help an investigator understand the public-facing infrastructure.</p>

      <p>However, metadata should not be interpreted as a complete technology fingerprint. A banner may be customized, outdated, or generated by an intermediate service such as a reverse proxy.</p>

      <h2>7. Certificate Results</h2>
      <p>Certificates can provide useful relationships between domains and hosts. An investigator should pay attention to fields such as subject name, alternative names, issuer, and validity period.</p>

      <p>For example, a certificate associated with a fictional organization might contain:</p>

      <pre><code>Subject:
CN=www.atlas.example

Subject Alternative Names:
www.atlas.example
api.atlas.example
portal.atlas.example</code></pre>

      <p>These hostnames can become passive investigation pivots.</p>

      <h2>8. Observation Dates</h2>
      <p>Time is extremely important in technical OSINT. A service observed by Censys at one point may no longer exist. An investigator should record when the observation occurred and avoid presenting historical observations as current facts without additional confirmation.</p>

      <h2>9. Search Result Triage</h2>
      <p>Not every result deserves equal attention. Investigators should prioritize results directly related to the investigation objective. A result containing the exact domain is generally more useful than a result sharing only a common keyword.</p>

      <p>A simple classification system is:</p>

      <ul>
        <li><strong>Relevant:</strong> Directly connected to the investigation.</li>
        <li><strong>Potential:</strong> May provide a useful pivot.</li>
        <li><strong>Unrelated:</strong> Similar terminology but no supporting relationship.</li>
        <li><strong>Historical:</strong> Useful for timeline analysis.</li>
      </ul>

      <h2>10. Recording Findings</h2>
      <p>Every important Censys discovery should be documented with the query or identifier used, the result, observation date, relevant technical fields, source context, and investigator interpretation.</p>

      <p>A good evidence record might look like:</p>

      <pre><code>Evidence ID: CENSYS-001
Identifier: atlas.example
Finding: Publicly observable HTTPS service
Observed: Investigation timestamp
Relationship: Domain → Host
Confidence: Probable
Next Pivot: Certificate and DNS validation</code></pre>

      <h2>11. Basic Practice</h2>
      <p>Using only fictional or authorized infrastructure, start with a domain and construct a simple investigation chain: domain → DNS → IP → Censys host → services → certificates. Record what each source independently demonstrates.</p>

      <p>The goal is to understand that each tool contributes a different layer of evidence.</p>
    `,
    keyPoints: [
      "Start Censys investigations from a known identifier",
      "Domains can be pivoted to IP addresses through DNS",
      "Host results should be interpreted as observations",
      "Ports do not automatically prove the exact application",
      "Certificate fields can reveal useful hostname relationships",
      "Observation dates are important for technical intelligence"
    ],
    example:
      "Domain → DNS resolution → IP address → Censys host → observed HTTPS service → certificate hostname pivot.",
    estimatedTime: 50,
    order: 2,
    difficulty: "Beginner",
    prerequisites: ["Censys Fundamentals for OSINT"]
  },

  {
    lessonNumber: 3,
    title: "Censys Search and Query Techniques",
    shortDescription:
      "Learn structured Censys searching, field-oriented investigation, query refinement, and techniques for finding hosts, services, and certificates.",
    objectives: [
      "Understand structured Censys queries",
      "Use field-based search concepts",
      "Search for technical attributes",
      "Combine multiple conditions",
      "Refine noisy searches",
      "Create repeatable investigation queries"
    ],
    content: `
      <h2>1. Why Structured Searching Matters</h2>
      <p>As an investigator moves beyond basic host searches, structured query techniques become increasingly important. Internet infrastructure contains enormous amounts of information, and broad searches can produce many irrelevant results. Field-based searching allows an investigator to focus on specific characteristics.</p>

      <p>The exact syntax available can depend on the Censys product and version being used. Students should therefore treat the platform's current documentation and interface as authoritative for exact query syntax. The methodology remains consistent: identify the field representing the investigative question and combine it with appropriate values.</p>

      <h2>2. Search by Known IP</h2>
      <p>When an IP address is known, searching directly for that address provides a focused starting point. This is useful when the IP was obtained from DNS, a public document, a certificate relationship, or another legitimate intelligence source.</p>

      <pre><code>Known domain
    ↓
DNS
    ↓
203.0.113.10
    ↓
Censys host search</code></pre>

      <p>Use documentation-supported field syntax when constructing the actual query.</p>

      <h2>3. Search by Domain or Hostname</h2>
      <p>Hostname-oriented searches are useful when the investigation begins with a domain or a hostname discovered in a certificate. Exact field names and query syntax should be verified against the current Censys interface.</p>

      <p>The investigative concept is more important than memorizing one static query. The objective is to locate observations where the hostname appears as an associated attribute.</p>

      <h2>4. Combining Conditions</h2>
      <p>Multiple conditions can make a query more precise. For example, an investigator may want to identify HTTPS-related observations associated with a particular domain or investigate certificates containing a specific name.</p>

      <p>Conceptually:</p>

      <pre><code>Domain condition
       AND
HTTPS condition
       AND
Certificate condition</code></pre>

      <p>Each condition reduces the search space, but excessive filtering can also hide useful information.</p>

      <h2>5. Query Refinement</h2>
      <p>A good query-development process is iterative. Begin with one strong identifier. Examine the results. Identify a useful field. Add one additional restriction. Repeat until the results become sufficiently relevant.</p>

      <ol>
        <li>Start broad.</li>
        <li>Identify relevant results.</li>
        <li>Determine which field matters.</li>
        <li>Add one restriction.</li>
        <li>Review results again.</li>
        <li>Record the successful query.</li>
      </ol>

      <h2>6. Searching Services</h2>
      <p>Service searches can help identify systems exposing particular protocols or characteristics. For defensive OSINT, this can be useful for understanding the public exposure of an authorized organization's infrastructure.</p>

      <p>For example, an organization may want to know which of its assets are publicly observable as web services. A structured Censys query can help identify relevant observations within the available dataset.</p>

      <h2>7. Searching Certificates</h2>
      <p>Certificate-based queries are especially valuable because certificates can connect multiple names and infrastructure observations. An investigator may start with a domain, find a certificate, identify alternative names, and then investigate those names individually.</p>

      <pre><code>Domain
  ↓
Certificate
  ↓
SAN hostname
  ↓
Host
  ↓
Service</code></pre>

      <h2>8. Avoiding False Matches</h2>
      <p>Search systems can return technically correct matches that are irrelevant to the investigation. For example, a common hostname fragment may appear in multiple unrelated certificates. The investigator must establish whether the result belongs to the intended organization.</p>

      <p>Useful validation attributes include:</p>

      <ul>
        <li>Exact domain</li>
        <li>Related organization</li>
        <li>DNS relationship</li>
        <li>Certificate context</li>
        <li>Time period</li>
        <li>Independent public references</li>
      </ul>

      <h2>9. Query Documentation</h2>
      <p>Professional investigators should record important queries. Query logging makes the investigation reproducible and allows the analyst to explain how a particular finding was discovered.</p>

      <pre><code>Query ID: Q-007
Purpose: Find certificate observations for fictional domain
Query: [document exact platform query]
Result: Certificate containing api.atlas.example
Pivot: Investigate api.atlas.example
Confidence: Probable</code></pre>

      <h2>10. Query Efficiency</h2>
      <p>Efficient querying is not about creating the most complicated query. It is about reducing irrelevant results while retaining meaningful coverage. A query that returns zero results may be too restrictive, while a query returning an enormous unrelated dataset may be too broad.</p>

      <p>The investigator should gradually adjust the balance between recall and precision.</p>

      <h2>11. Practical Exercise</h2>
      <p>Create a fictional organization with a fictional domain. Design three conceptual Censys queries: one for the domain, one for associated certificates, and one for publicly observable HTTPS infrastructure. Write the investigative purpose of each query and explain what a positive result would and would not prove.</p>

      <h2>12. Platform Version Awareness</h2>
      <p>Security platforms evolve. Query languages, datasets, user interfaces, and field names can change. For this reason, students should learn the concept of field-based querying rather than relying exclusively on memorized examples from old tutorials.</p>
    `,
    keyPoints: [
      "Structured queries reduce irrelevant results",
      "Exact syntax should be verified against the current Censys interface",
      "Query development should be iterative",
      "Certificate searches provide powerful pivots",
      "Overly restrictive queries can hide useful results",
      "Important queries should be documented"
    ],
    example:
      "Conceptual query workflow: identify domain → search domain-related observations → identify certificate field → refine certificate search → pivot to discovered hostname.",
    estimatedTime: 60,
    order: 3,
    difficulty: "Intermediate",
    prerequisites: [
      "Censys Fundamentals for OSINT",
      "Censys Platform and Basic Searching"
    ]
  },

  {
    lessonNumber: 4,
    title: "Certificate Intelligence with Censys",
    shortDescription:
      "Understand TLS certificates, subject names, SANs, issuers, validity periods, certificate relationships, and certificate-based OSINT pivoting.",
    objectives: [
      "Understand TLS certificate structure",
      "Identify important certificate fields",
      "Understand Subject Alternative Names",
      "Use certificates as OSINT pivots",
      "Interpret certificate validity and issuer information",
      "Avoid incorrect attribution based only on certificates"
    ],
    content: `
      <h2>1. Introduction to Certificate Intelligence</h2>
      <p>Digital certificates are one of the most valuable technical intelligence sources available to an OSINT investigator. TLS certificates are used to establish secure communications, but the metadata associated with certificates can also reveal relationships between domains, hostnames, certificate authorities, and infrastructure.</p>

      <p>Censys makes certificate information particularly useful because certificates can be connected with publicly observable Internet infrastructure.</p>

      <h2>2. What Is a TLS Certificate?</h2>
      <p>A TLS certificate is a digital credential used by a server to support encrypted communication. It contains information that helps a client determine which name or names the certificate represents and which certificate authority issued it.</p>

      <p>For OSINT, the certificate itself is not proof of organizational ownership in every situation. The investigator must examine the certificate's context and compare it with other sources.</p>

      <h2>3. Subject Name</h2>
      <p>The subject section traditionally contains information about the entity represented by the certificate. In modern TLS deployments, hostname validation commonly relies heavily on the Subject Alternative Name extension.</p>

      <p>A certificate might contain a subject such as:</p>

      <pre><code>CN=www.atlas.example</code></pre>

      <p>This tells the investigator that the certificate is associated with that hostname at the time of issuance, but further investigation is needed to understand the broader infrastructure relationship.</p>

      <h2>4. Subject Alternative Names</h2>
      <p>Subject Alternative Names, commonly called SANs, are particularly useful because a certificate can list multiple DNS names.</p>

      <pre><code>DNS:www.atlas.example
DNS:api.atlas.example
DNS:portal.atlas.example
DNS:mail.atlas.example</code></pre>

      <p>Each discovered hostname can become a potential passive pivot. The investigator can determine whether the hostname appears in DNS information, public documents, historical archives, or other intelligence sources.</p>

      <h2>5. Certificate Pivots</h2>
      <p>A certificate investigation can be represented as a graph:</p>

      <pre><code>Certificate
   |
   +---- www.atlas.example
   |
   +---- api.atlas.example
   |
   +---- portal.atlas.example
              |
              +---- IP
              |
              +---- Service</code></pre>

      <p>This is powerful because a single certificate can reveal several related identifiers. However, the relationships still need validation.</p>

      <h2>6. Issuer Information</h2>
      <p>The issuer identifies the certificate authority that issued the certificate. Issuer information can help distinguish certificate types and provide context about the certificate lifecycle.</p>

      <p>Issuer information should not be confused with infrastructure ownership. A certificate authority issuing a certificate for a domain does not own the domain or the associated server.</p>

      <h2>7. Validity Period</h2>
      <p>Certificates have validity periods containing start and expiration information. These dates are useful for temporal analysis.</p>

      <p>If a hostname appeared in an old certificate but no longer appears in current infrastructure observations, the hostname may represent historical infrastructure. The investigator should preserve the historical context instead of presenting it as current.</p>

      <h2>8. Certificate Transparency</h2>
      <p>Certificate transparency systems provide publicly observable records of certificate issuance. Censys can be used alongside certificate transparency sources to investigate domain and certificate relationships.</p>

      <p>A useful workflow is:</p>

      <pre><code>Known Domain
    ↓
Certificate Search
    ↓
Certificate Identifier
    ↓
SAN Names
    ↓
Hostname Discovery
    ↓
DNS / Censys / Historical Validation</code></pre>

      <h2>9. Wildcard Certificates</h2>
      <p>Wildcard certificates can represent a domain pattern such as <code>*.atlas.example</code>. They can indicate that multiple subdomains may be covered by the same certificate, but they do not reveal every actual subdomain automatically.</p>

      <p>An investigator should never interpret a wildcard certificate as proof that every possible hostname exists.</p>

      <h2>10. Shared Certificates</h2>
      <p>Certificates may sometimes contain multiple names that are not all owned or operated by the same organization. Hosting providers, certificate configurations, and infrastructure architectures can produce shared relationships.</p>

      <p>Therefore, the investigator should avoid the assumption:</p>

      <pre><code>Same certificate = same organization</code></pre>

      <p>Instead, treat it as:</p>

      <pre><code>Same certificate = potentially related names requiring validation</code></pre>

      <h2>11. Certificate-to-Domain Investigation</h2>
      <p>Suppose a certificate contains <code>api.atlas.example</code>. Search the hostname independently using DNS tools and OSINT search engines. If multiple independent sources connect the hostname to the same organization, confidence increases.</p>

      <h2>12. Certificate-to-Host Investigation</h2>
      <p>Once a hostname is identified, the investigator can examine passive DNS information and Censys observations to determine which public infrastructure has been associated with the hostname.</p>

      <p>Again, infrastructure relationships can change. Always associate observations with dates.</p>

      <h2>13. Practical Exercise</h2>
      <p>Create a fictional certificate containing three fictional hostnames. Build an investigation graph connecting the certificate to those names. Then define the independent evidence that would be required before concluding that all three hosts belong to the same organization.</p>

      <h2>14. Final Certificate Principle</h2>
      <p>Certificates are excellent pivots but imperfect attribution evidence. Their greatest value comes from revealing identifiers that can be validated through DNS, historical data, public documents, and other independent OSINT sources.</p>
    `,
    keyPoints: [
      "Certificates contain valuable technical metadata",
      "SAN fields can reveal multiple hostnames",
      "Certificate issuers are not infrastructure owners",
      "Validity dates provide useful historical context",
      "Wildcard certificates do not prove every subdomain exists",
      "Certificate relationships require independent validation"
    ],
    example:
      "A certificate containing api.example.org and portal.example.org can be used to identify potential investigation pivots, which should then be validated independently.",
    estimatedTime: 65,
    order: 4,
    difficulty: "Intermediate",
    prerequisites: [
      "Censys Platform and Basic Searching",
      "Censys Search and Query Techniques"
    ]
  },

  {
    lessonNumber: 5,
    title: "Host and Service Intelligence",
    shortDescription:
      "Learn how to interpret Censys host observations, services, protocols, ports, HTTP metadata, TLS information, and technical fingerprints.",
    objectives: [
      "Understand host and service relationships",
      "Interpret ports and protocols",
      "Analyze publicly observable web services",
      "Understand technical fingerprints",
      "Use service information for passive infrastructure analysis",
      "Avoid overinterpreting banners and fingerprints"
    ],
    content: `
      <h2>1. Understanding Host Intelligence</h2>
      <p>Host intelligence focuses on the publicly observable characteristics of Internet-connected systems. Censys can help an investigator understand which services have been observed on an address and what metadata may have been associated with those services.</p>

      <p>For an authorized organization, this type of information can be valuable for attack-surface awareness. For an educational OSINT investigation, it demonstrates how technical infrastructure can be researched without directly attacking the target.</p>

      <h2>2. IP Addresses as Infrastructure Identifiers</h2>
      <p>An IP address identifies a network endpoint at a particular point in time. It should not automatically be treated as a permanent organizational identifier because IP addresses can be reassigned, shared, moved between hosting providers, or placed behind cloud infrastructure.</p>

      <p>This is why IP attribution requires context.</p>

      <h2>3. Ports</h2>
      <p>Ports allow network services to be associated with a transport endpoint. Common ports are conventionally associated with particular protocols, but a port number alone does not prove the service identity.</p>

      <p>For example, HTTPS commonly uses TCP port 443, but HTTPS can also be configured on other ports. Likewise, an application using a conventional port may not necessarily be the expected application.</p>

      <h2>4. Protocol Identification</h2>
      <p>Protocol identification provides more context than a port number alone. An investigator may encounter HTTP, TLS, DNS, SMTP, SSH, or other protocol observations.</p>

      <p>The correct interpretation is:</p>

      <pre><code>IP
 ↓
Port
 ↓
Observed protocol
 ↓
Service metadata
 ↓
Additional validation</code></pre>

      <h2>5. HTTP Metadata</h2>
      <p>Web services can expose HTTP-related metadata. Depending on the observation, investigators may encounter status information, headers, protocol versions, titles, or other characteristics.</p>

      <p>HTTP metadata can provide clues about the architecture of a service, but it should not be treated as a complete application inventory.</p>

      <h2>6. Server Headers</h2>
      <p>Server-related headers can sometimes identify software or infrastructure components. However, headers can be removed, customized, proxied, or misleading.</p>

      <p>Therefore, a header should normally be considered a technical clue rather than definitive proof of the entire technology stack.</p>

      <h2>7. TLS Metadata</h2>
      <p>TLS observations can provide information about certificates, protocols, and cryptographic characteristics. These observations can help connect a host with certificate intelligence.</p>

      <p>For example:</p>

      <pre><code>Host
 ↓
HTTPS service
 ↓
TLS certificate
 ↓
SAN hostname
 ↓
Domain relationship</code></pre>

      <h2>8. Software Fingerprinting</h2>
      <p>Technical fingerprints attempt to infer software or service characteristics from observable behavior. Fingerprints can be useful for defensive inventory and OSINT research, but they are not infallible.</p>

      <p>Different software can produce similar responses, and administrators can modify default configurations. Investigators should therefore seek multiple indicators before making a strong technology claim.</p>

      <h2>9. Reverse Proxy and CDN Considerations</h2>
      <p>Modern websites frequently use reverse proxies, content delivery networks, cloud load balancers, or managed security services. As a result, the publicly observable server may not directly represent the origin infrastructure.</p>

      <p>This is one reason why an IP address discovered through a public observation should not automatically be treated as the organization's physical server.</p>

      <h2>10. Shared Hosting</h2>
      <p>Multiple organizations can share the same infrastructure. Cloud platforms and hosting providers can place many unrelated domains on the same address or service architecture.</p>

      <p>Therefore:</p>

      <pre><code>Same IP ≠ Same organization</code></pre>

      <p>Additional evidence is required to establish attribution.</p>

      <h2>11. Service Exposure Analysis</h2>
      <p>For a defensive investigation, service observations can help answer questions such as:</p>

      <ul>
        <li>Which public services are visible?</li>
        <li>Which protocols are observed?</li>
        <li>Which hostnames are associated with the service?</li>
        <li>Which certificates are associated with the service?</li>
        <li>Are observations current or historical?</li>
      </ul>

      <p>These questions are useful for understanding an organization's public exposure without attempting unauthorized access.</p>

      <h2>12. Technology Correlation</h2>
      <p>If Censys suggests that a host exposes an HTTPS service and another tool identifies a technology reference, the investigator can compare the two observations. Agreement can increase confidence, but differences may also reveal architecture such as a proxy or CDN.</p>

      <h2>13. Practical Exercise</h2>
      <p>Create a fictional host with three hypothetical services. For each service, record the IP, port, protocol, potential application, evidence source, and confidence. Then explain why a port number or banner alone should not be treated as conclusive evidence.</p>

      <h2>14. Defensive Perspective</h2>
      <p>Censys is particularly valuable for defensive teams because organizations can use Internet-wide observations to understand what their infrastructure appears to expose publicly. This can support asset inventory, certificate management, service monitoring, and exposure awareness.</p>

      <p>The same information can be used educationally to teach students how technical OSINT differs from traditional web searching.</p>
    `,
    keyPoints: [
      "IP addresses are time-dependent infrastructure identifiers",
      "Port numbers alone do not prove service identity",
      "HTTP headers and fingerprints are clues rather than absolute proof",
      "CDNs and reverse proxies can hide origin infrastructure",
      "Shared hosting makes simple IP attribution unreliable",
      "Censys observations can support defensive exposure analysis"
    ],
    example:
      "An observed HTTPS service on an IP should be interpreted as an infrastructure observation and correlated with DNS, certificate, and organizational evidence before attribution.",
    estimatedTime: 65,
    order: 5,
    difficulty: "Advanced",
    prerequisites: [
      "Censys Search and Query Techniques",
      "Certificate Intelligence with Censys"
    ]
  },

  {
    lessonNumber: 6,
    title: "Censys with Other OSINT Tools and ForenX Correlation",
    shortDescription:
      "Learn how Censys can be combined with WHOIS, DNS, crt.sh, SecurityTrails, VirusTotal, Wayback Machine, and the ForenX Correlation Engine.",
    objectives: [
      "Correlate Censys findings with WHOIS",
      "Use DNS information to validate infrastructure",
      "Combine Censys with certificate transparency",
      "Use historical sources for temporal validation",
      "Understand threat-intelligence correlation",
      "Design a ForenX multi-tool investigation workflow"
    ],
    content: `
      <h2>1. Why Cross-Tool Correlation Matters</h2>
      <p>No single OSINT tool provides a complete representation of an investigation target. Each tool specializes in a different information layer. Censys provides valuable technical infrastructure observations, but those observations become much more useful when compared with domain registration information, DNS records, certificate transparency, historical archives, and other sources.</p>

      <p>The objective is not to collect as many tools as possible. The objective is to use the right tool to answer the right question.</p>

      <h2>2. Censys and WHOIS</h2>
      <p>WHOIS information can provide registration-related information about a domain where available. Censys can provide technical infrastructure observations associated with public hosts and services.</p>

      <pre><code>WHOIS
  ↓
Domain context
  ↓
Censys
  ↓
Technical infrastructure
</code></pre>

      <p>If both sources support a relationship, confidence may increase. However, privacy protection, registrar information, and changing ownership can limit what WHOIS proves.</p>

      <h2>3. Censys and DNS Lookup</h2>
      <p>DNS is one of the most important validation layers for infrastructure investigation. A domain can resolve to one or more addresses, while Censys can provide observations associated with those addresses.</p>

      <pre><code>Domain
 ↓
DNS records
 ↓
IP
 ↓
Censys host
 ↓
Services</code></pre>

      <p>The investigator should record timestamps because DNS mappings can change.</p>

      <h2>4. Censys and dig</h2>
      <p>The <code>dig</code> command can provide detailed DNS information. It can be useful when the investigator needs to inspect A, AAAA, MX, NS, CNAME, or other DNS records.</p>

      <p>Censys can then be used as a separate technical observation source. This creates a useful distinction between DNS configuration and observed services.</p>

      <h2>5. Censys and crt.sh</h2>
      <p>Certificate transparency information can reveal certificate names associated with a domain. Those names can become Censys search pivots.</p>

      <pre><code>Domain
 ↓
crt.sh
 ↓
Certificate
 ↓
SAN hostname
 ↓
Censys
 ↓
Host/service observation</code></pre>

      <p>This is particularly useful for identifying historical or additional hostnames that may not be obvious from the main website.</p>

      <h2>6. Censys and SecurityTrails</h2>
      <p>SecurityTrails can provide DNS and historical infrastructure context. Censys and SecurityTrails answer related but different questions.</p>

      <ul>
        <li>SecurityTrails can help investigate DNS and historical relationships.</li>
        <li>Censys can help investigate publicly observable hosts and services.</li>
      </ul>

      <p>Combining them can help an investigator understand how infrastructure changed over time.</p>

      <h2>7. Censys and VirusTotal</h2>
      <p>VirusTotal can provide threat-intelligence context around domains, URLs, IP addresses, and other indicators. A Censys observation of a public host does not imply that the host is malicious. VirusTotal information should therefore be used as a separate intelligence layer.</p>

      <p>A useful correlation may look like:</p>

      <pre><code>Domain
 ↓
Censys infrastructure observation
 ↓
VirusTotal reputation/context
 ↓
Independent validation</code></pre>

      <p>The investigator must avoid interpreting a security vendor detection as automatic proof of malicious activity.</p>

      <h2>8. Censys and Wayback Machine</h2>
      <p>Historical archives can help explain changes in public infrastructure. If Censys contains a historical observation of a hostname or service, the investigator may compare that with archived web pages from the same period.</p>

      <p>This can help answer temporal questions such as whether a hostname was publicly referenced during a particular period.</p>

      <h2>9. Censys and Brave Search</h2>
      <p>Brave Search can discover public documents, web pages, technical references, and organization information. Censys can then provide technical infrastructure context.</p>

      <pre><code>Brave Search
 ↓
Domain discovery
 ↓
Censys
 ↓
Infrastructure discovery
 ↓
Certificate pivot
 ↓
Search discovered hostname</code></pre>

      <p>This is an example of bidirectional pivoting. Technical findings can return to the search engine as new public-search terms.</p>

      <h2>10. ForenX Correlation Engine</h2>
      <p>ForenX AI LearnOSINT can use a Correlation Engine to connect findings from multiple modules. The engine should not simply merge every matching string. It should evaluate relationships and provide an explanation for each correlation.</p>

      <p>For example:</p>

      <pre><code>Finding A:
Brave Search → api.atlas.example

Finding B:
DNS Lookup → api.atlas.example → IP

Finding C:
Censys → HTTPS service observed on IP

Finding D:
crt.sh → certificate contains api.atlas.example

Correlation:
Domain + DNS + Certificate + Censys
→ Strongly supported technical relationship</code></pre>

      <h2>11. Explainable Correlation</h2>
      <p>The system should show users why findings were correlated. This is particularly important for educational software. A student should be able to understand the evidence chain rather than receiving an unexplained "related" label.</p>

      <h2>12. Confidence Scoring</h2>
      <p>ForenX can classify findings as confirmed, strongly supported, probable, possible, or unverified. The exact scoring model can be implemented according to project requirements, but the principle should remain explainable.</p>

      <h2>13. Example Multi-Tool Workflow</h2>

      <ol>
        <li>Use Brave Search to discover a fictional domain.</li>
        <li>Use WHOIS to obtain registration context.</li>
        <li>Use DNS Lookup to identify addresses.</li>
        <li>Use crt.sh to discover certificate names.</li>
        <li>Use Censys to inspect public infrastructure observations.</li>
        <li>Use Wayback Machine for historical context.</li>
        <li>Store findings in the ForenX evidence notebook.</li>
        <li>Allow the Correlation Engine to show supported relationships.</li>
      </ol>

      <h2>14. Important Principle</h2>
      <p>Cross-tool correlation should increase understanding, not artificially increase certainty. Five tools repeating the same underlying source do not necessarily provide five independent confirmations. Investigators should evaluate the independence and reliability of each source.</p>
    `,
    keyPoints: [
      "Censys becomes more powerful when correlated with complementary tools",
      "DNS validates domain-to-IP relationships",
      "crt.sh provides certificate-based pivots",
      "Wayback Machine adds historical context",
      "VirusTotal provides separate threat-intelligence context",
      "ForenX should make correlations explainable",
      "Multiple tools do not automatically mean independent confirmation"
    ],
    example:
      "Brave Search → domain → DNS → IP → crt.sh certificate → Censys host → Wayback historical validation → ForenX correlation.",
    estimatedTime: 70,
    order: 6,
    difficulty: "Advanced",
    prerequisites: [
      "Host and Service Intelligence",
      "Certificate Intelligence with Censys"
    ]
  },

  {
    lessonNumber: 7,
    title: "Evidence Preservation and Censys Practical Lab",
    shortDescription:
      "Perform a controlled fictional Censys investigation while documenting infrastructure observations, certificates, pivots, timestamps, confidence, and evidence.",
    objectives: [
      "Conduct a structured passive infrastructure investigation",
      "Document Censys observations",
      "Record query and timestamp information",
      "Correlate hosts, services, and certificates",
      "Distinguish observations from conclusions",
      "Prepare an evidence package for reporting"
    ],
    content: `
      <h2>1. Purpose of the Practical Lab</h2>
      <p>This practical laboratory exercise teaches students how to incorporate Censys into a structured OSINT investigation. The scenario is fictional and should remain within the boundaries of passive research. The goal is to practice methodology, documentation, correlation, and evidence preservation.</p>

      <h2>2. Fictional Scenario</h2>
      <p>The fictional organization is <strong>Orion Digital Research</strong>. The fictional domain is <code>orion.example</code>. Assume that the investigator has been asked to understand the organization's publicly observable technical infrastructure.</p>

      <h2>3. Investigation Objective</h2>
      <p>The objective is to determine what publicly observable technical relationships can be established between the fictional organization, its domain, certificates, hostnames, and infrastructure observations.</p>

      <h2>4. Step One — Establish the Domain</h2>
      <p>Start with the fictional domain. Document where the domain came from and why it is considered relevant to the investigation.</p>

      <pre><code>Entity:
Orion Digital Research

Domain:
orion.example

Evidence:
Authorized fictional investigation input

Objective:
Map publicly observable infrastructure relationships</code></pre>

      <h2>5. Step Two — DNS Validation</h2>
      <p>Use a DNS tool in an appropriate environment to establish the relationship between the fictional domain and any associated addresses. Record the record type, returned value, and observation time.</p>

      <p>Do not assume that every returned address represents infrastructure directly operated by the organization. Cloud providers, CDNs, and hosting providers may be involved.</p>

      <h2>6. Step Three — Censys Host Observation</h2>
      <p>Use the discovered IP address as the starting point for a Censys observation. Record relevant services, protocols, certificate information, and observation dates available through the platform.</p>

      <p>Do not perform unauthorized interaction with the discovered service.</p>

      <h2>7. Step Four — Certificate Analysis</h2>
      <p>Identify any relevant certificate information. Record:</p>

      <ul>
        <li>Certificate identifier where available</li>
        <li>Subject</li>
        <li>Alternative names</li>
        <li>Issuer</li>
        <li>Validity period</li>
        <li>Associated host or service</li>
      </ul>

      <h2>8. Step Five — Hostname Pivots</h2>
      <p>Suppose a certificate reveals the fictional hostname <code>api.orion.example</code>. This becomes a new investigation entity.</p>

      <pre><code>orion.example
      ↓
Certificate
      ↓
api.orion.example
      ↓
DNS validation
      ↓
Censys observation</code></pre>

      <p>Each step should be recorded independently.</p>

      <h2>9. Evidence Record Template</h2>

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
            <td>CENSYS-E01</td>
          </tr>
          <tr>
            <td>Entity</td>
            <td>api.orion.example</td>
          </tr>
          <tr>
            <td>Source</td>
            <td>Censys</td>
          </tr>
          <tr>
            <td>Observation</td>
            <td>Public HTTPS service observed</td>
          </tr>
          <tr>
            <td>Timestamp</td>
            <td>Investigation timestamp</td>
          </tr>
          <tr>
            <td>Confidence</td>
            <td>Probable</td>
          </tr>
          <tr>
            <td>Next Pivot</td>
            <td>DNS validation</td>
          </tr>
        </tbody>
      </table>

      <h2>10. Evidence Integrity</h2>
      <p>Evidence preservation should maintain the connection between the finding and its original source. Record URLs or platform references where appropriate, timestamps, screenshots where permitted, query details, and relevant observations.</p>

      <p>If a legitimately acquired file is preserved, a cryptographic hash can be used to demonstrate whether the file changed after acquisition. Hashing does not prove that the information is truthful; it helps demonstrate artifact integrity.</p>

      <h2>11. Timeline</h2>
      <p>Construct a timeline separating source dates from investigator observation dates.</p>

      <pre><code>Certificate Issued
      ↓
Historical DNS Observation
      ↓
Censys Observation
      ↓
Investigator Discovery
      ↓
Independent Validation</code></pre>

      <p>This prevents historical information from being mistakenly represented as current.</p>

      <h2>12. Confidence Assessment</h2>
      <p>Use confidence categories:</p>

      <ul>
        <li><strong>Confirmed:</strong> Directly supported by strong evidence.</li>
        <li><strong>Strongly supported:</strong> Multiple independent sources agree.</li>
        <li><strong>Probable:</strong> Evidence supports the relationship but some uncertainty remains.</li>
        <li><strong>Possible:</strong> A reasonable hypothesis requiring validation.</li>
        <li><strong>Unverified:</strong> A lead without sufficient supporting evidence.</li>
      </ul>

      <h2>13. Lab Deliverables</h2>
      <p>The learner should produce:</p>

      <ol>
        <li>Investigation objective</li>
        <li>Known entities</li>
        <li>DNS findings</li>
        <li>Censys host observations</li>
        <li>Certificate observations</li>
        <li>At least two justified pivots</li>
        <li>Evidence table</li>
        <li>Timeline</li>
        <li>Confidence assessment</li>
        <li>Short conclusion</li>
      </ol>

      <h2>14. What the Lab Should Not Include</h2>
      <p>The exercise should not include exploitation, password attacks, unauthorized vulnerability testing, service disruption, credential collection, or attempts to bypass access controls. The purpose is passive intelligence analysis and evidence documentation.</p>

      <h2>15. Reflection Questions</h2>

      <ol>
        <li>Which Censys observation was most useful?</li>
        <li>Which finding required independent validation?</li>
        <li>Which hostname became the most valuable pivot?</li>
        <li>Could the same IP belong to another organization?</li>
        <li>Which observations were historical?</li>
        <li>How would another investigator reproduce your findings?</li>
      </ol>
    `,
    keyPoints: [
      "Practical Censys investigations should begin with a defined objective",
      "Record source and timestamp information",
      "Separate DNS relationships from Censys observations",
      "Certificate hostnames can become useful pivots",
      "Evidence should preserve provenance and context",
      "Historical observations should not automatically be presented as current",
      "Passive research does not require exploitation"
    ],
    example:
      "Fictional lab: Orion Digital Research → orion.example → DNS → IP → Censys → HTTPS observation → certificate → api.orion.example → validation.",
    estimatedTime: 75,
    order: 7,
    difficulty: "Advanced",
    prerequisites: [
      "Censys with Other OSINT Tools and ForenX Correlation",
      "Certificate Intelligence with Censys"
    ]
  },

  {
    lessonNumber: 8,
    title: "Complete Censys Investigation and Final Assessment",
    shortDescription:
      "Apply the complete Censys workflow from initial domain discovery through infrastructure analysis, certificate pivots, correlation, evidence preservation, and reporting.",
    objectives: [
      "Plan a complete Censys investigation",
      "Perform structured infrastructure discovery",
      "Analyze hosts, services, and certificates",
      "Correlate multiple OSINT sources",
      "Document uncertainty and limitations",
      "Produce a professional investigation report"
    ],
    content: `
      <h2>1. Complete Investigation Methodology</h2>
      <p>The final objective of this module is to transform individual Censys techniques into a complete investigation methodology. A professional investigator should be able to begin with a known identifier, formulate questions, search appropriate datasets, identify useful infrastructure relationships, validate findings, preserve evidence, and produce a report that another analyst can understand.</p>

      <p>Censys should therefore be considered one component of an investigation rather than a complete investigation platform by itself.</p>

      <h2>2. Phase One — Define Scope</h2>
      <p>Before collecting information, define the investigation scope. Specify the organization, domain, IP range, infrastructure identifier, or fictional scenario being investigated. Clearly document what is inside and outside the authorized scope.</p>

      <p>For an educational investigation, use fictional targets whenever possible. For real organizations, only investigate infrastructure where you have appropriate authorization and follow applicable policies and laws.</p>

      <h2>3. Phase Two — Establish Known Information</h2>
      <p>Record all initial information before searching. This creates a baseline.</p>

      <pre><code>Known Organization:
Atlas Digital Research

Known Domain:
atlas.example

Known Identifier:
Fictional domain

Investigation Goal:
Understand publicly observable infrastructure</code></pre>

      <h2>4. Phase Three — Domain and DNS Discovery</h2>
      <p>Start by validating the domain relationship through appropriate DNS information. Record A, AAAA, CNAME, MX, NS, and other relevant records where appropriate to the investigation objective.</p>

      <p>Do not assume every DNS record represents a directly operated server. Modern organizations often use third-party cloud providers and managed services.</p>

      <h2>5. Phase Four — Censys Host Investigation</h2>
      <p>Use relevant IP addresses as Censys pivots. Examine publicly observable services and technical metadata. Record observation dates and avoid presenting old observations as current.</p>

      <p>The key questions are:</p>

      <ul>
        <li>What host was observed?</li>
        <li>Which services were observed?</li>
        <li>Which protocols were identified?</li>
        <li>Which certificates were associated?</li>
        <li>When was the observation made?</li>
      </ul>

      <h2>6. Phase Five — Certificate Pivoting</h2>
      <p>Analyze certificate information associated with relevant services. Extract useful names from certificate fields, particularly SAN entries. Each new hostname should become a separate investigation entity rather than being automatically merged with the original host.</p>

      <pre><code>Host
 ↓
TLS
 ↓
Certificate
 ↓
SAN
 ↓
Hostname
 ↓
DNS
 ↓
Censys</code></pre>

      <h2>7. Phase Six — Infrastructure Correlation</h2>
      <p>Compare Censys observations with other OSINT sources. For example, a hostname discovered in a certificate may also appear in a public document. DNS may connect the hostname to an address. Censys may show that the address has an HTTPS service. A historical archive may show that the hostname was publicly referenced several months earlier.</p>

      <p>Each source contributes a different piece of the investigation.</p>

      <h2>8. Phase Seven — Attribution Analysis</h2>
      <p>Attribution is one of the most difficult parts of infrastructure OSINT. A shared IP, certificate, or hosting provider is not automatically sufficient to prove ownership.</p>

      <p>Use multiple attributes:</p>

      <ul>
        <li>Domain ownership context</li>
        <li>DNS relationships</li>
        <li>Certificate names</li>
        <li>Public organizational references</li>
        <li>Historical evidence</li>
        <li>Infrastructure consistency</li>
      </ul>

      <p>When evidence is incomplete, report the relationship as uncertain instead of forcing a definitive conclusion.</p>

      <h2>9. Phase Eight — Temporal Analysis</h2>
      <p>Infrastructure changes frequently. A host may move between providers. A certificate may expire. A DNS record may change. A service may disappear. Therefore, every major technical finding should be associated with time.</p>

      <p>For example:</p>

      <pre><code>January:
api.atlas.example → IP-A

March:
api.atlas.example → IP-B

May:
Certificate renewed

June:
Censys observes HTTPS on IP-B</code></pre>

      <p>This timeline provides a much more accurate representation than saying simply that the domain "belongs to IP-B."</p>

      <h2>10. Phase Nine — Evidence Preservation</h2>
      <p>Preserve important evidence with source context. Record query details, timestamps, identifiers, screenshots where permitted, relevant result fields, and investigator notes.</p>

      <p>The evidence notebook should distinguish:</p>

      <ul>
        <li>Raw observation</li>
        <li>Interpretation</li>
        <li>Correlation</li>
        <li>Hypothesis</li>
        <li>Conclusion</li>
      </ul>

      <p>This distinction is especially important when AI systems are involved. An AI-generated interpretation must not be silently transformed into an observed fact.</p>

      <h2>11. Phase Ten — ForenX AI Assistance</h2>
      <p>ForenX AI LearnOSINT can use Censys findings as part of its AI-assisted learning workflow. The AI Mentor can explain terms such as host, service, certificate, SAN, issuer, and observation date.</p>

      <p>The system can also suggest appropriate next tools. For example:</p>

      <pre><code>Finding: New hostname
      ↓
Suggested tools:
DNS Lookup
crt.sh
Wayback Machine
Brave Search
Censys
</code></pre>

      <p>These recommendations should be explanations rather than unexplained commands.</p>

      <h2>12. Correlation Engine Example</h2>

      <pre><code>Finding 1:
Brave Search → atlas.example

Finding 2:
DNS → atlas.example → 203.0.113.20

Finding 3:
Censys → HTTPS observed on 203.0.113.20

Finding 4:
Certificate → api.atlas.example

Finding 5:
crt.sh → api.atlas.example certificate record

Finding 6:
Wayback → historical public reference

Correlation:
Multiple independent sources support
a technical relationship between the
domain, hostname, certificate, and host.</code></pre>

      <p>The Correlation Engine should explain this chain rather than simply assigning a confidence score without justification.</p>

      <h2>13. Common Censys Mistakes</h2>

      <ul>
        <li>Assuming an IP permanently belongs to an organization</li>
        <li>Assuming a certificate proves server ownership</li>
        <li>Treating old observations as current</li>
        <li>Assuming a port identifies an application with certainty</li>
        <li>Ignoring CDN and reverse-proxy architecture</li>
        <li>Assuming shared hosting means shared ownership</li>
        <li>Using one source to support a strong attribution claim</li>
        <li>Failing to document query and observation time</li>
        <li>Confusing AI-generated interpretation with source evidence</li>
      </ul>

      <h2>14. Professional Investigation Report</h2>

      <p>A Censys-based investigation report can use the following structure:</p>

      <ol>
        <li><strong>Executive Summary</strong> — Short description of the investigation.</li>
        <li><strong>Scope</strong> — Systems, domains, and identifiers included.</li>
        <li><strong>Methodology</strong> — Passive OSINT and tools used.</li>
        <li><strong>Known Information</strong> — Initial identifiers.</li>
        <li><strong>DNS Findings</strong> — Relevant DNS relationships.</li>
        <li><strong>Censys Findings</strong> — Hosts and services observed.</li>
        <li><strong>Certificate Findings</strong> — Relevant certificate relationships.</li>
        <li><strong>Correlation</strong> — Relationships supported by multiple sources.</li>
        <li><strong>Timeline</strong> — Historical observations.</li>
        <li><strong>Confidence</strong> — Strength of each conclusion.</li>
        <li><strong>Limitations</strong> — Missing data and uncertainty.</li>
        <li><strong>Conclusion</strong> — What the evidence establishes.</li>
      </ol>

      <h2>15. Final Practical Assessment</h2>
      <p>Conduct a fictional investigation beginning with the domain <code>atlas.example</code>. Create an investigation notebook containing at least ten queries or investigation actions. Include DNS information, Censys host observations, certificate relationships, at least two pivots, a timeline, confidence levels, and a final conclusion.</p>

      <h3>Assessment Questions</h3>

      <ol>
        <li>What is the primary purpose of Censys?</li>
        <li>How does Censys differ from a conventional search engine?</li>
        <li>What is a host?</li>
        <li>What is a service?</li>
        <li>Why are certificates useful for OSINT?</li>
        <li>What is a SAN?</li>
        <li>Why can a shared IP create attribution problems?</li>
        <li>Why should observation dates be recorded?</li>
        <li>Why is a port number insufficient to identify an application with certainty?</li>
        <li>Why should Censys findings be correlated with other sources?</li>
        <li>What role can crt.sh play in a Censys investigation?</li>
        <li>How can the Wayback Machine add historical context?</li>
        <li>Why should AI-generated interpretations be separated from evidence?</li>
        <li>What is the difference between a technical observation and an attribution?</li>
        <li>Why is passive reconnaissance useful?</li>
      </ol>

      <h2>16. Professional Checklist</h2>

      <ul>
        <li>☐ Define investigation scope</li>
        <li>☐ Record known identifiers</li>
        <li>☐ Validate domain relationships</li>
        <li>☐ Record DNS observations</li>
        <li>☐ Investigate relevant hosts</li>
        <li>☐ Record observed services</li>
        <li>☐ Analyze relevant certificates</li>
        <li>☐ Extract useful hostname pivots</li>
        <li>☐ Validate pivots independently</li>
        <li>☐ Record observation dates</li>
        <li>☐ Preserve evidence context</li>
        <li>☐ Assign confidence levels</li>
        <li>☐ Document contradictions</li>
        <li>☐ Record limitations</li>
        <li>☐ Produce a reproducible report</li>
      </ul>

      <h2>17. Final Takeaway</h2>
      <p>Censys provides a powerful way to study publicly observable Internet infrastructure. Its value in OSINT comes from connecting technical observations with domains, certificates, services, and other infrastructure identifiers. However, technical data must always be interpreted carefully.</p>

      <p>A professional investigator does not conclude that an organization owns an IP merely because a domain once resolved to that address. The investigator does not conclude that every hostname in a certificate is currently active. The investigator does not treat a port number as definitive software identification. Instead, each observation becomes one piece of a larger evidence chain.</p>

      <p>Within ForenX AI LearnOSINT, this methodology can be transformed into a guided learning experience. The Tool Explorer can teach Censys concepts, the AI Mentor can explain findings, the Tool Recommendation system can suggest appropriate pivots, the Correlation Engine can connect evidence from different modules, and the Reporting module can turn validated findings into a structured investigation report.</p>

      <p>The ultimate skill is therefore not simply knowing how to search Censys. It is knowing how to reason about infrastructure evidence, understand uncertainty, validate relationships, preserve provenance, and communicate conclusions responsibly.</p>

      <h2>18. Final Principle</h2>
      <p><strong>Observe → Validate → Correlate → Preserve → Explain.</strong></p>

      <p>This five-stage approach should guide every Censys investigation performed within an ethical OSINT environment.</p>
    `,
    keyPoints: [
      "A complete Censys investigation requires planning and scope definition",
      "DNS, Censys, certificates, archives, and search engines provide complementary evidence",
      "Infrastructure attribution requires multiple supporting attributes",
      "Technical observations must be associated with time",
      "Evidence and AI-generated interpretation must remain separate",
      "ForenX can use Censys as part of an explainable multi-tool investigation workflow",
      "Professional OSINT emphasizes validation, preservation, and uncertainty"
    ],
    example:
      "Complete workflow: Domain → DNS → IP → Censys host → services → certificate → SAN hostname → independent validation → correlation → evidence notebook → final report.",
    estimatedTime: 80,
    order: 8,
    difficulty: "Advanced",
    prerequisites: [
      "Censys Fundamentals for OSINT",
      "Censys Platform and Basic Searching",
      "Censys Search and Query Techniques",
      "Certificate Intelligence with Censys",
      "Host and Service Intelligence",
      "Censys with Other OSINT Tools and ForenX Correlation",
      "Evidence Preservation and Censys Practical Lab"
    ]
  }
];

module.exports = toolLessons;