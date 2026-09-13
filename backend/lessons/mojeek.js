const toolLessons = [
  {
    lessonNumber: 1,
    title: "Mojeek Fundamentals for OSINT",
    shortDescription:
      "Understand Mojeek as an independent web search engine and learn how it can contribute to search-based OSINT investigations.",
    objectives: [
      "Understand the role of Mojeek in OSINT",
      "Understand independent search indexes",
      "Learn basic query construction",
      "Understand search results and snippets",
      "Learn progressive search refinement",
      "Recognize search-engine limitations"
    ],
    content: `
      <h2>1. Introduction to Mojeek</h2>

      <p>Mojeek is an independent web search engine that can be used to discover publicly accessible information on the Internet. In an OSINT environment, independent search engines are useful because investigators should not depend entirely on a single search index. Different search systems can discover, rank, and present pages differently.</p>

      <p>Mojeek can therefore be treated as an additional discovery layer within an OSINT workflow. It can help investigators locate websites, articles, public documents, technical references, organizations, projects, and other publicly indexed information.</p>

      <p>The objective is not to assume that Mojeek contains every page on the web. Instead, the investigator uses its results as potential leads and then validates important information using the original source and additional evidence where appropriate.</p>

      <h2>2. Why Multiple Search Engines Matter</h2>

      <p>Search engines maintain different indexes and ranking systems. As a result, an investigator who uses only one search engine may miss useful information that appears elsewhere.</p>

      <pre><code>Investigation Question
        ↓
Search Engine A
        ↓
Search Engine B
        ↓
Mojeek
        ↓
Compare Results
        ↓
Validate Sources</code></pre>

      <p>The purpose of using multiple search engines is not to collect duplicate results. It is to improve discovery coverage and identify sources that may not have appeared in the first search.</p>

      <h2>3. Search Engine Versus Evidence Database</h2>

      <p>A search engine is a discovery system. It helps users locate pages that may contain relevant information. It should not be treated as a definitive evidence database.</p>

      <p>For example, if a result states that a fictional organization operates a particular project, the investigator should inspect the underlying page and determine whether the source actually supports that claim.</p>

      <h2>4. Basic Searching</h2>

      <p>Begin with the known identifier.</p>

      <pre><code>Northstar Cyber Research</code></pre>

      <p>Then use an exact phrase:</p>

      <pre><code>"Northstar Cyber Research"</code></pre>

      <p>Additional context can be introduced:</p>

      <pre><code>"Northstar Cyber Research" security
"Northstar Cyber Research" research
"Northstar Cyber Research" report</code></pre>

      <h2>5. Exact Phrase Searching</h2>

      <p>Quotation marks are useful when searching for a specific multi-word phrase. They can help with organization names, project names, document titles, technical terminology, and distinctive sentences.</p>

      <pre><code>"Project Aurora"
"Northstar Cyber Research"
"annual security report"</code></pre>

      <p>Exact phrases can also be used to investigate whether a distinctive piece of text appears across multiple public sources.</p>

      <h2>6. Progressive Refinement</h2>

      <p>Do not attempt to create the perfect query immediately. Begin broadly and add context as useful terminology is discovered.</p>

      <pre><code>Northstar Cyber Research

"Northstar Cyber Research"

"Northstar Cyber Research" cybersecurity

"Northstar Cyber Research" report

"Northstar Cyber Research" public research</code></pre>

      <p>This approach helps the investigator understand the search landscape before narrowing the investigation.</p>

      <h2>7. Search Result Evaluation</h2>

      <p>A result normally provides a title, URL, and descriptive information. These elements help determine whether the page should be investigated further.</p>

      <p>However, the search result itself should not automatically become an evidence record. Open the underlying source and examine its complete context.</p>

      <h2>8. Source Credibility</h2>

      <p>Ask several questions when evaluating a source:</p>

      <ul>
        <li>Who created the page?</li>
        <li>Is the source primary or secondary?</li>
        <li>When was the information published?</li>
        <li>Does the page directly support the claim?</li>
        <li>Is the information current?</li>
        <li>Can the finding be independently confirmed?</li>
      </ul>

      <h2>9. Mojeek as a Pivot Generator</h2>

      <p>The strongest discovery may be a new identifier rather than an answer. A search result might reveal a project, domain, username, document title, or technical term.</p>

      <pre><code>Organization
    ↓
Mojeek Search
    ↓
Public Document
    ↓
Project Name
    ↓
New Search
    ↓
Additional Source</code></pre>

      <h2>10. Search Diversity</h2>

      <p>Mojeek can be compared with Google, Bing, DuckDuckGo, and Brave Search. If several engines return the same original source, that does not automatically make the information independently verified. The investigator must identify the actual source behind the repeated results.</p>

      <h2>11. Limitations</h2>

      <ul>
        <li>Search indexes are incomplete.</li>
        <li>Results change over time.</li>
        <li>Some websites prevent or limit indexing.</li>
        <li>Search ranking does not equal credibility.</li>
        <li>Old information may remain discoverable.</li>
        <li>Duplicate content can appear across many pages.</li>
      </ul>

      <h2>12. Beginner Exercise</h2>

      <p>Create a fictional organization called <strong>Orion Digital Research</strong>. Search for the organization using Mojeek. Perform at least eight queries, beginning with broad searches and gradually adding contextual terms.</p>

      <p>Record every new identifier you discover and use at least two identifiers as new pivots.</p>

      <h2>13. Core Principle</h2>

      <p>Mojeek should be viewed as one component of a broader OSINT methodology. Search results provide leads. Investigation begins when those leads are examined, validated, correlated, and documented.</p>
    `,
    keyPoints: [
      "Mojeek provides an additional web discovery layer",
      "Independent search engines can improve discovery diversity",
      "Exact phrase searches are useful for unique identifiers",
      "Progressive refinement is more effective than random searching",
      "Search results are leads rather than automatic evidence",
      "Important findings should be validated using underlying sources"
    ],
    example:
      "\"Orion Digital Research\" cybersecurity research",
    estimatedTime: 45,
    order: 1,
    difficulty: "Beginner",
    prerequisites: []
  },

  {
    lessonNumber: 2,
    title: "Mojeek Search and Query Construction",
    shortDescription:
      "Learn practical Mojeek search techniques for organizations, domains, projects, documents, technical information, and public references.",
    objectives: [
      "Construct effective Mojeek queries",
      "Use exact phrases",
      "Search organizations and domains",
      "Search for public documents",
      "Use contextual keywords",
      "Reduce irrelevant results"
    ],
    content: `
      <h2>1. Query Construction</h2>

      <p>Effective OSINT searching begins with converting an investigation question into a search query. A query should represent what the investigator wants to discover rather than simply containing every known piece of information.</p>

      <p>Consider the fictional organization <strong>Atlas Security Research</strong>.</p>

      <pre><code>"Atlas Security Research"</code></pre>

      <p>This is the starting point. Additional queries can investigate different information categories.</p>

      <h2>2. Organization Queries</h2>

      <pre><code>"Atlas Security Research" cybersecurity
"Atlas Security Research" research
"Atlas Security Research" conference
"Atlas Security Research" report
"Atlas Security Research" technology</code></pre>

      <p>Each query asks a slightly different question and may reveal different sources.</p>

      <h2>3. Domain Queries</h2>

      <p>If a domain becomes known, search the domain directly.</p>

      <pre><code>"atlas.example"
"www.atlas.example"
"api.atlas.example"</code></pre>

      <p>Domain searches can reveal third-party references, public documentation, discussions, and technical material.</p>

      <h2>4. Contextual Searching</h2>

      <p>Context words can help distinguish an investigation target from unrelated entities with similar names.</p>

      <pre><code>"Atlas Security Research" university
"Atlas Security Research" software
"Atlas Security Research" laboratory
"Atlas Security Research" conference</code></pre>

      <p>Context should be introduced gradually.</p>

      <h2>5. Document Discovery</h2>

      <p>Public documents can provide valuable investigative context.</p>

      <pre><code>"Atlas Security Research" PDF
"Atlas Security Research" report
"Atlas Security Research" presentation</code></pre>

      <p>Depending on the search interface and current capabilities, document-oriented searches may produce PDFs, presentations, reports, or pages containing links to those resources.</p>

      <h2>6. Distinctive Text Searching</h2>

      <p>If an investigator discovers an unusual sentence or phrase, search the phrase exactly.</p>

      <pre><code>"advanced telemetry correlation framework"
"distributed evidence preservation architecture"</code></pre>

      <p>This can reveal duplicate publications, citations, mirrored documents, or references to the same material.</p>

      <h2>7. Username Discovery</h2>

      <p>A username discovered in a legitimate public source can be searched as an exact phrase.</p>

      <pre><code>"atlas_research"
"atlas_research" cybersecurity
"atlas_research" developer
"atlas_research" research</code></pre>

      <p>Search-engine results should not be treated as proof that accounts belong to one individual.</p>

      <h2>8. Project Searching</h2>

      <p>Project names can be strong investigation pivots.</p>

      <pre><code>"Project Aurora"
"Project Aurora" Atlas
"Project Aurora" security
"Project Aurora" research</code></pre>

      <p>Compare dates and source context to determine whether multiple references concern the same project.</p>

      <h2>9. Search Variations</h2>

      <p>Organizations may appear under abbreviations, shortened names, former names, or alternative spellings.</p>

      <pre><code>"Atlas Security Research"
"Atlas Security"
"ASR research"
"Atlas Research Laboratory"</code></pre>

      <p>Every alternate name should be recorded with the source that introduced it.</p>

      <h2>10. Query Matrix</h2>

      <table>
        <thead>
          <tr>
            <th>Identifier</th>
            <th>Context</th>
            <th>Purpose</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Organization</td>
            <td>security</td>
            <td>General discovery</td>
          </tr>
          <tr>
            <td>Organization</td>
            <td>report</td>
            <td>Publication discovery</td>
          </tr>
          <tr>
            <td>Domain</td>
            <td>documentation</td>
            <td>Technical discovery</td>
          </tr>
          <tr>
            <td>Project</td>
            <td>research</td>
            <td>Project references</td>
          </tr>
        </tbody>
      </table>

      <h2>11. Avoiding Over-Searching</h2>

      <p>Searching thousands of irrelevant pages does not automatically improve an investigation. Establish stopping conditions. If several query variations consistently produce the same set of sources, move to a different pivot rather than repeating nearly identical searches.</p>

      <h2>12. Search Notes</h2>

      <pre><code>Query:
"Atlas Security Research" report

Purpose:
Find public reports

Useful Result:
Research publication

New Identifier:
Project Aurora

Next Pivot:
"Project Aurora"</code></pre>

      <p>This structure makes the investigation reproducible.</p>

      <h2>13. Practical Exercise</h2>

      <p>Build a search matrix containing at least fifteen queries for a fictional organization. Include organization, domain, project, document, technical, and username-oriented searches.</p>

      <h2>14. Core Principle</h2>

      <p>A strong query is one that has a clear investigative purpose. Do not measure search quality by the number of operators or the complexity of the syntax.</p>
    `,
    keyPoints: [
      "Queries should represent specific investigation questions",
      "Context keywords can reduce irrelevant results",
      "Domain and project names make useful pivots",
      "Distinctive phrases can locate related public sources",
      "Username matches require validation",
      "Search notes improve reproducibility"
    ],
    example:
      "\"Atlas Security Research\" report cybersecurity",
    estimatedTime: 50,
    order: 2,
    difficulty: "Beginner",
    prerequisites: [
      "Mojeek Fundamentals for OSINT"
    ]
  },

  {
    lessonNumber: 3,
    title: "Advanced Mojeek Search Strategy",
    shortDescription:
      "Develop advanced search strategies using query refinement, source comparison, terminology expansion, exclusions, and structured search matrices.",
    objectives: [
      "Build advanced search strategies",
      "Expand terminology systematically",
      "Reduce search noise",
      "Compare search-engine results",
      "Use source-oriented queries",
      "Develop repeatable investigation searches"
    ],
    content: `
      <h2>1. Advanced Search Is Strategy</h2>

      <p>Advanced OSINT searching is not simply about memorizing operators. It is about understanding what information is missing and designing searches that can reveal that information.</p>

      <p>Suppose the investigator knows only a company name. The investigation can be divided into categories:</p>

      <pre><code>Organization
Domain
People
Projects
Documents
Technology
Historical References
Security Information</code></pre>

      <p>Each category can receive its own query strategy.</p>

      <h2>2. Search Expansion</h2>

      <p>Search expansion means creating multiple variations of an identifier.</p>

      <pre><code>"Orion Cyber Labs"
"Orion Cyber Laboratory"
"Orion Security Labs"
"Orion Cyber Research"</code></pre>

      <p>When an alternative name is discovered in a reliable source, incorporate it into later searches.</p>

      <h2>3. Context Expansion</h2>

      <pre><code>"Orion Cyber Labs" research
"Orion Cyber Labs" software
"Orion Cyber Labs" cybersecurity
"Orion Cyber Labs" conference
"Orion Cyber Labs" report</code></pre>

      <p>This creates multiple perspectives on the same target.</p>

      <h2>4. Search Reduction</h2>

      <p>If the results are too broad, introduce a restriction or more specific phrase. If results become too narrow, remove one restriction.</p>

      <pre><code>Broad:
Orion research

Refined:
"Orion Cyber Labs" research

More refined:
"Orion Cyber Labs" research report</code></pre>

      <h2>5. Excluding Noise</h2>

      <p>Exclusion concepts can sometimes remove unrelated meanings from a query.</p>

      <pre><code>Orion security -football
Orion research -astronomy</code></pre>

      <p>Use exclusions carefully. A useful result may contain a term that the investigator initially considered irrelevant.</p>

      <h2>6. Source-Oriented Searching</h2>

      <p>Search for known source types such as academic publications, conferences, government references, technical documentation, or public reports.</p>

      <pre><code>"Orion Cyber Labs" research paper
"Orion Cyber Labs" conference
"Orion Cyber Labs" technical report
"Orion Cyber Labs" security advisory</code></pre>

      <h2>7. Domain-Focused Investigation</h2>

      <p>Once the investigator knows a domain, search for references to that domain.</p>

      <pre><code>"orion.example"
"orion.example" API
"orion.example" documentation
"orion.example" security
"orion.example" research</code></pre>

      <p>These searches can reveal third-party references as well as official material.</p>

      <h2>8. Cross-Search Comparison</h2>

      <p>Run the same query across multiple search engines and compare the results.</p>

      <pre><code>Query:
"Orion Cyber Labs" research

Mojeek:
Result Set A

Google:
Result Set B

Bing:
Result Set C

Brave:
Result Set D</code></pre>

      <p>Identify sources that appear in only one result set. These can become additional leads.</p>

      <h2>9. Result Classification</h2>

      <p>Classify results before investigating them deeply.</p>

      <ul>
        <li>Official source</li>
        <li>Independent publication</li>
        <li>Academic source</li>
        <li>News source</li>
        <li>Technical documentation</li>
        <li>Community discussion</li>
        <li>Duplicate or syndicated content</li>
        <li>Irrelevant result</li>
      </ul>

      <h2>10. Temporal Searching</h2>

      <p>Search results may represent different periods.</p>

      <pre><code>"Orion Cyber Labs" 2020
"Orion Cyber Labs" 2022
"Orion Cyber Labs" 2024</code></pre>

      <p>The exact query behavior may vary, but the methodological principle is to search for dated references and compare them chronologically.</p>

      <h2>11. Search Stopping Conditions</h2>

      <p>OSINT investigations can become inefficient if investigators repeatedly search the same information. Define stopping conditions such as:</p>

      <ul>
        <li>Three or more independent query variations produce no new information.</li>
        <li>All identified pivots have already been investigated.</li>
        <li>New results are duplicates of existing sources.</li>
        <li>The investigation objective has been sufficiently answered.</li>
      </ul>

      <h2>12. Query Documentation</h2>

      <p>Record the reason behind important searches.</p>

      <pre><code>Query:
"Orion Cyber Labs" "Project Aurora"

Purpose:
Determine whether project is publicly associated
with the organization.

Result:
Public research publication.

Assessment:
Strong supporting evidence.</code></pre>

      <h2>13. Practical Exercise</h2>

      <p>Construct a twenty-query search strategy for a fictional organization. Divide the queries into discovery, document, technical, project, historical, and validation categories.</p>

      <h2>14. Core Principle</h2>

      <p>Advanced search is successful when it produces new, relevant, and verifiable information without unnecessary duplication.</p>
    `,
    keyPoints: [
      "Advanced search is primarily an investigative strategy",
      "Expand organization names and terminology",
      "Use contextual terms to target information categories",
      "Compare search engines for discovery diversity",
      "Classify sources before using them as evidence",
      "Use stopping conditions to avoid repetitive searching"
    ],
    example:
      "\"Orion Cyber Labs\" \"Project Aurora\" research report",
    estimatedTime: 60,
    order: 3,
    difficulty: "Intermediate",
    prerequisites: [
      "Mojeek Search and Query Construction"
    ]
  },

  {
    lessonNumber: 4,
    title: "Mojeek for Organizations, Documents, and Digital Footprints",
    shortDescription:
      "Use Mojeek to investigate organizations, public documents, projects, domains, professional identities, and digital-footprint relationships.",
    objectives: [
      "Investigate organizations systematically",
      "Discover public documents",
      "Search project names",
      "Investigate public professional identities",
      "Map digital-footprint relationships",
      "Avoid false correlations"
    ],
    content: `
      <h2>1. Organization Investigation</h2>

      <p>Organization investigations can begin with a company, research group, university, nonprofit, project, or other entity name. The investigator should search the exact name and then explore alternate terminology.</p>

      <pre><code>"Northstar Intelligence Labs"
"Northstar Intelligence Labs" research
"Northstar Intelligence Labs" report
"Northstar Intelligence Labs" conference</code></pre>

      <h2>2. Discovering Organizational Terminology</h2>

      <p>Public sources often contain abbreviations or alternate names. These should be recorded because later searches may produce substantially different results.</p>

      <pre><code>"Northstar Intelligence Labs"
"Northstar Intelligence"
"NIL research"</code></pre>

      <p>Do not assume that an abbreviation refers to the target until supporting evidence exists.</p>

      <h2>3. Document Investigation</h2>

      <p>Documents can reveal organizational history, project names, authors, technical terms, and dates.</p>

      <pre><code>"Northstar Intelligence Labs" report
"Northstar Intelligence Labs" PDF
"Northstar Intelligence Labs" presentation
"Northstar Intelligence Labs" whitepaper</code></pre>

      <p>When a useful document is found, inspect it for additional identifiers.</p>

      <h2>4. Project Pivots</h2>

      <p>Suppose a document mentions <strong>Project Aurora</strong>.</p>

      <pre><code>"Project Aurora"
"Project Aurora" Northstar
"Project Aurora" cybersecurity
"Project Aurora" research</code></pre>

      <p>This can determine whether the project appears independently in other public sources.</p>

      <h2>5. Domain Investigation</h2>

      <pre><code>"northstar.example"
"northstar.example" documentation
"northstar.example" research
"northstar.example" security</code></pre>

      <p>Third-party references can be especially useful because they may provide independent context.</p>

      <h2>6. Public Professional Identity Research</h2>

      <p>Mojeek can be used to discover public professional references to researchers, developers, authors, and speakers.</p>

      <pre><code>"Jordan Reed" cybersecurity
"Jordan Reed" researcher
"Jordan Reed" Northstar
"Jordan Reed" conference</code></pre>

      <p>Common names create significant false-positive risk.</p>

      <h2>7. Username Research</h2>

      <pre><code>"northstar_researcher"
"northstar_researcher" security
"northstar_researcher" developer</code></pre>

      <p>A username match should be considered a lead. Additional attributes are required before connecting accounts.</p>

      <h2>8. Digital-Footprint Graph</h2>

      <pre><code>Person
 |
 +---- Organization
 |
 +---- Publication
 |
 +---- Project
 |
 +---- Username
 |
 +---- Domain</code></pre>

      <p>Every relationship in the graph should have a source.</p>

      <h2>9. False Correlation</h2>

      <p>Several signals can look convincing while still being unrelated. Two people may have identical names. Two organizations may share a project name. Multiple websites may copy the same article.</p>

      <p>Use multiple attributes before concluding that two entities are related.</p>

      <h2>10. Confidence Model</h2>

      <ul>
        <li><strong>Confirmed:</strong> Direct reliable evidence.</li>
        <li><strong>Strongly supported:</strong> Multiple independent attributes.</li>
        <li><strong>Probable:</strong> Evidence strongly suggests a relationship.</li>
        <li><strong>Possible:</strong> Plausible lead requiring more research.</li>
        <li><strong>Unverified:</strong> Insufficient evidence.</li>
      </ul>

      <h2>11. Source Independence</h2>

      <p>If ten websites reproduce the same press release, they are not necessarily ten independent sources. Identify the original publication whenever possible.</p>

      <h2>12. Practical Investigation</h2>

      <p>Use a fictional organization named <strong>Atlas Digital Intelligence</strong>. Search for public reports, projects, researchers, and domains. Construct an evidence graph containing at least six nodes and document the source supporting each relationship.</p>

      <h2>13. Core Principle</h2>

      <p>Digital-footprint investigation requires disciplined correlation. Search engines can discover relationships, but the investigator must determine whether those relationships are actually supported by evidence.</p>
    `,
    keyPoints: [
      "Organizations should be searched using multiple terminology variations",
      "Documents often provide valuable pivots",
      "Projects and domains can expand an investigation",
      "Professional identity searches require context",
      "Username matches are leads rather than proof",
      "Evidence graphs should document the source for every relationship"
    ],
    example:
      "\"Atlas Digital Intelligence\" research → public report → Project Aurora → independent project search → validate organization relationship.",
    estimatedTime: 65,
    order: 4,
    difficulty: "Intermediate",
    prerequisites: [
      "Advanced Mojeek Search Strategy"
    ]
  },

  {
    lessonNumber: 5,
    title: "Mojeek OSINT Pivoting and Cross-Tool Correlation",
    shortDescription:
      "Combine Mojeek discoveries with WHOIS, DNS, certificate transparency, Censys, Wayback Machine, VirusTotal, and other OSINT tools.",
    objectives: [
      "Understand multi-stage OSINT pivoting",
      "Use Mojeek discoveries as technical pivots",
      "Correlate domain and DNS information",
      "Use certificate intelligence as a pivot",
      "Understand historical validation",
      "Evaluate cross-source confidence"
    ],
    content: `
      <h2>1. OSINT Pivoting</h2>

      <p>A pivot occurs when one finding becomes the starting point for another investigation step. Search engines are particularly useful pivot generators because public pages frequently contain new identifiers.</p>

      <pre><code>Mojeek
  ↓
Public Document
  ↓
Domain
  ↓
DNS
  ↓
Certificate
  ↓
Hostname
  ↓
Mojeek Search Again</code></pre>

      <h2>2. Mojeek → Domain</h2>

      <p>Suppose a public article references <code>atlas.example</code>.</p>

      <pre><code>"atlas.example"
"atlas.example" research
"atlas.example" documentation
"atlas.example" security</code></pre>

      <p>This can identify additional public references.</p>

      <h2>3. Domain → WHOIS</h2>

      <p>WHOIS can provide domain-registration context where information is publicly available. This information should be interpreted carefully because registration records may use privacy services or intermediaries.</p>

      <pre><code>Mojeek
 ↓
atlas.example
 ↓
WHOIS
 ↓
Registration Context</code></pre>

      <h2>4. Domain → DNS</h2>

      <pre><code>atlas.example
 ↓
DNS Lookup
 ↓
A / AAAA / CNAME / MX
 ↓
Additional Technical Information</code></pre>

      <p>DNS information can reveal relationships that are not visible in ordinary search results.</p>

      <h2>5. Domain → Certificate Transparency</h2>

      <p>Certificate-transparency services can provide certificate-related hostname information.</p>

      <pre><code>atlas.example
    ↓
Certificate Search
    ↓
api.atlas.example
portal.atlas.example
dev.atlas.example</code></pre>

      <p>Each hostname can become a new passive search pivot.</p>

      <h2>6. Hostname → Mojeek</h2>

      <pre><code>"api.atlas.example"
"portal.atlas.example"
"dev.atlas.example"</code></pre>

      <p>This may reveal public documentation or historical references.</p>

      <h2>7. Mojeek → Censys</h2>

      <p>If a public hostname or domain becomes relevant to infrastructure research, Censys can provide additional passive observations about publicly observable hosts and services.</p>

      <pre><code>Mojeek
 ↓
Hostname
 ↓
DNS
 ↓
IP
 ↓
Censys
 ↓
Infrastructure Observation</code></pre>

      <p>These observations should be timestamped and interpreted according to the relevant source context.</p>

      <h2>8. Mojeek → Wayback Machine</h2>

      <p>If a search reveals an old hostname or public page, historical archives can help determine whether that information belonged to an earlier period.</p>

      <pre><code>Mojeek
 ↓
Old URL
 ↓
Wayback Machine
 ↓
Historical Snapshot
 ↓
Timeline</code></pre>

      <h2>9. Mojeek → VirusTotal</h2>

      <p>If an investigation identifies a domain, URL, or other indicator, VirusTotal may provide additional threat-intelligence context. A detection does not automatically prove that an indicator is malicious.</p>

      <p>Investigators should consider detection context, dates, relationships, and independent evidence.</p>

      <h2>10. Cross-Source Correlation</h2>

      <pre><code>Mojeek:
Public domain reference

WHOIS:
Registration context

DNS:
Domain relationship

Certificate:
Hostname relationship

Censys:
Infrastructure observation

Wayback:
Historical context</code></pre>

      <p>Each source answers a different question.</p>

      <h2>11. Evidence Independence</h2>

      <p>Search results that copy the same source should not be treated as independent confirmation. Stronger confidence comes from genuinely different evidence sources.</p>

      <h2>12. Correlation Example</h2>

      <pre><code>Organization
    ↓
Mojeek article
    ↓
Domain
    ↓
DNS
    ↓
Certificate hostname
    ↓
Censys observation
    ↓
Historical archive
    ↓
Final assessment</code></pre>

      <h2>13. Confidence</h2>

      <p>Confidence should increase only when additional evidence genuinely supports the same relationship.</p>

      <ul>
        <li>Confirmed</li>
        <li>Strongly supported</li>
        <li>Probable</li>
        <li>Possible</li>
        <li>Unverified</li>
      </ul>

      <h2>14. Practical Exercise</h2>

      <p>Create a fictional domain and build a six-stage pivot chain beginning with Mojeek. Explain what each tool contributes and what it cannot prove.</p>

      <h2>15. Professional Principle</h2>

      <p>Cross-tool correlation should make an investigation more precise, not more speculative. Every relationship should remain tied to observable evidence.</p>
    `,
    keyPoints: [
      "Mojeek can generate domain, project, and hostname pivots",
      "WHOIS adds registration context",
      "DNS adds domain-resolution information",
      "Certificate sources can reveal related hostnames",
      "Censys provides passive infrastructure observations",
      "Wayback Machine adds historical context",
      "Cross-source agreement should not be confused with automatic proof"
    ],
    example:
      "Mojeek → public domain reference → DNS → certificate hostname → Censys → Wayback Machine → documented correlation.",
    estimatedTime: 70,
    order: 5,
    difficulty: "Advanced",
    prerequisites: [
      "Mojeek for Organizations, Documents, and Digital Footprints",
      "Advanced Mojeek Search Strategy"
    ]
  },

  {
    lessonNumber: 6,
    title: "Mojeek in ForenX AI LearnOSINT",
    shortDescription:
      "Learn how Mojeek can be integrated into ForenX through AI-assisted query generation, tool recommendations, evidence notebooks, correlation, simulation, and reporting.",
    objectives: [
      "Understand Mojeek's role in ForenX",
      "Use AI-assisted query construction",
      "Record search evidence",
      "Use tool recommendations",
      "Understand AI limitations",
      "Connect search findings with the Correlation Engine"
    ],
    content: `
      <h2>1. Mojeek as a ForenX Learning Module</h2>

      <p>ForenX AI LearnOSINT is designed to teach beginners how to perform structured OSINT investigations. Mojeek can be included as an independent search-engine module that teaches search diversity, query construction, source validation, and investigation pivoting.</p>

      <h2>2. AI Mentor</h2>

      <p>The AI Mentor can help students convert investigation objectives into search strategies.</p>

      <p>For example, if the learner asks:</p>

      <blockquote>
        How can I find public research documents associated with a fictional organization?
      </blockquote>

      <p>The AI can explain the reasoning behind a query such as:</p>

      <pre><code>"Example Organization" research report</code></pre>

      <p>The student learns why contextual keywords are useful rather than simply receiving an unexplained search string.</p>

      <h2>3. AI Suggestions Versus Evidence</h2>

      <p>ForenX should clearly distinguish between AI-generated recommendations and actual evidence.</p>

      <pre><code>AI Suggestion
      ↓
User Search
      ↓
Observed Source
      ↓
Validated Finding
      ↓
Investigator Conclusion</code></pre>

      <p>An AI-generated claim should never automatically become a confirmed finding.</p>

      <h2>4. Tool Recommendations</h2>

      <p>ForenX can recommend another tool based on a finding.</p>

      <pre><code>Mojeek Finding:
Domain

Recommended:
WHOIS
DNS Lookup
crt.sh
Censys
Wayback Machine</code></pre>

      <p>If the finding is a username, the system can recommend username investigation tools. If the finding is a document, metadata analysis may be appropriate.</p>

      <h2>5. Evidence Notebook</h2>

      <p>Each important search finding can be stored using structured information.</p>

      <ul>
        <li>Evidence ID</li>
        <li>Exact query</li>
        <li>Source URL</li>
        <li>Source title</li>
        <li>Observation timestamp</li>
        <li>Finding</li>
        <li>Confidence</li>
        <li>Related entity</li>
        <li>Next pivot</li>
        <li>Investigator notes</li>
      </ul>

      <h2>6. Correlation Engine</h2>

      <p>The ForenX Correlation Engine can connect Mojeek findings with other intelligence modules.</p>

      <pre><code>Mojeek:
api.example.org

DNS:
api.example.org → IP

Certificate:
Hostname appears in certificate

Censys:
Public service observation

Correlation:
Web reference + DNS + certificate + infrastructure</code></pre>

      <p>The system should explain why the relationship was created.</p>

      <h2>7. Explainable AI</h2>

      <p>If AI identifies a potential relationship, the platform should show the supporting evidence and uncertainty.</p>

      <blockquote>
        The hostname appears in a public source and in certificate data, but current operational ownership has not been independently established.
      </blockquote>

      <p>This is more useful educationally than presenting an unexplained confidence score.</p>

      <h2>8. Simulation Mode</h2>

      <p>Students can practice using fictional organizations, projects, domains, usernames, and documents. Simulation Mode prevents beginners from needing to target real people or organizations during training.</p>

      <h2>9. Learning Recommendations</h2>

      <p>ForenX can analyze learning behavior and recommend lessons. For example, if a student performs many searches but does not record sources, the system can recommend evidence-preservation training.</p>

      <h2>10. Reporting</h2>

      <p>Validated search findings can be included in investigation reports.</p>

      <pre><code>Query
 ↓
Source
 ↓
Finding
 ↓
Evidence
 ↓
Confidence
 ↓
Related Entity
 ↓
Report</code></pre>

      <h2>11. Complete ForenX Workflow</h2>

      <pre><code>Investigation Objective
        ↓
AI Mentor
        ↓
Mojeek Query
        ↓
Search Result
        ↓
Evidence Notebook
        ↓
Tool Recommendation
        ↓
WHOIS / DNS / crt.sh / Censys
        ↓
Correlation Engine
        ↓
AI Explanation
        ↓
Investigation Report</code></pre>

      <h2>12. Beginner-Focused Learning</h2>

      <p>ForenX should teach the reasoning behind each step. A beginner should understand why a search was performed, why a result matters, why another tool is recommended, and why a conclusion has a particular confidence level.</p>

      <h2>13. Educational Principle</h2>

      <p>AI should act as a mentor, not as a replacement for investigation. The learner remains responsible for source validation and final conclusions.</p>
    `,
    keyPoints: [
      "Mojeek can be integrated as an independent search module",
      "AI can explain query construction",
      "AI recommendations must remain separate from evidence",
      "Tool recommendations can guide investigation pivots",
      "The evidence notebook preserves search context",
      "The Correlation Engine can connect findings across modules",
      "Simulation Mode provides safe practical training"
    ],
    example:
      "Investigation objective → AI query explanation → Mojeek discovery → evidence notebook → recommended DNS/certificate tool → correlation → report.",
    estimatedTime: 60,
    order: 6,
    difficulty: "Advanced",
    prerequisites: [
      "Mojeek OSINT Pivoting and Cross-Tool Correlation"
    ]
  },

  {
    lessonNumber: 7,
    title: "Mojeek Evidence Preservation and Practical Lab",
    shortDescription:
      "Perform a fictional Mojeek investigation while documenting queries, sources, timestamps, pivots, confidence, and evidence.",
    objectives: [
      "Perform a structured Mojeek investigation",
      "Record exact queries",
      "Preserve source context",
      "Create an evidence timeline",
      "Separate facts from hypotheses",
      "Prepare findings for reporting"
    ],
    content: `
      <h2>1. Laboratory Objective</h2>

      <p>This laboratory teaches a complete passive search workflow using Mojeek. The target is fictional and the exercise focuses on search discovery, validation, pivoting, and evidence documentation.</p>

      <h2>2. Fictional Scenario</h2>

      <p>The fictional organization is <strong>Northstar Digital Intelligence</strong>.</p>

      <p>The investigation objective is to identify publicly documented research, projects, domains, and technical references associated with the fictional organization.</p>

      <h2>3. Step One — Organization Search</h2>

      <pre><code>"Northstar Digital Intelligence"</code></pre>

      <p>Record useful results and identify alternative terminology.</p>

      <h2>4. Step Two — Context Searching</h2>

      <pre><code>"Northstar Digital Intelligence" research
"Northstar Digital Intelligence" cybersecurity
"Northstar Digital Intelligence" report
"Northstar Digital Intelligence" conference</code></pre>

      <h2>5. Step Three — Document Searching</h2>

      <pre><code>"Northstar Digital Intelligence" report
"Northstar Digital Intelligence" PDF
"Northstar Digital Intelligence" whitepaper</code></pre>

      <p>Suppose a fictional document identifies <strong>Project Aurora</strong>.</p>

      <h2>6. Step Four — Project Pivot</h2>

      <pre><code>"Project Aurora"
"Project Aurora" Northstar
"Project Aurora" security
"Project Aurora" research</code></pre>

      <p>Record whether the project appears in independent sources.</p>

      <h2>7. Step Five — Domain Pivot</h2>

      <p>Suppose the investigation discovers <code>northstar.example</code>.</p>

      <pre><code>"northstar.example"
"northstar.example" documentation
"northstar.example" security
"northstar.example" research</code></pre>

      <h2>8. Step Six — Passive Technical Pivot</h2>

      <p>The domain can now become a pivot into appropriate passive tools such as DNS Lookup and certificate-transparency services.</p>

      <pre><code>Mojeek
 ↓
northstar.example
 ↓
DNS
 ↓
Certificate
 ↓
Hostname
 ↓
Mojeek Search</code></pre>

      <h2>9. Evidence Record</h2>

      <table>
        <thead>
          <tr>
            <th>Field</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Evidence ID</td>
            <td>Unique evidence identifier</td>
          </tr>
          <tr>
            <td>Query</td>
            <td>Exact search query</td>
          </tr>
          <tr>
            <td>Source</td>
            <td>Original URL</td>
          </tr>
          <tr>
            <td>Timestamp</td>
            <td>Observation time</td>
          </tr>
          <tr>
            <td>Finding</td>
            <td>What was observed</td>
          </tr>
          <tr>
            <td>Confidence</td>
            <td>Evidence strength</td>
          </tr>
          <tr>
            <td>Pivot</td>
            <td>Next investigation step</td>
          </tr>
        </tbody>
      </table>

      <h2>10. Evidence Preservation</h2>

      <p>Web content can change. Preserve relevant information according to the investigation's evidence-handling procedures.</p>

      <p>Record source URLs, timestamps, titles, relevant context, and screenshots where permitted and appropriate.</p>

      <h2>11. Timeline Construction</h2>

      <p>Do not confuse publication dates with observation dates.</p>

      <pre><code>Publication Date
      ↓
Historical Event
      ↓
Current Discovery
      ↓
Investigator Observation
      ↓
Validation</code></pre>

      <h2>12. Observation Versus Conclusion</h2>

      <p>Consider the difference between:</p>

      <p><strong>Observation:</strong> A public document mentions <code>api.northstar.example</code>.</p>

      <p><strong>Conclusion:</strong> The organization currently operates that API.</p>

      <p>The second statement requires additional evidence.</p>

      <h2>13. Confidence Assessment</h2>

      <ul>
        <li>Confirmed</li>
        <li>Strongly supported</li>
        <li>Probable</li>
        <li>Possible</li>
        <li>Unverified</li>
      </ul>

      <h2>14. Lab Deliverables</h2>

      <ol>
        <li>Investigation objective</li>
        <li>Scope</li>
        <li>At least fifteen search queries</li>
        <li>At least five findings</li>
        <li>At least five pivots</li>
        <li>Source URLs</li>
        <li>Timeline</li>
        <li>Confidence classification</li>
        <li>Evidence graph</li>
        <li>Final conclusion</li>
      </ol>

      <h2>15. Reflection Questions</h2>

      <ol>
        <li>Which query produced the strongest result?</li>
        <li>Which result created the best pivot?</li>
        <li>Which source required additional validation?</li>
        <li>Which information was historical?</li>
        <li>Could another investigator reproduce the investigation?</li>
      </ol>

      <h2>16. Safety Boundary</h2>

      <p>The laboratory is passive and fictional. Do not attempt unauthorized access, credential attacks, exploitation, vulnerability testing, or service disruption.</p>

      <h2>17. Core Principle</h2>

      <p>A professional investigation preserves not only the final finding but also the path used to discover that finding.</p>
    `,
    keyPoints: [
      "Use fictional targets for training",
      "Record exact search queries",
      "Preserve source URLs and timestamps",
      "Document pivots and confidence",
      "Separate observations from conclusions",
      "Build a reproducible evidence trail",
      "Keep practical exercises passive"
    ],
    example:
      "E-003: Query = \"Northstar Digital Intelligence\" report; Finding = fictional public report; Pivot = Project Aurora; Confidence = strongly supported.",
    estimatedTime: 75,
    order: 7,
    difficulty: "Advanced",
    prerequisites: [
      "Mojeek in ForenX AI LearnOSINT",
      "Mojeek OSINT Pivoting and Cross-Tool Correlation"
    ]
  },

  {
    lessonNumber: 8,
    title: "Complete Mojeek Investigation and Final Assessment",
    shortDescription:
      "Apply the complete Mojeek OSINT methodology from planning and search discovery through pivoting, validation, correlation, evidence preservation, and reporting.",
    objectives: [
      "Plan a complete Mojeek investigation",
      "Construct systematic search queries",
      "Perform justified pivots",
      "Validate important findings",
      "Assess evidence confidence",
      "Create a professional OSINT report"
    ],
    content: `
      <h2>1. Complete Investigation Methodology</h2>

      <p>Mojeek should be used as part of a structured OSINT workflow rather than as an isolated search tool. A complete investigation begins with a question and ends with documented conclusions.</p>

      <pre><code>Plan
 ↓
Discover
 ↓
Refine
 ↓
Pivot
 ↓
Validate
 ↓
Correlate
 ↓
Preserve
 ↓
Report</code></pre>

      <h2>2. Phase One — Define the Objective</h2>

      <p>Write a specific investigation question.</p>

      <blockquote>
        Identify publicly documented information about the fictional organization Atlas Cyber Research and determine relationships between its projects, documents, domains, and technical references.
      </blockquote>

      <p>Divide the objective into smaller questions.</p>

      <ul>
        <li>What public references exist?</li>
        <li>What projects are mentioned?</li>
        <li>What domains are publicly associated?</li>
        <li>What documents exist?</li>
        <li>What technical references appear?</li>
        <li>What historical information exists?</li>
      </ul>

      <h2>3. Phase Two — Discovery</h2>

      <pre><code>"Atlas Cyber Research"
"Atlas Cyber Research" research
"Atlas Cyber Research" report
"Atlas Cyber Research" cybersecurity</code></pre>

      <p>At this stage, collect terminology and potential pivots.</p>

      <h2>4. Phase Three — Query Expansion</h2>

      <pre><code>"Atlas Cyber Research" conference
"Atlas Cyber Research" technical report
"Atlas Cyber Research" whitepaper
"Atlas Cyber Research" project</code></pre>

      <p>Search alternate names discovered during the investigation.</p>

      <h2>5. Phase Four — Document Investigation</h2>

      <pre><code>"Atlas Cyber Research" PDF
"Atlas Cyber Research" report
"Atlas Cyber Research" publication</code></pre>

      <p>Extract project names, authors, domains, technologies, and dates from relevant sources.</p>

      <h2>6. Phase Five — Project Pivot</h2>

      <p>If the investigation discovers <strong>Project Aurora</strong>:</p>

      <pre><code>"Project Aurora"
"Project Aurora" Atlas
"Project Aurora" security
"Project Aurora" research</code></pre>

      <p>Determine whether independent sources support the project relationship.</p>

      <h2>7. Phase Six — Domain Pivot</h2>

      <pre><code>"atlas.example"
"atlas.example" documentation
"atlas.example" security
"atlas.example" research</code></pre>

      <p>Then use passive domain-intelligence tools where appropriate.</p>

      <h2>8. Phase Seven — Technical Correlation</h2>

      <pre><code>Mojeek
 ↓
Domain
 ↓
DNS
 ↓
Certificate
 ↓
Hostname
 ↓
Censys
 ↓
Historical Archive
</code></pre>

      <p>Every source provides a different type of information.</p>

      <h2>9. Phase Eight — Historical Analysis</h2>

      <p>Old references must be clearly identified as historical.</p>

      <p>A hostname discovered in a document from several years ago should not automatically be reported as an active current service.</p>

      <p>Record publication dates, archive dates, and investigator observation dates separately.</p>

      <h2>10. Phase Nine — Validation</h2>

      <p>Important findings should be compared with reliable independent sources.</p>

      <pre><code>Mojeek:
Public reference

Official Source:
Organization confirmation

DNS:
Domain relationship

Certificate:
Hostname relationship

Archive:
Historical context</code></pre>

      <p>Do not claim that all sources prove the same thing.</p>

      <h2>11. Phase Ten — Correlation</h2>

      <pre><code>Organization
 |
 +---- Domain
 |      |
 |      +---- DNS
 |      |
 |      +---- Certificate
 |
 +---- Project
 |
 +---- Document
 |
 +---- Technical Reference</code></pre>

      <p>Every relationship should have evidence.</p>

      <h2>12. Phase Eleven — Confidence</h2>

      <ul>
        <li><strong>Confirmed:</strong> Direct reliable evidence.</li>
        <li><strong>Strongly supported:</strong> Multiple independent supporting sources.</li>
        <li><strong>Probable:</strong> Evidence strongly suggests the relationship.</li>
        <li><strong>Possible:</strong> Plausible hypothesis requiring additional validation.</li>
        <li><strong>Unverified:</strong> Insufficient evidence.</li>
      </ul>

      <h2>13. Phase Twelve — Evidence Preservation</h2>

      <p>Record:</p>

      <ul>
        <li>Exact query</li>
        <li>Source URL</li>
        <li>Source title</li>
        <li>Observation timestamp</li>
        <li>Publication date</li>
        <li>Relevant source context</li>
        <li>Evidence identifier</li>
        <li>Confidence level</li>
        <li>Next pivot</li>
      </ul>

      <h2>14. Phase Thirteen — Reporting</h2>

      <p>A professional OSINT report should communicate methodology and reasoning.</p>

      <ol>
        <li>Executive Summary</li>
        <li>Investigation Objective</li>
        <li>Scope</li>
        <li>Methodology</li>
        <li>Search Strategy</li>
        <li>Important Queries</li>
        <li>Evidence</li>
        <li>Findings</li>
        <li>Pivots</li>
        <li>Correlations</li>
        <li>Timeline</li>
        <li>Confidence Assessment</li>
        <li>Limitations</li>
        <li>Conclusion</li>
      </ol>

      <h2>15. Mojeek and ForenX</h2>

      <p>Within ForenX AI LearnOSINT, the Mojeek workflow can be transformed into an interactive investigation lesson.</p>

      <pre><code>Student Objective
      ↓
AI Mentor
      ↓
Mojeek Search
      ↓
Finding
      ↓
Evidence Notebook
      ↓
Recommended Tool
      ↓
Correlation Engine
      ↓
AI Explanation
      ↓
Report Generator</code></pre>

      <p>The AI should explain why a query is useful and identify uncertainty rather than inventing unsupported conclusions.</p>

      <h2>16. Common Beginner Mistakes</h2>

      <ul>
        <li>Using only one search query</li>
        <li>Assuming search ranking means credibility</li>
        <li>Treating snippets as evidence</li>
        <li>Failing to validate organization names</li>
        <li>Assuming identical usernames belong to one person</li>
        <li>Ignoring dates</li>
        <li>Repeating duplicate searches</li>
        <li>Counting copied articles as independent sources</li>
        <li>Confusing correlation with proof</li>
        <li>Failing to document queries</li>
      </ul>

      <h2>17. Final Assessment Questions</h2>

      <ol>
        <li>What is Mojeek used for in OSINT?</li>
        <li>Why is search-engine diversity useful?</li>
        <li>Why should search results not automatically be treated as evidence?</li>
        <li>Why are exact phrase searches useful?</li>
        <li>What is progressive query refinement?</li>
        <li>Why should alternate terminology be searched?</li>
        <li>What is an OSINT pivot?</li>
        <li>Why should usernames be independently validated?</li>
        <li>Why are publication and observation dates different?</li>
        <li>Why is source independence important?</li>
        <li>How can DNS complement Mojeek?</li>
        <li>How can certificate intelligence create additional pivots?</li>
        <li>How can historical archives improve analysis?</li>
        <li>What should an OSINT report contain?</li>
        <li>How can AI assist without replacing evidence validation?</li>
      </ol>

      <h2>18. Final Practical Challenge</h2>

      <p>Conduct a fictional investigation using Mojeek as the primary discovery source.</p>

      <p>Your investigation should contain:</p>

      <ol>
        <li>A clearly defined objective</li>
        <li>At least twenty search queries</li>
        <li>At least five meaningful pivots</li>
        <li>At least five documented findings</li>
        <li>At least three independent validation sources</li>
        <li>A timeline</li>
        <li>An evidence graph</li>
        <li>Confidence classifications</li>
        <li>A final report</li>
      </ol>

      <h2>19. Professional Checklist</h2>

      <ul>
        <li>☐ Define the investigation objective</li>
        <li>☐ Define scope and boundaries</li>
        <li>☐ Record known identifiers</li>
        <li>☐ Perform broad discovery</li>
        <li>☐ Expand terminology</li>
        <li>☐ Refine queries</li>
        <li>☐ Search documents</li>
        <li>☐ Search project names</li>
        <li>☐ Investigate domain references</li>
        <li>☐ Record exact queries</li>
        <li>☐ Validate important findings</li>
        <li>☐ Perform justified pivots</li>
        <li>☐ Compare independent sources</li>
        <li>☐ Record timestamps</li>
        <li>☐ Assign confidence</li>
        <li>☐ Preserve evidence context</li>
        <li>☐ Document limitations</li>
        <li>☐ Produce a reproducible report</li>
      </ul>

      <h2>20. Final Takeaway</h2>

      <p>Mojeek is valuable to an OSINT investigator because it provides another independent environment for public web discovery. Its importance is not based on one special search trick. Instead, it contributes to search diversity and gives investigators another path for discovering publicly indexed information.</p>

      <p>The strongest OSINT methodology combines multiple search strategies with disciplined validation. Investigators should search broadly, refine queries, recognize new identifiers, pivot intelligently, compare independent sources, preserve evidence, and clearly communicate uncertainty.</p>

      <p>ForenX AI LearnOSINT can turn this methodology into an educational workflow by combining Mojeek with the AI Mentor, Tool Explorer, investigation notebook, Correlation Engine, simulation environment, and report generator.</p>

      <p>The complete workflow can be remembered as:</p>

      <blockquote>
        <strong>Plan → Search → Refine → Pivot → Validate → Correlate → Preserve → Report.</strong>
      </blockquote>

      <p>This methodology is more important than memorizing individual search tricks because search engines and their interfaces can evolve. The underlying principles of structured investigation, evidence validation, source independence, and reproducibility remain fundamental to professional OSINT.</p>
    `,
    keyPoints: [
      "Start every investigation with a defined objective",
      "Use Mojeek as one discovery layer within a larger OSINT workflow",
      "Refine queries progressively",
      "Use new identifiers as justified pivots",
      "Validate important findings using independent evidence",
      "Record timestamps and source provenance",
      "Separate observations from conclusions",
      "Use AI as an assistant rather than an evidence authority",
      "Finish with a reproducible investigation report"
    ],
    example:
      "Complete workflow: Organization → Mojeek → document → project/domain → DNS → certificate → Censys/Wayback → correlation → evidence notebook → final report.",
    estimatedTime: 90,
    order: 8,
    difficulty: "Advanced",
    prerequisites: [
      "Mojeek Fundamentals for OSINT",
      "Mojeek Search and Query Construction",
      "Advanced Mojeek Search Strategy",
      "Mojeek for Organizations, Documents, and Digital Footprints",
      "Mojeek OSINT Pivoting and Cross-Tool Correlation",
      "Mojeek in ForenX AI LearnOSINT",
      "Mojeek Evidence Preservation and Practical Lab"
    ]
  }
];

module.exports = toolLessons;