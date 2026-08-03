import { BrowserRouter, useLocation } from "react-router-dom";

import { ParticleField } from "./components/intelligence/ParticleField";
import { Navbar } from "./components/layout/Navbar";
import { Footer } from "./components/layout/Footer";
import { AiMentorDrawer } from "./components/layout/AiMentorDrawer";
import { AppRouter } from "./router";

function AppLayout() {
  const location = useLocation();

  const isAuthPage =
    location.pathname === "/login" ||
    location.pathname === "/register";

  return (
    <div className="min-h-screen bg-[#030303] text-slate-100 relative overflow-hidden flex flex-col selection:bg-[#00ff99] selection:text-black">
      {/* Background */}
      <ParticleField />

      {/* Show only after login */}
      {!isAuthPage && <Navbar />}

      <main
        className={
          isAuthPage
            ? "flex-1 z-10 relative"
            : "flex-1 max-w-7xl w-full mx-auto px-4 sm:px-8 py-8 z-10 relative"
        }
      >
        <AppRouter />
      </main>

      {/* Show only after login */}
      {!isAuthPage && <AiMentorDrawer />}

      {/* Show only after login */}
      {!isAuthPage && <Footer />}
    </div>
  );
}

export function App() {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  );
}

export default App;