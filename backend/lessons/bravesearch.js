const toolLessons = [
  {
    lessonNumber: 1,
    title: "Brave Search Fundamentals for OSINT",
    shortDescription:
      "Understand Brave Search, its privacy-oriented design, search index, result structure, and why it is useful in open-source intelligence investigations.",
    objectives: [
      "Understand what Brave Search is and how it differs from traditional search engines",
      "Understand the role of search engines in OSINT investigations",
      "Learn how to construct useful investigative search queries",
      "Understand search result pages, snippets, domains, and source context",
      "Learn the limitations of search engines as OSINT sources",
      "Develop a disciplined approach to validating information discovered through Brave Search"
    ],
    content: `
      <h2>1. Introduction to Brave Search</h2>
      <p>Brave Search is a privacy-focused web search engine designed to provide search results without relying on the same tracking-oriented model commonly associated with large advertising platforms. For an OSINT investigator, the important point is not simply that Brave Search provides another place to type a query. It provides an additional search environment that can be used to discover publicly indexed information, compare search results, identify alternative sources, and reduce dependence on a single search provider.</p>

      <p>Open-source intelligence depends heavily on information that is publicly accessible. Search engines act as discovery layers over a large portion of the public web. They help investigators locate websites, documents, news articles, technical pages, public reports, forums, repositories, organizational information, and other resources. However, a search engine does not contain the entire Internet. It indexes a subset of publicly accessible content, and its ranking system determines which results are displayed prominently.</p>

      <h2>2. Why Search Diversity Matters in OSINT</h2>
      <p>A common beginner mistake is to perform one search on one search engine and assume that the returned results represent everything that exists. This is dangerous during an investigation. Different search engines may discover, rank, filter, or present different pages. A useful OSINT workflow therefore treats search engines as complementary discovery sources.</p>

      <p>For example, an investigator researching a fictional organization called Northstar Research could begin with a simple query such as <code>"Northstar Research"</code>. The investigator can then compare the results with searches for the organization's domain, employees, documents, technical infrastructure, and historical references.</p>

      <pre><code>"Northstar Research"
"Northstar Research" technology
"Northstar Research" filetype:pdf
"Northstar Research" site:example.org</code></pre>

      <h2>3. Understanding a Search Result</h2>
      <p>A typical result contains several pieces of information. The title gives an initial indication of the page topic. The URL or domain identifies the source location. The description or snippet provides a short section of surrounding text. Search results may also expose dates, breadcrumbs, document types, or other contextual information.</p>

      <p>Investigators should never treat a search snippet as final evidence. A snippet is a discovery clue. The investigator should open the underlying source whenever possible, examine the complete page, record the URL, identify the publisher, determine the publication or modification date where available, and compare the information against independent sources.</p>

      <h2>4. Search Queries as Investigative Hypotheses</h2>
      <p>An effective OSINT query is more than a collection of keywords. It represents a hypothesis about where information may exist. Suppose an investigator knows only that a fictional company operates a domain called <code>northstar.example</code>. Instead of repeatedly searching the company name, the investigator can formulate separate questions.</p>

      <ul>
        <li>What public pages mention the organization?</li>
        <li>What documents are associated with the organization?</li>
        <li>What technologies are publicly discussed?</li>
        <li>What employees or public representatives are associated with it?</li>
        <li>Are historical references available?</li>
        <li>Are there publicly indexed subdomains or files?</li>
      </ul>

      <p>Each question can become a separate search strategy. This produces a structured investigation rather than random browsing.</p>

      <h2>5. Query Construction</h2>
      <p>Begin with the smallest useful query and gradually increase specificity. Broad queries are useful during discovery, while specific queries are useful during validation and pivoting.</p>

      <pre><code>Northstar Research
"Northstar Research"
"Northstar Research" cybersecurity
"Northstar Research" report
"Northstar Research" filetype:pdf</code></pre>

      <p>Quotation marks are particularly useful when searching for an exact phrase. Exact phrase searching can reduce unrelated results when a name, identifier, organization, project title, or distinctive phrase is known.</p>

      <h2>6. Search Engine Results Are Not Evidence by Themselves</h2>
      <p>Search rankings should not be interpreted as reliability rankings. A page appearing first does not automatically mean that it is authoritative. Search ranking can depend on many factors, including relevance and popularity. An investigator should therefore separate three concepts: discovery, validation, and evidence.</p>

      <ol>
        <li><strong>Discovery:</strong> Find potentially relevant sources.</li>
        <li><strong>Validation:</strong> Determine whether the source actually supports the claim.</li>
        <li><strong>Evidence:</strong> Preserve the relevant information and its provenance.</li>
      </ol>

      <h2>7. Privacy and Investigation Discipline</h2>
      <p>Brave Search emphasizes privacy, which can be useful when conducting legitimate research where minimizing unnecessary tracking is desirable. Privacy, however, does not eliminate the need for operational discipline. Investigators should still follow organizational policies, legal requirements, authorization boundaries, and evidence-handling procedures.</p>

      <h2>8. Beginner OSINT Exercise</h2>
      <p>Use a fictional organization such as <code>Northstar Research</code>. Perform these searches:</p>

      <pre><code>"Northstar Research"
"Northstar Research" report
"Northstar Research" filetype:pdf
"Northstar Research" technology
"Northstar Research" contact</code></pre>

      <p>For every useful result, record the title, URL, source organization, apparent date, and why the result is relevant. Do not record search ranking as proof of credibility.</p>

      <h2>Investigator Mindset</h2>
      <p>The most important skill is not knowing a particular search engine. It is learning how to transform an investigation question into a sequence of increasingly precise searches. Brave Search becomes valuable when it is used as one component of a repeatable OSINT methodology.</p>
    `,
    keyPoints: [
      "Brave Search can be used as an additional OSINT discovery source",
      "Search results are discovery clues rather than automatic evidence",
      "Exact phrase searching can reduce unrelated results",
      "Different search engines may produce different useful results",
      "Every important discovery should be validated against the underlying source",
      "A good investigator converts investigation questions into structured queries"
    ],
    example: `"Northstar Research" filetype:pdf`,
    estimatedTime: 35,
    order: 1,
    difficulty: "Beginner",
    prerequisites: []
  },

  {
    lessonNumber: 2,
    title: "Basic Searching and Query Construction",
    shortDescription:
      "Learn practical Brave Search techniques for names, domains, organizations, documents, technical terms, and public information.",
    objectives: [
      "Perform effective basic searches",
      "Use exact phrase searches",
      "Combine keywords systematically",
      "Search for organizations and domains",
      "Find public documents and technical information",
      "Reduce irrelevant search results"
    ],
    content: `
      <h2>1. Building a Search From Known Information</h2>
      <p>OSINT investigations often begin with a small amount of information. It may be an organization name, domain name, username, email address, project name, document title, or distinctive phrase. The first task is to convert this starting information into searchable forms.</p>

      <p>Suppose the starting point is the fictional organization <code>Orion Security Labs</code>. A weak investigation might repeatedly search the same phrase. A stronger approach creates a search matrix.</p>

      <table>
        <thead>
          <tr>
            <th>Objective</th>
            <th>Example Query</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Organization</td>
            <td>"Orion Security Labs"</td>
          </tr>
          <tr>
            <td>Documents</td>
            <td>"Orion Security Labs" filetype:pdf</td>
          </tr>
          <tr>
            <td>Technical references</td>
            <td>"Orion Security Labs" cybersecurity</td>
          </tr>
          <tr>
            <td>Reports</td>
            <td>"Orion Security Labs" report</td>
          </tr>
          <tr>
            <td>Contact information</td>
            <td>"Orion Security Labs" contact</td>
          </tr>
        </tbody>
      </table>

      <h2>2. Exact Phrase Searching</h2>
      <p>Quotation marks tell the search engine that a phrase is important as a unit. This is particularly useful for names, project titles, error messages, document titles, unique phrases, and organization names.</p>

      <pre><code>"Orion Security Labs"
"Orion Security Labs" "annual report"
"Orion Security Labs" "security research"</code></pre>

      <p>Exact phrase searching can also help investigate text fragments. If an investigator discovers a distinctive sentence in one public document, searching the exact phrase may reveal mirrors, citations, archived references, or duplicate publications.</p>

      <h2>3. Adding Context</h2>
      <p>When a query produces too many results, add contextual keywords. Context can represent an industry, country, technology, document type, department, event, or time period.</p>

      <pre><code>"Orion Security Labs" Kerala
"Orion Security Labs" cybersecurity
"Orion Security Labs" research
"Orion Security Labs" conference
"Orion Security Labs" PDF</code></pre>

      <p>However, investigators should avoid adding too many restrictions at once. Excessive constraints can hide useful results.</p>

      <h2>4. Searching Domains</h2>
      <p>Once an organization domain is known, domain-focused searching becomes highly useful. The <code>site:</code> operator can restrict results to a particular domain.</p>

      <pre><code>site:example.org security
site:example.org research
site:example.org filetype:pdf
site:example.org employees</code></pre>

      <p>This technique can reveal publicly indexed pages that may not be obvious through the site's normal navigation.</p>

      <h2>5. Searching Documents</h2>
      <p>Public documents are valuable OSINT sources because they can contain names, organizational relationships, technical terminology, project information, addresses, dates, and historical details. Search engines can help locate documents using file-type restrictions and keywords.</p>

      <pre><code>"Orion Security Labs" filetype:pdf
"Orion Security Labs" filetype:doc
"Orion Security Labs" filetype:ppt
"Orion Security Labs" filetype:xls</code></pre>

      <p>Not every indexed document should be downloaded or redistributed. Investigators should respect authorization, copyright, privacy, and applicable laws.</p>

      <h2>6. Excluding Unwanted Results</h2>
      <p>Search exclusions are useful when a common term produces a large amount of irrelevant material. For example:</p>

      <pre><code>Orion security -football
"Orion Labs" -jobs
"Northstar Research" -fiction</code></pre>

      <p>Exclusion terms should be used carefully. Removing a word can also remove legitimate results that happen to contain that word.</p>

      <h2>7. Search Iteration</h2>
      <p>Professional searching is iterative. A useful result often creates the next query. If a page reveals an employee name, search the name. If a document reveals a project identifier, search the identifier. If a page reveals a subdomain, investigate the subdomain through appropriate passive tools.</p>

      <p>This process is called pivoting. The investigator should record each pivot so that the reasoning behind the investigation remains understandable.</p>

      <h2>8. Basic Practice Exercise</h2>
      <p>Create a fictional company called <code>Atlas Cyber Research</code>. Perform ten searches starting with the company name. Gradually introduce exact phrases, technical keywords, document types, and domain restrictions. Create a table containing query, result, source, relevance, and next pivot.</p>

      <p>The objective is to learn that searching is an investigative process rather than a single command.</p>
    `,
    keyPoints: [
      "Start with known information and progressively add context",
      "Use quotation marks for important exact phrases",
      "Use site-focused searches when a domain is known",
      "Public documents can contain valuable contextual information",
      "Exclusion terms can reduce noise",
      "Every useful result can become a pivot for the next search"
    ],
    example: `site:example.org filetype:pdf "security report"`,
    estimatedTime: 40,
    order: 2,
    difficulty: "Beginner",
    prerequisites: ["Brave Search Fundamentals for OSINT"]
  },

  {
    lessonNumber: 3,
    title: "Advanced Search Operators and Query Engineering",
    shortDescription:
      "Learn advanced query construction techniques for narrowing searches, locating specific resources, and creating repeatable OSINT search strategies.",
    objectives: [
      "Understand advanced search operators",
      "Combine multiple operators",
      "Use site and filetype restrictions",
      "Use title and URL-focused searches where supported",
      "Design investigative query patterns",
      "Avoid overly restrictive and noisy queries"
    ],
    content: `
      <h2>1. Why Query Engineering Matters</h2>
      <p>Query engineering is the process of designing search queries that efficiently locate information relevant to an investigative question. A search query can be viewed as a filter. The investigator starts with a broad information space and progressively narrows it using known identifiers and contextual clues.</p>

      <p>A well-designed query should have a purpose. Before entering a query, ask what you are trying to discover. For example, "find public PDF reports mentioning the organization" is a specific objective. The resulting query can then be constructed around that objective.</p>

      <h2>2. The site: Operator</h2>
      <p>The <code>site:</code> operator is one of the most useful search operators for OSINT. It restricts results to a particular domain or site.</p>

      <pre><code>site:example.org security
site:example.org "annual report"
site:example.org filetype:pdf
site:example.org research</code></pre>

      <p>It can also be useful for investigating major public platforms where an organization's content may appear.</p>

      <pre><code>site:github.com "Example Organization"
site:linkedin.com "Example Organization"
site:reddit.com "Example Organization"</code></pre>

      <p>The investigator should remember that search indexing is incomplete. A site search does not prove that no other pages exist.</p>

      <h2>3. The filetype: Operator</h2>
      <p>The <code>filetype:</code> operator can focus searches on particular document formats.</p>

      <pre><code>filetype:pdf "security assessment"
filetype:ppt "incident response"
filetype:doc "project report"
filetype:xls "asset inventory"</code></pre>

      <p>Documents often contain information that is less visible on ordinary web pages. Search results should still be validated by opening the source and checking the context.</p>

      <h2>4. Title and URL Searching</h2>
      <p>Search systems may support operators such as <code>intitle:</code> and <code>inurl:</code> for focusing queries on page titles and URL text. Availability and behavior can vary, so investigators should test operators rather than assuming every search engine implements every operator identically.</p>

      <pre><code>intitle:"security report"
intitle:documentation authentication
inurl:research cybersecurity
inurl:report "incident"</code></pre>

      <p>These searches are especially useful when looking for predictable document or page naming patterns.</p>

      <h2>5. Combining Operators</h2>
      <p>Operators become more powerful when combined. For example:</p>

      <pre><code>site:example.org filetype:pdf "incident response"
site:example.org intitle:report cybersecurity
site:example.org inurl:research filetype:pdf</code></pre>

      <p>The goal is not to create the longest possible query. The goal is to create the smallest query that accurately represents the investigation objective.</p>

      <h2>6. Avoiding Over-Filtering</h2>
      <p>A query can become too specific. Consider an investigator who knows an organization published a security report but does not know its exact title. Adding the organization's name, exact title, exact year, filetype, URL structure, and several keywords may return zero results even if the document is publicly indexed.</p>

      <p>A better workflow starts broad and progressively adds restrictions.</p>

      <ol>
        <li>Search the organization name.</li>
        <li>Add the document topic.</li>
        <li>Add filetype if necessary.</li>
        <li>Add domain restrictions when appropriate.</li>
        <li>Try alternate terminology.</li>
      </ol>

      <h2>7. Alternate Vocabulary</h2>
      <p>Different organizations use different terminology for similar concepts. A security incident might be described as an incident, breach, event, compromise, intrusion, or investigation. An investigator should therefore maintain a vocabulary list.</p>

      <pre><code>"Example Corp" breach
"Example Corp" incident
"Example Corp" compromise
"Example Corp" intrusion
"Example Corp" "security event"</code></pre>

      <p>This can dramatically improve discovery coverage.</p>

      <h2>8. Query Documentation</h2>
      <p>Record important queries in the investigation notebook. Query documentation provides reproducibility. If another investigator reviews the case, they should understand what was searched and why.</p>

      <p>For each significant query record the query text, timestamp, purpose, useful results, rejected results, and resulting pivots.</p>

      <h2>Practical Query Exercise</h2>
      <p>For the fictional domain <code>atlas.example</code>, create queries for public reports, research pages, documentation, PDF files, and security information. Start with broad searches and progressively refine them. Compare which queries produce useful results and which become too restrictive.</p>
    `,
    keyPoints: [
      "Query engineering turns investigation questions into searchable hypotheses",
      "site: is useful for domain-focused discovery",
      "filetype: can help locate public documents",
      "intitle: and inurl: may help locate predictable resources",
      "Operators should be combined carefully",
      "Alternate vocabulary improves discovery coverage",
      "Important queries should be documented for reproducibility"
    ],
    example: `site:example.org filetype:pdf intitle:"security report"`,
    estimatedTime: 50,
    order: 3,
    difficulty: "Intermediate",
    prerequisites: [
      "Brave Search Fundamentals for OSINT",
      "Basic Searching and Query Construction"
    ]
  },

  {
    lessonNumber: 4,
    title: "Brave Search for OSINT Investigation",
    shortDescription:
      "Apply Brave Search to organization, domain, document, technical, username, and public-information investigations.",
    objectives: [
      "Use Brave Search in structured OSINT investigations",
      "Find public information about organizations",
      "Investigate domains and technical terminology",
      "Perform document discovery",
      "Use search results as pivots",
      "Validate discovered information"
    ],
    content: `
      <h2>1. Search as an OSINT Collection Layer</h2>
      <p>In an OSINT investigation, Brave Search can act as a collection and discovery layer. The investigator does not necessarily expect the search engine to answer every question. Instead, the search engine helps identify sources that can answer those questions.</p>

      <p>For example, if investigating a fictional domain <code>orion.example</code>, the search process may reveal the organization's main website, documentation, public reports, employee references, conference material, repositories, news articles, and third-party references.</p>

      <h2>2. Organization Investigation</h2>
      <p>Begin with the organization's exact name and common variations.</p>

      <pre><code>"Orion Security"
"Orion Security Labs"
"Orion Security" research
"Orion Security" conference
"Orion Security" report</code></pre>

      <p>Record alternative names discovered during the process. An organization may use a legal name, brand name, abbreviated name, product name, or former name. These variants can become additional pivots.</p>

      <h2>3. Domain Investigation</h2>
      <p>Once a domain is known, search for references to it.</p>

      <pre><code>"orion.example"
site:orion.example
"orion.example" documentation
"orion.example" security
"orion.example" filetype:pdf</code></pre>

      <p>Searching the domain as an exact phrase can reveal third-party references where the domain itself is mentioned.</p>

      <h2>4. Technical Information Discovery</h2>
      <p>Search engines can expose publicly indexed technical discussions and documentation. Queries can target technologies, products, frameworks, error messages, configuration terminology, and documentation.</p>

      <pre><code>"orion.example" nginx
"orion.example" API
"orion.example" documentation
"orion.example" "security header"
"orion.example" "login"</code></pre>

      <p>Such searches should remain passive. Discovering a technical reference does not authorize active testing of the system.</p>

      <h2>5. Username and Identity Pivoting</h2>
      <p>Publicly known usernames can be searched across indexed sources. For example:</p>

      <pre><code>"orion_researcher"
"orion_researcher" security
"orion_researcher" GitHub
"orion_researcher" conference</code></pre>

      <p>Search results must be validated carefully. A matching username does not automatically prove that multiple accounts belong to the same person.</p>

      <h2>6. Document Discovery</h2>
      <p>Documents can provide historical and organizational context. Useful queries include:</p>

      <pre><code>"Orion Security" filetype:pdf
"Orion Security" filetype:ppt
"Orion Security" filetype:doc
"Orion Security" "annual report"</code></pre>

      <p>When a document is discovered, record its title, source, URL, publication date, author if available, and relevant sections.</p>

      <h2>7. Source Validation</h2>
      <p>Validation should answer several questions:</p>

      <ul>
        <li>Who published the information?</li>
        <li>Is the source primary or secondary?</li>
        <li>When was it published?</li>
        <li>Does the source directly support the claim?</li>
        <li>Can an independent source confirm it?</li>
        <li>Could the information be outdated?</li>
      </ul>

      <p>Primary sources generally deserve more weight for claims about the source's own activities. Third-party sources may still be valuable for independent confirmation.</p>

      <h2>8. Search Result Pivoting</h2>
      <p>Suppose a public report reveals a project codename called <code>Project Aurora</code>. The next step is not necessarily another search for the original company. Search the newly discovered identifier.</p>

      <pre><code>"Project Aurora"
"Project Aurora" security
"Project Aurora" "Orion Security"
"Project Aurora" filetype:pdf</code></pre>

      <p>This creates a graph of investigation entities: organization → document → project → technology → people → additional documents.</p>

      <h2>9. False Association Risk</h2>
      <p>Search engines frequently return similarly named organizations, people, products, and projects. Investigators should not merge entities simply because names match. Correlation requires supporting attributes such as domain, location, organization, dates, unique identifiers, or independent sources.</p>

      <h2>Practical Investigation</h2>
      <p>Use a fictional company and investigate only publicly available information. Begin with its name, identify its domain, locate public documents, identify technical terminology, and record at least five independent sources. Mark each finding as confirmed, probable, or unverified.</p>
    `,
    keyPoints: [
      "Use Brave Search as a discovery and pivoting layer",
      "Search organization names and domain names separately",
      "Technical discoveries must not be treated as authorization for active testing",
      "Usernames require careful identity validation",
      "Documents can provide historical and organizational context",
      "Avoid merging similarly named entities without supporting evidence"
    ],
    example: `"orion.example" filetype:pdf security`,
    estimatedTime: 55,
    order: 4,
    difficulty: "Intermediate",
    prerequisites: [
      "Advanced Search Operators and Query Engineering"
    ]
  },

  {
    lessonNumber: 5,
    title: "Advanced Pivoting and Cross-Tool Correlation",
    shortDescription:
      "Learn how Brave Search can connect with passive OSINT tools to build a structured investigation graph and validate findings.",
    objectives: [
      "Understand OSINT pivoting",
      "Combine Brave Search with domain intelligence tools",
      "Correlate search findings with DNS information",
      "Use passive certificate and historical sources",
      "Identify and avoid false correlations",
      "Build an investigation graph"
    ],
    content: `
      <h2>1. What Is Pivoting?</h2>
      <p>Pivoting means using one discovered piece of information to locate another related piece of information. A search result may reveal a domain. The domain can lead to DNS information. DNS information can reveal hostnames. Hostnames can become search terms. A document can reveal a project name, which can become another query.</p>

      <p>Effective OSINT investigations therefore behave like graphs rather than straight lines.</p>

      <pre><code>Organization
    |
    +---- Domain
    |       |
    |       +---- DNS
    |       +---- Certificates
    |       +---- Historical records
    |
    +---- Documents
    |       |
    |       +---- Project names
    |       +---- People
    |
    +---- Public profiles
            |
            +---- Usernames
            +---- Repositories</code></pre>

      <h2>2. Brave Search to WHOIS</h2>
      <p>Suppose Brave Search reveals the domain <code>orion.example</code>. The investigator can use a WHOIS tool to examine registration information where publicly available.</p>

      <p>The important workflow is to treat each source independently. A WHOIS record can provide registration-related information, while Brave Search may provide public references to the organization. Agreement between sources can strengthen confidence.</p>

      <h2>3. Brave Search to DNS Lookup</h2>
      <p>If a hostname appears in a public document, passive DNS lookup can help determine relevant DNS records.</p>

      <pre><code>site:example.org "api"
site:example.org "mail"
"api.example.org"</code></pre>

      <p>The resulting hostname can be investigated through appropriate DNS tools. The investigator should remain within passive and authorized boundaries.</p>

      <h2>4. Brave Search to crt.sh</h2>
      <p>Certificate transparency information can reveal certificates associated with domains. If a certificate-related hostname is discovered, search engines can then be used to determine whether that hostname has public references.</p>

      <pre><code>"dev.example.org"
"staging.example.org"
"api.example.org"</code></pre>

      <p>Not every certificate hostname represents an active public service. It must be validated using multiple sources.</p>

      <h2>5. Brave Search to Wayback Machine</h2>
      <p>Search results describe what is currently indexed or publicly referenced, while historical archives can provide older versions of pages. If a current page references a historical project, the Wayback Machine may help determine when the information was previously published.</p>

      <p>Historical evidence is especially useful for understanding changes in branding, technology, organizational structure, and public documentation.</p>

      <h2>6. Brave Search and VirusTotal</h2>
      <p>When an investigator discovers a domain, URL, or file hash in public information, VirusTotal may provide additional threat-intelligence context. The investigator should understand that the presence of an indicator in a security database does not automatically mean that the associated organization or system is malicious.</p>

      <p>Indicators must be interpreted using context, timestamps, detections, relationships, and independent evidence.</p>

      <h2>7. Brave Search and Username Tools</h2>
      <p>A public article may reveal a username. That username can become a pivot for tools such as Sherlock or Maigret. Search-engine results and username-tool results should be treated as separate evidence streams.</p>

      <pre><code>"atlas_researcher"
"atlas_researcher" GitHub
"atlas_researcher" security</code></pre>

      <p>A username match should be considered a lead until identity is independently supported.</p>

      <h2>8. Correlation Confidence</h2>
      <p>A useful approach is to classify relationships:</p>

      <ul>
        <li><strong>Confirmed:</strong> Directly supported by a reliable source.</li>
        <li><strong>Strongly supported:</strong> Multiple independent attributes agree.</li>
        <li><strong>Probable:</strong> Several clues suggest a relationship but evidence is incomplete.</li>
        <li><strong>Possible:</strong> A hypothesis requiring additional validation.</li>
        <li><strong>Rejected:</strong> Evidence contradicts the proposed relationship.</li>
      </ul>

      <h2>9. Example Correlation Chain</h2>
      <p>Imagine Brave Search finds a public report containing <code>researcher@orion.example</code>. The investigator can search the email domain, inspect the organization's public website, identify the domain, review public DNS information, search certificate transparency records, and inspect historical references. Each discovery should be recorded separately.</p>

      <p>The final conclusion should never be stronger than the evidence supporting it.</p>

      <h2>10. Practical Correlation Exercise</h2>
      <p>Create a fictional investigation beginning with an organization name. Use Brave Search to identify a domain and public document. Then conceptually pivot to WHOIS, DNS Lookup, crt.sh, and Wayback Machine. Create an investigation graph showing every relationship and label each relationship with its confidence level.</p>
    `,
    keyPoints: [
      "Pivoting converts one discovery into another investigation lead",
      "Search results can connect domains, documents, people, and technical indicators",
      "WHOIS, DNS, certificate transparency, archives, and threat intelligence provide different evidence",
      "Username matches require identity validation",
      "Correlations should be assigned confidence levels",
      "Independent sources strengthen investigative conclusions"
    ],
    example: `"api.example.org" "Orion Security"`,
    estimatedTime: 60,
    order: 5,
    difficulty: "Advanced",
    prerequisites: [
      "Advanced Search Operators and Query Engineering",
      "Brave Search for OSINT Investigation"
    ]
  },

  {
    lessonNumber: 6,
    title: "Brave Search in ForenX AI LearnOSINT",
    shortDescription:
      "Learn how Brave Search can be integrated into the ForenX AI LearnOSINT educational workflow with AI guidance, tool recommendations, investigations, and reporting.",
    objectives: [
      "Understand the role of Brave Search inside ForenX AI LearnOSINT",
      "Use AI-assisted query generation responsibly",
      "Combine search with the Tool Explorer",
      "Record findings in an investigation workflow",
      "Use AI to explain search concepts and results",
      "Understand the limits of AI-generated investigative conclusions"
    ],
    content: `
      <h2>1. Purpose of Integration</h2>
      <p>ForenX AI LearnOSINT is designed as an educational environment where beginners can learn OSINT concepts through guided practice. Brave Search can therefore be treated not simply as an isolated search engine but as one component of a larger investigation workflow.</p>

      <p>The Tool Explorer can explain what Brave Search is, when it should be used, what types of information it can discover, and how its results can be correlated with other tools.</p>

      <h2>2. AI Mentor and Query Construction</h2>
      <p>A beginner may know the investigation objective but not know how to construct an effective query. An AI Mentor can help explain query construction and suggest multiple query strategies.</p>

      <p>For example, if a learner says, "I want to find public reports from this fictional organization," the mentor can explain why a query such as:</p>

      <pre><code>"Example Organization" filetype:pdf report</code></pre>

      <p>may be more useful than repeatedly searching only the organization name.</p>

      <p>The AI should explain the reasoning behind a suggestion rather than simply producing a query.</p>

      <h2>3. AI Should Not Invent Evidence</h2>
      <p>A critical design principle is that AI-generated suggestions are not evidence. If the AI suggests that a domain may belong to an organization, the system should label that as a hypothesis until actual sources support it.</p>

      <p>ForenX can distinguish between:</p>

      <ul>
        <li>AI-generated recommendation</li>
        <li>User-observed search result</li>
        <li>Imported tool output</li>
        <li>Validated finding</li>
        <li>Investigator conclusion</li>
      </ul>

      <h2>4. Tool Recommendation</h2>
      <p>The platform can recommend the next tool based on the current investigation state. If Brave Search reveals a domain, the system may recommend WHOIS, DNS Lookup, crt.sh, or Wayback Machine. If a public username is discovered, the platform may recommend username investigation tools.</p>

      <p>This creates a guided workflow for beginners instead of forcing learners to memorize dozens of independent tools.</p>

      <h2>5. Investigation Notebook</h2>
      <p>Every useful discovery should be capable of being recorded in the investigation notebook. A finding can include:</p>

      <ul>
        <li>Finding title</li>
        <li>Search query</li>
        <li>Source URL</li>
        <li>Source type</li>
        <li>Date and time observed</li>
        <li>Relevant information</li>
        <li>Confidence level</li>
        <li>Related entities</li>
        <li>Investigator notes</li>
      </ul>

      <h2>6. Correlation Engine</h2>
      <p>The Correlation Engine can connect findings discovered through different modules. For example, a Brave Search result may identify a public hostname. DNS analysis may independently confirm that hostname. Certificate transparency may reveal the same hostname. The system can display these as related findings.</p>

      <p>Correlation should remain explainable. The learner should be able to see why two findings were linked.</p>

      <h2>7. Simulation Mode</h2>
      <p>Educational OSINT platforms benefit from fictional investigation scenarios. A simulation can provide a fictional company, domain, employee names, public documents, and controlled clues. Students can then practice search techniques without targeting real individuals or systems.</p>

      <p>ForenX can score learners based on investigation methodology rather than simply whether they find a particular answer.</p>

      <h2>8. AI Explanation of Results</h2>
      <p>An AI Mentor can explain technical search concepts in beginner-friendly language. If a student finds a search result containing a certificate hostname, the AI can explain what a certificate hostname is and why it may be a useful pivot.</p>

      <p>The AI should also teach uncertainty. A hostname discovered in a certificate does not automatically prove that the associated service is active or owned by a particular individual.</p>

      <h2>9. Learning Recommendations</h2>
      <p>If a student repeatedly struggles with search operators, the system can recommend a lesson on query engineering. If the student performs well with search but struggles with evidence preservation, the system can recommend the evidence-handling module.</p>

      <h2>10. Example ForenX Workflow</h2>
      <pre><code>Investigation Objective
        ↓
Brave Search
        ↓
Public Finding
        ↓
AI Explanation
        ↓
Select Related Tool
        ↓
WHOIS / DNS / crt.sh / Wayback
        ↓
Correlation Engine
        ↓
Evidence Notebook
        ↓
Investigation Report</code></pre>

      <p>This workflow turns an individual search technique into a complete educational investigation process.</p>
    `,
    keyPoints: [
      "Brave Search can be integrated into the ForenX investigation workflow",
      "AI suggestions should be clearly separated from evidence",
      "The AI Mentor can explain query reasoning",
      "Tool recommendations can guide beginners toward appropriate next steps",
      "The Correlation Engine can connect independent findings",
      "Simulation Mode provides a controlled environment for learning",
      "Investigation notebooks improve reproducibility"
    ],
    example: `User goal: "Find public reports about Example Organization" → AI suggests: "Example Organization" filetype:pdf report → learner records validated sources in the evidence notebook.`,
    estimatedTime: 55,
    order: 6,
    difficulty: "Advanced",
    prerequisites: [
      "Brave Search for OSINT Investigation",
      "Advanced Pivoting and Cross-Tool Correlation"
    ]
  },

  {
    lessonNumber: 7,
    title: "Evidence Preservation and Practical Investigation Lab",
    shortDescription:
      "Practice a complete controlled Brave Search investigation while documenting queries, sources, timestamps, findings, pivots, and evidence.",
    objectives: [
      "Conduct a structured search investigation",
      "Document search queries",
      "Preserve source information",
      "Distinguish leads from confirmed findings",
      "Build an evidence timeline",
      "Prepare findings for a final report"
    ],
    content: `
      <h2>1. Why Evidence Preservation Matters</h2>
      <p>Finding information is only one part of an OSINT investigation. An investigator must also demonstrate where the information came from and how it was obtained. Without proper documentation, an interesting discovery can become difficult to reproduce or verify later.</p>

      <p>Search results can change over time. Pages can be edited, removed, moved, or become inaccessible. Therefore, investigators should record relevant information as soon as it is discovered.</p>

      <h2>2. Controlled Practical Scenario</h2>
      <p>This lab uses a fictional organization called <strong>Northstar Digital Research</strong> and the fictional domain <code>northstar.example</code>. The scenario is intentionally fictional so that learners can practice methodology without investigating real people or organizations.</p>

      <h2>3. Investigation Objective</h2>
      <p>Your objective is to identify publicly available information associated with the fictional organization and construct a small evidence map.</p>

      <h3>Step 1: Initial Search</h3>
      <pre><code>"Northstar Digital Research"</code></pre>

      <p>Record useful results. For each result, record its title, URL, source type, and relevance.</p>

      <h3>Step 2: Search Variations</h3>
      <pre><code>"Northstar Digital Research" report
"Northstar Digital Research" research
"Northstar Digital Research" cybersecurity
"Northstar Digital Research" documentation</code></pre>

      <h3>Step 3: Document Search</h3>
      <pre><code>"Northstar Digital Research" filetype:pdf
"Northstar Digital Research" filetype:ppt</code></pre>

      <h3>Step 4: Domain Search</h3>
      <pre><code>"northstar.example"
site:northstar.example
"northstar.example" security
"northstar.example" documentation</code></pre>

      <h2>4. Evidence Record</h2>
      <p>Create an evidence record with the following fields:</p>

      <table>
        <thead>
          <tr>
            <th>Field</th>
            <th>Purpose</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Evidence ID</td>
            <td>Unique identifier</td>
          </tr>
          <tr>
            <td>Query</td>
            <td>Search used to locate the information</td>
          </tr>
          <tr>
            <td>Source URL</td>
            <td>Original source location</td>
          </tr>
          <tr>
            <td>Timestamp</td>
            <td>When the investigator observed it</td>
          </tr>
          <tr>
            <td>Description</td>
            <td>What the source contains</td>
          </tr>
          <tr>
            <td>Confidence</td>
            <td>Confirmed, probable, possible, or rejected</td>
          </tr>
          <tr>
            <td>Pivot</td>
            <td>Next investigation direction</td>
          </tr>
        </tbody>
      </table>

      <h2>5. Screenshot and Source Capture</h2>
      <p>Where organizational policy permits, investigators can preserve screenshots or copies of relevant public material. The preserved material should be associated with the original URL and observation time. A screenshot without source context is much less useful than a documented screenshot tied to an evidence record.</p>

      <h2>6. Hashing Evidence</h2>
      <p>If a file is legitimately acquired for an investigation, a cryptographic hash can be calculated to help demonstrate whether the file changed after acquisition. A hash does not prove that the underlying information is true; it helps establish integrity of the acquired artifact.</p>

      <h2>7. Building a Timeline</h2>
      <p>Arrange findings chronologically where dates are available. A timeline might contain a publication date, discovery timestamp, historical archive date, and subsequent validation event. Distinguish source dates from investigator observation dates.</p>

      <h2>8. Confidence Assessment</h2>
      <p>Do not mark every discovery as confirmed. A search result mentioning a company is a lead. A first-party document may provide stronger support. Independent confirmation from another reliable source can increase confidence.</p>

      <h2>9. Lab Deliverable</h2>
      <p>At the end of the lab, produce:</p>

      <ul>
        <li>At least ten documented queries</li>
        <li>At least five useful findings</li>
        <li>A list of source URLs</li>
        <li>A finding-confidence table</li>
        <li>An investigation timeline</li>
        <li>A relationship graph</li>
        <li>A short conclusion explaining what was and was not established</li>
      </ul>

      <h2>10. Important Safety Boundary</h2>
      <p>This exercise is passive. Do not attempt login bypasses, vulnerability exploitation, unauthorized scanning, credential attacks, or access to private systems. The objective is to learn information discovery and evidence-handling methodology.</p>

      <h2>Reflection Questions</h2>
      <ol>
        <li>Which query produced the most useful discovery?</li>
        <li>Which result required additional validation?</li>
        <li>Which findings were only hypotheses?</li>
        <li>What information could become a future pivot?</li>
        <li>How would another investigator reproduce your investigation?</li>
      </ol>
    `,
    keyPoints: [
      "Evidence must include source context and observation time",
      "Search results should be documented rather than merely remembered",
      "Screenshots should be linked to source URLs and timestamps",
      "Hashes help verify artifact integrity",
      "Confidence levels prevent unsupported conclusions",
      "Passive investigation is sufficient for learning search methodology"
    ],
    example: `Evidence E-004: Query = "Northstar Digital Research" filetype:pdf; Source = fictional public document; Observation time = recorded in notebook; Confidence = probable until independently validated.`,
    estimatedTime: 70,
    order: 7,
    difficulty: "Advanced",
    prerequisites: [
      "Brave Search in ForenX AI LearnOSINT",
      "Advanced Pivoting and Cross-Tool Correlation"
    ]
  },

  {
    lessonNumber: 8,
    title: "Complete Brave Search Investigation and Final Assessment",
    shortDescription:
      "Apply the complete Brave Search methodology from initial discovery through query expansion, pivoting, validation, evidence preservation, and reporting.",
    objectives: [
      "Perform a complete structured OSINT investigation",
      "Create an investigation plan",
      "Use progressive query refinement",
      "Perform cross-source validation",
      "Document evidence and uncertainty",
      "Prepare a professional investigation summary"
    ],
    content: `
      <h2>1. From Searching to Investigation</h2>
      <p>The final objective of learning Brave Search is not memorizing operators. It is learning how to conduct a disciplined investigation. A professional workflow begins with an objective, identifies known information, creates search hypotheses, discovers sources, validates findings, pivots to related information, preserves evidence, and communicates conclusions with appropriate confidence.</p>

      <h2>2. Investigation Planning</h2>
      <p>Before searching, write down the investigation question. For example: "Identify publicly documented technical and organizational information associated with the fictional organization Northstar Digital Research."</p>

      <p>Separate the objective into smaller questions:</p>

      <ul>
        <li>What names are associated with the organization?</li>
        <li>What domains are publicly associated with it?</li>
        <li>What documents are available?</li>
        <li>What technologies are mentioned?</li>
        <li>What public projects are associated with it?</li>
        <li>What historical information can be validated?</li>
      </ul>

      <h2>3. Phase One — Discovery</h2>
      <pre><code>"Northstar Digital Research"
"Northstar Digital Research" research
"Northstar Digital Research" report
"Northstar Digital Research" technology</code></pre>

      <p>At this stage, do not over-filter. The objective is to collect terminology and identify possible pivots.</p>

      <h2>4. Phase Two — Precision Searching</h2>
      <p>Once useful terminology is discovered, increase precision.</p>

      <pre><code>"Northstar Digital Research" filetype:pdf
"Northstar Digital Research" "security report"
site:northstar.example research
site:northstar.example filetype:pdf</code></pre>

      <p>Compare the results from broad and narrow searches. Record which query produced each useful source.</p>

      <h2>5. Phase Three — Pivoting</h2>
      <p>Suppose a document reveals the fictional project name <code>Project Aurora</code>. Search that identifier independently.</p>

      <pre><code>"Project Aurora"
"Project Aurora" security
"Project Aurora" "Northstar"
"Project Aurora" filetype:pdf</code></pre>

      <p>If a public hostname is discovered, it can become a pivot for passive DNS and certificate investigation. If a public username appears, it can become a pivot for username investigation. Every pivot should be justified.</p>

      <h2>6. Phase Four — Cross-Validation</h2>
      <p>Cross-validation is one of the most important steps. Consider a claim that a particular domain belongs to an organization. The investigator should look for multiple supporting sources rather than relying on one search result.</p>

      <p>Possible evidence streams include:</p>

      <ul>
        <li>Official organizational pages</li>
        <li>Public documents</li>
        <li>WHOIS information where available</li>
        <li>DNS information</li>
        <li>Certificate transparency records</li>
        <li>Historical archives</li>
        <li>Independent publications</li>
      </ul>

      <p>Different sources answer different questions. They should not be treated as interchangeable.</p>

      <h2>7. Phase Five — Evidence Assessment</h2>
      <p>For every important finding, ask whether the evidence directly supports the conclusion. Avoid statements such as "the search engine found this, therefore it is true." Instead, describe exactly what the source demonstrates.</p>

      <p>For example:</p>

      <blockquote>
        The public document explicitly lists the domain in its contact information.
      </blockquote>

      <p>This is stronger than:</p>

      <blockquote>
        The domain appeared in a search result near the organization name.
      </blockquote>

      <h2>8. Phase Six — Reporting</h2>
      <p>A professional OSINT report should allow another person to understand what was investigated, how it was investigated, what was discovered, what evidence supports each finding, and what remains uncertain.</p>

      <h3>Recommended Report Structure</h3>

      <ol>
        <li>Investigation objective</li>
        <li>Scope and limitations</li>
        <li>Collection methodology</li>
        <li>Search queries</li>
        <li>Key findings</li>
        <li>Supporting sources</li>
        <li>Correlations and pivots</li>
        <li>Confidence assessment</li>
        <li>Timeline</li>
        <li>Conclusion</li>
      </ol>

      <h2>9. Common Beginner Mistakes</h2>

      <ul>
        <li>Searching only one engine</li>
        <li>Using the same query repeatedly</li>
        <li>Trusting the first result automatically</li>
        <li>Confusing search snippets with evidence</li>
        <li>Assuming username matches prove identity</li>
        <li>Ignoring publication dates</li>
        <li>Failing to record queries</li>
        <li>Over-filtering searches</li>
        <li>Making conclusions stronger than the evidence</li>
        <li>Failing to distinguish fact from hypothesis</li>
      </ul>

      <h2>10. Final Assessment</h2>

      <h3>Knowledge Questions</h3>
      <ol>
        <li>What is the primary purpose of Brave Search in an OSINT workflow?</li>
        <li>Why should search results not automatically be considered evidence?</li>
        <li>What is the purpose of quotation marks in a search query?</li>
        <li>What does the site: operator accomplish?</li>
        <li>Why can filetype: searches be useful during document discovery?</li>
        <li>Why should investigators use multiple search strategies?</li>
        <li>What is an OSINT pivot?</li>
        <li>Why is cross-source validation important?</li>
        <li>What is the difference between a lead and a confirmed finding?</li>
        <li>Why should investigation queries be documented?</li>
      </ol>

      <h3>Practical Assessment</h3>
      <p>Construct a complete investigation of a fictional organization. Start with only its name. Use Brave Search to discover public information, identify at least one domain or project identifier, perform additional searches, document at least five useful findings, classify confidence, and produce a final report.</p>

      <h2>11. Professional Checklist</h2>

      <ul>
        <li>☐ Define the investigation objective</li>
        <li>☐ Record known information</li>
        <li>☐ Start with broad discovery queries</li>
        <li>☐ Use exact phrases where appropriate</li>
        <li>☐ Apply search operators carefully</li>
        <li>☐ Search alternate terminology</li>
        <li>☐ Record useful URLs</li>
        <li>☐ Record timestamps</li>
        <li>☐ Validate important claims</li>
        <li>☐ Perform justified pivots</li>
        <li>☐ Separate facts from hypotheses</li>
        <li>☐ Assign confidence levels</li>
        <li>☐ Preserve relevant evidence</li>
        <li>☐ Document limitations</li>
        <li>☐ Produce a reproducible report</li>
      </ul>

      <h2>12. Final Takeaway</h2>
      <p>Brave Search is most useful when it becomes part of a structured OSINT methodology. Search engines provide access to publicly indexed information, but the investigator is responsible for asking precise questions, interpreting results carefully, validating sources, preserving evidence, and communicating uncertainty.</p>

      <p>Within ForenX AI LearnOSINT, the goal is to move students from simple searching to professional investigation thinking. The learner should finish this module knowing not only how to search, but also how to explain why a query was used, how a discovery became a pivot, how different sources were correlated, and why a final conclusion is or is not supported by evidence.</p>
      <h2>13. Search Coverage and Result Diversity</h2>

<p>A professional investigator should understand that search coverage is never complete. A search engine may not have indexed a particular page, may have indexed an older version, or may rank a useful source below many unrelated results. This means that absence from Brave Search should not automatically be interpreted as absence from the public Internet.</p>

<p>Search coverage can be improved by changing the structure of the investigation. Instead of searching only one organization name, use different representations of the same entity. These may include a formal organization name, abbreviated name, domain name, product name, project identifier, employee name, distinctive phrase, document title, or technical identifier discovered during the investigation.</p>

<p>For example, suppose an investigation begins with the fictional organization <code>Northstar Digital Research</code>. The following searches represent different discovery dimensions:</p>

<pre><code>"Northstar Digital Research"
"Northstar Digital Research" research
"Northstar Digital Research" report
"Northstar Digital Research" filetype:pdf
"northstar.example"
"Northstar" cybersecurity
"Northstar Digital Research" conference
"Northstar Digital Research" documentation</code></pre>

<p>Each query asks a slightly different question. Comparing the results can reveal information that would remain hidden if the investigator used only one query.</p>

<h2>14. Search Result Triage</h2>

<p>When an investigation produces dozens or hundreds of search results, the investigator needs a triage process. Reading every result in order is inefficient. Instead, classify results according to relevance and source quality.</p>

<ul>
  <li><strong>High relevance:</strong> Directly concerns the investigation target.</li>
  <li><strong>Potential relevance:</strong> Contains an identifier or relationship requiring further examination.</li>
  <li><strong>Low relevance:</strong> Mentions a similar term but appears unrelated.</li>
  <li><strong>Duplicate:</strong> Repeats information already collected from another source.</li>
  <li><strong>Contradictory:</strong> Appears to disagree with another important source.</li>
</ul>

<p>Triage prevents the investigation notebook from becoming a collection of uncontrolled search results. Only meaningful findings should normally become formal evidence records.</p>

<h2>15. Primary, Secondary, and Tertiary Sources</h2>

<p>Source classification is important when evaluating search results. A primary source directly originates from the entity or event being investigated. Examples include an organization's official publication, an official technical document, or a first-party announcement.</p>

<p>A secondary source discusses or analyzes information originating elsewhere. News reports, research articles, technical blogs, and independent analysis can be valuable secondary sources. Tertiary sources organize information from multiple sources, such as directories or aggregated databases.</p>

<p>The investigator should not assume that primary sources are always correct or that secondary sources are always unreliable. Instead, source type should be recorded as part of the evidence assessment.</p>

<h2>16. Handling Conflicting Information</h2>

<p>Real investigations may produce contradictory information. One source may identify an organization with one domain while another source identifies a different domain. A project may have changed names. An old document may contain information that is no longer current.</p>

<p>When sources conflict, do not immediately choose the result that appears most convenient. Record both claims and investigate the reason for the difference.</p>

<p>Useful comparison factors include:</p>

<ul>
  <li>Publication date</li>
  <li>Source authority</li>
  <li>Directness of the source</li>
  <li>Independent confirmation</li>
  <li>Historical context</li>
  <li>Specificity of the claim</li>
</ul>

<p>A good report should explicitly mention unresolved contradictions instead of silently removing inconvenient findings.</p>

<h2>17. Temporal OSINT</h2>

<p>Information found through search engines can represent different points in time. A current page may describe a present situation, while an older indexed document may describe a previous state. Investigators should therefore distinguish between the date information was published and the date it was observed during the investigation.</p>

<p>For example, a technical document published several years ago may mention a technology that is no longer used. Treating the document as proof of the current technology stack would be an error.</p>

<p>A timeline can help resolve this problem:</p>

<pre><code>Publication Date
      ↓
Historical Reference
      ↓
Current Search Discovery
      ↓
Current Validation
      ↓
Investigator Conclusion</code></pre>

<h2>18. Reproducibility of Search Investigations</h2>

<p>An investigation should be reproducible whenever possible. Another investigator should be able to understand which queries were used, why they were selected, which sources were considered important, and how conclusions were reached.</p>

<p>ForenX AI LearnOSINT can support this by storing the search query together with the finding. A finding should not simply say "Brave Search found a domain." It should record the actual query, source URL, observation timestamp, relevant text or description, confidence level, and next pivot.</p>

<h2>19. Search Strategy Documentation</h2>

<p>A useful investigation notebook can divide queries into categories.</p>

<table>
  <thead>
    <tr>
      <th>Category</th>
      <th>Purpose</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Identity</td>
      <td>Identify names and aliases</td>
    </tr>
    <tr>
      <td>Domain</td>
      <td>Find references to domains and hostnames</td>
    </tr>
    <tr>
      <td>Documents</td>
      <td>Locate reports and public files</td>
    </tr>
    <tr>
      <td>Technical</td>
      <td>Find technology-related references</td>
    </tr>
    <tr>
      <td>Historical</td>
      <td>Locate older references</td>
    </tr>
    <tr>
      <td>Validation</td>
      <td>Confirm important findings</td>
    </tr>
  </tbody>
</table>

<p>This organization makes the investigation easier to review and prevents the same query from being accidentally repeated.</p>

<h2>20. Knowing When to Stop Searching</h2>

<p>More searching does not always produce better intelligence. Investigators should define stopping conditions. Once the investigation question has been answered with sufficient independent evidence, continued searching may add little value.</p>

<p>A practical stopping rule is reached when the major investigation objectives have supporting evidence, important relationships have been validated, contradictory information has been addressed, and remaining uncertainty has been documented.</p>

<p>The final result should therefore communicate both what was discovered and what could not be established.</p>

<h2>21. Final Professional Principle</h2>

<p>The quality of an OSINT investigation is determined by the quality of its reasoning, not by the number of search results collected. A strong investigator knows how to discover information, evaluate sources, create justified pivots, recognize uncertainty, preserve evidence, and explain conclusions.</p>

<p>Brave Search provides an important discovery capability within this process, but it should always operate as part of a broader methodology. When combined with passive domain investigation, historical sources, threat-intelligence platforms, evidence notebooks, and the AI-assisted learning features of ForenX AI LearnOSINT, it can become a powerful educational component for teaching structured OSINT investigation.</p>
    `,
    keyPoints: [
      "A complete investigation begins with a clearly defined objective",
      "Use broad discovery before precise searches",
      "Every pivot should have an investigative reason",
      "Cross-validation strengthens important findings",
      "Reports should distinguish facts, hypotheses, and limitations",
      "Brave Search is one component of a larger OSINT methodology",
      "Professional OSINT requires reproducibility and evidence discipline"
    ],
    example: `Investigation flow: Organization → Brave Search → Public Document → Project Identifier → Additional Search → Passive Domain Validation → Cross-Source Correlation → Evidence Notebook → Final Report.`,
    estimatedTime: 75,
    order: 8,
    difficulty: "Advanced",
    prerequisites: [
      "Brave Search Fundamentals for OSINT",
      "Basic Searching and Query Construction",
      "Advanced Search Operators and Query Engineering",
      "Brave Search for OSINT Investigation",
      "Advanced Pivoting and Cross-Tool Correlation",
      "Brave Search in ForenX AI LearnOSINT",
      "Evidence Preservation and Practical Investigation Lab"
    ]
  }
];

module.exports = toolLessons;