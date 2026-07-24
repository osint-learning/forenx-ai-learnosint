const technologyRules = [

    {
        name: "React",
        category: "Frontend Framework",
        match: (html) => {
            if (html.includes('id="root"')) {
                return {
                    detectedBy: "HTML",
                    evidence: 'id="root"'
                };
            }

            if (html.includes("__REACT_DEVTOOLS")) {
                return {
                    detectedBy: "Script",
                    evidence: "__REACT_DEVTOOLS"
                };
            }

            return null;
        }
    },

    {
        name: "Next.js",
        category: "Frontend Framework",
        match: ({ html, scripts }) => {

            const nextScript = scripts.find(script =>
                script && script.toLowerCase().includes("_next")
            );

            if (nextScript) {
                return {
                    detectedBy: "Script",
                    evidence: nextScript
                };
            }

            if (html.includes("__NEXT_DATA__")) {
                return {
                    detectedBy: "HTML",
                    evidence: "__NEXT_DATA__"
                };
            }

            return null;
        }
    },

    {
        name: "Google Analytics",
        category: "Analytics",
        match: ({ html, scripts }) => {

            const analytics = scripts.find(script =>
                script &&
                (
                    script.includes("gtag") ||
                    script.includes("analytics")
                )
            );

            if (analytics) {
                return {
                    detectedBy: "Script",
                    evidence: analytics
                };
            }

            if (html.includes("googletagmanager")) {
                return {
                    detectedBy: "HTML",
                    evidence: "googletagmanager"
                };
            }

            return null;
        }
    },

    {
        name: "Google Tag Manager",
        category: "Analytics",
        match: ({ html }) => {

            if (html.includes("GTM-")) {
                return {
                    detectedBy: "HTML",
                    evidence: "GTM-*"
                };
            }

            return null;
        }
    },

    {
        name: "Angular",
        category: "Frontend Framework",
        match: (html) => {

            if (html.includes("ng-version")) {
                return {
                    detectedBy: "HTML",
                    evidence: "ng-version"
                };
            }

            return null;
        }
    },

    {
        name: "Vue.js",
        category: "Frontend Framework",
        match: (html) => {

            if (html.includes("__VUE__")) {
                return {
                    detectedBy: "Script",
                    evidence: "__VUE__"
                };
            }

            if (html.includes("data-v-")) {
                return {
                    detectedBy: "HTML",
                    evidence: "data-v-*"
                };
            }

            return null;
        }
    },

    {
        name: "Bootstrap",
        category: "CSS Framework",
        match: (html) => {

            if (html.toLowerCase().includes("bootstrap")) {
                return {
                    detectedBy: "CSS",
                    evidence: "bootstrap"
                };
            }

            return null;
        }
    },

    {
        name: "Tailwind CSS",
        category: "CSS Framework",
        match: (html) => {

            if (html.toLowerCase().includes("tailwind")) {
                return {
                    detectedBy: "CSS",
                    evidence: "tailwind"
                };
            }

            return null;
        }
    },

    {
        name: "WordPress",
        category: "CMS",
        match: (html) => {

            if (
                html.includes("wp-content") ||
                html.includes("wp-includes")
            ) {
                return {
                    detectedBy: "HTML",
                    evidence: "wp-content"
                };
            }

            return null;
        }
    },

    {
        name: "Cloudflare",
        category: "CDN",
        match: ({ html, headers, scripts, stylesheets, metaTags, cookies }) => {

            if (headers.server?.toLowerCase().includes("cloudflare")) {
                return {
                    detectedBy: "Header",
                    evidence: headers.server
                };
            }

            return null;
        }
    },

    {
        name: "Google Web Server",
        category: "Web Server",
        match: ({ html, headers, scripts, stylesheets, metaTags, cookies }) => {

            if (headers.server?.toLowerCase() === "gws") {
                return {
                    detectedBy: "Header",
                    evidence: "gws"
                };
            }

            return null;
        }
    },

    {
        name: "Nginx",
        category: "Web Server",
        match: ({ html, headers, scripts, stylesheets, metaTags, cookies }) => {

            if (headers.server?.toLowerCase().includes("nginx")) {
                return {
                    detectedBy: "Header",
                    evidence: headers.server
                };
            }

            return null;
        }
    },

    {
        name: "Apache",
        category: "Web Server",
        match: ({ html, headers, scripts, stylesheets, metaTags, cookies }) => {

            if (headers.server?.toLowerCase().includes("apache")) {
                return {
                    detectedBy: "Header",
                    evidence: headers.server
                };
            }

            return null;
        }
    },

    {
        name: "Express",
        category: "Backend Framework",
        match: ({ html, headers, scripts, stylesheets, metaTags, cookies }) => {

            if (headers["x-powered-by"]?.toLowerCase().includes("express")) {
                return {
                    detectedBy: "Header",
                    evidence: headers["x-powered-by"]
                };
            }

            return null;
        }
    },

    {
        name: "PHP",
        category: "Backend Language",
        match: ({ html, headers, scripts, stylesheets, metaTags, cookies }) => {

            if (headers["x-powered-by"]?.toLowerCase().includes("php")) {
                return {
                    detectedBy: "Header",
                    evidence: headers["x-powered-by"]
                };
            }

            return null;
        }
    }

];

module.exports = technologyRules;