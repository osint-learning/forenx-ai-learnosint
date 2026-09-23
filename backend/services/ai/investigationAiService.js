const path = require('path');
const { askOllama } = require('./ollamaService');

// Helper to extract clean structured context from real recon data
function extractReconSummary(reconData, target) {
    const d = reconData || {};
    return {
        target: target || d.target || d.domain || 'target.com',
        domain: {
            ip: d.domain?.a?.[0] || d.domain?.ip || d.website?.ip || 'N/A',
            ns: d.domain?.ns || d.domain?.nameservers || [],
            mx: d.domain?.mx || [],
            txt: d.domain?.txt || [],
        },
        ssl: {
            valid: d.ssl?.valid !== false,
            issuer: typeof d.ssl?.issuer === 'object'
                ? (d.ssl.issuer.O || d.ssl.issuer.CN || 'Verified SSL')
                : (d.ssl?.issuer || 'N/A'),
            protocol: d.ssl?.protocol || 'TLS',
            validTo: d.ssl?.validTo || d.ssl?.expiry || 'N/A',
        },
        headers: {
            server: d.headers?.server || 'N/A',
            score: d.headers?.score || d.headers?.grade || 'N/A',
            strictTransportSecurity: Boolean(d.headers?.['strict-transport-security'] || d.headers?.hsts),
            contentSecurityPolicy: Boolean(d.headers?.['content-security-policy'] || d.headers?.csp),
            xFrameOptions: Boolean(d.headers?.['x-frame-options']),
            xContentTypeOptions: Boolean(d.headers?.['x-content-type-options']),
        },
        technology: Array.isArray(d.technology?.categories)
            ? d.technology.categories.map(c => ({
                category: c.name,
                tech: Array.isArray(c.technologies) ? c.technologies.map(t => t.name) : [c.name]
            }))
            : [],
        robots: {
            disallowCount: Array.isArray(d.robots?.disallow) ? d.robots.disallow.length : 0,
            disallowSample: Array.isArray(d.robots?.disallow) ? d.robots.disallow.slice(0, 5) : [],
            sitemaps: d.robots?.sitemaps || null,
        },
        metadata: {
            title: d.metadata?.metadata?.title || d.metadata?.title || 'N/A',
            description: d.metadata?.metadata?.description || d.metadata?.description || 'N/A',
            publisher: d.metadata?.metadata?.publisher || d.metadata?.publisher || 'N/A',
        }
    };
}

// 1. Tool Selection Service
async function recommendTools(investigation) {
    const summary = extractReconSummary(investigation.reconData, investigation.target);

    const prompt = "You are ForenX AI, an OSINT Investigation Mentor.\n" +
        "Analyze this REAL Recon data for target \"" + summary.target + "\":\n" +
        JSON.stringify(summary, null, 2) + "\n\n" +
        "Recommend 3 to 5 OSINT tools specifically suited for deeper investigation of this target's findings.\n" +
        "Return JSON ONLY in this format:\n" +
        JSON.stringify({
            recommendations: [
                {
                    toolName: "tool name",
                    category: "DNS / Web / Network / WHOIS / Exposure",
                    command: "example command with target",
                    rationale: "specific reason based on the recon data",
                    priority: "High / Medium / Low"
                }
            ]
        }, null, 2);

    const aiRes = await askOllama(prompt, null, { format: 'json', temperature: 0.1 });
    if (aiRes.success) {
        try {
            const parsed = JSON.parse(aiRes.response);
            if (Array.isArray(parsed.recommendations) && parsed.recommendations.length > 0) {
                return parsed.recommendations;
            }
        } catch (e) {}
    }

    // Grounded fallback
    const recs = [];
    const target = summary.target;

    if (summary.domain.ip !== 'N/A' || summary.domain.ns.length > 0) {
        recs.push({
            toolName: 'dig',
            category: 'DNS & Infrastructure',
            command: 'dig +nocmd ' + target + ' any +multiline +noall +answer',
            rationale: 'Target resolves to ' + summary.domain.ip + '. Dig allows deep inspection of authoritative nameservers and DNS record consistency.',
            priority: 'High',
        });
        recs.push({
            toolName: 'dnsenum',
            category: 'DNS & Subdomain Enumeration',
            command: 'dnsenum --enum ' + target,
            rationale: 'Enumerate subdomains and verify DNS zone transfer vulnerabilities for ' + target + '.',
            priority: 'Medium',
        });
    }

    if (summary.technology.length > 0 || summary.headers.server !== 'N/A') {
        const techNames = summary.technology.flatMap(t => t.tech).slice(0, 3).join(', ') || 'Web Server';
        recs.push({
            toolName: 'whatweb',
            category: 'Web Technology Fingerprinting',
            command: 'whatweb -v -a 3 https://' + target,
            rationale: 'Detected stack (' + techNames + ' / Server: ' + summary.headers.server + '). WhatWeb verifies version numbers, plugins, and server software build.',
            priority: 'High',
        });
    }

    if (!summary.headers.strictTransportSecurity || !summary.headers.contentSecurityPolicy) {
        recs.push({
            toolName: 'curl',
            category: 'Security Headers Inspection',
            command: 'curl -I -L https://' + target,
            rationale: 'Missing critical headers (HSTS / CSP). Direct HTTP response header inspection verifies cache-control, HSTS, and clickjacking protections.',
            priority: 'Medium',
        });
    }

    if (summary.robots.disallowCount > 0) {
        recs.push({
            toolName: 'nikto',
            category: 'Web Vulnerability & Endpoint Scanner',
            command: 'nikto -h https://' + target + ' -Tuning 1',
            rationale: summary.robots.disallowCount + ' disallowed robots paths identified (' + summary.robots.disallowSample.slice(0, 2).join(', ') + '). Nikto correlates hidden administrative endpoints.',
            priority: 'Medium',
        });
    }

    if (recs.length === 0) {
        recs.push({
            toolName: 'whois',
            category: 'Domain Intelligence',
            command: 'whois ' + target,
            rationale: 'Gather registrar, creation date, nameservers, and organization ownership records for ' + target + '.',
            priority: 'High',
        });
    }

    return recs;
}

