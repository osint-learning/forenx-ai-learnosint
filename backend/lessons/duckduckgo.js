const toolLessons = [
  {
    lessonNumber: 1,
    title: "DuckDuckGo Fundamentals for OSINT",
    shortDescription:
      "Understand DuckDuckGo, privacy-oriented searching, result discovery, search behavior, and its role in an OSINT workflow.",
    objectives: [
      "Understand what DuckDuckGo is",
      "Understand why search-engine diversity matters in OSINT",
      "Learn how privacy-oriented searching relates to investigation",
      "Understand search results, snippets, and source context",
      "Learn basic query construction",
      "Understand the limitations of search-engine intelligence"
    ],
    content: `
      <h2>1. Introduction to DuckDuckGo</h2>

      <p>DuckDuckGo is a privacy-oriented Internet search service that can be used to discover publicly accessible information. For OSINT investigators, its value comes from providing another search environment through which publicly indexed pages, documents, websites, technical references, news articles, and other sources can be discovered.</p>

      <p>Search engines are important components of OSINT because investigators frequently begin with incomplete information. A target may be known only by a name, domain, username, organization, project, document title, or distinctive phrase. Search engines allow the investigator to expand these initial clues into additional publicly available sources.</p>

      <h2>2. Search Engines as Discovery Systems</h2>

      <p>A search engine should not be thought of as a complete database of the Internet. Search engines discover and index portions of the public web, and their indexes and ranking systems differ. A page that appears prominently in one search engine may be less visible or absent from another.</p>

      <p>This is why experienced investigators often use multiple search engines. DuckDuckGo can complement tools such as Google, Bing, Brave Search, Yandex, and other specialized sources.</p>

      <pre><code>Investigation Question
        ↓
Search Engine Discovery
        ↓
Potential Source
        ↓
Source Validation
        ↓
Finding
        ↓
Pivot</code></pre>

      <h2>3. Privacy-Oriented Searching</h2>

      <p>DuckDuckGo is widely associated with privacy-oriented search. Privacy can be relevant to legitimate OSINT because investigators may want to minimize unnecessary tracking while performing research. However, privacy features do not remove the need for ethical investigation practices.</p>

      <p>An investigator must still respect legal requirements, organizational policies, terms of service, authorization boundaries, and the privacy of individuals who are not relevant to the investigation.</p>

      <h2>4. Understanding Search Results</h2>

      <p>A search result normally contains a title, URL, and description or snippet. These elements help determine whether a page deserves further examination.</p>

      <p>The snippet should be treated as a discovery clue rather than definitive evidence. The investigator should open the underlying source when possible and inspect the complete context.</p>

      <h2>5. Exact Phrase Searching</h2>

      <p>Quotation marks are useful when an investigator wants to search for a specific phrase.</p>

      <pre><code>"Atlas Digital Research"
"Atlas Digital Research" report
"Atlas Digital Research" cybersecurity</code></pre>

      <p>Exact phrase searching is especially useful for organization names, project names, document titles, distinctive sentences, and unique identifiers.</p>

      <h2>6. Progressive Search</h2>

      <p>Do not begin every investigation with an extremely complicated query. Start with a broad query and progressively add context.</p>

      <pre><code>Atlas Digital Research

"Atlas Digital Research"

"Atlas Digital Research" cybersecurity

"Atlas Digital Research" filetype:pdf</code></pre>

      <p>This allows the investigator to understand how each restriction changes the result set.</p>

      <h2>7. Search Diversity</h2>

      <p>Search-engine diversity is useful because different platforms may emphasize different sources or rankings. If an investigator performs the same query across several engines, the results can be compared to identify additional sources.</p>

      <p>The goal is not to collect duplicate pages. Instead, search diversity can reveal new leads that become independent investigation pivots.</p>

      <h2>8. Search Results Are Not Automatically Evidence</h2>

      <p>A result appearing at the top of a page does not prove that the result is authoritative. Search ranking is not the same thing as evidence reliability.</p>

      <p>For each important finding, ask:</p>

      <ul>
        <li>Who published the information?</li>
        <li>When was it published?</li>
        <li>Is it a primary or secondary source?</li>
        <li>Does the page directly support the claim?</li>
        <li>Can another independent source confirm it?</li>
      </ul>

      <h2>9. Search as a Pivot Generator</h2>

      <p>One of the most important OSINT skills is recognizing new identifiers inside a source. A page may reveal a domain, username, project code, employee name, document title, or technical term. Each identifier can become a new query.</p>

      <pre><code>Organization
    ↓
Public Article
    ↓
Project Name
    ↓
New Search
    ↓
Additional Source</code></pre>

      <h2>10. Beginner Exercise</h2>

      <p>Create a fictional organization named <strong>Northstar Intelligence Labs</strong>. Search for its name using DuckDuckGo. Perform at least five progressively specific searches and record the query, useful result, source, and possible pivot.</p>

      <p>The purpose is to learn structured discovery rather than random browsing.</p>

      <h2>11. Limitations</h2>

      <ul>
        <li>Search indexes are incomplete.</li>
        <li>Results can change over time.</li>
        <li>Pages can disappear.</li>
        <li>Ranking does not represent source credibility.</li>
        <li>Duplicate information may appear across many websites.</li>
        <li>Search snippets can lack important context.</li>
      </ul>

      <h2>12. Core Principle</h2>

      <p>DuckDuckGo is most useful when treated as one discovery layer within a larger OSINT methodology. The investigator's responsibility is to convert search results into validated findings rather than assuming that search results themselves represent verified intelligence.</p>
    `,
    keyPoints: [
      "DuckDuckGo can serve as an additional OSINT discovery source",
      "Privacy-oriented searching can support legitimate research workflows",
      "Search snippets are discovery clues rather than automatic evidence",
      "Progressive queries improve investigation coverage",
      "Different search engines may expose different useful sources",
      "New identifiers discovered in sources can become investigation pivots"
    ],
    example:
      "\"Northstar Intelligence Labs\" filetype:pdf",
    estimatedTime: 40,
    order: 1,
    difficulty: "Beginner",
    prerequisites: []
  },

  {
    lessonNumber: 2,
    title: "Basic DuckDuckGo Searching and Query Construction",
    shortDescription:
      "Learn practical DuckDuckGo searching for organizations, domains, people, documents, technical information, and public references.",
    objectives: [
      "Construct effective DuckDuckGo queries",
      "Use exact phrase searches",
      "Search organizations and domains",
      "Find public documents",
      "Use contextual keywords",
      "Reduce irrelevant search results"
    ],
    content: `
      <h2>1. Starting With Known Information</h2>

      <p>Most investigations begin with at least one known identifier. This could be a company name, domain, username, project name, email domain, document title, or technical term. The first step is to turn the known information into multiple search variations.</p>

      <p>Suppose the fictional organization is <strong>Orion Security Research</strong>. Instead of performing one search, build a small search matrix.</p>

      <table>
        <thead>
          <tr>
            <th>Purpose</th>
            <th>Query</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Organization</td>
            <td>"Orion Security Research"</td>
          </tr>
          <tr>
            <td>Research</td>
            <td>"Orion Security Research" research</td>
          </tr>
          <tr>
            <td>Documents</td>
            <td>"Orion Security Research" filetype:pdf</td>
          </tr>
          <tr>
            <td>Technology</td>
            <td>"Orion Security Research" technology</td>
          </tr>
          <tr>
            <td>Events</td>
            <td>"Orion Security Research" conference</td>
          </tr>
        </tbody>
      </table>

      <h2>2. Exact Phrase Searching</h2>

      <p>Exact phrase searches are useful when the investigator knows a meaningful multi-word identifier. They reduce the chance that the search engine interprets every word independently.</p>

      <pre><code>"Orion Security Research"
"Orion Security Research" "annual report"
"Orion Security Research" "security research"</code></pre>

      <p>Exact phrase searches can also be used with distinctive sentences. If an investigator finds an unusual phrase in a public document, searching that phrase can sometimes identify duplicates, references, or related publications.</p>

      <h2>3. Adding Context</h2>

      <p>When a query returns too many unrelated results, add context. Context can be a technology, industry, location, document type, event, or project.</p>

      <pre><code>"Orion Security Research" cybersecurity
"Orion Security Research" software
"Orion Security Research" report
"Orion Security Research" university</code></pre>

      <p>However, adding too many terms can remove useful results. Search refinement should be gradual.</p>

      <h2>4. Domain Searching</h2>

      <p>When an organization domain is known, domain-focused searches can help identify indexed pages associated with that domain. The <code>site:</code> operator is commonly useful for this purpose.</p>

      <pre><code>site:example.org
site:example.org security
site:example.org research
site:example.org filetype:pdf</code></pre>

      <p>The result set should not be interpreted as a complete inventory of the website. Search indexes are incomplete.</p>

      <h2>5. Document Discovery</h2>

      <p>Documents can contain valuable organizational and technical information. Investigators can use file-type restrictions where supported.</p>

      <pre><code>"Orion Security Research" filetype:pdf
"Orion Security Research" filetype:ppt
"Orion Security Research" filetype:doc</code></pre>

      <p>Potentially sensitive documents should be handled responsibly. Public availability does not automatically authorize redistribution or misuse.</p>

      <h2>6. Searching Technical Terms</h2>

      <p>Technical keywords can help identify documentation and public discussions associated with an organization.</p>

      <pre><code>"orion.example" API
"orion.example" documentation
"orion.example" security
"orion.example" developer</code></pre>

      <p>Technical searches should remain passive. Discovering a reference to an endpoint or technology is not authorization to attack or test it.</p>

      <h2>7. Searching Usernames</h2>

      <p>A username discovered in a public source can become a search pivot.</p>

      <pre><code>"orion_researcher"
"orion_researcher" security
"orion_researcher" GitHub
"orion_researcher" research</code></pre>

      <p>A matching username does not automatically establish that every account belongs to the same individual. Identity correlation requires additional evidence.</p>

      <h2>8. Excluding Noise</h2>

      <p>Exclusion terms can reduce irrelevant results when a keyword has multiple meanings.</p>

      <pre><code>Orion security -football
"Orion Labs" -jobs</code></pre>

      <p>Exclusions should be used carefully because they can also hide legitimate results.</p>

      <h2>9. Search Iteration</h2>

      <p>Good investigators treat every search as an experiment. If a result reveals a new project name, search the project. If it reveals a domain, search the domain. If it reveals a distinctive document title, search that title.</p>

      <h2>10. Search Notebook</h2>

      <p>Record important searches in an investigation notebook.</p>

      <pre><code>Query:
"Orion Security Research" filetype:pdf

Purpose:
Find public reports

Useful Result:
Public research document

Pivot:
Project identifier found inside document

Confidence:
Unverified until source validation</code></pre>

      <h2>11. Practical Exercise</h2>

      <p>Create ten queries for a fictional organization. Include organization searches, domain searches, document searches, technical searches, and at least two exclusion queries. Record which queries produced useful results and why.</p>

      <h2>12. Beginner Principle</h2>

      <p>Effective searching is a process of progressive refinement. Start broad enough to discover terminology, then become more precise as new identifiers become available.</p>
    `,
    keyPoints: [
      "Begin with known identifiers",
      "Exact phrases are useful for names and distinctive text",
      "Context keywords reduce unrelated results",
      "site: can focus searches on a domain",
      "Documents can reveal useful investigation pivots",
      "Username matches require independent validation"
    ],
    example:
      "site:example.org filetype:pdf \"security report\"",
    estimatedTime: 45,
    order: 2,
    difficulty: "Beginner",
    prerequisites: [
      "DuckDuckGo Fundamentals for OSINT"
    ]
  },

  {
    lessonNumber: 3,
    title: "Advanced Search Operators and Bangs",
    shortDescription:
      "Learn DuckDuckGo-specific search features, bangs, operators, query combinations, and advanced search strategy for OSINT.",
    objectives: [
      "Understand DuckDuckGo bangs",
      "Use search operators effectively",
      "Combine operators with investigative identifiers",
      "Understand when to switch search sources",
      "Build advanced query patterns",
      "Avoid overly restrictive queries"
    ],
    content: `
      <h2>1. Why Advanced Search Matters</h2>

      <p>Basic keyword searches are useful during initial discovery, but complex investigations require more precise searching. DuckDuckGo provides search operators and a feature known as bangs that can help users move quickly between search contexts.</p>

      <p>Because search syntax and supported behavior can change, investigators should verify exact syntax using current DuckDuckGo documentation or interface behavior. The broader methodology is stable: restrict the search space only when the investigation benefits from the restriction.</p>

      <h2>2. The site: Operator</h2>

      <p>The <code>site:</code> operator is useful when the investigator wants results from a particular domain.</p>

      <pre><code>site:example.org security
site:example.org documentation
site:example.org filetype:pdf
site:example.org research</code></pre>

      <p>For OSINT, this can help investigate a known organization's public web presence.</p>

      <h2>3. The filetype: Operator</h2>

      <p>The <code>filetype:</code> operator can help discover specific document formats.</p>

      <pre><code>filetype:pdf "incident response"
filetype:ppt "cybersecurity"
filetype:doc "security policy"</code></pre>

      <p>Documents should be examined in their complete context rather than relying only on snippets.</p>

      <h2>4. Title and URL Searching</h2>

      <p>Search engines may support operators such as <code>intitle:</code> and <code>inurl:</code>. Their exact behavior should be tested because search engines do not necessarily implement all operators identically.</p>

      <pre><code>intitle:"security report"
intitle:documentation cybersecurity
inurl:research security
inurl:report "incident"</code></pre>

      <p>These patterns can be useful when investigating predictable page structures.</p>

      <h2>5. Combining Operators</h2>

      <p>Operators can be combined to construct highly targeted queries.</p>

      <pre><code>site:example.org filetype:pdf security
site:example.org intitle:report research
site:example.org inurl:documentation API</code></pre>

      <p>The goal is not to make a query complicated. The goal is to represent a specific investigative question.</p>

      <h2>6. DuckDuckGo Bangs</h2>

      <p>Bangs are shortcuts that can send a search directly to another website or search service. A bang begins with an exclamation mark followed by a shortcut identifier. Because available bangs can change, investigators should verify the current list and syntax through DuckDuckGo itself.</p>

      <p>Conceptually, bangs allow a researcher to say: "I want to search this query using a particular external service."</p>

      <pre><code>!bang query</code></pre>

      <p>The educational importance of bangs is that they can make multi-source searching more efficient. An investigator can move from a general search to a specialized source without manually navigating through multiple websites.</p>

      <h2>7. Why Bangs Matter in OSINT</h2>

      <p>OSINT frequently requires source diversity. Suppose DuckDuckGo reveals a domain but the investigator wants to compare results with another search engine or specialized service. A bang can provide a quick transition to another search context when an appropriate shortcut is available.</p>

      <p>This should be viewed as workflow optimization rather than a replacement for understanding the underlying search source.</p>

      <h2>8. Search Engine Switching</h2>

      <p>Different search engines can produce different results. A useful workflow might begin with DuckDuckGo, switch to Brave Search for comparison, then use a specialized tool for technical intelligence.</p>

      <pre><code>DuckDuckGo
    ↓
Discovery
    ↓
Brave Search
    ↓
Result comparison
    ↓
Specialized OSINT Tool
    ↓
Validation</code></pre>

      <h2>9. Query Expansion</h2>

      <p>Suppose the investigator discovers the phrase <code>Project Aurora</code>. Instead of searching only once, create variations:</p>

      <pre><code>"Project Aurora"
"Project Aurora" security
"Project Aurora" research
"Project Aurora" report
"Project Aurora" filetype:pdf
"Project Aurora" "Orion"</code></pre>

      <p>Query expansion improves discovery coverage.</p>

      <h2>10. Query Reduction</h2>

      <p>If a search becomes too broad, add one restriction at a time. If it becomes too narrow, remove the least important restriction.</p>

      <pre><code>Broad:
security report

Refined:
"Orion Security" report

More refined:
"Orion Security" filetype:pdf report

Too restrictive:
"Orion Security" exact-title filetype:pdf year-specific-site-specific</code></pre>

      <h2>11. Operator Validation</h2>

      <p>Search operators should never be blindly copied from old tutorials. Search platforms evolve. An investigator should test the operator with a simple query and inspect whether the returned results actually satisfy the intended restriction.</p>

      <h2>12. Practical Exercise</h2>

      <p>Create five advanced DuckDuckGo queries for a fictional domain. Use site restriction, document searching, title or URL concepts, exact phrases, and one cross-search workflow using a supported bang.</p>

      <p>For each query, explain the investigation question it is designed to answer.</p>
    `,
    keyPoints: [
      "Advanced operators can reduce search noise",
      "site: is useful for domain-focused discovery",
      "filetype: can help locate public documents",
      "intitle: and inurl: may help locate predictable resources",
      "Bangs provide shortcuts to other search contexts",
      "Operator support and syntax should be verified against current behavior",
      "Queries should be specific enough to be useful but not unnecessarily restrictive"
    ],
    example:
      "site:example.org filetype:pdf \"security assessment\"",
    estimatedTime: 55,
    order: 3,
    difficulty: "Intermediate",
    prerequisites: [
      "Basic DuckDuckGo Searching and Query Construction"
    ]
  },

  {
    lessonNumber: 4,
    title: "DuckDuckGo for Practical OSINT Investigation",
    shortDescription:
      "Apply DuckDuckGo to organization, domain, document, username, technical, and public-information investigations.",
    objectives: [
      "Use DuckDuckGo in a structured investigation",
      "Investigate organizations and domains",
      "Discover public documents",
      "Perform username and project pivots",
      "Validate public information",
      "Build an investigation trail"
    ],
    content: `
      <h2>1. From Search to Investigation</h2>

      <p>An OSINT investigation should have a defined objective. Searching randomly produces large amounts of information but does not necessarily produce useful intelligence. DuckDuckGo becomes more effective when every search is connected to a specific investigative question.</p>

      <h2>2. Organization Investigation</h2>

      <p>Start with the exact organization name and known variations.</p>

      <pre><code>"Atlas Cyber Research"
"Atlas Cyber Research" technology
"Atlas Cyber Research" report
"Atlas Cyber Research" conference
"Atlas Cyber Research" security</code></pre>

      <p>Record alternate names discovered in reliable sources. These names can become additional pivots.</p>

      <h2>3. Domain Investigation</h2>

      <p>If a domain is discovered, search both the domain itself and references to the domain.</p>

      <pre><code>"atlas.example"
site:atlas.example
"atlas.example" security
"atlas.example" documentation
"atlas.example" report</code></pre>

      <p>Searching the domain as a quoted phrase can reveal third-party references.</p>

      <h2>4. Document Investigation</h2>

      <p>Public reports, presentations, research papers, manuals, and other documents can provide useful context.</p>

      <pre><code>"Atlas Cyber Research" filetype:pdf
"Atlas Cyber Research" filetype:ppt
"Atlas Cyber Research" "annual report"</code></pre>

      <p>Once a useful document is found, examine it for new identifiers such as project names, domains, technologies, authors, dates, or contact information.</p>

      <h2>5. Username Investigation</h2>

      <p>A username discovered in a legitimate public source can be searched using exact phrase queries.</p>

      <pre><code>"atlas_research"
"atlas_research" cybersecurity
"atlas_research" research
"atlas_research" conference</code></pre>

      <p>Do not assume that identical usernames necessarily belong to the same person. Supporting attributes are required.</p>

      <h2>6. Project Investigation</h2>

      <p>Project names can be excellent pivots because they may appear in multiple documents or publications.</p>

      <pre><code>"Project Aurora"
"Project Aurora" Atlas
"Project Aurora" cybersecurity
"Project Aurora" filetype:pdf</code></pre>

      <p>Compare publication dates and source relationships to determine whether references actually concern the same project.</p>

      <h2>7. Technical Investigation</h2>

      <p>Public technical references can help an investigator understand an organization's documented technology. Queries might include framework names, API terminology, documentation terms, or publicly discussed products.</p>

      <pre><code>"atlas.example" API
"atlas.example" nginx
"atlas.example" documentation
"atlas.example" "security header"</code></pre>

      <p>These searches are passive. They should not be followed by unauthorized testing.</p>

      <h2>8. Source Validation</h2>

      <p>Every significant discovery should be validated. A useful source-validation checklist is:</p>

      <ul>
        <li>Is the source primary or secondary?</li>
        <li>Who published it?</li>
        <li>What date is associated with it?</li>
        <li>Does the source directly support the claim?</li>
        <li>Is the source likely to be outdated?</li>
        <li>Can another source independently confirm it?</li>
      </ul>

      <h2>9. Search-to-Tool Pivoting</h2>

      <p>DuckDuckGo can serve as the first stage of a larger workflow. If it reveals a domain, use appropriate domain tools. If it reveals a certificate hostname, use certificate transparency resources. If it reveals historical information, use archival sources.</p>

      <pre><code>DuckDuckGo
   ↓
Domain
   ↓
WHOIS / DNS
   ↓
Certificate
   ↓
crt.sh / Censys
   ↓
Historical validation
   ↓
Evidence notebook</code></pre>

      <h2>10. False Correlation</h2>

      <p>Search engines often return similarly named people and organizations. A common word or username should not be used as the only basis for connecting entities.</p>

      <p>Strong correlation usually requires several matching attributes such as organization, domain, location, time period, unique identifiers, or independent publications.</p>

      <h2>11. Investigation Graph</h2>

      <pre><code>Organization
    |
    +---- Domain
    |
    +---- Document
    |       |
    |       +---- Project
    |
    +---- Public Username
    |
    +---- Technical Reference</code></pre>

      <p>This graph helps the investigator understand how discoveries relate to one another.</p>

      <h2>12. Practical Exercise</h2>

      <p>Use a fictional organization and perform an investigation beginning with only its name. Identify a fictional domain, locate public documents, identify a project name, and create at least three additional search pivots. For every finding, record the source and confidence level.</p>
    `,
    keyPoints: [
      "Searches should answer explicit investigation questions",
      "Organization and domain searches provide useful starting points",
      "Documents often contain additional pivot information",
      "Username matches require supporting evidence",
      "Technical searches should remain passive",
      "Source validation is essential before reporting conclusions"
    ],
    example:
      "\"Atlas Cyber Research\" filetype:pdf → identify project name → search project independently → validate through additional sources.",
    estimatedTime: 60,
    order: 4,
    difficulty: "Intermediate",
    prerequisites: [
      "Advanced Search Operators and Bangs"
    ]
  },

  {
    lessonNumber: 5,
    title: "Advanced Pivoting and Cross-Tool Correlation",
    shortDescription:
      "Learn how DuckDuckGo findings can be correlated with WHOIS, DNS, certificate, threat-intelligence, historical, and username investigation tools.",
    objectives: [
      "Understand OSINT pivoting",
      "Correlate search findings with domain intelligence",
      "Use DNS as a validation layer",
      "Connect search results with certificate intelligence",
      "Use historical information to establish timelines",
      "Avoid unsupported correlations"
    ],
    content: `
      <h2>1. Understanding OSINT Pivoting</h2>

      <p>Pivoting is the process of using a discovered identifier to locate additional information. It is one of the most important techniques in OSINT because useful investigations rarely end with the first search result.</p>

      <p>A DuckDuckGo search may reveal a domain. The domain can lead to DNS information. DNS can reveal an address. Certificate sources can reveal additional hostnames. Those hostnames can then be searched again.</p>

      <pre><code>Search Result
     ↓
Domain
     ↓
DNS
     ↓
IP / Hostname
     ↓
Certificate
     ↓
New Search
     ↓
Additional Evidence</code></pre>

      <h2>2. DuckDuckGo and WHOIS</h2>

      <p>Suppose DuckDuckGo identifies a domain associated with a fictional organization. WHOIS can provide registration-related context where such information is publicly available.</p>

      <p>The two sources answer different questions. DuckDuckGo may reveal public references, while WHOIS provides domain registration information. Agreement between the sources can strengthen understanding, but neither should automatically be treated as definitive ownership evidence.</p>

      <h2>3. DuckDuckGo and DNS Lookup</h2>

      <p>DNS can validate domain-to-address relationships. If a public page mentions <code>api.example.org</code>, a DNS lookup can determine relevant DNS records.</p>

      <pre><code>"api.example.org"
        ↓
DNS Lookup
        ↓
A / AAAA / CNAME
        ↓
IP or related hostname</code></pre>

      <p>The result can then become a technical pivot.</p>

      <h2>4. DuckDuckGo and crt.sh</h2>

      <p>Certificate transparency sources can reveal certificate-related hostnames. A hostname discovered through a certificate can be searched in DuckDuckGo to determine whether it appears in public documents or web pages.</p>

      <pre><code>Domain
 ↓
Certificate
 ↓
api.example.org
 ↓
DuckDuckGo
 ↓
Public references</code></pre>

      <h2>5. DuckDuckGo and Censys</h2>

      <p>Censys can provide publicly observable infrastructure observations. DuckDuckGo can provide web and document context.</p>

      <p>For example:</p>

      <pre><code>DuckDuckGo
  ↓
api.example.org
  ↓
DNS
  ↓
IP
  ↓
Censys
  ↓
Observed service
</code></pre>

      <p>This creates a relationship between public web intelligence and technical infrastructure intelligence.</p>

      <h2>6. DuckDuckGo and Wayback Machine</h2>

      <p>Search results can reveal current or historical references, while the Wayback Machine can provide archived versions of web pages. Combining these sources can help answer temporal questions.</p>

      <p>If a hostname appears in an old public document, an archived website may provide additional context about when it was used.</p>

      <h2>7. DuckDuckGo and VirusTotal</h2>

      <p>VirusTotal can provide threat-intelligence context for domains, URLs, IP addresses, and other indicators. A search result identifying an indicator does not establish that the indicator is malicious.</p>

      <p>Threat-intelligence findings should be interpreted using detection context, dates, relationships, and independent evidence.</p>

      <h2>8. DuckDuckGo and Username Tools</h2>

      <p>A public username can be searched in DuckDuckGo and then investigated using appropriate username tools such as Sherlock or Maigret. Results should be compared carefully.</p>

      <p>A username match is a lead. Identity attribution requires additional supporting information.</p>

      <h2>9. Correlation Confidence</h2>

      <p>Use explicit confidence categories:</p>

      <ul>
        <li><strong>Confirmed:</strong> Directly supported by reliable evidence.</li>
        <li><strong>Strongly supported:</strong> Several independent attributes agree.</li>
        <li><strong>Probable:</strong> Evidence supports the relationship but uncertainty remains.</li>
        <li><strong>Possible:</strong> A hypothesis requiring further validation.</li>
        <li><strong>Unverified:</strong> A lead without sufficient support.</li>
      </ul>

      <h2>10. Source Independence</h2>

      <p>Five websites repeating the same original article do not necessarily provide five independent confirmations. Investigators should determine whether apparently separate sources are actually copying the same underlying information.</p>

      <p>This is especially important when measuring confidence in an investigation.</p>

      <h2>11. Example Correlation Chain</h2>

      <pre><code>DuckDuckGo:
"Orion Security" → api.orion.example

DNS:
api.orion.example → IP

crt.sh:
Certificate contains api.orion.example

Censys:
HTTPS service observed on IP

Wayback:
Historical page references hostname

Conclusion:
Multiple sources support the relationship,
subject to timestamps and infrastructure context.</code></pre>

      <h2>12. Practical Exercise</h2>

      <p>Create a fictional domain and build a five-stage pivot chain beginning with DuckDuckGo. Use conceptual steps involving DNS, certificates, Censys, and historical archives. Record exactly what each source proves and what it does not prove.</p>

      <h2>13. Professional Principle</h2>

      <p>Correlation should improve understanding without artificially increasing certainty. The investigator must remain responsible for determining whether relationships are genuinely supported.</p>
    `,
    keyPoints: [
      "Pivoting turns discoveries into new investigation paths",
      "WHOIS and DNS provide complementary domain context",
      "Certificate sources can reveal hostname pivots",
      "Censys adds technical infrastructure observations",
      "Historical archives provide temporal context",
      "Source independence matters when evaluating confidence",
      "Correlation must not be confused with proof"
    ],
    example:
      "DuckDuckGo → hostname → DNS → certificate transparency → Censys → historical archive → validated relationship.",
    estimatedTime: 65,
    order: 5,
    difficulty: "Advanced",
    prerequisites: [
      "Practical DuckDuckGo OSINT Investigation",
      "Advanced Search Operators and Bangs"
    ]
  },

  {
    lessonNumber: 6,
    title: "DuckDuckGo in ForenX AI LearnOSINT",
    shortDescription:
      "Learn how DuckDuckGo can be integrated into ForenX AI LearnOSINT through AI assistance, tool recommendations, investigation notebooks, correlation, and reporting.",
    objectives: [
      "Understand DuckDuckGo's role in ForenX",
      "Use AI-assisted query generation",
      "Use the Tool Explorer for guided learning",
      "Record search findings",
      "Understand AI limitations",
      "Use correlation and reporting features responsibly"
    ],
    content: `
      <h2>1. Role of DuckDuckGo in ForenX</h2>

      <p>ForenX AI LearnOSINT is intended to help beginners learn OSINT through practical workflows. DuckDuckGo can be integrated as a search-engine module that teaches students how to perform public information discovery and transform search results into structured investigation findings.</p>

      <p>The Tool Explorer can explain DuckDuckGo's purpose, search concepts, query operators, privacy-oriented design, and appropriate OSINT applications.</p>

      <h2>2. AI Mentor</h2>

      <p>A beginner may know what information they want but not know how to search for it. The AI Mentor can explain how to convert an investigation objective into search queries.</p>

      <p>For example, a learner may say:</p>

      <blockquote>
        I need to find public research reports associated with a fictional organization.
      </blockquote>

      <p>The AI can explain why a query such as:</p>

      <pre><code>"Example Organization" filetype:pdf research</code></pre>

      <p>could be a reasonable starting point.</p>

      <p>The important educational feature is the explanation. The student should understand why the query works rather than blindly copying an AI-generated command.</p>

      <h2>3. AI-Generated Queries Are Not Evidence</h2>

      <p>ForenX should distinguish between AI recommendations and collected evidence. If the AI proposes that a domain may be associated with an organization, the system should label this as a hypothesis until actual sources support it.</p>

      <ul>
        <li>AI suggestion</li>
        <li>User-observed search result</li>
        <li>Source evidence</li>
        <li>Validated finding</li>
        <li>Investigator conclusion</li>
      </ul>

      <p>These categories should not be silently merged.</p>

      <h2>4. Tool Recommendations</h2>

      <p>ForenX can recommend the next tool based on the current finding.</p>

      <pre><code>Finding:
Domain discovered

Possible next tools:
WHOIS
DNS Lookup
crt.sh
Censys
Wayback Machine</code></pre>

      <p>If a username is discovered, the system may recommend username investigation tools. If a public document is discovered, the system may recommend metadata analysis.</p>

      <h2>5. Investigation Notebook</h2>

      <p>A search finding should be recordable with structured metadata.</p>

      <ul>
        <li>Evidence ID</li>
        <li>Query</li>
        <li>Source URL</li>
        <li>Observation timestamp</li>
        <li>Finding description</li>
        <li>Confidence level</li>
        <li>Related entity</li>
        <li>Next pivot</li>
        <li>Investigator notes</li>
      </ul>

      <h2>6. Correlation Engine</h2>

      <p>The ForenX Correlation Engine can connect DuckDuckGo findings with information from other modules.</p>

      <pre><code>DuckDuckGo:
api.example.org

DNS:
api.example.org → IP

crt.sh:
api.example.org in certificate

Censys:
HTTPS observed

Correlation:
Domain + DNS + Certificate + Infrastructure
</code></pre>

      <p>The platform should show the reasoning behind the relationship.</p>

      <h2>7. Explainable AI</h2>

      <p>If the AI identifies a potential relationship, it should explain which evidence supports the suggestion. It should also identify missing evidence.</p>

      <p>For example:</p>

      <blockquote>
        The hostname appears in a certificate associated with the domain, but current ownership and service status require independent validation.
      </blockquote>

      <p>This teaches students to reason about uncertainty.</p>

      <h2>8. Simulation Mode</h2>

      <p>ForenX can provide fictional organizations, domains, usernames, documents, and clues. Students can then practice DuckDuckGo searching without targeting real people or systems.</p>

      <p>Simulation Mode can evaluate methodology, query quality, evidence documentation, pivot selection, and final conclusions.</p>

      <h2>9. Learning Recommendations</h2>

      <p>If a student repeatedly creates overly broad queries, the system can recommend a query-engineering lesson. If the student finds useful sources but fails to preserve evidence, the system can recommend the evidence-preservation lesson.</p>

      <h2>10. Reporting</h2>

      <p>Validated findings can flow into the report generator. A report can contain the query, source, finding, evidence, confidence, and relationship to other entities.</p>

      <h2>11. Example ForenX Workflow</h2>

      <pre><code>Investigation Objective
        ↓
DuckDuckGo
        ↓
Search Result
        ↓
AI Explanation
        ↓
Evidence Notebook
        ↓
Tool Recommendation
        ↓
DNS / WHOIS / crt.sh / Censys
        ↓
Correlation Engine
        ↓
AI-Assisted Interpretation
        ↓
Investigation Report</code></pre>

      <h2>12. Educational Principle</h2>

      <p>ForenX should teach students to use AI as an assistant rather than as an unquestioned authority. The learner remains responsible for validating sources and deciding whether the evidence supports a conclusion.</p>
    `,
    keyPoints: [
      "DuckDuckGo can function as a search module inside ForenX",
      "AI can explain query construction",
      "AI-generated suggestions are not evidence",
      "Tool recommendations can guide beginners through investigations",
      "The evidence notebook should preserve search context",
      "The Correlation Engine should make relationships explainable",
      "Simulation Mode provides a safe educational environment"
    ],
    example:
      "User objective → AI query explanation → DuckDuckGo discovery → evidence notebook → recommended DNS/certificate tool → correlation → report.",
    estimatedTime: 60,
    order: 6,
    difficulty: "Advanced",
    prerequisites: [
      "Advanced Pivoting and Cross-Tool Correlation"
    ]
  },

  {
    lessonNumber: 7,
    title: "Evidence Preservation and Practical DuckDuckGo Lab",
    shortDescription:
      "Conduct a controlled fictional investigation using DuckDuckGo while recording queries, sources, timestamps, pivots, confidence, and evidence.",
    objectives: [
      "Conduct a structured DuckDuckGo investigation",
      "Record search queries",
      "Preserve source context",
      "Build an evidence timeline",
      "Distinguish facts from hypotheses",
      "Prepare findings for reporting"
    ],
    content: `
      <h2>1. Lab Purpose</h2>

      <p>This laboratory exercise teaches students how to use DuckDuckGo in a structured OSINT investigation. The scenario is fictional and focuses on passive public-information discovery.</p>

      <h2>2. Fictional Organization</h2>

      <p>The fictional organization is <strong>Northstar Digital Intelligence</strong>. The fictional domain is <code>northstar.example</code>.</p>

      <p>Investigation objective: identify publicly documented information associated with the fictional organization and construct an evidence map.</p>

      <h2>3. Step One — Initial Discovery</h2>

      <pre><code>"Northstar Digital Intelligence"</code></pre>

      <p>Record useful results and note which ones appear directly relevant.</p>

      <h2>4. Step Two — Search Expansion</h2>

      <pre><code>"Northstar Digital Intelligence" research
"Northstar Digital Intelligence" report
"Northstar Digital Intelligence" cybersecurity
"Northstar Digital Intelligence" conference</code></pre>

      <p>Identify new terms discovered in the results.</p>

      <h2>5. Step Three — Document Discovery</h2>

      <pre><code>"Northstar Digital Intelligence" filetype:pdf
"Northstar Digital Intelligence" filetype:ppt</code></pre>

      <p>If a fictional document reveals a project name, treat that project name as a new pivot.</p>

      <h2>6. Step Four — Domain Search</h2>

      <pre><code>"northstar.example"
site:northstar.example
"northstar.example" documentation
"northstar.example" security</code></pre>

      <p>Record the source and timestamp for each useful result.</p>

      <h2>7. Step Five — Pivoting</h2>

      <p>Suppose the investigation identifies the fictional project <code>Project Aurora</code>.</p>

      <pre><code>"Project Aurora"
"Project Aurora" Northstar
"Project Aurora" security
"Project Aurora" filetype:pdf</code></pre>

      <p>Each search should have a documented purpose.</p>

      <h2>8. Evidence Table</h2>

      <table>
        <thead>
          <tr>
            <th>Evidence</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Evidence ID</td>
            <td>Unique identifier</td>
          </tr>
          <tr>
            <td>Query</td>
            <td>Exact search used</td>
          </tr>
          <tr>
            <td>Source</td>
            <td>Original page or document</td>
          </tr>
          <tr>
            <td>Timestamp</td>
            <td>Time observed</td>
          </tr>
          <tr>
            <td>Finding</td>
            <td>What the source demonstrates</td>
          </tr>
          <tr>
            <td>Confidence</td>
            <td>Strength of evidence</td>
          </tr>
          <tr>
            <td>Pivot</td>
            <td>Next investigation direction</td>
          </tr>
        </tbody>
      </table>

      <h2>9. Search Result Preservation</h2>

      <p>Search results change. A page can disappear, move, or change content. Investigators should preserve the relevant source context according to their evidence-handling procedures.</p>

      <p>Useful documentation may include screenshots where permitted, source URLs, timestamps, relevant excerpts, and notes describing why the source matters.</p>

      <h2>10. Timeline Construction</h2>

      <p>Separate the source's publication date from the investigator's observation date.</p>

      <pre><code>Source Published
      ↓
Historical Event
      ↓
Current Search Discovery
      ↓
Investigator Observation
      ↓
Independent Validation</code></pre>

      <h2>11. Confidence Classification</h2>

      <ul>
        <li><strong>Confirmed:</strong> Strong direct evidence.</li>
        <li><strong>Strongly supported:</strong> Multiple independent sources.</li>
        <li><strong>Probable:</strong> Good supporting evidence with some uncertainty.</li>
        <li><strong>Possible:</strong> Plausible hypothesis.</li>
        <li><strong>Unverified:</strong> Lead without sufficient support.</li>
      </ul>

      <h2>12. Lab Deliverables</h2>

      <ol>
        <li>Investigation objective</li>
        <li>Known identifiers</li>
        <li>At least ten search queries</li>
        <li>At least five useful findings</li>
        <li>Source URLs</li>
        <li>Confidence classifications</li>
        <li>At least three pivots</li>
        <li>Timeline</li>
        <li>Evidence graph</li>
        <li>Final conclusion</li>
      </ol>

      <h2>13. Safety Boundary</h2>

      <p>This laboratory is passive. Do not attempt credential attacks, unauthorized access, vulnerability exploitation, service disruption, or intrusive testing. The objective is search-based intelligence collection and evidence analysis.</p>

      <h2>14. Reflection Questions</h2>

      <ol>
        <li>Which query produced the most useful result?</li>
        <li>Which source required validation?</li>
        <li>Which identifier became the best pivot?</li>
        <li>Which findings were only hypotheses?</li>
        <li>How would another investigator reproduce the work?</li>
      </ol>
    `,
    keyPoints: [
      "Document the exact query used to discover important information",
      "Preserve source context and observation time",
      "Use confidence levels to separate facts from hypotheses",
      "Build timelines using source dates and observation dates",
      "Every pivot should have a documented purpose",
      "The lab should remain passive and fictional"
    ],
    example:
      "Evidence E-003: Query = \"Northstar Digital Intelligence\" filetype:pdf; Finding = fictional public report; Pivot = project identifier discovered inside the report.",
    estimatedTime: 75,
    order: 7,
    difficulty: "Advanced",
    prerequisites: [
      "DuckDuckGo in ForenX AI LearnOSINT",
      "Advanced Pivoting and Cross-Tool Correlation"
    ]
  },

  {
    lessonNumber: 8,
    title: "Complete DuckDuckGo Investigation and Final Assessment",
    shortDescription:
      "Apply the complete DuckDuckGo OSINT methodology from planning and discovery through query refinement, pivoting, validation, evidence preservation, and reporting.",
    objectives: [
      "Plan a complete search-based investigation",
      "Use progressive query refinement",
      "Perform multiple investigation pivots",
      "Validate important findings",
      "Document evidence and uncertainty",
      "Produce a professional OSINT report"
    ],
    content: `
      <h2>1. From Search to Professional OSINT</h2>

      <p>The purpose of learning DuckDuckGo is not to memorize a collection of search operators. The real objective is to develop an investigation methodology that can be repeated, documented, validated, and explained.</p>

      <p>A professional workflow can be summarized as:</p>

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

      <p>Start by writing a precise investigation question. For example:</p>

      <blockquote>
        Identify publicly documented technical and organizational information associated with the fictional organization Atlas Digital Research.
      </blockquote>

      <p>Break the question into smaller objectives:</p>

      <ul>
        <li>Identify public organization references.</li>
        <li>Identify relevant domains.</li>
        <li>Locate public documents.</li>
        <li>Identify project names.</li>
        <li>Identify publicly documented technologies.</li>
        <li>Establish historical context.</li>
      </ul>

      <h2>3. Phase Two — Initial Discovery</h2>

      <pre><code>"Atlas Digital Research"
"Atlas Digital Research" research
"Atlas Digital Research" report
"Atlas Digital Research" technology</code></pre>

      <p>At this stage, focus on collecting terminology and identifying potential pivots.</p>

      <h2>4. Phase Three — Query Refinement</h2>

      <p>Once useful identifiers are known, introduce more precise searches.</p>

      <pre><code>"Atlas Digital Research" filetype:pdf
"Atlas Digital Research" cybersecurity
site:example.org "Atlas Digital Research"
"Atlas Digital Research" conference</code></pre>

      <p>Compare results between broad and narrow searches.</p>

      <h2>5. Phase Four — Pivoting</h2>

      <p>Suppose a public document identifies the fictional project <code>Project Aurora</code>. Search the project independently.</p>

      <pre><code>"Project Aurora"
"Project Aurora" Atlas
"Project Aurora" security
"Project Aurora" filetype:pdf</code></pre>

      <p>If a hostname is discovered, investigate that hostname separately. If a username is discovered, perform appropriate username research. Each pivot should be justified.</p>

      <h2>6. Phase Five — Cross-Source Validation</h2>

      <p>Important findings should be compared with independent sources. A search result can provide a lead, while an official document or another reliable source can provide stronger confirmation.</p>

      <p>Possible validation sources include:</p>

      <ul>
        <li>Official websites</li>
        <li>Public documents</li>
        <li>WHOIS information</li>
        <li>DNS records</li>
        <li>Certificate transparency</li>
        <li>Historical archives</li>
        <li>Independent publications</li>
      </ul>

      <h2>7. Phase Six — Attribution</h2>

      <p>Attribution requires caution. Similar names, shared infrastructure, and copied content can produce false relationships.</p>

      <p>For example:</p>

      <pre><code>Same username
      ≠
Same person</code></pre>

      <pre><code>Same IP
      ≠
Same organization</code></pre>

      <pre><code>Same certificate
      ≠
Automatic ownership proof</code></pre>

      <p>Additional evidence is required before making strong attribution claims.</p>

      <h2>8. Phase Seven — Temporal Analysis</h2>

      <p>Search results and web pages represent information at particular points in time. A page published five years ago should not automatically be treated as evidence of the present situation.</p>

      <p>Record:</p>

      <ul>
        <li>Publication date</li>
        <li>Last modification date where available</li>
        <li>Investigator observation date</li>
        <li>Historical archive date</li>
      </ul>

      <h2>9. Phase Eight — Evidence Preservation</h2>

      <p>Preserve relevant information according to the investigation's evidence-handling procedures. Record source URLs, search queries, timestamps, screenshots where permitted, and relevant context.</p>

      <p>The evidence notebook should separate:</p>

      <ul>
        <li>Raw observation</li>
        <li>Interpretation</li>
        <li>Correlation</li>
        <li>Hypothesis</li>
        <li>Conclusion</li>
      </ul>

      <h2>10. Phase Nine — ForenX Integration</h2>

      <p>ForenX AI LearnOSINT can convert the DuckDuckGo workflow into a guided educational process.</p>

      <pre><code>DuckDuckGo Discovery
        ↓
AI Mentor Explanation
        ↓
Evidence Notebook
        ↓
Tool Recommendation
        ↓
DNS / WHOIS / crt.sh / Censys
        ↓
Correlation Engine
        ↓
Confidence Assessment
        ↓
Report Generator</code></pre>

      <p>The AI Mentor can explain why a query is useful and recommend appropriate next steps. However, AI suggestions must remain separate from validated evidence.</p>

      <h2>11. Phase Ten — Final Reporting</h2>

      <p>A professional report should contain:</p>

      <ol>
        <li>Executive summary</li>
        <li>Investigation objective</li>
        <li>Scope and limitations</li>
        <li>Methodology</li>
        <li>Search queries</li>
        <li>Important findings</li>
        <li>Source information</li>
        <li>Pivots</li>
        <li>Correlations</li>
        <li>Confidence assessment</li>
        <li>Timeline</li>
        <li>Conclusion</li>
      </ol>

      <h2>12. Common Beginner Mistakes</h2>

      <ul>
        <li>Using only one search query</li>
        <li>Using only one search engine</li>
        <li>Trusting the first result automatically</li>
        <li>Confusing snippets with evidence</li>
        <li>Failing to validate usernames</li>
        <li>Ignoring dates</li>
        <li>Over-filtering queries</li>
        <li>Collecting information without documenting sources</li>
        <li>Confusing correlation with proof</li>
        <li>Allowing AI-generated claims to become unsupported facts</li>
      </ul>

      <h2>13. Final Practical Assessment</h2>

      <p>Conduct a fictional OSINT investigation beginning with only an organization name. Use DuckDuckGo to identify relevant public information. Construct at least fifteen queries, perform at least five meaningful pivots, identify at least five findings, validate the most important findings through additional sources, and produce a final report.</p>

      <h3>Assessment Questions</h3>

      <ol>
        <li>What is DuckDuckGo used for in OSINT?</li>
        <li>Why should search results not automatically be treated as evidence?</li>
        <li>Why are exact phrase searches useful?</li>
        <li>What is the purpose of the site: operator?</li>
        <li>What is filetype: useful for?</li>
        <li>What are DuckDuckGo bangs?</li>
        <li>Why can search-engine diversity improve discovery?</li>
        <li>What is an OSINT pivot?</li>
        <li>Why should usernames be independently validated?</li>
        <li>Why should observation dates be recorded?</li>
        <li>What is the difference between a lead and a confirmed finding?</li>
        <li>Why is source independence important?</li>
        <li>How can DNS validate a domain relationship?</li>
        <li>How can certificate transparency provide a pivot?</li>
        <li>How can ForenX AI assist without replacing investigator judgment?</li>
      </ol>

      <h2>14. Professional Checklist</h2>

      <ul>
        <li>☐ Define the investigation objective</li>
        <li>☐ Establish scope</li>
        <li>☐ Record known identifiers</li>
        <li>☐ Perform broad discovery</li>
        <li>☐ Refine queries progressively</li>
        <li>☐ Use appropriate operators</li>
        <li>☐ Search alternate terminology</li>
        <li>☐ Record important queries</li>
        <li>☐ Preserve source URLs</li>
        <li>☐ Record timestamps</li>
        <li>☐ Validate important findings</li>
        <li>☐ Perform justified pivots</li>
        <li>☐ Correlate independent sources</li>
        <li>☐ Assign confidence levels</li>
        <li>☐ Document limitations</li>
        <li>☐ Produce a reproducible report</li>
      </ul>

      <h2>15. Final Takeaway</h2>

      <p>DuckDuckGo is a useful component of a modern OSINT workflow because it provides another environment for discovering publicly indexed information. Its greatest value comes from how investigators use the information they discover. A search result is only the beginning of an investigation.</p>

      <p>Professional investigators search systematically, expand queries when necessary, recognize new identifiers, perform justified pivots, compare independent sources, preserve evidence, and communicate uncertainty.</p>

      <p>Within ForenX AI LearnOSINT, DuckDuckGo can become part of a broader educational pipeline where students learn search techniques, receive AI explanations, discover related tools, record evidence, correlate findings, and generate structured investigation reports.</p>

      <p>The central lesson is simple:</p>

      <blockquote>
        Search → Verify → Pivot → Correlate → Preserve → Report.
      </blockquote>

      <p>Following this process allows a learner to move from basic web searching toward disciplined OSINT investigation.</p>
    `,
    keyPoints: [
      "A complete OSINT investigation begins with a defined objective",
      "Search progressively from broad discovery to precise queries",
      "Every useful discovery can become a justified pivot",
      "Important claims require independent validation",
      "Dates and source provenance are essential",
      "AI should assist reasoning without replacing evidence validation",
      "Professional OSINT ends with documented and reproducible reporting"
    ],
    example:
      "Complete workflow: Organization → DuckDuckGo → public document → project identifier → additional searches → DNS/certificate validation → correlation → evidence notebook → final report.",
    estimatedTime: 80,
    order: 8,
    difficulty: "Advanced",
    prerequisites: [
      "DuckDuckGo Fundamentals for OSINT",
      "Basic DuckDuckGo Searching and Query Construction",
      "Advanced Search Operators and Bangs",
      "DuckDuckGo for Practical OSINT Investigation",
      "Advanced Pivoting and Cross-Tool Correlation",
      "DuckDuckGo in ForenX AI LearnOSINT",
      "Evidence Preservation and Practical DuckDuckGo Lab"
    ]
  }
];

module.exports = toolLessons;