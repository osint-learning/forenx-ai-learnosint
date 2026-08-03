import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Dashboard } from '../pages/Dashboard';
import { Learn } from '../pages/Learn';
import { ToolExplorer } from '../pages/ToolExplorer';
import { LessonViewer } from '../pages/LessonViewer';
import { PracticeLabs } from '../pages/PracticeLabs';
import { ReconEngine } from '../pages/ReconEngine';
import { InvestigationWorkspace } from '../pages/InvestigationWorkspace';
import { ThreatIntelligence } from '../pages/ThreatIntelligence';
import { Reports } from '../pages/Reports';
import { Profile } from '../pages/Profile';

export const AppRouter: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/learn" element={<Learn />} />
      <Route path="/tool-explorer" element={<ToolExplorer />} />
      <Route path="/lesson-viewer" element={<LessonViewer />} />
      <Route path="/practice-labs" element={<PracticeLabs />} />
      <Route path="/recon" element={<ReconEngine />} />
      <Route path="/investigations" element={<InvestigationWorkspace />} />
      <Route path="/threats" element={<ThreatIntelligence />} />
      <Route path="/reports" element={<Reports />} />
      <Route path="/profile" element={<Profile />} />
    </Routes>
  );
};