// 2. Output Analysis Service
async function analyzeReconSection(investigation, section, query) {
    const summary = extractReconSummary(investigation.reconData, investigation.target);
    const target = summary.target;

    const sectionKey = (section || 'general').toLowerCase();
    let relevantData = summary;
    if (sectionKey.includes('dns') || sectionKey.includes('domain')) relevantData = summary.domain;
    else if (sectionKey.includes('ssl')) relevantData = summary.ssl;
    else if (sectionKey.includes('header')) relevantData = summary.headers;
    else if (sectionKey.includes('tech')) relevantData = summary.technology;
    else if (sectionKey.includes('robot')) relevantData = summary.robots;
    else if (sectionKey.includes('meta')) relevantData = summary.metadata;

    const prompt = "You are ForenX AI, an educational OSINT investigation mentor.\n" +
        "Target: " + target + "\n" +
        "Section Requested: " + section + "\n" +
        "Student Query: " + (query || "Explain the technical findings and security implications of this section in beginner-friendly language.") + "\n\n" +
        "REAL RECON DATA:\n" +
        JSON.stringify(relevantData, null, 2) + "\n\n" +
        "Provide an educational analysis in JSON:\n" +
        JSON.stringify({
            section: section,
            title: "Clear educational title",
            summary: "1-2 sentence overview",
            technicalDetails: ["bullet 1", "bullet 2", "bullet 3"],
            securityImplication: "What this means for an OSINT investigator",
            recommendedAction: "Concrete next step to investigate further"
        }, null, 2);

    const aiRes = await askOllama(prompt, null, { format: 'json', temperature: 0.1 });
    if (aiRes.success) {
        try {
            const parsed = JSON.parse(aiRes.response);
            if (parsed.title && parsed.summary) {
                return parsed;
            }
        } catch (e) {}
    }

    // Grounded Fallback
    if (sectionKey.includes('dns')) {
        return {
            section: 'DNS & Routing',
            title: 'DNS Analysis for ' + target,
            summary: 'Target resolves to primary IP address ' + summary.domain.ip + ' with ' + summary.domain.ns.length + ' configured nameservers.',
            technicalDetails: [
                'Primary A Record resolution: ' + summary.domain.ip,
                'Authoritative Nameservers: ' + (summary.domain.ns.join(', ') || 'Default cloud DNS'),
                'MX Mail Records: ' + (summary.domain.mx.join(', ') || 'None exposed in scan')
            ],
            securityImplication: 'DNS records define the routing backbone and expose whether the target utilizes reverse proxy/CDN infrastructure (such as Cloudflare) or hosts services directly on dedicated IP blocks.',
            recommendedAction: 'Perform reverse IP lookup and query historical DNS records to determine if any origin IP addresses are exposed.'
        };
    } else if (sectionKey.includes('ssl')) {
        return {
            section: 'SSL/TLS Certificate',
            title: 'SSL/TLS Security Posture for ' + target,
            summary: 'SSL certificate is ' + (summary.ssl.valid ? 'VALID' : 'INVALID/UNVERIFIED') + ' and issued by ' + summary.ssl.issuer + ' using ' + summary.ssl.protocol + '.',
            technicalDetails: [
                'Certificate Status: ' + (summary.ssl.valid ? 'Active & Valid' : 'Check Expiration'),
                'Issuer Authority: ' + summary.ssl.issuer,
                'Valid Until: ' + summary.ssl.validTo,
                'Protocol Version: ' + summary.ssl.protocol
            ],
            securityImplication: 'Valid TLS certificates encrypt communications and verify host authenticity. The certificate authority and Subject Alternative Names (SANs) frequently reveal related staging subdomains and organizational entities.',
            recommendedAction: 'Inspect certificate SAN fields using crt.sh to map all sister domains sharing the same SSL cert.'
        };
    } else if (sectionKey.includes('header')) {
        return {
            section: 'Security Headers',
            title: 'HTTP Response Header Inspection for ' + target,
            summary: 'Server banner identified as "' + summary.headers.server + '". Overall header security score: ' + summary.headers.score + '.',
            technicalDetails: [
                'Server Header: ' + summary.headers.server,
                'HSTS Enabled: ' + (summary.headers.strictTransportSecurity ? 'Yes (Protected)' : 'No (Vulnerable to downgrade attacks)'),
                'Content Security Policy: ' + (summary.headers.contentSecurityPolicy ? 'Configured' : 'Missing'),
                'X-Frame-Options: ' + (summary.headers.xFrameOptions ? 'Configured' : 'Missing (Clickjacking risk)')
            ],
            securityImplication: 'Missing security headers like HSTS and CSP allow potential man-in-the-middle downgrade attacks and cross-site scripting (XSS) exploitation.',
            recommendedAction: 'Check for missing X-Content-Type-Options and test if the application allows embedding inside iframe elements.'
        };
    } else if (sectionKey.includes('robot')) {
        return {
            section: 'Robots.txt & Crawling Rules',
            title: 'Robots.txt Crawler Directives for ' + target,
            summary: 'Detected ' + summary.robots.disallowCount + ' disallow rules intended to hide sensitive directories from search engine bots.',
            technicalDetails: [
                'Total Disallowed Paths: ' + summary.robots.disallowCount,
                'Sample Endpoints: ' + (summary.robots.disallowSample.join(', ') || 'No disallow rules'),
                'Sitemap Configuration: ' + (summary.robots.sitemaps || 'None specified')
            ],
            securityImplication: 'Robots.txt files intended to keep search crawlers away from administrative or staging portals frequently serve as a roadmap for OSINT investigators to discover unlinked assets.',
            recommendedAction: 'Manually review disallowed endpoints for admin login panels, backup archives, or private API routes.'
        };
    } else if (sectionKey.includes('tech')) {
        const techList = summary.technology.map(t => t.category + ': ' + t.tech.join(', '));
        return {
            section: 'Technology Fingerprinting',
            title: 'Technology Stack Identification for ' + target,
            summary: 'Identified ' + summary.technology.length + ' technology categories powering the target website.',
            technicalDetails: techList.length > 0 ? techList : ['Standard HTTP Web Server', 'HTML5 Architecture'],
            securityImplication: 'Understanding the underlying web framework, CMS, and server components enables targeted vulnerability mapping against public CVE databases.',
            recommendedAction: 'Correlate identified software versions against the National Vulnerability Database (NVD) to assess patch levels.'
        };
    } else {
        return {
            section: 'Metadata & Web Assets',
            title: 'Webpage Metadata Analysis for ' + target,
            summary: 'Page Title: "' + summary.metadata.title + '". Publisher: ' + summary.metadata.publisher + '.',
            technicalDetails: [
                'Page Title: ' + summary.metadata.title,
                'Meta Description: ' + summary.metadata.description,
                'Publisher / Author: ' + summary.metadata.publisher
            ],
            securityImplication: 'Metadata reveals business context, branding assets, copyright signatures, and internal naming conventions helpful for social engineering defense and entity attribution.',
            recommendedAction: 'Extract keywords and author tags to search across code repositories and social media registries.'
        };
    }
}

