import { BrowserRouter, Routes, Route, NavLink, useLocation } from "react-router-dom";
import Categorias from "./pages/Categorias";
import Pessoas from "./pages/Pessoas";
import Transacoes from "./pages/Transacoes";
import Dashboard from "./pages/Dashboard";

const NAV_ITEMS = [
  { to: "/", label: "Dashboard", icon: "◈" },
  { to: "/pessoas", label: "Pessoas", icon: "◉" },
  { to: "/categorias", label: "Categorias", icon: "◈" },
  { to: "/transacoes", label: "Transações", icon: "◇" },
];

function Navbar() {
  const location = useLocation();

  return (
    <header className="sticky top-0 z-50 border-b border-white/5 bg-[#0f1117]/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-violet-600 flex items-center justify-center text-sm">
              ₿
            </div>
            <span
              className="text-white font-bold text-lg hidden sm:block"
              style={{ fontFamily: "var(--font-display)" }}
            >
              FinControl
            </span>
          </div>

          {/* Nav */}
          <nav className="flex items-center gap-1">
            {NAV_ITEMS.map((item) => {
              const isActive =
                item.to === "/"
                  ? location.pathname === "/"
                  : location.pathname.startsWith(item.to);

              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={`relative px-3 sm:px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "text-white bg-white/10"
                      : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
                  }`}
                >
                  <span className="sm:hidden">{item.icon}</span>
                  <span className="hidden sm:inline">{item.label}</span>
                  {isActive && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-violet-500" />
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
}

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#0f1117]">
      <Navbar />

      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 50% -20%, rgba(139,92,246,0.08) 0%, transparent 60%)",
        }}
      />

      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {children}
      </main>

      <footer className="border-t border-white/5 mt-16 py-6 text-center text-xs text-slate-700">
        FinControl — Sistema de Controle de Gastos Residenciais
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/pessoas" element={<Pessoas />} />
          <Route path="/categorias" element={<Categorias />} />
          <Route path="/transacoes" element={<Transacoes />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}