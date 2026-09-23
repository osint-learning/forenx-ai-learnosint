import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import ProtectedRoute from "./ProtectedRoute";

import { Dashboard } from "../pages/Dashboard";
import { Learn } from "../pages/Learn";
import { ToolExplorer } from "../pages/ToolExplorer";
import { PracticeLabs } from "../pages/PracticeLabs";
import { ReconEngine } from "../pages/ReconEngine";
import { InvestigationsList } from "../pages/InvestigationsList";
import { InvestigationWorkspace } from "../pages/InvestigationWorkspace";
import { ThreatIntelligence } from "../pages/ThreatIntelligence";
import { Reports } from "../pages/Reports";
import { Profile } from "../pages/Profile";
import { IndependentTerminal } from "../pages/IndependentTerminal";
import { AdminDashboard } from "../pages/AdminDashboard";
import { Login } from "../pages/Login";
import { Register } from "../pages/Register";

export const AppRouter: React.FC = () => {
  const { user } = useAuth();

  return (
    <Routes>
      {/* Redirect root based on user role */}
      <Route
        path="/"
        element={
          user ? (
            user.role === "admin" ? (
              <Navigate to="/admin" replace />
            ) : (
              <Navigate to="/dashboard" replace />
            )
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
            {user?.role === "admin" ? (
              <Navigate to="/admin" replace />
            ) : (
              <Dashboard />
            )}
          </ProtectedRoute>
        }
      />

      <Route
        path="/learn"
        element={
          <ProtectedRoute>
            {user?.role === "admin" ? <Navigate to="/admin" replace /> : <Learn />}
          </ProtectedRoute>
        }
      />

      <Route
        path="/tool-explorer"
        element={
          <ProtectedRoute>
            {user?.role === "admin" ? <Navigate to="/admin" replace /> : <ToolExplorer />}
          </ProtectedRoute>
        }
      />

      <Route
        path="/terminal"
        element={
          <ProtectedRoute>
            {user?.role === "admin" ? <Navigate to="/admin" replace /> : <IndependentTerminal />}
          </ProtectedRoute>
        }
      />

      <Route
        path="/practice-labs"
        element={
          <ProtectedRoute>
            {user?.role === "admin" ? <Navigate to="/admin" replace /> : <PracticeLabs />}
          </ProtectedRoute>
        }
      />

      <Route
        path="/recon"
        element={
          <ProtectedRoute>
            {user?.role === "admin" ? <Navigate to="/admin" replace /> : <ReconEngine />}
          </ProtectedRoute>
        }
      />

      <Route
        path="/investigations"
        element={
          <ProtectedRoute>
            {user?.role === "admin" ? <Navigate to="/admin" replace /> : <InvestigationsList />}
          </ProtectedRoute>
        }
      />

      <Route
        path="/investigations/:id"
        element={
          <ProtectedRoute>
            {user?.role === "admin" ? <Navigate to="/admin" replace /> : <InvestigationWorkspace />}
          </ProtectedRoute>
        }
      />

      <Route
        path="/threats"
        element={
          <ProtectedRoute>
            {user?.role === "admin" ? <Navigate to="/admin" replace /> : <ThreatIntelligence />}
          </ProtectedRoute>
        }
      />

      <Route
        path="/reports"
        element={
          <ProtectedRoute>
            {user?.role === "admin" ? <Navigate to="/admin" replace /> : <Reports />}
          </ProtectedRoute>
        }
      />

      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            {user?.role === "admin" ? <Navigate to="/admin" replace /> : <Profile />}
          </ProtectedRoute>
        }
      />

      {/* Admin Dashboard */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute adminOnly>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      {/* Unknown Route */}
      <Route
        path="*"
        element={
          user ? (
            user.role === "admin" ? (
              <Navigate to="/admin" replace />
            ) : (
              <Navigate to="/dashboard" replace />
            )
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
    </Routes>
  );
};
