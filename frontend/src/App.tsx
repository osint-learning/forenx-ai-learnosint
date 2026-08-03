import { BrowserRouter } from 'react-router-dom';
import { ParticleField } from './components/intelligence/ParticleField';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { AiMentorDrawer } from './components/layout/AiMentorDrawer';
import { AppRouter } from './router';

export function App() {
  return (
    <BrowserRouter>
        <div className="min-h-screen bg-[#030303] text-slate-100 relative overflow-hidden flex flex-col selection:bg-[#00ff99] selection:text-black">
          {/* Animated Cinematic Background Particles & Scanlines */}
          <ParticleField />

          {/* Floating Glass Navbar */}
          <Navbar />

          {/* Main App Page Viewport */}
          <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-8 py-8 z-10 relative">
            <AppRouter />
          </main>

          {/* Floating AI Mentor Chat Drawer */}
          <AiMentorDrawer />

          {/* Command Center Footer */}
          <Footer />
        </div>
    </BrowserRouter>
  );
}

export default App;
