# ForenX AI OSINT Tools Docker Environment

This directory contains the Dockerfile for building the unified OSINT container used by the **Tool Runner**.

## Building the Image

To build the image locally or on a production host:

```bash
docker build -t forenxai-osint-tools:latest -f docker/osint-tools/Dockerfile .
```

## Testing the Image

Verify that tools execute properly inside the container:

```bash
# Test DIG
docker run --rm forenxai-osint-tools:latest dig example.com ANY +nocmd +stats

# Test NMAP
docker run --rm forenxai-osint-tools:latest nmap -F scanme.nmap.org

# Test SUBFINDER
docker run --rm forenxai-osint-tools:latest subfinder -d example.com -silent

# Test EXIFTOOL
docker run --rm forenxai-osint-tools:latest exiftool -ver
```

## Security Attributes

- **Unprivileged User**: Runs as `osintuser` (UID 1001).
- **Read-Only Compatibility**: Operates without root filesystem writes.
- **Resource Limits**: Invoked with `--memory 256m --cpus 1.0 --security-opt=no-new-privileges`.
