const { spawn } = require("child_process");

const cleanTarget = (input) => {
    return String(input || "").trim();
};

const runWhatweb = (target) => {
    return new Promise((resolve, reject) => {
        const domain = cleanTarget(target);
        if (!domain) {
            return reject(new Error("Target domain or URL is required for whatweb."));
        }

        const child = spawn("whatweb", ["--color=never", domain], {
            windowsHide: true,
        });

        let stdout = "";
        let stderr = "";

        const timeout = setTimeout(() => {
            child.kill();
            reject(new Error("whatweb command timed out after 15 seconds."));
        }, 15000);

        child.stdout.on("data", (data) => {
            stdout += data.toString();
        });

        child.stderr.on("data", (data) => {
            stderr += data.toString();
        });

        child.on("error", (error) => {
            clearTimeout(timeout);
            if (error.code === "ENOENT") {
                return reject(
                    new Error(
                        "whatweb is not installed or not available in the system PATH. Please install WhatWeb."
                    )
                );
            }
            reject(error);
        });

        child.on("close", (code) => {
            clearTimeout(timeout);

            const rawOutput = stdout.trim();
            if (!rawOutput && stderr.trim()) {
                return reject(new Error(stderr.trim()));
            }

            let statusCode = null;
            let title = null;
            let server = null;
            const technologies = [];

            const statusMatch = rawOutput.match(/\[(\d{3})\]/);
            if (statusMatch) statusCode = parseInt(statusMatch[1], 10);

            const titleMatch = rawOutput.match(/Title\[([^\]]+)\]/i);
            if (titleMatch) title = titleMatch[1];

            const serverMatch = rawOutput.match(/HTTPServer\[([^\]]+)\]/i);
            if (serverMatch) server = serverMatch[1];

            const techMatches = rawOutput.match(/[A-Za-z0-9_-]+\[[^\]]*\]/g);
            if (techMatches) {
                techMatches.forEach((m) => {
                    const name = m.split("[")[0];
                    if (name && !["Title", "HTTPServer", "IP", "Country"].includes(name)) {
                        technologies.push(name);
                    }
                });
            }

            resolve({
                target: domain,
                statusCode: statusCode || 200,
                title: title || "Unknown",
                server: server || "Unknown",
                technologies: [...new Set(technologies)],
                exitCode: code,
                rawOutput: rawOutput || "whatweb execution completed.",
            });
        });
    });
};

module.exports = { runWhatweb };
