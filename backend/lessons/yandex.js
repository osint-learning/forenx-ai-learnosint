const toolLessons = [
  {
    lessonNumber: 1,
    title: "Yandex Search Fundamentals for OSINT",
    shortDescription:
      "Understand Yandex as an OSINT search engine, its search model, regional relevance, image capabilities, indexing behavior, and responsible investigative use.",
    objectives: [
      "Understand Yandex and its role in OSINT",
      "Learn basic Yandex search techniques",
      "Understand search queries and relevance",
      "Learn regional and language considerations",
      "Understand Yandex image search",
      "Apply responsible search practices"
    ],
    content: `
      <h2>1. Introduction to Yandex</h2>

      <p>Yandex is a major search technology platform that provides web search and a range of information services. From an OSINT perspective, search engines are important because they provide access to publicly indexed information that may not appear identically across different search platforms.</p>

      <p>Yandex can therefore be used as a complementary search engine during investigations. An investigator should not assume that one search engine contains the complete public web. Different search engines may crawl, rank, index, and present information differently.</p>

      <h2>2. Why Multiple Search Engines Matter</h2>

      <pre><code>Search Engine A
      ↓
Result Set A

Search Engine B
      ↓
Result Set B

Yandex
      ↓
Result Set C

        ↓

Compare Results
        ↓
Broader OSINT Coverage</code></pre>

      <p>Using several search engines can reveal different pages, documents, images, cached references, or language-specific results.</p>

      <h2>3. Yandex as an OSINT Source</h2>

      <p>Yandex can help investigators search for:</p>

      <ul>
        <li>Web pages</li>
        <li>Public documents</li>
        <li>Organizations</li>
        <li>Technical information</li>
        <li>News and public references</li>
        <li>Images</li>
        <li>Language-specific content</li>
        <li>Publicly indexed websites</li>
      </ul>

      <h2>4. Search Engines Are Indexes</h2>

      <p>A search engine does not represent the entire Internet. It maintains an index of content discovered and processed by its crawling and indexing systems.</p>

      <pre><code>Public Web
   ↓
Crawler
   ↓
Index
   ↓
Ranking
   ↓
Search Results</code></pre>

      <p>Therefore, the absence of a result does not prove that information does not exist.</p>

      <h2>5. Search Relevance</h2>

      <p>Search engines rank results according to their own systems. The first result is not automatically the most authoritative source.</p>

      <p>An investigator should evaluate:</p>

      <ul>
        <li>Source identity</li>
        <li>Publication date</li>
        <li>Context</li>
        <li>Originality</li>
        <li>Authority</li>
        <li>Consistency with independent sources</li>
      </ul>

      <h2>6. Basic Search</h2>

      <p>A basic query can begin with a unique keyword, organization name, domain, document title, or phrase.</p>

      <pre><code>Example organization:
BlueShield Training Labs

Basic search:
BlueShield Training Labs</code></pre>

      <p>The investigator can then refine the query based on the results.</p>

      <h2>7. Exact Phrases</h2>

      <p>Quotation marks can be useful when searching for an exact phrase.</p>

      <pre><code>"BlueShield Training Labs"</code></pre>

      <p>Exact phrase searches are useful for identifying repeated references to a distinctive organization, statement, document title, or technical phrase.</p>

      <h2>8. Query Refinement</h2>

      <p>A strong OSINT investigation rarely depends on a single query.</p>

      <pre><code>Broad Query
    ↓
Review Results
    ↓
Identify Unique Terms
    ↓
Refine Query
    ↓
Search Again
    ↓
Compare Results</code></pre>

      <h2>9. Language and Regional Results</h2>

      <p>Yandex can be especially useful when investigating information written in languages or regions where its search ecosystem has strong relevance.</p>

      <p>Language should be considered an investigative variable.</p>

      <pre><code>English Query
      ↓
English Results

Translated / Local-Language Query
      ↓
Potentially Different Results</code></pre>

      <p>Translation can reveal terminology that would not appear in an English-only query.</p>

      <h2>10. Image Search</h2>

      <p>Image search is an important OSINT capability. Investigators can use image search to locate visually similar or related public images, identify alternate copies, and discover pages containing similar imagery.</p>

      <p>Image results should always be evaluated in context because visual similarity does not automatically prove that two images depict the same event, location, or person.</p>

      <h2>11. Search Result Evaluation</h2>

      <table>
        <thead>
          <tr>
            <th>Question</th>
            <th>Why It Matters</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Who published it?</td>
            <td>Establishes source identity</td>
          </tr>
          <tr>
            <td>When?</td>
            <td>Provides temporal context</td>
          </tr>
          <tr>
            <td>Is it original?</td>
            <td>Avoids copied information</td>
          </tr>
          <tr>
            <td>Can it be independently verified?</td>
            <td>Improves confidence</td>
          </tr>
        </tbody>
      </table>

      <h2>12. Search Engine Bias</h2>

      <p>Every search engine has its own indexing and ranking behavior. Search results can therefore differ significantly.</p>

      <h2>13. Yandex and OSINT Methodology</h2>

      <pre><code>Question
 ↓
Query
 ↓
Yandex Results
 ↓
Source Evaluation
 ↓
Useful Finding
 ↓
Independent Validation</code></pre>

      <h2>14. Responsible Use</h2>

      <p>Yandex should be used for lawful research and investigation. Searching publicly available information does not automatically authorize access to private systems, accounts, restricted content, or protected resources.</p>

      <h2>15. Core Principle</h2>

      <p>Yandex is most valuable when used as one component of a multi-source OSINT methodology. Its results provide leads and evidence that should be evaluated, preserved, and validated rather than accepted automatically.</p>
    `,
    keyPoints: [
      "Yandex is a major search platform useful for OSINT",
      "Different search engines can return different results",
      "Search results are not automatically authoritative",
      "Language and regional searching can improve coverage",
      "Image search can provide useful investigative pivots",
      "Search results require source and context validation"
    ],
    example:
      "Search a fictional organization name in Yandex, identify unique references, refine the query, and independently validate the most important source.",
    estimatedTime: 50,
    order: 1,
    difficulty: "Beginner",
    prerequisites: []
  },

  {
    lessonNumber: 2,
    title: "Yandex Search Techniques and Query Construction",
    shortDescription:
      "Learn how to construct precise Yandex queries using exact phrases, exclusions, domain-focused searches, file searches, and progressive query refinement.",
    objectives: [
      "Build effective Yandex queries",
      "Use exact phrase searches",
      "Use exclusion techniques",
      "Search specific domains",
      "Search public documents",
      "Develop iterative search strategies"
    ],
    content: `
      <h2>1. Query Engineering</h2>

      <p>Query engineering is the process of designing search queries that produce information relevant to a specific investigative objective. Instead of entering a broad keyword and accepting whatever appears, an investigator constructs searches intentionally.</p>

      <pre><code>Investigation Question
        ↓
Identify Search Terms
        ↓
Build Query
        ↓
Review Results
        ↓
Refine Query</code></pre>

      <h2>2. Start Broad</h2>

      <p>Begin with the most distinctive information available.</p>

      <pre><code>"BlueShield Training Labs"</code></pre>

      <p>Review the result set for additional terms.</p>

      <h2>3. Extract Search Pivots</h2>

      <p>Suppose the first search reveals:</p>

      <pre><code>BlueShield Training Labs
Project Atlas
Kozhikode
security research</code></pre>

      <p>These new terms can become search pivots.</p>

      <pre><code>"Project Atlas" "BlueShield"
"BlueShield" "security research"
"Project Atlas" Kozhikode</code></pre>

      <h2>4. Exact Phrase Searching</h2>

      <p>Quotation marks can restrict a search toward a specific phrase.</p>

      <pre><code>"Project Atlas"</code></pre>

      <p>This can reduce unrelated results.</p>

      <h2>5. Combining Terms</h2>

      <p>Multiple distinctive terms can narrow results.</p>

      <pre><code>"Project Atlas" "BlueShield"</code></pre>

      <h2>6. Excluding Terms</h2>

      <p>Exclusion can reduce irrelevant results by removing a common unrelated term.</p>

      <pre><code>BlueShield -sports</code></pre>

      <p>The exact operator behavior can vary by search engine and current implementation, so investigators should verify syntax against the search engine's current documentation or observed behavior.</p>

      <h2>7. Domain-Focused Searching</h2>

      <p>Domain restrictions can be useful when the investigator already knows which website should contain the information.</p>

      <pre><code>site:example.com "Project Atlas"</code></pre>

      <p>This is useful for finding information inside a known public website.</p>

      <h2>8. File Searches</h2>

      <p>Searching for publicly indexed documents can be useful during corporate or academic OSINT.</p>

      <pre><code>filetype:pdf "Project Atlas"</code></pre>

      <p>Other document formats may also be searchable depending on indexing support.</p>

      <h2>9. Combining File and Domain Searches</h2>

      <pre><code>site:example.com filetype:pdf "security research"</code></pre>

      <p>This approach can narrow the search toward publicly indexed documents on a particular website.</p>

      <h2>10. Query Families</h2>

      <p>Instead of relying on one query, create a family of related searches.</p>

      <pre><code>Query 1:
"Organization Name"

Query 2:
"Organization Name" report

Query 3:
"Organization Name" filetype:pdf

Query 4:
site:organization.example "Organization Name"</code></pre>

      <h2>11. Search Iteration</h2>

      <pre><code>Query
 ↓
Results
 ↓
Unique Keyword
 ↓
New Query
 ↓
New Results
 ↓
New Pivot</code></pre>

      <p>This is one of the foundations of practical OSINT.</p>

      <h2>12. Search Noise</h2>

      <p>Broad queries can produce significant noise. Common names, popular organizations, generic technical terms, and common usernames may have many unrelated results.</p>

      <h2>13. Reducing Noise</h2>

      <p>Use distinctive combinations:</p>

      <pre><code>"BlueShield Training Labs" "Project Atlas"</code></pre>

      <p>rather than:</p>

      <pre><code>security company project</code></pre>

      <h2>14. Query Documentation</h2>

      <p>Professional investigators should record important queries.</p>

      <pre><code>Query ID:
Y-001

Query:
"BlueShield Training Labs" "Project Atlas"

Purpose:
Find public references connecting organization
and project.

Timestamp:
Recorded time</code></pre>

      <h2>15. Search Reproducibility</h2>

      <p>Search results can change. Recording the query, timestamp, relevant result, and source URL improves reproducibility.</p>

      <h2>16. Practical Exercise</h2>

      <p>Use a fictional organization and create five queries:</p>

      <ol>
        <li>Exact organization name</li>
        <li>Organization + project name</li>
        <li>Organization + PDF</li>
        <li>Domain-restricted search</li>
        <li>Excluded irrelevant term</li>
      </ol>

      <p>Compare the result sets and record what changed.</p>

      <h2>17. Core Principle</h2>

      <p>Good Yandex searching is an iterative process. Start with distinctive terms, examine results for new pivots, refine the query, and document important searches so another investigator can reproduce the process.</p>
    `,
    keyPoints: [
      "Query engineering improves search precision",
      "Exact phrases can reduce noise",
      "Domain restrictions focus searches",
      "File searches can locate public documents",
      "Exclusion can remove irrelevant results",
      "Document important queries and timestamps"
    ],
    example:
      "Organization name → exact phrase → project keyword → domain-restricted search → PDF search → result comparison.",
    estimatedTime: 60,
    order: 2,
    difficulty: "Beginner",
    prerequisites: [
      "Yandex Search Fundamentals for OSINT"
    ]
  },

  {
    lessonNumber: 3,
    title: "Advanced Yandex Search, Regional Intelligence, and Image OSINT",
    shortDescription:
      "Explore advanced Yandex search strategy, multilingual research, regional intelligence, image investigation, source discovery, and result verification.",
    objectives: [
      "Perform advanced search refinement",
      "Use multilingual search strategies",
      "Understand regional search differences",
      "Use image search for OSINT",
      "Identify original sources",
      "Validate visual and textual findings"
    ],
    content: `
      <h2>1. Advanced Search Strategy</h2>

      <p>Advanced search involves combining multiple search dimensions. These may include exact phrases, domains, document types, language, region, time, and distinctive contextual terms.</p>

      <pre><code>Entity
 +
Location
 +
Event
 +
Document Type
 +
Time
 ↓
Focused Search</code></pre>

      <h2>2. Multilingual OSINT</h2>

      <p>Information about an organization or event may exist in multiple languages. Searching only in English can therefore produce incomplete intelligence.</p>

      <pre><code>English Name
 ↓
Local Translation
 ↓
Alternative Spelling
 ↓
Local-Language Search
 ↓
Compare Results</code></pre>

      <h2>3. Transliteration</h2>

      <p>Names written in one script may have multiple transliterations in another script. Investigators should consider spelling variations when searching names, locations, organizations, and technical terms.</p>

      <h2>4. Search Vocabulary</h2>

      <p>A useful method is to build a vocabulary list.</p>

      <pre><code>Organization:
BlueShield

Project:
Atlas

Location:
Kozhikode

Topic:
Cybersecurity

Language:
English + Local Language</code></pre>

      <p>Search combinations of these terms.</p>

      <h2>5. Regional Search</h2>

      <p>Search engines may produce different results depending on region, language, and localization settings. This can affect which sources appear prominently.</p>

      <p>Regional differences should be treated as an investigative variable rather than a guarantee of additional evidence.</p>

      <h2>6. Image OSINT</h2>

      <p>Images can contain useful clues about an investigation. Search engines can sometimes identify visually similar images or pages containing the same or related image.</p>

      <pre><code>Image
 ↓
Visual Search
 ↓
Similar Results
 ↓
Source Pages
 ↓
Context Validation</code></pre>

      <h2>7. Reverse Image Reasoning</h2>

      <p>If an image appears in an investigation, the investigator can search for earlier or alternate appearances. This may help determine whether an image is old, reused, miscaptioned, or associated with a different event.</p>

      <h2>8. Image Context</h2>

      <p>Finding the same image on another website does not automatically establish that the second website is the original source.</p>

      <p>Investigate:</p>

      <ul>
        <li>Publication date</li>
        <li>Page context</li>
        <li>Image metadata where available</li>
        <li>Captions</li>
        <li>Associated event</li>
        <li>Earlier appearances</li>
      </ul>

      <h2>9. Visual Similarity Is Not Identity</h2>

      <pre><code>Similar Image
     ≠
Same Event

Similar Person
     ≠
Confirmed Identity</code></pre>

      <p>Visual evidence must be interpreted carefully.</p>

      <h2>10. Finding Original Sources</h2>

      <p>Search results often contain copies of the same content. The investigator should attempt to locate the earliest credible source.</p>

      <pre><code>Search Result
 ↓
Copied Article
 ↓
Referenced Source
 ↓
Original Publication
 ↓
Verify</code></pre>

      <h2>11. Source Reliability</h2>

      <table>
        <thead>
          <tr>
            <th>Source</th>
            <th>Typical Value</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Official organization</td>
            <td>High for its own announcements</td>
          </tr>
          <tr>
            <td>Established publication</td>
            <td>Useful secondary reporting</td>
          </tr>
          <tr>
            <td>Anonymous post</td>
            <td>Requires stronger validation</td>
          </tr>
          <tr>
            <td>Copied page</td>
            <td>Useful lead, weaker originality</td>
          </tr>
        </tbody>
      </table>

      <h2>12. Temporal Search</h2>

      <p>Search results can be used to investigate changes over time.</p>

      <pre><code>2024:
Organization announcement

2025:
Updated project information

2026:
Current page

Timeline:
Change over time</code></pre>

      <h2>13. Search Engine Comparison</h2>

      <pre><code>Yandex
 +
Google
 +
Bing
 +
Brave
 +
DuckDuckGo
 ↓
Compare Coverage
 ↓
Identify Unique Results</code></pre>

      <h2>14. Practical Exercise</h2>

      <p>Take a fictional event and construct searches in two languages. Compare:</p>

      <ul>
        <li>Number of relevant results</li>
        <li>Source types</li>
        <li>Regional references</li>
        <li>Different terminology</li>
        <li>Images and documents</li>
      </ul>

      <h2>15. Core Principle</h2>

      <p>Advanced Yandex OSINT combines query engineering, language awareness, regional context, image investigation, source tracing, and temporal analysis. Every result remains a lead until its context and reliability have been evaluated.</p>
    `,
    keyPoints: [
      "Multilingual searching can reveal additional terminology",
      "Regional search behavior can affect result coverage",
      "Image search can reveal alternate appearances",
      "Visual similarity does not prove identity",
      "Copied sources should be traced toward original publications",
      "Temporal analysis helps understand changing information"
    ],
    example:
      "English organization name → local-language variant → regional search → image search → earliest credible source → independent validation.",
    estimatedTime: 70,
    order: 3,
    difficulty: "Intermediate",
    prerequisites: [
      "Yandex Search Techniques and Query Construction"
    ]
  },

  {
    lessonNumber: 4,
    title: "Yandex for People, Organizations, Documents, and Digital Footprints",
    shortDescription:
      "Learn how Yandex can support public-identity research, organization intelligence, document discovery, usernames, and digital-footprint analysis without over-attribution.",
    objectives: [
      "Search public organization information",
      "Research public digital footprints",
      "Discover indexed documents",
      "Use username and name variations",
      "Perform identity validation",
      "Avoid attribution errors"
    ],
    content: `
      <h2>1. People and Public Information</h2>

      <p>Search engines can help investigators locate publicly available information about individuals when there is a legitimate investigative purpose. The objective should be to understand a public digital footprint rather than invade private life.</p>

      <p>Possible public sources include:</p>

      <ul>
        <li>Professional pages</li>
        <li>Public articles</li>
        <li>Conference pages</li>
        <li>Public publications</li>
        <li>Organization websites</li>
        <li>Public profiles</li>
      </ul>

      <h2>2. Name Variations</h2>

      <p>Names can have multiple spellings, abbreviations, transliterations, or ordering conventions.</p>

      <pre><code>Full Name
 ↓
Alternative Spelling
 ↓
Initials
 ↓
Transliteration
 ↓
Search Comparison</code></pre>

      <h2>3. Identity Validation</h2>

      <p>Finding two pages with the same name does not prove they belong to the same person.</p>

      <p>Useful contextual signals include:</p>

      <ul>
        <li>Organization</li>
        <li>Location</li>
        <li>Profession</li>
        <li>Publication history</li>
        <li>Unique usernames</li>
        <li>Consistent public biography</li>
      </ul>

      <h2>4. Username Searching</h2>

      <p>A username can be searched across public websites.</p>

      <pre><code>"example_username"</code></pre>

      <p>Search results may reveal potential accounts, but username reuse is common.</p>

      <h2>5. Username Collision</h2>

      <pre><code>example_username
 ↓
Website A
Website B
Website C

Does not automatically mean:
Same person</code></pre>

      <p>Additional contextual evidence is required.</p>

      <h2>6. Organization Research</h2>

      <p>Organizations can be researched using names, domains, project names, reports, staff pages, and public announcements.</p>

      <pre><code>Organization
 |
 +---- Website
 +---- Reports
 +---- Projects
 +---- People
 +---- Public Documents
 +---- News</code></pre>

      <h2>7. Document Discovery</h2>

      <p>Public documents can reveal organizational activities, technical information, research, policies, presentations, and historical references.</p>

      <pre><code>Organization
 ↓
filetype:pdf
 ↓
Public Documents
 ↓
Metadata / Context
 ↓
Investigation Pivot</code></pre>

      <h2>8. Document Metadata</h2>

      <p>A public document may contain metadata such as author names, software information, creation dates, or organization references. Metadata should be treated as supporting evidence rather than unquestionable attribution.</p>

      <h2>9. Technical Documents</h2>

      <p>Search engines can locate publicly indexed technical documents.</p>

      <pre><code>site:example.com filetype:pdf
technical documentation</code></pre>

      <p>Such documents may reveal public technology terminology, project structures, or historical information.</p>

      <h2>10. Digital Footprint</h2>

      <p>A digital footprint is the collection of publicly visible information associated with an entity.</p>

      <pre><code>Name
 +
Username
 +
Organization
 +
Domain
 +
Documents
 +
News
 ↓
Digital Footprint</code></pre>

      <h2>11. Correlation</h2>

      <p>Individual observations become more meaningful when independent contextual evidence supports the same relationship.</p>

      <pre><code>Name
 ↓
Professional Page
 ↓
Organization
 ↓
Published Document
 ↓
Consistent Biography
 ↓
Higher Confidence</code></pre>

      <h2>12. Avoiding Over-Attribution</h2>

      <p>Investigators should never assume that a search result proves identity simply because names or usernames match.</p>

      <p>Use language such as:</p>

      <blockquote>
        The public sources are consistent with the possibility that these accounts are related, but the available evidence is insufficient to establish identity conclusively.
      </blockquote>

      <h2>13. Evidence Classification</h2>

      <table>
        <thead>
          <tr>
            <th>Observation</th>
            <th>Interpretation</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Same name</td>
            <td>Weak relationship</td>
          </tr>
          <tr>
            <td>Same username</td>
            <td>Potential relationship</td>
          </tr>
          <tr>
            <td>Same username + organization</td>
            <td>Stronger contextual relationship</td>
          </tr>
          <tr>
            <td>Multiple independent matching attributes</td>
            <td>Higher confidence</td>
          </tr>
        </tbody>
      </table>

      <h2>14. Practical Exercise</h2>

      <p>Create a fictional investigator profile and search for:</p>

      <ul>
        <li>Organization name</li>
        <li>Project name</li>
        <li>Public documents</li>
        <li>Username</li>
        <li>News references</li>
      </ul>

      <p>Separate confirmed observations from possible relationships.</p>

      <h2>15. Core Principle</h2>

      <p>Yandex can support people, organization, and document OSINT, but identity research requires strong contextual reasoning. Similar names, usernames, and documents are useful leads, not automatic proof of identity.</p>
    `,
    keyPoints: [
      "Public identity research requires legitimate purpose",
      "Names can have many variations",
      "Username reuse creates collision risk",
      "Public documents can provide useful organizational context",
      "Metadata is supporting evidence",
      "Multiple independent attributes improve confidence"
    ],
    example:
      "Organization name → public document → username reference → professional page → contextual comparison → confidence assessment.",
    estimatedTime: 70,
    order: 4,
    difficulty: "Intermediate",
    prerequisites: [
      "Advanced Yandex Search, Regional Intelligence, and Image OSINT"
    ]
  },

  {
    lessonNumber: 5,
    title: "Yandex OSINT Pivoting, Correlation, and Cross-Search Investigation",
    shortDescription:
      "Learn how to use Yandex as part of a multi-tool OSINT workflow by pivoting from domains, names, documents, images, and infrastructure into independent sources.",
    objectives: [
      "Understand OSINT pivoting",
      "Build cross-search workflows",
      "Correlate Yandex findings",
      "Validate search results",
      "Use multiple search engines",
      "Develop investigation stopping conditions"
    ],
    content: `
      <h2>1. Pivot-Based OSINT</h2>

      <p>Pivoting means moving from one known piece of information to another related entity. Search engines are powerful pivot tools because every result may reveal new names, domains, documents, organizations, locations, or technical identifiers.</p>

      <pre><code>Known Entity
 ↓
Search
 ↓
New Entity
 ↓
Search Again
 ↓
Additional Evidence</code></pre>

      <h2>2. Domain Pivot</h2>

      <pre><code>Domain
 ↓
Yandex
 ↓
Public Pages
 ↓
Document
 ↓
Project Name
 ↓
Additional Search</code></pre>

      <h2>3. Document Pivot</h2>

      <p>A document can reveal:</p>

      <ul>
        <li>Author</li>
        <li>Organization</li>
        <li>Project</li>
        <li>Technical terminology</li>
        <li>Publication date</li>
        <li>Related URLs</li>
      </ul>

      <p>These can become new search terms.</p>

      <h2>4. Image Pivot</h2>

      <pre><code>Image
 ↓
Yandex Image Search
 ↓
Similar / Matching Pages
 ↓
Source Comparison
 ↓
Earliest Credible Context</code></pre>

      <h2>5. Search Engine Triangulation</h2>

      <p>Triangulation means comparing information from multiple independent search engines or sources.</p>

      <pre><code>Yandex
Google
Bing
Brave
DuckDuckGo
        ↓
Compare
        ↓
Common Results
Unique Results
        ↓
Validate</code></pre>

      <h2>6. Unique Results</h2>

      <p>A result appearing only on Yandex is not automatically more important than a result appearing on several search engines. It simply means that the result should be examined as a potentially unique source.</p>

      <h2>7. Infrastructure Pivot</h2>

      <p>Suppose a public page reveals a domain.</p>

      <pre><code>Public Page
 ↓
Domain
 ↓
DNS
 ↓
IP
 ↓
Certificate
 ↓
Infrastructure Context</code></pre>

      <p>Yandex provides the initial discovery while dedicated infrastructure tools provide technical validation.</p>

      <h2>8. Document-to-Organization Pivot</h2>

      <pre><code>PDF
 ↓
Author
 ↓
Organization
 ↓
Organization Domain
 ↓
Public Website
 ↓
Related Documents</code></pre>

      <h2>9. Name-to-Organization Pivot</h2>

      <pre><code>Public Name
 ↓
Search
 ↓
Professional Page
 ↓
Organization
 ↓
Project
 ↓
Public Documents</code></pre>

      <h2>10. Correlation Matrix</h2>

      <table>
        <thead>
          <tr>
            <th>Entity</th>
            <th>Source 1</th>
            <th>Source 2</th>
            <th>Assessment</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Domain</td>
            <td>Yandex</td>
            <td>DNS</td>
            <td>Validated relationship</td>
          </tr>
          <tr>
            <td>Organization</td>
            <td>Yandex</td>
            <td>Official website</td>
            <td>Strong relationship</td>
          </tr>
          <tr>
            <td>Username</td>
            <td>Yandex</td>
            <td>Public profile</td>
            <td>Requires identity validation</td>
          </tr>
        </tbody>
      </table>

      <h2>11. Conflicting Results</h2>

      <pre><code>Yandex:
Information A

Google:
Information B

Possible causes:
- Different indexing dates
- Source changes
- Regional differences
- Cached references
- Search ranking differences</code></pre>

      <p>Conflicting results should be investigated rather than ignored.</p>

      <h2>12. Temporal Correlation</h2>

      <p>Search results can reveal changes in public information.</p>

      <pre><code>Old Page:
Project A

New Page:
Project B

Organization:
Same

Observation:
Possible project transition</code></pre>

      <p>The investigator should verify the dates before drawing conclusions.</p>

      <h2>13. Correlation Engine in ForenX</h2>

      <pre><code>Yandex
   |
   +---- Domain
   +---- Document
   +---- Image
   +---- Organization
        |
        ↓
ForenX
        |
   +---- DNS
   +---- WHOIS
   +---- Certificates
   +---- Recon Engine
   +---- Other Search Engines
        ↓
Correlation Engine
        ↓
Unified Finding</code></pre>

      <h2>14. Investigation Graph</h2>

      <pre><code>Organization
 |
 +---- Domain
 |       |
 |       +---- IP
 |
 +---- Project
 |       |
 |       +---- Document
 |
 +---- Public Profile
</code></pre>

      <h2>15. Stopping Conditions</h2>

      <p>Search-based investigations can continue indefinitely. Define a stopping point when:</p>

      <ul>
        <li>The investigation objective has been answered</li>
        <li>Important relationships have been validated</li>
        <li>New searches produce only duplicates</li>
        <li>Scope has been exhausted</li>
        <li>Additional pivots have low investigative value</li>
      </ul>

      <h2>16. Core Principle</h2>

      <p>Yandex becomes much more powerful when used as a pivoting and discovery layer rather than an isolated search engine. Search results should lead to independent validation through dedicated OSINT and cybersecurity tools.</p>
    `,
    keyPoints: [
      "Every useful search result can become a pivot",
      "Documents can reveal organizations, projects, and authors",
      "Images can lead to alternate sources",
      "Infrastructure findings require dedicated validation",
      "Multiple search engines improve investigative coverage",
      "ForenX can correlate Yandex findings with technical tools"
    ],
    example:
      "Yandex result → domain → DNS → certificate → infrastructure validation → correlation with additional OSINT sources.",
    estimatedTime: 75,
    order: 5,
    difficulty: "Advanced",
    prerequisites: [
      "Yandex for People, Organizations, Documents, and Digital Footprints",
      "Advanced Yandex Search, Regional Intelligence, and Image OSINT"
    ]
  },

  {
    lessonNumber: 6,
    title: "Yandex in ForenX AI LearnOSINT",
    shortDescription:
      "Learn how Yandex can integrate with the ForenX Tool Explorer, AI Mentor, search workflows, Recon Engine, Correlation Engine, simulation missions, and reporting system.",
    objectives: [
      "Understand Yandex's role in ForenX",
      "Integrate search results into investigations",
      "Use AI to explain search strategies",
      "Create search-based correlation workflows",
      "Use simulation mode",
      "Generate structured investigation reports"
    ],
    content: `
      <h2>1. Yandex Within ForenX</h2>

      <p>ForenX AI LearnOSINT is designed to teach OSINT through practical tools, guided lessons, AI assistance, investigation missions, correlation, and reporting. Yandex fits into the search and discovery layer of this architecture.</p>

      <h2>2. Tool Explorer</h2>

      <p>The Tool Explorer can teach Yandex through structured lessons covering:</p>

      <ul>
        <li>Search fundamentals</li>
        <li>Query construction</li>
        <li>Advanced searching</li>
        <li>Image OSINT</li>
        <li>Multilingual searching</li>
        <li>Document discovery</li>
        <li>Pivoting</li>
        <li>Evidence preservation</li>
      </ul>

      <h2>3. AI Mentor</h2>

      <p>The AI Mentor can help beginners understand why a search query should be modified.</p>

      <pre><code>User:
My search has too many unrelated results.

AI Mentor:
Add a distinctive phrase, organization name,
domain restriction, or document type. Then
compare the new results with the original set.</code></pre>

      <h2>4. AI Query Suggestions</h2>

      <p>ForenX can generate query suggestions based on an investigation entity.</p>

      <pre><code>Known:
Organization = BlueShield

AI Suggestions:
"BlueShield"
"BlueShield" report
"BlueShield" filetype:pdf
site:example.com "BlueShield"</code></pre>

      <p>The investigator remains responsible for choosing appropriate searches.</p>

      <h2>5. Search Result Summarization</h2>

      <p>AI can summarize search results into categories.</p>

      <pre><code>Results
 ↓
AI Classification
 ↓
Official Sources
News
Documents
Technical
Profiles
Images
 ↓
Investigator Review</code></pre>

      <h2>6. AI Must Not Invent Sources</h2>

      <p>If a search result does not contain information, the AI should not fabricate it.</p>

      <pre><code>Observed:
No result found

Correct AI:
No matching indexed result was observed.

Incorrect:
Invented page or unsupported claim.</code></pre>

      <h2>7. Recon Engine Integration</h2>

      <p>A search result may reveal a domain that can then be passed to the ForenX Recon Engine.</p>

      <pre><code>Yandex
 ↓
Domain Discovery
 ↓
ForenX Recon Engine
 ↓
DNS
SSL
Headers
Technology
Metadata
 ↓
Correlation</code></pre>

      <h2>8. Correlation Engine</h2>

      <pre><code>Yandex
+
Google
+
Bing
+
DNS
+
WHOIS
+
Certificates
+
Recon Engine
 ↓
Correlation Engine
 ↓
Unified Investigation</code></pre>

      <h2>9. Story-Based Missions</h2>

      <p>A ForenX mission could give students a fictional organization and ask them to discover public information.</p>

      <p>Students could be required to:</p>

      <ol>
        <li>Search the organization</li>
        <li>Identify unique terminology</li>
        <li>Find public documents</li>
        <li>Identify the organization's domain</li>
        <li>Validate the domain</li>
        <li>Build an evidence graph</li>
        <li>Prepare a report</li>
      </ol>

      <h2>10. Simulation Mode</h2>

      <p>Simulation Mode can generate fictional search results for educational purposes.</p>

      <pre><code>Fictional Organization
 ↓
Simulated Yandex Results
 ↓
Student Query Construction
 ↓
Pivot Discovery
 ↓
AI Feedback
 ↓
Score</code></pre>

      <h2>11. AI Learning Recommendations</h2>

      <p>If a student repeatedly uses overly broad queries, the AI can recommend lessons about exact phrases, domain restrictions, query refinement, and source validation.</p>

      <h2>12. Evidence Notebook</h2>

      <pre><code>Evidence ID:
Y-001

Query:
"BlueShield Training Labs"

Source:
Yandex result

Observation:
Public organization reference

Timestamp:
Recorded time

Confidence:
Medium

Validation:
Official organization website</code></pre>

      <h2>13. Correlation Rule</h2>

      <p>A simple ForenX correlation rule could identify when a Yandex-discovered domain is independently validated by DNS and certificate data.</p>

      <pre><code>Yandex:
Domain discovered

DNS:
Domain resolves

Certificate:
Domain appears

Result:
Infrastructure relationship supported</code></pre>

      <h2>14. Reporting</h2>

      <p>ForenX can generate reports containing:</p>

      <ul>
        <li>Investigation objective</li>
        <li>Queries used</li>
        <li>Search timestamps</li>
        <li>Important sources</li>
        <li>Discovered entities</li>
        <li>Pivots</li>
        <li>Validation</li>
        <li>Correlation</li>
        <li>Confidence</li>
        <li>Limitations</li>
      </ul>

      <h2>15. Core Principle</h2>

      <p>Yandex gives ForenX a valuable search-discovery layer. The platform can teach students not only how to search but how to transform search results into validated evidence and structured investigation findings.</p>
    `,
    keyPoints: [
      "Yandex provides a search and discovery layer for ForenX",
      "AI can suggest query refinements",
      "AI can summarize results but should not invent sources",
      "Yandex discoveries can feed the Recon Engine",
      "Correlation can connect search findings with technical evidence",
      "Simulation Mode can provide safe search-training scenarios"
    ],
    example:
      "Yandex query → public domain discovery → Recon Engine → DNS/certificate validation → Correlation Engine → evidence notebook → report.",
    estimatedTime: 70,
    order: 6,
    difficulty: "Advanced",
    prerequisites: [
      "Yandex OSINT Pivoting, Correlation, and Cross-Search Investigation",
      "Yandex Search Techniques and Query Construction"
    ]
  },

  {
    lessonNumber: 7,
    title: "Yandex Evidence Preservation and Practical OSINT Lab",
    shortDescription:
      "Perform a controlled Yandex investigation using a fictional organization and learn how to preserve queries, results, sources, timestamps, pivots, validation, and conclusions.",
    objectives: [
      "Plan a Yandex investigation",
      "Construct multiple search queries",
      "Identify useful search pivots",
      "Validate important findings",
      "Preserve search evidence",
      "Create a structured investigation report"
    ],
    content: `
      <h2>1. Laboratory Overview</h2>

      <p>This practical exercise teaches students how to conduct a structured Yandex-based OSINT investigation. The scenario uses a fictional organization so that students can focus on methodology, evidence handling, and analysis.</p>

      <h2>2. Scenario</h2>

      <pre><code>Organization:
BlueShield Training Labs

Project:
Atlas

Objective:
Identify publicly available information about
the fictional organization's project.</code></pre>

      <h2>3. Step One — Define Objective</h2>

      <p>Write the question before searching.</p>

      <pre><code>Question:
What public information is available about
Project Atlas?

Scope:
Publicly indexed information

Target:
BlueShield Training Labs</code></pre>

      <h2>4. Step Two — Build Initial Query</h2>

      <pre><code>"BlueShield Training Labs"</code></pre>

      <p>Record the query and timestamp.</p>

      <h2>5. Step Three — Identify New Terms</h2>

      <p>Suppose the results reveal:</p>

      <pre><code>Project Atlas
Cybersecurity research
Training platform</code></pre>

      <p>These terms become pivots.</p>

      <h2>6. Step Four — Refine Searches</h2>

      <pre><code>"Project Atlas" "BlueShield"

"Project Atlas" cybersecurity

"BlueShield" filetype:pdf</code></pre>

      <h2>7. Step Five — Domain Search</h2>

      <p>If the investigation identifies the fictional domain:</p>

      <pre><code>example.com</code></pre>

      <p>Use a domain-focused query:</p>

      <pre><code>site:example.com "Project Atlas"</code></pre>

      <h2>8. Step Six — Document Search</h2>

      <pre><code>site:example.com filetype:pdf
"Project Atlas"</code></pre>

      <p>Record relevant documents without downloading or interacting with anything outside the authorized scope.</p>

      <h2>9. Step Seven — Image Investigation</h2>

      <p>If a relevant public image is discovered, use image-search functionality to look for other pages containing the same or visually similar material.</p>

      <pre><code>Image
 ↓
Image Search
 ↓
Matching Pages
 ↓
Date Comparison
 ↓
Source Validation</code></pre>

      <h2>10. Step Eight — Validate Sources</h2>

      <p>For each important result, determine:</p>

      <ul>
        <li>Who published it?</li>
        <li>When was it published?</li>
        <li>Is it original?</li>
        <li>Is it still available?</li>
        <li>Can another source confirm it?</li>
      </ul>

      <h2>11. Step Nine — Technical Pivot</h2>

      <p>If a domain is discovered, validate it with appropriate ForenX tools.</p>

      <pre><code>Yandex
 ↓
Domain
 ↓
DNS Lookup
 ↓
Certificate
 ↓
Recon Engine</code></pre>

      <h2>12. Step Ten — Evidence Record</h2>

      <pre><code>Evidence ID:
Y-LAB-001

Query:
"BlueShield Training Labs"

Source:
Yandex

Observation:
Public organization reference

Timestamp:
Recorded time

Validation:
Independent source

Confidence:
Medium</code></pre>

      <h2>13. Step Eleven — Build Investigation Graph</h2>

      <pre><code>BlueShield Training Labs
 |
 +---- Project Atlas
 |
 +---- Domain
 |       |
 |       +---- DNS
 |       +---- Certificate
 |
 +---- Public Document
</code></pre>

      <h2>14. Step Twelve — Timeline</h2>

      <pre><code>10:00
Initial search

10:10
Project identified

10:20
Document discovered

10:30
Domain identified

10:40
Technical validation

10:50
Final findings documented</code></pre>

      <h2>15. Step Thirteen — Confidence</h2>

      <p>Classify findings according to supporting evidence.</p>

      <pre><code>Yandex result only:
Low / Medium

Yandex + official source:
Higher

Yandex + official source + technical validation:
High for the specific relationship</code></pre>

      <h2>16. Step Fourteen — Report</h2>

      <p>The final report should contain:</p>

      <ol>
        <li>Objective</li>
        <li>Scope</li>
        <li>Queries</li>
        <li>Important results</li>
        <li>Sources</li>
        <li>Timeline</li>
        <li>Investigation graph</li>
        <li>Validation</li>
        <li>Confidence</li>
        <li>Limitations</li>
        <li>Conclusion</li>
      </ol>

      <h2>17. Reflection Questions</h2>

      <ol>
        <li>Why should queries be recorded?</li>
        <li>Why can search results change?</li>
        <li>Why should copied sources be traced toward originals?</li>
        <li>Why can multilingual searching improve coverage?</li>
        <li>Why does visual similarity not prove identity?</li>
        <li>Why should a discovered domain be independently validated?</li>
      </ol>

      <h2>18. Core Principle</h2>

      <p>The purpose of this laboratory is to transform search-engine results into reproducible intelligence. Every important result should have a source, timestamp, context, validation status, and confidence level.</p>
    `,
    keyPoints: [
      "Start with a clearly defined search objective",
      "Record important queries and timestamps",
      "Use discovered terms as pivots",
      "Validate important sources",
      "Technical discoveries should be independently checked",
      "Preserve evidence and confidence information"
    ],
    example:
      "Fictional organization → Yandex search → project pivot → document discovery → domain pivot → DNS validation → evidence graph → final report.",
    estimatedTime: 85,
    order: 7,
    difficulty: "Advanced",
    prerequisites: [
      "Yandex in ForenX AI LearnOSINT",
      "Yandex OSINT Pivoting, Correlation, and Cross-Search Investigation"
    ]
  },

  {
    lessonNumber: 8,
    title: "Complete Yandex OSINT Investigation and Final Assessment",
    shortDescription:
      "Master the complete Yandex investigation workflow from query construction and multilingual discovery through pivoting, source validation, correlation, evidence preservation, and reporting.",
    objectives: [
      "Plan a complete Yandex investigation",
      "Construct effective search queries",
      "Perform multilingual and image searches",
      "Pivot between entities",
      "Validate search findings",
      "Create a professional OSINT report"
    ],
    content: `
      <h2>1. Complete Yandex OSINT Methodology</h2>

      <p>A professional Yandex investigation follows a structured workflow that begins with an investigative question and ends with a documented, validated conclusion.</p>

      <pre><code>Objective
 ↓
Scope
 ↓
Search Vocabulary
 ↓
Initial Query
 ↓
Result Review
 ↓
Query Refinement
 ↓
Pivot
 ↓
Independent Validation
 ↓
Cross-Search
 ↓
Correlation
 ↓
Evidence Preservation
 ↓
Report</code></pre>

      <h2>2. Phase One — Define the Question</h2>

      <p>Start with a specific investigative question.</p>

      <pre><code>Weak:
Find everything about this organization.

Better:
Identify publicly indexed documents associated
with the organization's Project Atlas.</code></pre>

      <h2>3. Phase Two — Define Scope</h2>

      <p>Scope should identify what sources and entities are relevant.</p>

      <pre><code>Target:
BlueShield Training Labs

Topic:
Project Atlas

Sources:
Publicly indexed information</code></pre>

      <h2>4. Phase Three — Build Search Vocabulary</h2>

      <pre><code>Organization
Project
Location
People
Domain
Technical Terms
Alternative Spellings
Languages</code></pre>

      <p>This vocabulary becomes the foundation of query construction.</p>

      <h2>5. Phase Four — Initial Search</h2>

      <pre><code>"BlueShield Training Labs"</code></pre>

      <p>Review the results without immediately deciding which result is correct.</p>

      <h2>6. Phase Five — Query Refinement</h2>

      <pre><code>"BlueShield Training Labs" "Project Atlas"

"Project Atlas" cybersecurity

"BlueShield" filetype:pdf</code></pre>

      <p>Each query should answer a particular investigative question.</p>

      <h2>7. Phase Six — Multilingual Search</h2>

      <p>Translate important terms when appropriate and search alternative spellings or transliterations.</p>

      <pre><code>English Term
 ↓
Local-Language Term
 ↓
Alternative Spelling
 ↓
Compare Results</code></pre>

      <h2>8. Phase Seven — Document Discovery</h2>

      <p>Search for public documents relevant to the investigation.</p>

      <pre><code>site:example.com filetype:pdf
"Project Atlas"</code></pre>

      <p>Evaluate the document's publisher, date, context, and originality.</p>

      <h2>9. Phase Eight — Image Investigation</h2>

      <p>If images are relevant, use image search to locate possible alternate appearances and source pages.</p>

      <pre><code>Image
 ↓
Visual Search
 ↓
Similar / Matching Pages
 ↓
Date Comparison
 ↓
Original Source Investigation</code></pre>

      <h2>10. Phase Nine — Pivoting</h2>

      <pre><code>Organization
 ↓
Project
 ↓
Document
 ↓
Domain
 ↓
DNS
 ↓
Certificate
 ↓
Infrastructure</code></pre>

      <p>Only follow pivots relevant to the investigation objective.</p>

      <h2>11. Phase Ten — Cross-Search</h2>

      <pre><code>Yandex
 +
Google
 +
Bing
 +
Brave
 +
DuckDuckGo
 ↓
Coverage Comparison
 ↓
Unique Results
 ↓
Validation</code></pre>

      <h2>12. Phase Eleven — Source Validation</h2>

      <p>For important information, ask:</p>

      <ul>
        <li>Is the source official?</li>
        <li>Is it original?</li>
        <li>When was it published?</li>
        <li>Is the information current?</li>
        <li>Can another source confirm it?</li>
      </ul>

      <h2>13. Phase Twelve — Temporal Analysis</h2>

      <p>Search results can expose changes over time.</p>

      <pre><code>Old Page
 ↓
Historical Information

Current Page
 ↓
Current Information

Comparison
 ↓
Change Over Time</code></pre>

      <h2>14. Phase Thirteen — Correlation</h2>

      <pre><code>Yandex
 |
 +---- Domain
 +---- Document
 +---- Organization
 +---- Image
        |
        ↓
ForenX Tools
 |
 +---- DNS
 +---- WHOIS
 +---- SSL
 +---- Recon Engine
        ↓
Correlation Engine
        ↓
Validated Finding</code></pre>

      <h2>15. Example Correlation</h2>

      <p>Yandex identifies a public document containing a domain. DNS confirms the domain exists, certificate information contains the same hostname, and an official organization page references the same project.</p>

      <pre><code>Yandex:
Document → Domain

DNS:
Domain exists

Certificate:
Hostname relationship

Official Source:
Project reference

Conclusion:
Multiple sources support the relationship.</code></pre>

      <h2>16. Phase Fourteen — Confidence</h2>

      <table>
        <thead>
          <tr>
            <th>Confidence</th>
            <th>Evidence</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Low</td>
            <td>Single search result</td>
          </tr>
          <tr>
            <td>Medium</td>
            <td>Search result plus contextual evidence</td>
          </tr>
          <tr>
            <td>High</td>
            <td>Multiple independent and consistent sources</td>
          </tr>
        </tbody>
      </table>

      <h2>17. Phase Fifteen — Evidence Preservation</h2>

      <p>Preserve:</p>

      <ul>
        <li>Investigation objective</li>
        <li>Scope</li>
        <li>Queries</li>
        <li>Search engine used</li>
        <li>Timestamp</li>
        <li>Important result</li>
        <li>Source URL</li>
        <li>Screenshot where appropriate</li>
        <li>Validation source</li>
        <li>Confidence</li>
        <li>Limitations</li>
      </ul>

      <h2>18. Phase Sixteen — AI-Assisted Investigation</h2>

      <p>ForenX's AI Mentor can help students improve query construction and understand evidence.</p>

      <pre><code>Student:
Too many results.

AI:
Add a distinctive phrase, domain restriction,
project term, or document type.

Student:
Found a unique document.

AI:
Record the source, date, URL, and relationship
to the investigation objective before treating
it as evidence.</code></pre>

      <h2>19. AI Uncertainty</h2>

      <p>The AI should clearly distinguish observed information from inference.</p>

      <pre><code>Observed:
A public page contains the domain.

Inference:
The domain may be associated with the
organization.

Validation:
Required before making a strong attribution.</code></pre>

      <h2>20. Common Beginner Mistakes</h2>

      <ul>
        <li>Using only one search query</li>
        <li>Using only one search engine</li>
        <li>Trusting the first result</li>
        <li>Ignoring publication dates</li>
        <li>Treating copied content as original</li>
        <li>Assuming username matches prove identity</li>
        <li>Assuming image similarity proves identity</li>
        <li>Ignoring regional and language differences</li>
        <li>Failing to document queries</li>
        <li>Over-pivoting into unrelated information</li>
      </ul>

      <h2>21. Final Assessment Questions</h2>

      <ol>
        <li>What is Yandex?</li>
        <li>Why can different search engines return different results?</li>
        <li>What is query engineering?</li>
        <li>Why are exact phrases useful?</li>
        <li>How can domain-restricted searching help?</li>
        <li>Why can multilingual searches improve OSINT coverage?</li>
        <li>What is an OSINT pivot?</li>
        <li>Why should image similarity not be treated as identity proof?</li>
        <li>How can documents become investigation pivots?</li>
        <li>Why should copied information be traced toward original sources?</li>
        <li>Why are timestamps important?</li>
        <li>How can Yandex complement Google and Bing?</li>
        <li>How can a Yandex-discovered domain be validated?</li>
        <li>How can ForenX's Recon Engine use Yandex discoveries?</li>
        <li>How can the Correlation Engine combine search and technical evidence?</li>
        <li>What information should be preserved as evidence?</li>
        <li>Why should AI communicate uncertainty?</li>
      </ol>

      <h2>22. Final Practical Challenge</h2>

      <p>Complete a fictional organization investigation using Yandex and supporting ForenX tools.</p>

      <ol>
        <li>Define the objective</li>
        <li>Define scope</li>
        <li>Build search vocabulary</li>
        <li>Perform an initial Yandex search</li>
        <li>Refine queries</li>
        <li>Perform a document search</li>
        <li>Perform an appropriate image search</li>
        <li>Search alternative spellings or languages</li>
        <li>Identify useful pivots</li>
        <li>Validate important results</li>
        <li>Compare other search engines</li>
        <li>Correlate technical findings</li>
        <li>Assign confidence</li>
        <li>Preserve evidence</li>
        <li>Generate a final report</li>
      </ol>

      <h2>23. Professional Checklist</h2>

      <ul>
        <li>☐ Define investigation objective</li>
        <li>☐ Confirm scope</li>
        <li>☐ Build search vocabulary</li>
        <li>☐ Record initial query</li>
        <li>☐ Refine queries</li>
        <li>☐ Search documents</li>
        <li>☐ Consider language variations</li>
        <li>☐ Perform image research where appropriate</li>
        <li>☐ Identify pivots</li>
        <li>☐ Validate important sources</li>
        <li>☐ Compare search engines</li>
        <li>☐ Correlate technical evidence</li>
        <li>☐ Record timestamps</li>
        <li>☐ Assign confidence</li>
        <li>☐ Preserve evidence</li>
        <li>☐ Document limitations</li>
        <li>☐ Generate final report</li>
      </ul>

      <h2>24. Final Takeaway</h2>

      <p>Yandex is an important addition to a multi-engine OSINT methodology because search coverage and ranking can differ between platforms. A professional investigator uses Yandex not simply to find pages, but to discover new entities, documents, images, terminology, and relationships that can become investigation pivots.</p>

      <p>The strongest workflow combines query engineering with source validation. An investigator begins with a clear question, creates distinctive searches, reviews results, extracts new pivots, searches alternative terms and languages, and compares information across independent sources.</p>

      <p>Yandex can also support technical investigations. A public search result may reveal a domain, which can then be validated through DNS, certificates, WHOIS/RDAP, URL analysis, or the ForenX Recon Engine. These relationships can subsequently be processed by the Correlation Engine.</p>

      <p>ForenX AI LearnOSINT can further improve the learning experience through AI-assisted query suggestions, result summarization, uncertainty detection, simulation missions, evidence notebooks, and automated reporting.</p>

      <p>The complete Yandex methodology can be remembered as:</p>

      <blockquote>
        <strong>Question → Query → Search → Refine → Pivot → Validate → Correlate → Preserve → Report.</strong>
      </blockquote>

      <p>The most important principle is that search results are not conclusions. They are observations that become useful intelligence only after the investigator establishes context, evaluates source reliability, validates important relationships, and clearly separates evidence from inference.</p>
    `,
    keyPoints: [
      "Begin every investigation with a clear question",
      "Use iterative query engineering rather than one broad search",
      "Multilingual and regional searches can improve discovery",
      "Images and documents can become powerful pivots",
      "Compare Yandex with other search engines",
      "Validate important search results independently",
      "Correlate search findings with technical evidence",
      "Preserve queries, timestamps, sources, confidence, and limitations",
      "Separate observed evidence from inference",
      "Search results are leads and evidence, not automatic conclusions"
    ],
    example:
      "Question → Yandex query → query refinement → document/image pivot → domain discovery → DNS/certificate validation → cross-search correlation → evidence preservation → final report.",
    estimatedTime: 95,
    order: 8,
    difficulty: "Advanced",
    prerequisites: [
      "Yandex Search Fundamentals for OSINT",
      "Yandex Search Techniques and Query Construction",
      "Advanced Yandex Search, Regional Intelligence, and Image OSINT",
      "Yandex for People, Organizations, Documents, and Digital Footprints",
      "Yandex OSINT Pivoting, Correlation, and Cross-Search Investigation",
      "Yandex in ForenX AI LearnOSINT",
      "Yandex Evidence Preservation and Practical OSINT Lab"
    ]
  }
];

module.exports = toolLessons;