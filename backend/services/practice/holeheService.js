const { spawn } = require("child_process");

const cleanEmail = (input) => {
    return String(input || "")
        .trim()
        .toLowerCase();
};

const runHolehe = (target) => {
    return new Promise((resolve, reject) => {
        const email = cleanEmail(target);
        if (!email || !email.includes("@")) {
            return reject(new Error("Valid target email address is required for holehe."));
        }

        const child = spawn("holehe", [email, "--only-used"], {
            windowsHide: true,
        });

        let stdout = "";
        let stderr = "";

        const timeout = setTimeout(() => {
            child.kill();
            reject(new Error("holehe command timed out after 20 seconds."));
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
                        "holehe is not installed or not available in the system PATH. Please install holehe (pip install holehe)."
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

            const matches = [];
            const lines = rawOutput.split(/\r?\n/);
            for (const line of lines) {
                const trimmed = line.trim();
                if (trimmed.startsWith("[+]")) {
                    const match = trimmed.replace("[+]", "").trim().split(/\s+/)[0];
                    if (match) matches.push(match);
                }
            }

            resolve({
                email,
                matches: [...new Set(matches)],
                count: matches.length,
                exitCode: code,
                rawOutput: rawOutput || "holehe returned 0 registered accounts for this email.",
            });
        });
    });
};

module.exports = { runHolehe };
