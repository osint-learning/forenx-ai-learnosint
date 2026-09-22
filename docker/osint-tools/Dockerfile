# ==============================================================================
# ForenX AI LearnOSINT - Unified OSINT Tools Container
# ==============================================================================
# Controlled execution environment for Practice Labs & OSINT Terminal.
#
# IMPORTANT:
# Docker is ONLY the execution environment for CLI OSINT tools.
# It is NOT used by the ForenX Recon Engine.
# ==============================================================================


# ==============================================================================
# STAGE 1 - Go Builder
# ==============================================================================

FROM golang:1.25-bookworm AS go-builder

ENV CGO_ENABLED=0

# Existing Go tools
RUN go install -v github.com/projectdiscovery/subfinder/v2/cmd/subfinder@latest && \
    go install -v github.com/tomnomnom/assetfinder@latest

# Amass
RUN go install -v github.com/owasp-amass/amass/v4/...@latest

# PhoneInfoga
RUN apt-get update && \
    apt-get install -y --no-install-recommends nodejs npm && \
    rm -rf /var/lib/apt/lists/* && \
    npm install -g corepack@0.29.4 && \
    corepack enable && \
    git clone --depth 1 --branch v2.9.0 https://github.com/sundowndev/phoneinfoga.git /tmp/phoneinfoga && \
    cd /tmp/phoneinfoga/web/client && \
    corepack yarn install && \
    NODE_OPTIONS=--openssl-legacy-provider corepack yarn build && \
    cd /tmp/phoneinfoga && \
    go build -o /go/bin/phoneinfoga . && \
    rm -rf /tmp/phoneinfoga


# ==============================================================================
# STAGE 2 - Final Runtime
# ==============================================================================

FROM python:3.12-slim-bookworm

LABEL maintainer="ForenX AI LearnOSINT"
LABEL description="Unified containerized OSINT tool environment for Practice Labs"

ENV DEBIAN_FRONTEND=noninteractive
ENV PYTHONUNBUFFERED=1


# ==============================================================================
# SYSTEM PACKAGES
# ==============================================================================

RUN apt-get update && apt-get install -y --no-install-recommends \
    ca-certificates \
    curl \
    wget \
    git \
    perl \
    cpanminus \
    dnsutils \
    bind9-host \
    whois \
    nmap \
    libimage-exiftool-perl \
    whatweb \
    python3 \
    python3-pip \
    python3-venv \
    build-essential \
    libxml2-dev \
    libxslt1-dev \
    libffi-dev \
    libssl-dev \
    && rm -rf /var/lib/apt/lists/*


# ==============================================================================
# PYTHON VIRTUAL ENVIRONMENT
# ==============================================================================

ENV VIRTUAL_ENV=/opt/osint-venv

RUN python3 -m venv "$VIRTUAL_ENV"

ENV PATH="$VIRTUAL_ENV/bin:$PATH"


# ==============================================================================
# EXISTING PYTHON OSINT TOOLS
# ==============================================================================

RUN pip install --no-cache-dir --upgrade pip setuptools wheel && \
    pip install --no-cache-dir \
        sherlock-project \
        dnsrecon \
        fierce \
        holehe \
        maigret


# ==============================================================================
# THEHARVESTER
#
# Current upstream releases require Python 3.14.
# We intentionally use the Python-3.11-compatible 4.11.1 release here so
# the shared runtime remains compatible with the existing Python tools.
# ==============================================================================

RUN git clone --depth 1 --branch 4.11.1 \
        https://github.com/laramies/theHarvester.git \
        /opt/theHarvester && \
    cd /opt/theHarvester && \
    pip install --no-cache-dir . && \
    ln -sf "$VIRTUAL_ENV/bin/theHarvester" /usr/local/bin/theharvester

# ==============================================================================
# DNSENUM
#
# dnsenum is a Perl application.
# ==============================================================================

# dnsenum
# dnsenum
RUN git clone --depth 1 \
        https://github.com/fwaeytens/dnsenum.git \
        /opt/dnsenum && \
    cpanm --notest \
        Net::IP \
        Net::DNS \
        Net::Netmask \
        Net::Whois::IP \
        HTML::Parser \
        WWW::Mechanize \
        XML::Writer \
        String::Random && \
    chmod +x /opt/dnsenum/dnsenum.pl && \
    ln -sf /opt/dnsenum/dnsenum.pl /usr/local/bin/dnsenum

# ==============================================================================
# SPIDERFOOT
#
# Install its dependencies while running as root.
# The temporary test showed pygexf fails when installed by osintuser because
# the legacy installer attempts to write directly into site-packages.
# ==============================================================================

# SpiderFoot - isolated Python environment
RUN git clone --depth 1 \
        https://github.com/smicallef/spiderfoot.git \
        /opt/spiderfoot && \
    python3 -m venv /opt/spiderfoot-venv && \
    /opt/spiderfoot-venv/bin/pip install --no-cache-dir --upgrade pip setuptools wheel && \
    /opt/spiderfoot-venv/bin/pip install --no-cache-dir -r /opt/spiderfoot/requirements.txt


# ==============================================================================
# COPY GO BINARIES
# ==============================================================================

COPY --from=go-builder /go/bin/subfinder /usr/local/bin/subfinder
COPY --from=go-builder /go/bin/assetfinder /usr/local/bin/assetfinder
COPY --from=go-builder /go/bin/amass /usr/local/bin/amass
COPY --from=go-builder /go/bin/phoneinfoga /usr/local/bin/phoneinfoga


# ==============================================================================
# NON-ROOT EXECUTION USER
# ==============================================================================

RUN groupadd -g 1001 osintgroup && \
    useradd \
        -u 1001 \
        -g osintgroup \
        -m \
        -s /usr/sbin/nologin \
        osintuser


# ==============================================================================
# WORKSPACE
# ==============================================================================

RUN mkdir -p /home/osintuser/.config && \
    chown -R osintuser:osintgroup /home/osintuser


WORKDIR /home/osintuser

USER osintuser


# ==============================================================================
# CONTAINER DEFAULT
# ==============================================================================

ENTRYPOINT []

CMD ["dig", "--version"]