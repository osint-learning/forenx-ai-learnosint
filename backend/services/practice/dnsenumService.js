const { spawn } = require("child_process");

const cleanDomain = (input) => {
    return String(input || "")
        .trim()
        .replace(/^https?:\/\//i, "")
        .split("/")[0]
        .split(":")[0]
        .trim();
};

const runDnsenum = (target) => {
    return new Promise((resolve, reject) => {
        const domain = cleanDomain(target);
        if (!domain) {
            return reject(new Error("Target domain is required for dnsenum."));
        }

        const child = spawn("dnsenum", ["--noreverse", domain], {
            windowsHide: true,
        });

        let stdout = "";
        let stderr = "";

        const timeout = setTimeout(() => {
            child.kill();
            reject(new Error("dnsenum command timed out after 15 seconds."));
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
                        "dnsenum is not installed or not available in the system PATH. Please install dnsenum."
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

            const nameServers = [];
            const mailServers = [];
            const subdomains = [];

            const lines = rawOutput.split(/\r?\n/);
            let section = "";

            for (const line of lines) {
                const trimmed = line.trim();
                if (!trimmed) continue;

                if (/Name Servers/i.test(trimmed)) {
                    section = "ns";
                    continue;
                } else if (/Mail (Servers|MX)/i.test(trimmed)) {
                    section = "mx";
                    continue;
                } else if (/Subdomains/i.test(trimmed)) {
                    section = "sub";
                    continue;
                }

                if (section === "ns" && trimmed.includes(".")) {
                    nameServers.push(trimmed.split(/\s+/)[0]);
                } else if (section === "mx" && trimmed.includes(".")) {
                    mailServers.push(trimmed.split(/\s+/)[0]);
                } else if (section === "sub" && trimmed.includes(".")) {
                    subdomains.push(trimmed.split(/\s+/)[0]);
                }
            }

            resolve({
                domain,
                nameServers: [...new Set(nameServers)],
                mailServers: [...new Set(mailServers)],
                subdomains: [...new Set(subdomains)],
                exitCode: code,
                rawOutput: rawOutput || "dnsenum finished execution with no records.",
            });
        });
    });
};

module.exports = { runDnsenum };
