import { useState } from "react";
import "./App.css";
import { Header } from "./components/layout/Header";
import { Footer } from "./components/layout/Footer";
import { Dashboard } from "./pages/Dashboard";
function App() {
  const [mode, setMode] = useState<"easy" | "expert">("easy");

  return (
    <>
      <div className="min-h-screen bg-dark">
        <Header mode={mode} onModeChange={setMode} />
        {/* main */}
        <main className="p-8">
          <Dashboard mode={mode} />
        </main>
      </div>
      <Footer />
    </>
  );
}

export default App;
