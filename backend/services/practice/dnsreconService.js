const { spawn } = require("child_process");

const cleanDomain = (input) => {
    return String(input || "")
        .trim()
        .replace(/^https?:\/\//i, "")
        .split("/")[0]
        .split(":")[0]
        .trim();
};

const runDnsrecon = (target) => {
    return new Promise((resolve, reject) => {
        const domain = cleanDomain(target);
        if (!domain) {
            return reject(new Error("Target domain is required for dnsrecon."));
        }

        const child = spawn("dnsrecon", ["-d", domain], {
            windowsHide: true,
        });

        let stdout = "";
        let stderr = "";

        const timeout = setTimeout(() => {
            child.kill();
            reject(new Error("dnsrecon command timed out after 15 seconds."));
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
                        "dnsrecon is not installed or not available in the system PATH. Please install dnsrecon (pip install dnsrecon)."
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

            const lines = rawOutput.split(/\r?\n/);
            const records = [];
            const nameservers = [];
            const subdomains = [];

            for (const line of lines) {
                const trimmed = line.trim();
                if (!trimmed) continue;

                if (trimmed.includes("[*] NS:")) {
                    const ns = trimmed.replace(/.*[*]s*NS:s*/i, "").trim();
                    if (ns) nameservers.push(ns);
                } else if (trimmed.includes("[*] A:")) {
                    const aRec = trimmed.replace(/.*[*]s*A:s*/i, "").trim();
                    if (aRec) records.push(aRec);
                } else if (trimmed.includes("[*]")) {
                    records.push(trimmed);
                }
            }

            resolve({
                domain,
                records,
                nameservers: [...new Set(nameservers)],
                subdomains: [...new Set(subdomains)],
                exitCode: code,
                rawOutput: rawOutput || "dnsrecon finished execution with no records.",
            });
        });
    });
};

module.exports = { runDnsrecon };