// 3. AI Investigation Mentor Chat
async function chatWithMentor(investigation, userMessage, chatHistory = []) {
    const summary = extractReconSummary(investigation.reconData, investigation.target);
    const target = summary.target;

    const completedObjectives = (investigation.objectives || [])
        .filter(o => o.completed)
        .map(o => o.title);

    const prompt = "You are ForenX AI, an expert OSINT Investigation Mentor assisting a student.\n" +
        "TARGET UNDER INVESTIGATION: " + target + "\n\n" +
        "REAL RECONNAISSANCE CONTEXT:\n" +
        "- Target IP: " + summary.domain.ip + "\n" +
        "- Nameservers: " + (summary.domain.ns.join(', ') || 'N/A') + "\n" +
        "- SSL Issuer: " + summary.ssl.issuer + " (Valid: " + summary.ssl.valid + ")\n" +
        "- Server Header: " + summary.headers.server + "\n" +
        "- Security Score: " + summary.headers.score + "\n" +
        "- Missing Headers: " + (!summary.headers.strictTransportSecurity ? 'HSTS, ' : '') + (!summary.headers.contentSecurityPolicy ? 'CSP, ' : '') + "\n" +
        "- Technologies: " + (summary.technology.map(t => t.tech.join(', ')).join('; ') || 'Web Server') + "\n" +
        "- Robots Disallow Rules: " + summary.robots.disallowCount + " rules (" + summary.robots.disallowSample.join(', ') + ")\n" +
        "- Metadata Title: \"" + summary.metadata.title + "\"\n\n" +
        "STUDENT COMPLETED OBJECTIVES:\n" +
        (completedObjectives.length > 0 ? completedObjectives.join('\n') : 'None yet') + "\n\n" +
        "STUDENT QUESTION / STATEMENT:\n" +
        "\"" + userMessage + "\"\n\n" +
        "RULES:\n" +
        "1. Provide concise, clear, and educational mentoring guidance (2 to 4 paragraphs max).\n" +
        "2. Directly reference the real reconnaissance findings for " + target + ".\n" +
        "3. Guide the student on what to investigate next rather than just giving a single answer.\n" +
        "4. Maintain an encouraging cybersecurity investigator persona.";

    const aiRes = await askOllama(prompt);
    if (aiRes.success && aiRes.response && aiRes.response.trim().length > 20) {
        return aiRes.response.trim();
    }

    const query = (userMessage || '').toLowerCase();
    if (query.includes('dns') || query.includes('ip') || query.includes('domain')) {
        return "Looking at the reconnaissance data for **" + target + "**, the domain resolves to IP `" + summary.domain.ip + "`. Your nameservers are configured as `" + (summary.domain.ns.join(', ') || 'Cloud DNS') + "`.\n\nTo advance your investigation, verify if this IP belongs to a Cloud CDN (like Cloudflare) or a direct web hosting provider. If it's a proxy, you should investigate historical DNS records to uncover the underlying origin server.";
    } else if (query.includes('ssl') || query.includes('cert') || query.includes('https')) {
        return "The SSL certificate for **" + target + "** is issued by **" + summary.ssl.issuer + "** and is currently " + (summary.ssl.valid ? 'valid' : 'expired/untrusted') + " (valid until " + summary.ssl.validTo + ").\n\nIn OSINT investigations, SSL certificates are goldmines: checking certificate transparency logs and Subject Alternative Names (SANs) often reveals unlisted internal subdomains and sister environments.";
    } else if (query.includes('header') || query.includes('server') || query.includes('hsts')) {
        return "The target's HTTP server banner reports `" + summary.headers.server + "` with an overall header grade of `" + summary.headers.score + "`.\n\nNotice that " + (!summary.headers.strictTransportSecurity ? 'HSTS is missing, which leaves users susceptible to SSL stripping attacks' : 'HSTS is active') + ". Document this in your security findings and check if Content-Security-Policy is properly enforced.";
    } else if (query.includes('robot') || query.includes('disallow') || query.includes('path')) {
        return "The crawler analysis reveals **" + summary.robots.disallowCount + "** disallowed directories in robots.txt (such as `" + summary.robots.disallowSample.slice(0, 3).join(', ') + "`).\n\nAdministrators often use robots.txt to keep web spiders away from admin portals, staging areas, or test scripts. Cross-reference these paths with your web application findings to identify potential unauthorized entry points.";
    } else {
        return "Welcome to the active investigation on **" + target + "**. Based on our reconnaissance data, we have mapped IP `" + summary.domain.ip + "`, server banner `" + summary.headers.server + "`, and " + summary.technology.length + " technology stack components.\n\nI recommend starting with your first uncompleted objective: examine the DNS records and correlate the detected technologies with known CVE signatures. How would you like to proceed?";
    }
}

