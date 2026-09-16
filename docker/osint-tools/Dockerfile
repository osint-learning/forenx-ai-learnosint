# ==============================================================================
# ForenX AI LearnOSINT - Unified OSINT Tools Container
# Production-ready image providing verified CLI OSINT tools in an unprivileged sandbox.
# ==============================================================================

# Stage 1: Build Go-based OSINT tools using official Go 1.25 toolchain
FROM golang:1.25-bookworm AS go-builder

ENV CGO_ENABLED=0

RUN go install -v github.com/projectdiscovery/subfinder/v2/cmd/subfinder@latest && \
    go install -v github.com/tomnomnom/assetfinder@latest

# Stage 2: Final minimal runtime image
FROM debian:bookworm-slim

LABEL maintainer="ForenX AI LearnOSINT"
LABEL description="Unified containerized OSINT tool environment for practice labs"

ENV DEBIAN_FRONTEND=noninteractive
ENV PYTHONUNBUFFERED=1

# Install base packages, networking tools, and CLI dependencies (excluding Go compiler)
RUN apt-get update && apt-get install -y --no-install-recommends \
    ca-certificates \
    curl \
    wget \
    git \
    dnsutils \
    bind9-host \
    whois \
    nmap \
    libimage-exiftool-perl \
    whatweb \
    python3 \
    python3-pip \
    python3-venv \
    && rm -rf /var/lib/apt/lists/*

# Install Python OSINT Tools into a managed virtual environment
ENV VIRTUAL_ENV=/opt/osint-venv
RUN python3 -m venv $VIRTUAL_ENV
ENV PATH="$VIRTUAL_ENV/bin:$PATH"

RUN pip install --no-cache-dir \
    sherlock-project \
    dnsrecon \
    fierce \
    holehe \
    maigret \
    theHarvester

# Copy compiled Go OSINT tools from builder stage
COPY --from=go-builder /go/bin/subfinder /usr/local/bin/subfinder
COPY --from=go-builder /go/bin/assetfinder /usr/local/bin/assetfinder

# Create non-root unprivileged execution user
RUN groupadd -g 1001 osintgroup && \
    useradd -u 1001 -g osintgroup -m -s /bin/false osintuser

WORKDIR /home/osintuser
USER osintuser

# Default entrypoint for direct tool execution
ENTRYPOINT []
CMD ["dig", "--version"]
