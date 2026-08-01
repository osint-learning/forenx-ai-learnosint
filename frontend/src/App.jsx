import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import Recon from "./pages/Recon";
import LearnOSINT from "./pages/LearnOSINT";
import LessonDetails from "./pages/LessonDetails";
import ToolCategories from "./pages/ToolCategories";
import ToolList from "./pages/ToolList";
import ToolDetails from "./pages/ToolDetails";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />

        <Route path="/register" element={<Register />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
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
        <Route
          path="/recon"
          element={
            <ProtectedRoute>
              <Recon />
            </ProtectedRoute>
          }
        />
        <Route
            path="/learn"
            element={<LearnOSINT />}
        />
        <Route 
            path="/learn/:id" 
            element={<LessonDetails />} 
        />
        <Route
            path="/tools"
            element={<ToolCategories />}
        />
        <Route
          path="/tools/category/:category"
          element={<ToolList />}
        />
        <Route
            path="/tools/:id"
            element={<ToolDetails />}
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;