// 4. Progressive AI Hints Service
async function generateProgressiveHint(investigation, level = 1) {
    const summary = extractReconSummary(investigation.reconData, investigation.target);
    const target = summary.target;
    const requestedLevel = Math.max(1, Math.min(3, Number(level) || 1));

    const prompt = "You are ForenX AI, an OSINT investigation mentor.\n" +
        "A student requested a Level " + requestedLevel + " progressive hint for target \"" + target + "\".\n\n" +
        "REAL RECON DATA:\n" +
        JSON.stringify(summary, null, 2) + "\n\n" +
        "HINT LEVEL DEFINITION:\n" +
        "- Level 1 (General Direction): Nudge the student toward the right recon area.\n" +
        "- Level 2 (Specific Focus): Highlight specific data points without giving the final conclusion.\n" +
        "- Level 3 (Correlation Strategy): Explain how two or more evidence items connect together.\n\n" +
        "STRICT RULES:\n" +
        "- Do NOT reveal the final conclusion directly.\n" +
        "Return JSON only in this format:\n" +
        JSON.stringify({
            level: requestedLevel,
            hint: "one clear hint",
            guidance: "what the student should look for",
            nextStep: "one actionable step"
        }, null, 2);

    const aiRes = await askOllama(prompt, null, { format: 'json', temperature: 0.1 });
    if (aiRes.success) {
        try {
            const parsed = JSON.parse(aiRes.response);
            if (parsed.hint && parsed.guidance) {
                return {
                    level: requestedLevel,
                    hint: parsed.hint,
                    guidance: parsed.guidance,
                    nextStep: parsed.nextStep || 'Inspect the corresponding section in the Recon Intelligence Dossier.',
                };
            }
        } catch (e) {}
    }

    if (requestedLevel === 1) {
        return {
            level: 1,
            hint: "Start by comparing the resolved IP (" + summary.domain.ip + ") and the server banner (" + summary.headers.server + ") in the Recon Dossier.",
            guidance: 'Observe whether the web traffic passes through a third-party proxy/CDN or hits the host directly.',
            nextStep: 'Check the DNS & Security Headers sections to identify the infrastructure provider.'
        };
    } else if (requestedLevel === 2) {
        return {
            level: 2,
            hint: "Notice the security headers configuration (" + summary.headers.score + ") and the " + summary.robots.disallowCount + " rules in robots.txt.",
            guidance: "Look closely at missing defensive headers like HSTS and examine the specific disallowed paths (" + (summary.robots.disallowSample.slice(0, 2).join(', ') || 'hidden paths') + ").",
            nextStep: 'Determine if any disallowed routes point to administrative panels or unpatched endpoints.'
        };
    } else {
        return {
            level: 3,
            hint: "Correlate the SSL Certificate Issuer (" + summary.ssl.issuer + ") with the identified technology stack (" + (summary.technology.map(t => t.tech[0]).filter(Boolean).slice(0, 2).join(', ') || 'Web Server') + ") and DNS routing.",
            guidance: 'When a target uses edge SSL protection with specific backend software versions, cross-referencing these data points establishes the entire attack surface and defensive posture.',
            nextStep: 'Click "Correlate Findings" to synthesize these evidence nodes on your Detective Wall.'
        };
    }
}

