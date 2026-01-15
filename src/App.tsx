import "./App.css";
import { Header } from "./components/layout/Header";
import { Footer } from "./components/layout/Footer";
import { Dashboard } from "./pages/Dashboard";
function App() {
  return (
    <>
      <div className="min-h-screen bg-dark">
        <Header />
        {/* main */}
        <main className="p-8">
          <Dashboard />
        </main>
      </div>
      <Footer />
    </>
  );
}

export default App;
