const { spawn } = require("child_process");

const cleanDomain = (input) => {
    return String(input || "")
        .trim()
        .replace(/^https?:\/\//i, "")
        .split("/")[0]
        .split(":")[0]
        .trim();
};

const runTheharvester = (target) => {
    return new Promise((resolve, reject) => {
        const domain = cleanDomain(target);
        if (!domain) {
            return reject(new Error("Target domain is required for theHarvester."));
        }

        const child = spawn("theHarvester", ["-d", domain, "-b", "all", "-l", "50"], {
            windowsHide: true,
        });

        let stdout = "";
        let stderr = "";

        const timeout = setTimeout(() => {
            child.kill();
            reject(new Error("theHarvester command timed out after 20 seconds."));
        }, 20000);

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
                        "theHarvester is not installed or not available in the system PATH. Please install theHarvester."
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

            const emails = [];
            const hosts = [];
            const ips = [];

            const lines = rawOutput.split(/\r?\n/);
            let section = "";

            for (const line of lines) {
                const trimmed = line.trim();
                if (!trimmed) continue;

                if (/[*] Emails found:/i.test(trimmed)) {
                    section = "emails";
                    continue;
                } else if (/[*] Hosts found:/i.test(trimmed)) {
                    section = "hosts";
                    continue;
                } else if (/[*] IPs found:/i.test(trimmed)) {
                    section = "ips";
                    continue;
                }

                if (section === "emails" && trimmed.includes("@")) {
                    emails.push(trimmed);
                } else if (section === "hosts" && trimmed.includes(".")) {
                    hosts.push(trimmed);
                } else if (section === "ips" && /^\d+\.\d+\.\d+\.\d+/.test(trimmed)) {
                    ips.push(trimmed);
                }
            }

            resolve({
                domain,
                emails: [...new Set(emails)],
                hosts: [...new Set(hosts)],
                ips: [...new Set(ips)],
                exitCode: code,
                rawOutput: rawOutput || "theHarvester returned 0 entries.",
            });
        });
    });
};

module.exports = { runTheharvester };
