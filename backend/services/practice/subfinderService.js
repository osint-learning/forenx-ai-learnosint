const { spawn } = require("child_process");

const cleanDomain = (input) => {
    return String(input || "")
        .trim()
        .replace(/^https?:\/\//i, "")
        .split("/")[0]
        .split(":")[0]
        .trim();
};

const runSubfinder = (target) => {
    return new Promise((resolve, reject) => {
        const domain = cleanDomain(target);
        if (!domain) {
            return reject(new Error("Target domain is required for subfinder."));
        }

        const child = spawn("subfinder", ["-d", domain, "-silent"], {
            windowsHide: true,
        });

        let stdout = "";
        let stderr = "";

        const timeout = setTimeout(() => {
            child.kill();
            reject(new Error("subfinder command timed out after 15 seconds."));
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
                        "subfinder is not installed or not available in the system PATH. Please install subfinder (ProjectDiscovery)."
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

            const subdomains = rawOutput
                .split(/\r?\n/)
                .map((s) => s.trim())
                .filter((s) => s.length > 0 && s.includes("."));

            resolve({
                domain,
                subdomains: [...new Set(subdomains)],
                count: subdomains.length,
                exitCode: code,
                rawOutput: rawOutput || "subfinder returned 0 subdomains.",
            });
        });
    });
};

module.exports = { runSubfinder };
