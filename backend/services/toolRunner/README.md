# ForenX AI LearnOSINT Tool Runner Architecture

The **Tool Runner** is a server-side execution abstraction designed to execute OSINT tools in a controlled environment without requiring students to install local binaries.

## Architecture Flow

```
Browser (Terminal UI)
   ↓ POST /api/recon/terminal { command, practiceTool, labId }
Command Validator (Checks against whitelist, dangerous characters & target syntax)
   ↓
Tool Runner (Evaluates execution type)
   ├── Native Service (WHOIS, DNS Lookup, nslookup)
   ├── Containerized CLI (dig, dnsrecon, nmap, etc. via Docker)
   ├── Authenticated API (Hunter, Shodan, Censys, VirusTotal via .env)
   └── Live Web Requests (Wayback, crt.sh, URLScan, WhatsMyName)
   ↓
Real Structured Output & Raw Text
   ↓
Objective Evaluator (Validates student lab answers against genuine output keys)
```

## Execution Types

1. **Native**: Executed directly in Node.js (e.g. WHOIS sockets, DNS resolvers, Windows nslookup).
2. **Container**: Executed inside the `forenxai-osint-tools` Docker container with restricted CPU/memory/privileges. Falls back to host binary if installed.
3. **API**: Queries external services with backend-stored API keys.
4. **Web**: Queries public web intelligence endpoints with live parsing.

## Security Constraints

- **No Shell Execution**: Uses `child_process.spawn()` with fixed argument arrays; never `exec()` with shell strings.
- **Forbidden Characters**: Rejects `;`, `&`, `|`, ``, `$`, `>`, `<`, `\`, `\n`.
- **Target Sanitization**: Regex validation for domains, IPs, emails, usernames, and files.
- **Resource Limits**: 256MB RAM, 1.0 CPU, 10–30s timeout, 512KB max output buffer.
