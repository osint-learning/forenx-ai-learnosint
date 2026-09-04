import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import ProtectedRoute from "./ProtectedRoute";

import { Dashboard } from "../pages/Dashboard";
import { Learn } from "../pages/Learn";
import { ToolExplorer } from "../pages/ToolExplorer";
import { PracticeLabs } from "../pages/PracticeLabs";
import { ReconEngine } from "../pages/ReconEngine";
import { InvestigationWorkspace } from "../pages/InvestigationWorkspace";
import { ThreatIntelligence } from "../pages/ThreatIntelligence";
import { Reports } from "../pages/Reports";
import { Profile } from "../pages/Profile";
import { IndependentTerminal } from "../pages/IndependentTerminal";

import { Login } from "../pages/Login";
import { Register } from "../pages/Register";

export const AppRouter: React.FC = () => {
  const { user } = useAuth();

  return (
    <Routes>

      {/* Redirect root */}
      <Route
        path="/"
        element={
          user ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected Routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/learn"
        element={
          <ProtectedRoute>
            <Learn />
          </ProtectedRoute>
        }
      />

      <Route
        path="/tool-explorer"
        element={
          <ProtectedRoute>
            <ToolExplorer />
          </ProtectedRoute>
        }
      />

        <Route
          path="/terminal"
          element={
            <ProtectedRoute>
              <IndependentTerminal />
            </ProtectedRoute>
          }
        />

      <Route
        path="/practice-labs"
        element={
          <ProtectedRoute>
            <PracticeLabs />
          </ProtectedRoute>
        }
      />

      <Route
        path="/recon"
        element={
          <ProtectedRoute>
            <ReconEngine />
          </ProtectedRoute>
        }
      />

      <Route
        path="/investigations"
        element={
          <ProtectedRoute>
            <InvestigationWorkspace />
          </ProtectedRoute>
        }
      />

      <Route
        path="/threats"
        element={
          <ProtectedRoute>
            <ThreatIntelligence />
          </ProtectedRoute>
        }
      />

      <Route
        path="/reports"
        element={
          <ProtectedRoute>
            <Reports />
          </ProtectedRoute>
        }
      />

      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />



      {/* Unknown Route */}
      <Route
        path="*"
        element={<Navigate to="/" replace />}
      />

    </Routes>
  );
};