// 5. Next-Step Recommendation Service
async function recommendNextStep(investigation) {
    const summary = extractReconSummary(investigation.reconData, investigation.target);
    const target = summary.target;
    const objectives = investigation.objectives || [];

    const uncompleted = objectives.filter(o => !o.completed);
    const completedCount = objectives.filter(o => o.completed).length;

    let title = 'Complete Domain & DNS Analysis';
    let rationale = 'Verify DNS records and nameserver delegation for ' + target + '.';
    let suggestedAction = 'Examine A and NS records in the Recon Intelligence Dossier.';
    let priority = 'High';

    if (uncompleted.length === 0) {
        title = 'Synthesize Final Investigation Findings';
        rationale = 'All 5 investigative objectives have been completed!';
        suggestedAction = 'Generate correlated findings, review your methodology score, and export your investigation report.';
        priority = 'High';
    } else {
        const nextObj = uncompleted[0];
        const objTitle = (nextObj.title || '').toLowerCase();
        if (objTitle.includes('dns') || objTitle.includes('domain')) {
            title = 'Examine DNS Records & Infrastructure';
            rationale = 'Target resolves to ' + summary.domain.ip + '. Check if nameservers match the hosting environment.';
            suggestedAction = 'Inspect DNS records and run a dig query to identify subdomains.';
        } else if (objTitle.includes('technolog')) {
            title = 'Identify Web Frameworks & Tech Stack';
            rationale = 'Detected ' + summary.technology.length + ' technology components powering the target.';
            suggestedAction = 'Review detected CMS, server versions, and JavaScript libraries in the Tech tab.';
        } else if (objTitle.includes('service') || objTitle.includes('exposed')) {
            title = 'Examine Exposed Services & Security Headers';
            rationale = 'Server header reports ' + summary.headers.server + '. Check for missing security headers and robots.txt disallow rules.';
            suggestedAction = 'Inspect the Security Headers & Robots.txt cards in the Intelligence Dossier.';
        } else if (objTitle.includes('correlat')) {
            title = 'Correlate Multi-Source Findings';
            rationale = 'You have analyzed individual data points. Now link DNS, SSL, and Web technologies together.';
            suggestedAction = 'Click "Correlate Findings" to generate structured cross-source intelligence.';
        }
    }

    return {
        stepTitle: title,
        rationale,
        suggestedAction,
        priority,
        progress: completedCount + ' / ' + objectives.length + ' Objectives Completed',
    };
}

