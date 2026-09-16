const { spawn } = require("child_process");

const cleanUsername = (input) => {
    return String(input || "")
        .trim()
        .replace(/^@/, "")
        .replace(/[^a-zA-Z0-9._-]/g, "")
        .trim();
};

const runSherlock = (target) => {
    return new Promise((resolve, reject) => {
        const username = cleanUsername(target);
        if (!username) {
            return reject(new Error("Target username is required for sherlock."));
        }

        const child = spawn("sherlock", [username, "--print-found", "--timeout", "10"], {
            windowsHide: true,
        });

        let stdout = "";
        let stderr = "";

        const timeout = setTimeout(() => {
            child.kill();
            reject(new Error("sherlock command timed out after 20 seconds."));
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
                        "sherlock is not installed or not available in the system PATH. Please install sherlock (pip install sherlock-project)."
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
                    const parts = trimmed.replace("[+]", "").trim().split(":");
                    if (parts.length > 0) {
                        matches.push(parts[0].trim());
                    }
                }
            }

            resolve({
                username,
                matches: [...new Set(matches)],
                count: matches.length,
                exitCode: code,
                rawOutput: rawOutput || "sherlock completed with 0 matches.",
            });
        });
    });
};

module.exports = { runSherlock };
