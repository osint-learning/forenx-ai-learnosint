import { useState } from "react";
import api from "../services/api";
import ResultCard from "../components/ResultCard";
import InfoRow from "../components/InfoRow";

function Recon() {
  const [domain, setDomain] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const handleScan = async () => {
    if (!domain) return;

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const token = localStorage.getItem("token");

      const response = await api.post(
        "/recon/fullscan",
        { domain },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setResult(response.data.data);
    } catch (err) {
      setError(err.response?.data?.message || "Scan failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 p-8">

      <h1 className="text-4xl font-bold text-blue-700">
        Recon Engine
      </h1>

      <div className="mt-8 flex gap-3">

        <input
          type="text"
          placeholder="example.com"
          className="flex-1 border rounded-lg p-3"
          value={domain}
          onChange={(e) => setDomain(e.target.value)}
        />

        <button
          onClick={handleScan}
          className="bg-blue-600 text-white px-6 rounded-lg"
        >
          Scan
        </button>

      </div>

      {loading && (
        <p className="mt-6">Scanning...</p>
      )}

      {error && (
        <p className="mt-6 text-red-600">{error}</p>
      )}

      {result && (
        <div className="mt-8">

        <div className="grid md:grid-cols-2 gap-6 mt-8">

        <ResultCard title="🌐 Domain Information">
            <InfoRow
            label="IP Address"
            value={result.domain?.ipAddresses?.join(", ")}
            />

            <InfoRow
            label="MX Records"
            value={result.domain?.mxRecords?.length}
            />

            <InfoRow
            label="Name Servers"
            value={result.domain?.nameServers?.join(", ")}
            />
        </ResultCard>

        <ResultCard title="🌍 Website Information">
            <InfoRow
            label="URL"
            value={result.website?.url}
            />

            <InfoRow
            label="Status Code"
            value={result.website?.statusCode}
            />

            <InfoRow
            label="Response Time"
            value={`${result.website?.responseTime} ms`}
            />

            <InfoRow
            label="Server"
            value={result.website?.server}
            />
        </ResultCard>

        <ResultCard title="🔒 SSL Certificate">
            <InfoRow
            label="Issuer"
            value={result.ssl?.issuer}
            />

            <InfoRow
            label="Subject"
            value={result.ssl?.subject}
            />

            <InfoRow
            label="Valid From"
            value={result.ssl?.validFrom}
            />

            <InfoRow
            label="Valid To"
            value={result.ssl?.validTo}
            />

            <InfoRow
            label="Days Remaining"
            value={result.ssl?.daysRemaining}
            />
        </ResultCard>

        <ResultCard title="📋 WHOIS">
            <InfoRow
            label="Registrar"
            value={result.whois?.whois?.registrar}
            />

            <InfoRow
            label="Registrant"
            value={result.whois?.whois?.registrant}
            />

            <InfoRow
            label="Created"
            value={result.whois?.whois?.created}
            />

            <InfoRow
            label="DNSSEC"
            value={result.whois?.whois?.dnssec}
            />
        </ResultCard>

        <ResultCard title="🛡 Security Headers">
        <div className="overflow-x-auto">
            <table className="w-full">
            <thead>
                <tr className="border-b">
                <th className="text-left py-2">Header</th>
                <th className="text-left">Status</th>
                <th className="text-left">Severity</th>
                </tr>
            </thead>

            <tbody>
                {result.headers?.findings?.map((header, index) => (
                <tr key={index} className="border-b">
                    <td className="py-2">{header.header}</td>
                    <td>{header.status}</td>
                    <td>{header.severity}</td>
                </tr>
                ))}
            </tbody>
            </table>
        </div>
        </ResultCard>

        <ResultCard title="💻 Technology Detection">
        {result.technology?.technologies?.map((tech, index) => (
            <div key={index} className="border-b py-3">
            <p className="font-bold">{tech.name}</p>
            <p>Category: {tech.category}</p>
            <p>Confidence: {tech.confidence}%</p>
            </div>
        ))}
        </ResultCard>

        <ResultCard title="📄 Metadata">
        <InfoRow
            label="Title"
            value={result.metadata?.metadata?.title}
        />

        <InfoRow
            label="Language"
            value={result.metadata?.metadata?.language}
        />

        <InfoRow
            label="Description"
            value={result.metadata?.metadata?.description}
        />

        <InfoRow
            label="Keywords"
            value={result.metadata?.metadata?.keywords}
        />

        <InfoRow
            label="Favicon"
            value={result.metadata?.metadata?.favicon}
        />
        </ResultCard>

        <ResultCard title="🤖 robots.txt">
        <InfoRow
            label="Exists"
            value={result.robots?.exists ? "Yes" : "No"}
        />

        <InfoRow
            label="Sitemap"
            value={result.robots?.sitemap}
        />

        <InfoRow
            label="Disallowed URLs"
            value={result.robots?.totalDisallowed}
        />
        </ResultCard>

        </div>

        </div>
      )}

    </div>
  );
}

export default Recon;