// 6. Findings Correlation Service
async function correlateInvestigationFindings(investigation) {
    const summary = extractReconSummary(investigation.reconData, investigation.target);
    const target = summary.target;

    const findings = [];

    // Finding 1: DNS & Infrastructure Footprint
    const nsStr = summary.domain.ns.join(', ');
    const isCloudflare = nsStr.toLowerCase().includes('cloudflare') || (summary.headers.server || '').toLowerCase().includes('cloudflare');
    findings.push({
        title: isCloudflare ? 'Cloudflare Edge CDN & Reverse Proxy Routing' : 'Direct DNS Host Resolution',
        category: 'DNS & Infrastructure',
        severity: isCloudflare ? 'Info' : 'Low',
        description: isCloudflare
            ? 'Target ' + target + ' routes traffic through Cloudflare Anycast CDN (IP: ' + summary.domain.ip + ', NS: ' + (nsStr || 'Cloudflare') + '). This masks the origin server IP and provides DDoS/WAF filtering.'
            : 'Target ' + target + ' resolves directly to primary IP ' + summary.domain.ip + ' via nameservers (' + (nsStr || 'Standard DNS') + ').',
        source: 'DNS Analysis + HTTP Server Header',
        relatedEvidence: [summary.domain.ip, ...(summary.domain.ns.slice(0, 2))],
        correlationInfo: 'Correlated A-Record (' + summary.domain.ip + ') with Nameserver delegation (' + (nsStr || 'DNS') + ') and Server HTTP Banner (' + summary.headers.server + ').',
        status: 'Correlated'
    });

    // Finding 2: SSL/TLS & Encryption Security
    const sslValid = summary.ssl.valid;
    const sslIssuer = summary.ssl.issuer;
    findings.push({
        title: sslValid ? 'Active TLS Certificate (' + sslIssuer + ')' : 'SSL/TLS Certificate Validity Alert',
        category: 'Security Headers & SSL',
        severity: sslValid ? 'Low' : 'High',
        description: 'Transport layer encryption is active using ' + summary.ssl.protocol + '. Certificate issued by ' + sslIssuer + ', valid until ' + summary.ssl.validTo + '.',
        source: 'SSL Certificate Analysis',
        relatedEvidence: [sslIssuer, summary.ssl.protocol, summary.ssl.validTo],
        correlationInfo: 'Correlated TLS protocol version (' + summary.ssl.protocol + ') with certificate authority (' + sslIssuer + ') and HTTPS endpoint accessibility.',
        status: 'Correlated'
    });

    // Finding 3: HTTP Security Header Posture
    const missingHeaders = [];
    if (!summary.headers.strictTransportSecurity) missingHeaders.push('HSTS');
    if (!summary.headers.contentSecurityPolicy) missingHeaders.push('Content-Security-Policy');
    if (!summary.headers.xFrameOptions) missingHeaders.push('X-Frame-Options');
    if (!summary.headers.xContentTypeOptions) missingHeaders.push('X-Content-Type-Options');

    findings.push({
        title: missingHeaders.length > 0 ? 'Defensive Header Gaps (' + missingHeaders.slice(0, 2).join(', ') + ')' : 'Hardened HTTP Security Headers',
        category: 'Security Headers & SSL',
        severity: missingHeaders.length >= 2 ? 'Medium' : 'Low',
        description: missingHeaders.length > 0
            ? 'Target is missing ' + missingHeaders.length + ' defensive HTTP headers (' + missingHeaders.join(', ') + '). Overall header security grade: ' + summary.headers.score + '.'
            : 'Target has implemented all recommended defensive HTTP response headers with a security score of ' + summary.headers.score + '.',
        source: 'HTTP Response Headers',
        relatedEvidence: [summary.headers.server, 'Grade: ' + summary.headers.score, ...missingHeaders],
        correlationInfo: 'Cross-referenced server HTTP banner (' + summary.headers.server + ') with missing policy headers (' + (missingHeaders.join(', ') || 'None') + ').',
        status: 'Correlated'
    });

    // Finding 4: Technology Stack & Frameworks
    if (summary.technology.length > 0) {
        const allTech = summary.technology.flatMap(t => t.tech);
        findings.push({
            title: 'Identified Web Technology Stack (' + allTech.slice(0, 3).join(', ') + ')',
            category: 'Web Application',
            severity: 'Info',
            description: 'Host runs ' + summary.technology.length + ' technology categories including ' + allTech.slice(0, 4).join(', ') + '. Server software: ' + summary.headers.server + '.',
            source: 'Technology Fingerprinting',
            relatedEvidence: allTech.slice(0, 5),
            correlationInfo: 'Correlated DOM signatures, JavaScript libraries, and HTTP response headers to fingerprint active web stack.',
            status: 'Correlated'
        });
    }

    // Finding 5: Information Disclosure & Crawling Directives
    if (summary.robots.disallowCount > 0) {
        findings.push({
            title: 'Crawler Endpoint Exposure (' + summary.robots.disallowCount + ' Disallow Directives)',
            category: 'Exposure & Information Disclosure',
            severity: summary.robots.disallowCount > 5 ? 'Medium' : 'Low',
            description: 'The robots.txt file reveals ' + summary.robots.disallowCount + ' hidden paths (' + summary.robots.disallowSample.slice(0, 4).join(', ') + '). These directories provide high-value reconnaissance targets.',
            source: 'robots.txt Crawler Rules',
            relatedEvidence: summary.robots.disallowSample.slice(0, 4),
            correlationInfo: 'Correlated robots.txt crawl rules with web application architecture to discover unindexed administrative and staging endpoints.',
            status: 'Correlated'
        });
    }

    return findings;
}

