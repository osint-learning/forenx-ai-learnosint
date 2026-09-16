const { spawn } = require("child_process");
const net = require("net");

const runNslookup = (target) => {
    return new Promise((resolve, reject) => {
        const cleanTarget = String(target || "").trim();

        if (!cleanTarget) {
            return reject(new Error("Target is required for nslookup."));
        }

        // Allow domain names and IP addresses only.
        const validDomain =
            /^(?=.{1,253}$)([a-zA-Z0-9](?:[a-zA-Z0-9.-]*[a-zA-Z0-9])?)$/.test(
                cleanTarget
            );

        const validIPv4 =
            /^(?:\d{1,3}\.){3}\d{1,3}$/.test(cleanTarget);

        if (!validDomain && !validIPv4) {
            return reject(
                new Error(
                    "Invalid nslookup target. Use a domain name or IP address."
                )
            );
        }

        const child = spawn("nslookup", [cleanTarget, "8.8.8.8"], {
            windowsHide: true,
        });

        let stdout = "";
        let stderr = "";

        const timeout = setTimeout(() => {
            child.kill();
            reject(new Error("nslookup request timed out."));
        }, 10000);

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
                        "nslookup is not available on this Windows system."
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

            let server = null;
            let serverAddress = null;
            const addresses = [];
            const aliases = [];

            let collectingAddresses = false;
            let collectingAliases = false;

            for (const line of lines) {
                const trimmed = line.trim();

                if (!trimmed) {
                    collectingAddresses = false;
                    collectingAliases = false;
                    continue;
                }

                // DNS server name
                const serverMatch = trimmed.match(/^Server:\s*(.+)$/i);

                if (serverMatch) {
                    server = serverMatch[1].trim();
                    continue;
                }

                // DNS server IP address
                const serverAddressMatch =
                    trimmed.match(/^Address:\s*(.+)$/i);

                if (
                    serverAddressMatch &&
                    !serverAddress
                ) {
                    const value = serverAddressMatch[1].trim();

                    if (net.isIP(value)) {
                        serverAddress = value;
                    }

                    continue;
                }

                // Result addresses
                const addressesMatch =
                    trimmed.match(/^Addresses?:\s*(.*)$/i);

                if (addressesMatch) {
                    collectingAddresses = true;
                    collectingAliases = false;

                    const inlineValue =
                        addressesMatch[1].trim();

                    if (inlineValue && net.isIP(inlineValue)) {
                        addresses.push(inlineValue);
                    }

                    continue;
                }

                // Aliases
                const aliasesMatch =
                    trimmed.match(/^Aliases?:\s*(.*)$/i);

                if (aliasesMatch) {
                    collectingAliases = true;
                    collectingAddresses = false;

                    const inlineAlias =
                        aliasesMatch[1].trim();

                    if (inlineAlias) {
                        aliases.push(inlineAlias);
                    }

                    continue;
                }

                // Continuation lines for IPv4/IPv6 addresses
                if (collectingAddresses) {
                    if (net.isIP(trimmed)) {
                        addresses.push(trimmed);
                    } else {
                        collectingAddresses = false;
                    }

                    continue;
                }

                // Continuation lines for aliases
                if (collectingAliases) {
                    if (trimmed) {
                        aliases.push(trimmed);
                    }

                    continue;
                }
            }

            resolve({
                target: cleanTarget,
                server,
                serverAddress,
                addresses: [...new Set(addresses)],
                aliases: [...new Set(aliases)],

                responseType:
                    /(^|\r?\n)\s*Non-authoritative answer:/i.test(rawOutput) ||
                    ["8.8.8.8", "1.1.1.1"].includes(serverAddress)
                        ? "non-authoritative"
                        : "authoritative",

                exitCode: code,
                rawOutput,
            });
        });
    });
};

module.exports = {
    runNslookup,
};