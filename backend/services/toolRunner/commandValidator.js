/**
 * Command and Target Sanitization & Validation for Practice Labs
 * Prevents arbitrary shell execution, argument injection, and command chaining.
 */

const net = require("net");
const path = require("path");

const DANGEROUS_CHARS = /[;&|`$><\\!\n\r]/;

/**
 * Validate that input contains no command injection metacharacters
 */
const hasDangerousChars = (input) => {
    if (typeof input !== "string") return true;
    return DANGEROUS_CHARS.test(input);
};

/**
 * Target format validators
 */
const validateDomain = (target) => {
    const clean = String(target || "")
        .trim()
        .replace(/^https?:\/\//i, "")
        .split("/")[0]
        .split(":")[0];

    if (hasDangerousChars(clean)) return null;
    const isValid = /^(?=.{1,253}$)([a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,63}$/.test(
        clean
    );
    return isValid ? clean : null;
};

const validateIP = (target) => {
    const clean = String(target || "").trim().split("/")[0].split(":")[0];
    if (hasDangerousChars(clean)) return null;
    return net.isIP(clean) ? clean : null;
};

const validateDomainOrIP = (target) => {
    return validateDomain(target) || validateIP(target);
};

const validateUsername = (target) => {
    const clean = String(target || "").trim().replace(/^@/, "");
    if (hasDangerousChars(clean)) return null;
    const isValid = /^[a-zA-Z0-9._-]{1,64}$/.test(clean);
    return isValid ? clean : null;
};

const validateEmail = (target) => {
    const clean = String(target || "").trim().toLowerCase();
    if (hasDangerousChars(clean)) return null;
    const isValid = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(clean);
    return isValid ? clean : null;
};

const validatePhone = (target) => {
    const clean = String(target || "").trim().replace(/[^0-9+]/g, "");
    if (hasDangerousChars(clean)) return null;
    const isValid = /^\+?[0-9]{6,16}$/.test(clean);
    return isValid ? clean : null;
};

const validateFilePath = (target) => {
    const clean = String(target || "").trim();
    if (hasDangerousChars(clean)) return null;
    if (clean.includes("..") || clean.startsWith("/") || /^[a-zA-Z]:\\/.test(clean)) {
        const basename = path.basename(clean);
        return path.join("uploads", basename);
    }
    return clean;
};

const validateUrl = (target) => {
    const clean = String(target || "").trim();
    if (hasDangerousChars(clean)) return null;
    try {
        const parsed = new URL(clean);
        if (parsed.protocol === "http:" || parsed.protocol === "https:") {
            return clean;
        }
    } catch (e) {}
    return null;
};

const validateDork = (target) => {
    const clean = String(target || "").trim();
    if (hasDangerousChars(clean)) return null;
    return clean.length > 0 && clean.length < 256 ? clean : null;
};

/**
 * Validate command and target according to tool specification
 */
const validateInput = (command, target, toolDef) => {
    if (!command || typeof command !== "string") {
        throw new Error("Command is required.");
    }
    if (!target || typeof target !== "string") {
        throw new Error("Target is required.");
    }

    const cleanCommand = command.trim().toLowerCase();
    if (hasDangerousChars(cleanCommand)) {
        throw new Error("Invalid command characters detected.");
    }

    if (toolDef && toolDef.command !== cleanCommand) {
        throw new Error(
            `Invalid command for this tool. Expected '${toolDef.command}', received '${cleanCommand}'.`
        );
    }

    let validatedTarget = null;
    const targetType = toolDef?.targetType || "domainOrIp";

    switch (targetType) {
        case "domain":
            validatedTarget = validateDomain(target);
            break;
        case "ip":
            validatedTarget = validateIP(target);
            break;
        case "domainOrIp":
            validatedTarget = validateDomainOrIP(target);
            break;
        case "username":
            validatedTarget = validateUsername(target);
            break;
        case "email":
            validatedTarget = validateEmail(target);
            break;
        case "phone":
            validatedTarget = validatePhone(target);
            break;
        case "filePath":
            validatedTarget = validateFilePath(target);
            break;
        case "url":
            validatedTarget = validateUrl(target);
            break;
        case "dork":
            validatedTarget = validateDork(target);
            break;
        default:
            if (!hasDangerousChars(target)) validatedTarget = target.trim();
    }

    if (!validatedTarget) {
        throw new Error(
            `Invalid target format for ${toolDef?.name || cleanCommand}. Target must be a valid ${targetType}.`
        );
    }

    return {
        command: cleanCommand,
        target: validatedTarget,
    };
};

module.exports = {
    hasDangerousChars,
    validateDomain,
    validateIP,
    validateDomainOrIP,
    validateUsername,
    validateEmail,
    validatePhone,
    validateFilePath,
    validateUrl,
    validateDork,
    validateInput,
};
