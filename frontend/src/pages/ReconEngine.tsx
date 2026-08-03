import React, { useState } from "react";
import { Radar, Search } from "lucide-react";

import { GlassCard } from "../components/ui/GlassCard";
import { GlowButton } from "../components/ui/GlowButton";
import { Badge } from "../components/ui/Badge";

import { OsintService } from "../services/api";

export const ReconEngine: React.FC = () => {
  const [targetInput, setTargetInput] = useState("");

  const [isScanning, setIsScanning] = useState(false);

  const [scanProgress, setScanProgress] = useState(0);

  const [scanResult, setScanResult] = useState<any>(null);

  const [showAllRobotsRules, setShowAllRobotsRules] = useState(false);

  const handleScan = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!targetInput.trim()) return;

    try {
      setIsScanning(true);
      setScanProgress(10);

      const interval = setInterval(() => {
        setScanProgress((prev) => {
          if (prev >= 90) {
            clearInterval(interval);
            return 90;
          }

          return prev + 20;
        });
      }, 400);

      const result = await OsintService.executeReconScan(targetInput);

      setTimeout(() => {
        clearInterval(interval);
        setScanProgress(100);
        setScanResult(result);
        setIsScanning(false);
      }, 500);
    } catch (err) {
      console.error(err);
      alert("Recon scan failed.");
    } finally {
}
  };

  return (
    <div className="space-y-8">

      {/* HEADER */}

      <div className="border-b border-[#00ff99]/20 pb-6">

        <h1 className="text-3xl font-bold text-white flex items-center gap-3">

          <Radar className="text-[#00ff99]" />

          Recon Engine

        </h1>

        <p className="text-slate-400 mt-2">

          Perform automated OSINT reconnaissance using the integrated backend
          scanning engine.

        </p>

      </div>

      {/* SEARCH */}

      <GlassCard glow="emerald" className="p-6">

        <form
          onSubmit={handleScan}
          className="flex gap-4 items-center"
        >

          <div className="relative flex-1">

            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              className="w-full bg-black/70 border border-[#00ff99]/30 rounded-xl pl-12 pr-4 py-3 text-white"
              placeholder="google.com"
              value={targetInput}
              onChange={(e) => setTargetInput(e.target.value)}
            />

          </div>

          <GlowButton
            type="submit"
            variant="primary"
            disabled={isScanning}
          >
            {isScanning ? "Scanning..." : "Start Scan"}
          </GlowButton>

        </form>

      </GlassCard>

      {isScanning && (
        <GlassCard glow="cyan" className="p-8 text-center space-y-8">

          <div className="relative w-44 h-44 mx-auto flex items-center justify-center">

            {/* Outer Pulse Ring */}
            <div className="absolute inset-0 rounded-full border border-[#00ff99]/20 animate-ping" />

            {/* Middle Ring */}
            <div className="absolute inset-4 rounded-full border border-[#00ff99]/40 animate-pulse" />

            {/* Inner Ring */}
            <div className="absolute inset-10 rounded-full border border-[#7efeff]/40" />

            {/* Rotating Sweep */}
            <div className="absolute w-full h-full rounded-full overflow-hidden">

              <div
                className="absolute left-1/2 top-1/2 w-1/2 h-[2px]
                origin-left
                bg-gradient-to-r from-[#00ff99] to-transparent
                animate-spin"
                style={{
                  animationDuration: "2s"
                }}
              />

            </div>

            {/* Radar Icon */}
            <Radar
              size={70}
              className="text-[#00ff99] animate-pulse z-10"
            />

          </div>

          <div>

            <h3 className="text-xl font-bold text-[#00ff99] font-mono">
              EXECUTING RECON SCAN
            </h3>

            <p className="text-[#7efeff] mt-2 font-mono text-sm">
              Collecting intelligence from multiple sources...
            </p>

          </div>

          <div className="max-w-lg mx-auto">

            <div className="h-3 rounded-full bg-black/60 border border-[#00ff99]/20 overflow-hidden">

              <div
                className="h-full bg-gradient-to-r
                from-[#00ff99]
                via-[#7efeff]
                to-[#00ff99]
                transition-all duration-300"
                style={{
                  width: `${scanProgress}%`
                }}
              />

            </div>

            <div className="mt-3 text-[#00ff99] font-mono text-sm">
              {scanProgress}% Completed
            </div>

          </div>

        </GlassCard>
      )}

      {/* RESULTS */}

      {scanResult && (

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

      {/* ================= DOMAIN INFORMATION ================= */}

      <GlassCard glow="emerald" className="p-6">

        <div className="flex items-center justify-between mb-6">

          <h2 className="text-xl font-bold text-[#00ff99]">
            🌐 Domain Information
          </h2>

          <Badge variant="emerald">
            ACTIVE
          </Badge>

        </div>

        <div className="space-y-5">

          {/* Domain */}

          <div className="flex justify-between border-b border-white/10 pb-2">

            <span className="text-slate-400">
              Domain
            </span>

            <span className="text-white font-semibold">
              {targetInput}
            </span>

          </div>

          {/* IP */}

          <div className="flex justify-between border-b border-white/10 pb-2">

            <span className="text-slate-400">
              IP Address
            </span>

            <span className="text-[#00ff99] font-mono">

              {scanResult.domain.ipAddresses?.join(", ") || "N/A"}

            </span>

          </div>

          {/* Name Servers */}

          <div>

            <span className="text-slate-400">
              Name Servers
            </span>

            <div className="mt-3 flex flex-wrap gap-2">

              {scanResult.domain.nameServers?.length > 0 ? (

                scanResult.domain.nameServers.map(
                  (server: string, index: number) => (

                    <Badge
                      key={index}
                      variant="cyan"
                    >
                      {server}
                    </Badge>

                  )
                )

              ) : (

                <span className="text-slate-500">
                  Not Available
                </span>

              )}

            </div>

          </div>

        </div>

      </GlassCard>
      {/* ================= WEBSITE INFORMATION ================= */}

      <GlassCard glow="cyan" className="p-6">

        <div className="flex items-center justify-between mb-6">

          <h2 className="text-xl font-bold text-[#7efeff]">
            🌍 Website Information
          </h2>

          <Badge variant="cyan">
            ONLINE
          </Badge>

        </div>

        <div className="space-y-5">

          <div className="flex justify-between border-b border-white/10 pb-2">
            <span className="text-slate-400">URL</span>
            <span className="text-white break-all text-right">
              {scanResult.website.url || "N/A"}
            </span>
          </div>

          <div className="flex justify-between border-b border-white/10 pb-2">
            <span className="text-slate-400">Final URL</span>
            <span className="text-white break-all text-right">
              {scanResult.website.finalUrl || "N/A"}
            </span>
          </div>

          <div className="flex justify-between border-b border-white/10 pb-2">
            <span className="text-slate-400">Status Code</span>

            <Badge
              variant={
                scanResult.website.statusCode === 200
                  ? "emerald"
                  : "warning"
              }
            >
              {scanResult.website.statusCode || "Unknown"}
            </Badge>

          </div>

          <div className="flex justify-between border-b border-white/10 pb-2">
            <span className="text-slate-400">Response Time</span>

            <span className="text-[#00ff99] font-semibold">
              {scanResult.website.responseTime || "--"} ms
            </span>

          </div>

          <div className="flex justify-between border-b border-white/10 pb-2">
            <span className="text-slate-400">Server</span>

            <span className="text-white">
              {scanResult.website.server || "Unknown"}
            </span>

          </div>

          <div className="flex justify-between border-b border-white/10 pb-2">
            <span className="text-slate-400">Powered By</span>

            <span className="text-white">
              {scanResult.website.poweredBy || "Unknown"}
            </span>

          </div>

          <div className="flex justify-between">
            <span className="text-slate-400">Content Type</span>

            <span className="text-white text-right">
              {scanResult.website.contentType || "Unknown"}
            </span>

          </div>

        </div>

      </GlassCard>


        {/* ================= SSL CERTIFICATE ================= */}

        <GlassCard glow="emerald" className="p-6">

          <div className="flex items-center justify-between mb-6">

            <h2 className="text-xl font-bold text-[#00ff99]">
              🔒 SSL Certificate
            </h2>

            <Badge
              variant={
                scanResult.ssl.expired
                  ? "warning"
                  : "emerald"
              }
            >
              {scanResult.ssl.expired ? "Expired" : "Valid"}
            </Badge>

          </div>

          <div className="space-y-5">

            {/* Issuer */}

            <div className="flex justify-between border-b border-white/10 pb-2">

              <span className="text-slate-400">
                Issuer
              </span>

              <span className="text-white text-right">
                {scanResult.ssl.issuer || "Unknown"}
              </span>

            </div>

            {/* Subject */}

            <div className="flex justify-between border-b border-white/10 pb-2">

              <span className="text-slate-400">
                Subject
              </span>

              <span className="text-white text-right">
                {scanResult.ssl.subject || "Unknown"}
              </span>

            </div>

            {/* Valid From */}

            <div className="flex justify-between border-b border-white/10 pb-2">

              <span className="text-slate-400">
                Valid From
              </span>

              <span className="text-white">
                {scanResult.ssl.validFrom || "N/A"}
              </span>

            </div>

            {/* Valid To */}

            <div className="flex justify-between border-b border-white/10 pb-2">

              <span className="text-slate-400">
                Valid To
              </span>

              <span className="text-white">
                {scanResult.ssl.validTo || "N/A"}
              </span>

            </div>

            {/* Days Remaining */}

            <div>

              <div className="flex justify-between mb-2">

                <span className="text-slate-400">
                  Days Remaining
                </span>

                <span className="text-[#00ff99] font-bold">

                  {scanResult.ssl.daysRemaining || 0} Days

                </span>

              </div>

              <div className="w-full h-3 bg-black/40 rounded-full overflow-hidden">

                <div
                  className={`h-full transition-all duration-700 ${
                    scanResult.ssl.expired
                      ? "bg-red-500"
                      : "bg-[#00ff99]"
                  }`}
                  style={{
                    width: `${Math.min(
                      ((scanResult.ssl.daysRemaining || 0) / 365) * 100,
                      100
                    )}%`,
                  }}
                />

              </div>

            </div>

            {/* Certificate Status */}

            <div className="flex justify-between">

              <span className="text-slate-400">
                Certificate Status
              </span>

              <Badge
                variant={
                  scanResult.ssl.expired
                    ? "warning"
                    : "emerald"
                }
              >
                {scanResult.ssl.expired ? "Expired" : "Secure"}
              </Badge>

            </div>

          </div>

        </GlassCard>

        {/* ================= TECHNOLOGY DETECTION ================= */}

        <GlassCard glow="cyan" className="p-6">

          <div className="flex items-center justify-between mb-6">

            <h2 className="text-xl font-bold text-[#7efeff]">
              ⚙ Technology Detection
            </h2>

            <Badge variant="cyan">
              {Array.isArray(scanResult.technology)
                ? scanResult.technology.length
                : Object.keys(scanResult.technology || {}).length} Found
            </Badge>

          </div>

          {scanResult.technology ? (

            Array.isArray(scanResult.technology) ? (

              <div className="flex flex-wrap gap-3">

              {scanResult.technology.map((tech: any, index: number) => (

                <div
                  key={index}
                  className="border border-white/10 rounded-lg p-4 bg-black/30"
                >

                  <div className="flex justify-between">

                    <h3 className="text-white font-semibold">
                      {tech.name}
                    </h3>

                    <Badge variant="cyan">
                      {tech.category}
                    </Badge>

                  </div>

                  <p className="text-slate-400 mt-2">
                    Detection:
                    <span className="text-white ml-2">
                      {tech.detectedBy}
                    </span>
                  </p>

                  <p className="text-slate-400">
                    Confidence:
                    <span className="text-[#00ff99] ml-2">
                      {tech.confidence}%
                    </span>
                  </p>

                  <p className="text-slate-400 mt-2 break-all">
                    {tech.evidence}
                  </p>

                </div>

              ))}

              </div>

            ) : (

              <div className="space-y-4">

                {Object.entries(scanResult.technology).map(
                  ([key, value]: any, index: number) => (

                    <div
                      key={index}
                      className="border-b border-white/10 pb-3"
                    >

                      <div className="flex justify-between items-center">

                        <span className="text-slate-400 capitalize">
                          {key}
                        </span>

                        {Array.isArray(value) ? (

                          <div className="flex flex-wrap gap-2 justify-end">

                            {value.length > 0 ? (

                              value.map((item: any, i: number) => {

                                console.log(item);

                                return (
                                  <Badge key={i} variant="purple">
                                    {typeof item === "object"
                                      ? item.name ||
                                        item.category ||
                                        item.detectedBy ||
                                        JSON.stringify(item)
                                      : item}
                                  </Badge>
                                );

                              })

                            ) : (

                              <span className="text-slate-500">
                                None
                              </span>

                            )}

                          </div>

                        ) : (

                          <span className="text-white text-right">

                            {String(value)}

                          </span>

                        )}

                      </div>

                    </div>

                  )
                )}

              </div>

            )

          ) : (

            <div className="text-center py-10 text-slate-500">

              No technologies detected.

            </div>

          )}

        </GlassCard>

      {/* ================= WHOIS INFORMATION ================= */}

      <GlassCard glow="cyan" className="p-6">

        <div className="flex items-center justify-between mb-6">

          <h2 className="text-xl font-bold text-[#7efeff]">
            🛡 WHOIS Information
          </h2>

          <Badge variant="cyan">
            WHOIS
          </Badge>

        </div>

        <div className="space-y-5">

          {/* Registrar */}

          <div className="flex justify-between border-b border-white/10 pb-2">

            <span className="text-slate-400">
              Registrar
            </span>

            <span className="text-white text-right">
              {scanResult.whois.whois?.registrar || "Unknown"}
            </span>

          </div>

          {/* Registrant */}

          <div className="flex justify-between border-b border-white/10 pb-2">

            <span className="text-slate-400">
              Registrant
            </span>

            <span className="text-white text-right">
              {scanResult.whois.whois?.registrant || "Hidden / Redacted"}
            </span>

          </div>

          {/* Creation Date */}

          <div className="flex justify-between border-b border-white/10 pb-2">

            <span className="text-slate-400">
              Created
            </span>

            <span className="text-white">
              {scanResult.whois.whois?.created || "N/A"}
            </span>

          </div>

          {/* Updated */}

          <div className="flex justify-between border-b border-white/10 pb-2">

            <span className="text-slate-400">
              Updated
            </span>

            <span className="text-white">
              {scanResult.whois.whois?.updated || "N/A"}
            </span>

          </div>

          {/* Expiry */}

          <div className="flex justify-between border-b border-white/10 pb-2">

            <span className="text-slate-400">
              Expiry Date
            </span>

            <span className="text-white">
              {scanResult.whois.whois?.expires || "N/A"}
            </span>

          </div>

          {/* DNSSEC */}

          <div className="flex justify-between border-b border-white/10 pb-2">

            <span className="text-slate-400">
              DNSSEC
            </span>

            <Badge
              variant={
                scanResult.whois.whois?.dnssec
                  ? "emerald"
                  : "warning"
              }
            >
              {scanResult.whois.whois?.dnssec
                ? "Enabled"
                : "Disabled"}
            </Badge>

          </div>

          {/* Name Servers */}

          <div>

            <span className="text-slate-400 block mb-3">
              Name Servers
            </span>

            <div className="flex flex-wrap gap-2">

              {scanResult.whois.whois?.nameServers?.length ? (

                scanResult.whois.whois.nameServers.map(
                  (server: string, index: number) => (

                    <Badge
                      key={index}
                      variant="purple"
                    >
                      {server}
                    </Badge>

                  )
                )

              ) : (

                <span className="text-slate-500">
                  No Name Servers Found
                </span>

              )}

            </div>

          </div>

        </div>

      </GlassCard>

        {/* ================= SECURITY HEADERS ================= */}

        <GlassCard glow="cyan" className="p-6">

          <div className="flex items-center justify-between mb-6">

            <h2 className="text-xl font-bold text-[#7efeff]">
              🛡 Security Headers
            </h2>

            <Badge variant="cyan">
              HEADERS
            </Badge>

          </div>

          <div className="space-y-4">

            {Object.entries(scanResult.headers || {}).map(
              ([header, value]: any, index: number) => {

                const enabled =
                  value !== null &&
                  value !== undefined &&
                  value !== "" &&
                  value !== false;

                return (

                  <div
                    key={index}
                    className="flex items-center justify-between border-b border-white/10 pb-3"
                  >

                    <span className="text-slate-300 break-all">
                      {header}
                    </span>

                    <Badge
                      variant={enabled ? "emerald" : "warning"}
                    >
                      {enabled ? "Present" : "Missing"}
                    </Badge>

                  </div>

                );
              }
            )}

          </div>

        </GlassCard>

        {/* robots.txt */}

        <GlassCard glow="emerald" className="p-6">

          {/* Header */}
          <div className="flex items-center justify-between mb-6">

            <h2 className="text-2xl font-bold text-[#00ff99] flex items-center gap-3">
              🤖 robots.txt
            </h2>

            <Badge
              variant={scanResult.robots.exists ? "emerald" : "warning"}
            >
              {scanResult.robots.exists ? "AVAILABLE" : "NOT FOUND"}
            </Badge>

          </div>

          {/* Status */}
          <div className="border-b border-white/10 pb-4 mb-4">

            <p className="text-slate-400 text-sm">
              Status
            </p>

            <p className="text-white text-lg font-semibold">
              {scanResult.robots.exists
                ? "robots.txt Found"
                : "robots.txt Missing"}
            </p>

          </div>

          {/* URL */}
          <div className="border-b border-white/10 pb-4 mb-4">

            <p className="text-slate-400 text-sm">
              robots.txt URL
            </p>

            <p className="text-[#7efeff] break-all">
              {scanResult.robots.url || "N/A"}
            </p>

          </div>

          {/* Sitemap */}
          <div className="border-b border-white/10 pb-4 mb-4">

            <p className="text-slate-400 text-sm">
              Sitemap
            </p>

            {scanResult.robots.sitemaps ? (

              <Badge variant="cyan">
                {scanResult.robots.sitemaps}
              </Badge>

            ) : (

              <span className="text-slate-500">
                No Sitemap Found
              </span>

            )}

          </div>

          {/* Rules Count */}
          <div className="border-b border-white/10 pb-4 mb-4">

            <div className="flex justify-between">

              <span className="text-slate-400">
                Total Disallow Rules
              </span>

              <Badge variant="purple">
                {scanResult.robots.disallow.length}
              </Badge>

            </div>

          </div>

          {/* Top Rules */}
          <div>

            <p className="text-slate-300 mb-3">
              Top Disallow Rules
            </p>

            <div className="space-y-2">

              {scanResult.robots.disallow.length > 0 ? (

              scanResult.robots.disallow
                .slice(
                  0,
                  showAllRobotsRules
                    ? scanResult.robots.disallow.length
                    : 8
                )
                  .map((rule: string, index: number) => (

                    <div
                      key={index}
                      className="bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-sm text-white"
                    >
                      {rule}
                    </div>

                  ))

              ) : (

                <p className="text-slate-500">
                  No Disallow Rules
                </p>

              )}

            </div>

            {scanResult.robots.disallow.length > 8 && (

              <div className="mt-4 text-center">

              <button
                onClick={() => setShowAllRobotsRules(!showAllRobotsRules)}
                className="px-4 py-2 rounded-lg bg-[#00ff99]/15 border border-[#00ff99]/40
                          text-[#00ff99] hover:bg-[#00ff99]/25 transition-all"
              >
                {showAllRobotsRules
                  ? "Show Less"
                  : `+ ${scanResult.robots.disallow.length - 8} More Rules`}
              </button>

              </div>

            )}

          </div>

        </GlassCard>






      {/* ================= METADATA ================= */}

      <GlassCard glow="emerald" className="p-6">

        <div className="flex items-center justify-between mb-6">

          <h2 className="text-xl font-bold text-[#00ff99]">
            📄 Metadata Analysis
          </h2>

          <Badge variant="emerald">
            METADATA
          </Badge>

        </div>

        <div className="space-y-5">

          {/* Title */}

          <div className="border-b border-white/10 pb-3">

            <p className="text-slate-400 mb-1">
              Title
            </p>

            <p className="text-white font-semibold break-words">
              {scanResult.metadata.metadata.title || "Not Found"}
            </p>

          </div>

          {/* Description */}

          <div className="border-b border-white/10 pb-3">

            <p className="text-slate-400 mb-1">
              Description
            </p>

            <p className="text-white break-words">
              {scanResult.metadata.metadata.description || "Not Found"}
            </p>

          </div>

          <div className="border-t border-white/10 py-4">
            <p className="text-slate-400">Publisher</p>

            <p className="text-white font-semibold">
              {scanResult.metadata.metadata.publisher || "Unknown"}
            </p>
          </div>

          <div className="border-t border-white/10 py-4">
            <p className="text-slate-400">Published Date</p>

            <p className="text-white">
              {scanResult.metadata.metadata.date || "Unknown"}
            </p>
          </div>

          <div className="border-t border-white/10 py-4">
            <p className="text-slate-400 mb-3">Website Logo</p>

            {scanResult.metadata.metadata.logo ? (

              <img
                src={scanResult.metadata.metadata.logo}
                alt="Logo"
                className="w-12 h-12 rounded-lg bg-white p-1"
              />

            ) : (

              <p className="text-slate-500">No Logo</p>

            )}
          </div>

          <div className="border-t border-white/10 py-4">

            <p className="text-slate-400 mb-3">Preview Image</p>

            {scanResult.metadata.metadata.image ? (

              <img
                src={scanResult.metadata.metadata.image}
                alt="Preview"
                className="rounded-lg border border-white/10"
              />

            ) : (

              <p className="text-slate-500">No Preview Image</p>

            )}

          </div>

          <div className="border-t border-white/10 py-4">

            <p className="text-slate-400">Source URL</p>

            <a

              href={scanResult.metadata.metadata.url}

              target="_blank"

              rel="noopener noreferrer"

              className="text-cyan-400 break-all"

            >
              {scanResult.metadata.metadata.url}

            </a>

          </div>

          {/* Keywords */}

          <div className="border-b border-white/10 pb-3">

            <p className="text-slate-400 mb-2">
              Keywords
            </p>

            <div className="flex flex-wrap gap-2">

              {scanResult.metadata.keywords
                ? scanResult.metadata.keywords
                    .split(",")
                    .map((item: string, index: number) => (
                      <Badge
                        key={index}
                        variant="purple"
                      >
                        {item.trim()}
                      </Badge>
                    ))
                : (
                  <span className="text-slate-500">
                    No Keywords
                  </span>
                )}

            </div>

          </div>

          {/* Charset */}

          <div className="flex justify-between border-b border-white/10 pb-2">

            <span className="text-slate-400">
              Charset
            </span>

            <span className="text-white">
              {scanResult.metadata.charset || "Unknown"}
            </span>

          </div>

          {/* Language */}

          <div className="flex justify-between border-b border-white/10 pb-2">

            <span className="text-slate-400">
              Language
            </span>

            <span className="text-white">
              {scanResult.metadata.metadata.lang || "Unknown"}
            </span>

          </div>

          {/* Viewport */}

          <div className="border-b border-white/10 pb-3">

            <p className="text-slate-400 mb-1">
              Viewport
            </p>

            <p className="text-white break-all">
              {scanResult.metadata.viewport || "Not Found"}
            </p>

          </div>

          {/* Generator */}

          <div className="flex justify-between">

            <span className="text-slate-400">
              Generator
            </span>

            <span className="text-white">
              {scanResult.metadata.generator || "Unknown"}
            </span>

          </div>

        </div>

      </GlassCard>

      </div>

      )}

    </div>
  );
};