// 7. Student Evaluation Service
function evaluateStudentProgress(investigation) {
    const summary = extractReconSummary(investigation.reconData, investigation.target);
    const objectives = investigation.objectives || [];
    const actions = investigation.studentActions || [];
    const findings = investigation.findings || [];

    const totalObjectives = objectives.length || 5;
    const completedObjectives = objectives.filter(o => o.completed).length;

    const objScore = (completedObjectives / totalObjectives) * 50;
    const actionScore = Math.min(25, actions.length * 5);
    const findingScore = Math.min(25, findings.length * 5);

    const totalScore = Math.round(Math.min(100, Math.max(15, objScore + actionScore + findingScore)));

    let grade = 'C (Novice)';
    if (totalScore >= 90) grade = 'A+ (Elite Master Investigator)';
    else if (totalScore >= 80) grade = 'A (Senior OSINT Analyst)';
    else if (totalScore >= 70) grade = 'B+ (Proficient Investigator)';
    else if (totalScore >= 55) grade = 'B (Developing Analyst)';
    else if (totalScore >= 40) grade = 'C+ (Apprentice)';

    const strengths = [];
    const improvements = [];

    if (completedObjectives >= 3) {
        strengths.push('Completed ' + completedObjectives + '/' + totalObjectives + ' core investigative milestones systematically.');
    } else {
        improvements.push('Complete the remaining ' + (totalObjectives - completedObjectives) + ' investigative objectives.');
    }

    if (findings.length > 0) {
        strengths.push('Generated and reviewed ' + findings.length + ' multi-source correlated intelligence findings.');
    } else {
        improvements.push('Run Findings Correlation to synthesize DNS, SSL, and Web technology evidence.');
    }

    if (actions.length >= 3) {
        strengths.push('Maintained an active investigation log with ' + actions.length + ' recorded actions.');
    } else {
        improvements.push('Engage with tool recommendations and request AI output analysis for deeper evidence verification.');
    }

    strengths.push('Ingested real Reconnaissance baseline for target ' + summary.target + '.');

    let feedback = '';
    if (totalScore >= 80) {
        feedback = 'Outstanding investigation workflow! You methodically examined the DNS infrastructure (' + summary.domain.ip + '), SSL security posture (' + summary.ssl.issuer + '), and correlated web technologies. Your structured findings reflect comprehensive reconnaissance coverage.';
    } else if (totalScore >= 50) {
        feedback = 'Good investigative progress on ' + summary.target + '. You have established the baseline reconnaissance context. To achieve a top evaluation score, ensure you examine the security headers score (' + summary.headers.score + ') and review all disallowed endpoints in robots.txt before concluding.';
    } else {
        feedback = 'Investigation initiated on ' + summary.target + '. Follow the standard OSINT methodology: first verify DNS records, examine SSL certificate validity, inspect server headers, and mark objectives as completed as you verify each evidence piece.';
    }

    return {
        score: totalScore,
        grade,
        methodology: 'NIST / OSINT Reconnaissance Framework',
        strengths,
        improvements,
        feedback,
        lastEvaluatedAt: new Date()
    };
}


