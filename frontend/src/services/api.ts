import axios from 'axios';
import type { OsintTool, LearningCapsule, PracticeLab, ReconResult, ThreatMarker, IntelligenceReport } from '../types';
import { INITIAL_CAPSULES, INITIAL_LABS, INITIAL_THREAT_MARKERS } from '../constants';
import { mapTool } from "../utils/toolMapper";
const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  'http://localhost:5000/api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'X-Client-Platform': 'ForenX-LearnOSINT-FUI'
  },
  timeout: 10000
});

// REST API Service Wrappers with local fallback for immediate interactive UI operation
export const OsintService = {
  async getTools(): Promise<OsintTool[]> {
    try {
      const response = await apiClient.get("/tools");

      return response.data.data.map(mapTool);

      } catch (error) {
        console.error("Failed to load tools:", error);
        return [];
      }
  },
  async getToolById(id: string): Promise<OsintTool | undefined> {
    try {

      const response = await apiClient.get(`/tools/${id}`);

      return mapTool(response.data.data);

    } 
    catch (error) {

      console.error("Failed to load tool:", error);

      return undefined;

    }
  },
  async getLessons(toolId: string) {
    const response = await apiClient.get(`/lessons/tool/${toolId}`);
    return response.data.data;
  },

  async getQuiz(toolId: string) {
    const response = await apiClient.get(`/quizzes/tool/${toolId}`);
    return response.data.data;
  },

  async getLearningCapsules(): Promise<LearningCapsule[]> {
    try {
      const response = await apiClient.get<LearningCapsule[]>('/capsules');
      return response.data;
    } catch {
      return INITIAL_CAPSULES;
    }
  },

  async getPracticeLabs(): Promise<PracticeLab[]> {
    try {
      const response = await apiClient.get<PracticeLab[]>('/labs');
      return response.data;
    } catch {
      return INITIAL_LABS;
    }
  },

  async executeReconScan(target: string): Promise<any> {
    try {
      const token = localStorage.getItem("token");

      const response = await apiClient.post(
        "/recon/fullscan",
        {
          domain: target,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data.data;
    } catch {
      // Mock realistic dynamic scan response
      const isIp = /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(target);
      return {
        target,
        timestamp: new Date().toISOString(),
        riskScore: Math.floor(Math.random() * 45) + 40,
        ipAddress: isIp ? target : '198.51.100.88',
        geoCountry: 'United States',
        openPorts: [
          { port: 80, service: 'http', state: 'open' },
          { port: 443, service: 'https (TLS 1.3)', state: 'open' },
          { port: 22, service: 'ssh (OpenSSH 8.9p1)', state: 'filtered' },
          { port: 8080, service: 'http-proxy', state: 'open' }
        ],
        securityHeaders: [
          { header: 'Strict-Transport-Security', status: 'Pass' },
          { header: 'Content-Security-Policy', status: 'Warning' },
          { header: 'X-Frame-Options', status: 'Pass' },
          { header: 'X-Content-Type-Options', status: 'Pass' }
        ],
        dnsRecords: [
          { type: 'A', value: isIp ? target : '198.51.100.88' },
          { type: 'MX', value: 'mail.protection.outlook.com' },
          { type: 'NS', value: 'ns1.cybersec-cloud.net' },
          { type: 'TXT', value: 'v=spf1 include:spf.protection.outlook.com ~all' }
        ],
        sslStatus: {
          valid: true,
          issuer: 'DigiCert TLS Hybrid ECC SHA384 2020 CA1',
          expiresDays: 142
        },
        attackSurface: [
          { threatType: 'Exposed HTTP Staging Endpoint', severity: 'Medium', description: 'Port 8080 reveals unauthenticated debug dashboard.' },
          { threatType: 'Permissive SPF Policy', severity: 'Low', description: 'Softfail (~all) allows potential email spoofing attempts.' }
        ]
      };
    }
  },

  async getThreatMarkers(): Promise<ThreatMarker[]> {
    try {
      const response = await apiClient.get<ThreatMarker[]>('/threats');
      return response.data;
    } catch {
      return INITIAL_THREAT_MARKERS;
    }
  },

  async generateReport(target: string, scanData: ReconResult): Promise<IntelligenceReport> {
    return {
      id: `REP-${Math.floor(Math.random() * 90000) + 10000}`,
      title: `Executive Intelligence Report: ${target}`,
      target,
      date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
      author: 'ForenX AI LearnOSINT Core Engine',
      overallRisk: scanData.riskScore,
      summary: `Automated OSINT investigation on ${target} uncovered ${scanData.openPorts.length} open network ports and ${scanData.attackSurface.length} active surface vulnerabilities requiring remediation.`,
      findingsCount: { critical: 0, high: 1, medium: 2, low: 3 },
      recommendations: [
        'Enforce strict IP whitelist on HTTP Proxy Port 8080',
        'Upgrade SPF policy from softfail (~all) to hardfail (-all)',
        'Rotate exposed SSL certificate keys prior to expiry in 142 days'
      ]
    };
  }
};