// 8. Generate Final Investigation Conclusion
async function generateFinalConclusion(investigation) {
    const summary = extractReconSummary(investigation.reconData, investigation.target);
    const target = summary.target;
    const findings = investigation.findings || [];
    const evaluation = investigation.evaluation || {};

    const prompt = "You are ForenX AI, Senior Cyber Threat Intelligence Lead.\n" +
        "Synthesize the FINAL INVESTIGATION CONCLUSION for target: \"" + target + "\"\n\n" +
        "REAL RECON CONTEXT:\n" +
        JSON.stringify(summary, null, 2) + "\n\n" +
        "CORRELATED FINDINGS (" + findings.length + "):\n" +
        JSON.stringify(findings.map(f => ({ title: f.title, severity: f.severity, category: f.category, desc: f.description })), null, 2) + "\n\n" +
        "STUDENT EVALUATION:\n" +
        JSON.stringify(evaluation, null, 2) + "\n\n" +
        "Generate a comprehensive executive conclusion in JSON:\n" +
        JSON.stringify({
            summary: "Executive final conclusion summarizing overall surface exposure and infrastructure",
            threatLevel: "Critical / High / Medium / Low",
            keyTakeaways: ["takeaway 1", "takeaway 2", "takeaway 3"],
            recommendations: ["recommendation 1", "recommendation 2", "recommendation 3"]
        }, null, 2);

    const aiRes = await askOllama(prompt, null, { format: 'json', temperature: 0.1 });
    if (aiRes.success) {
        try {
            const parsed = JSON.parse(aiRes.response);
            if (parsed.summary && Array.isArray(parsed.keyTakeaways)) {
                return {
                    summary: parsed.summary,
                    threatLevel: parsed.threatLevel || 'Medium',
                    keyTakeaways: parsed.keyTakeaways,
                    recommendations: parsed.recommendations || [],
                    generatedAt: new Date(),
                };
            }
        } catch (e) {}
    }

    const missingHeaders = [];
    if (!summary.headers.strictTransportSecurity) missingHeaders.push('HSTS');
    if (!summary.headers.contentSecurityPolicy) missingHeaders.push('CSP');

    return {
        summary: 'Investigation on ' + target + ' successfully concluded. Target resolves to ' + summary.domain.ip + ' with active server software ' + summary.headers.server + ' and valid TLS certificate issued by ' + summary.ssl.issuer + '. ' + (findings.length > 0 ? 'A total of ' + findings.length + ' correlated findings were mapped across DNS, Web Application, and Information Disclosure vectors.' : 'Reconnaissance baseline mapped across infrastructure and web surface.'),
        threatLevel: missingHeaders.length > 0 || summary.robots.disallowCount > 5 ? 'Medium' : 'Low',
        keyTakeaways: [
            'Infrastructure: Primary A-Record routed to ' + summary.domain.ip + ' with ' + summary.domain.ns.length + ' authoritative nameservers.',
            'Encryption: Active TLS encryption (' + summary.ssl.protocol + ') verified under certificate authority ' + summary.ssl.issuer + '.',
            'Defense Posture: HTTP Security Grade ' + summary.headers.score + ' with ' + (missingHeaders.length > 0 ? 'missing ' + missingHeaders.join(' and ') : 'standard headers enforced') + '.',
            'Surface Exposure: ' + summary.robots.disallowCount + ' crawl rules in robots.txt and ' + summary.technology.length + ' detected tech stack components.'
        ],
        recommendations: [
            'Enforce HTTP Strict Transport Security (HSTS) and Content Security Policy (CSP) headers.',
            'Review disallowed robots.txt paths to verify administrative panels are shielded behind SSO/MFA.',
            'Monitor Certificate Transparency logs for unexpected subdomain issuance.'
        ],
        generatedAt: new Date()
    };
}

// 9. Generate Complete Investigation Intelligence Report
async function generateInvestigationReport(investigation) {
    const summary = extractReconSummary(investigation.reconData, investigation.target);
    const target = summary.target;
    const findings = investigation.findings || [];
    const evaluation = investigation.evaluation || {};
    const conclusion = investigation.finalConclusion || await generateFinalConclusion(investigation);

    const findingsCount = {
        total: findings.length,
        critical: findings.filter(f => f.severity === 'Critical').length,
        high: findings.filter(f => f.severity === 'High').length,
        medium: findings.filter(f => f.severity === 'Medium').length,
        low: findings.filter(f => f.severity === 'Low').length,
        info: findings.filter(f => f.severity === 'Info').length,
    };

    return {
        title: 'ForenX AI OSINT Investigation Report — ' + target,
        executiveSummary: conclusion.summary,
        target: target,
        riskScore: evaluation.score ? Math.round(100 - evaluation.score * 0.4) : 45,
        threatLevel: conclusion.threatLevel,
        findingsCount,
        keyFindings: findings.map(f => ({
            title: f.title,
            category: f.category,
            severity: f.severity,
            description: f.description,
            source: f.source,
            correlationInfo: f.correlationInfo
        })),
        studentEvaluation: {
            score: evaluation.score || 20,
            grade: evaluation.grade || 'In Progress',
            methodology: evaluation.methodology || 'NIST / OSINT Reconnaissance Framework',
            strengths: evaluation.strengths || [],
            feedback: evaluation.feedback || ''
        },
        recommendations: conclusion.recommendations,
        generatedAt: new Date()
    };
}

module.exports = {
    generateFinalConclusion,
    generateInvestigationReport,
    extractReconSummary,
    recommendTools,
    analyzeReconSection,
    chatWithMentor,
    generateProgressiveHint,
    recommendNextStep,
    correlateInvestigationFindings,
    evaluateStudentProgress
};
