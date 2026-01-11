import "./App.css";
import { Header } from "./components/layout/Header";
import { StatsCard } from "./components/dahsboard/StatsCard";
import { Footer } from "./components/layout/Footer";

function App() {
  return (
    <>
      <div className="min-h-screen bg-dark">
        <Header />
        {/* main */}
        <main className="p-8">
          <h1 className="text-3xl text-primary"> Taraxa Dashboard</h1>
        </main>
        <StatsCard
          title="Balance"
          value="100 TARA"
          subtitle="Your current balance"
        />
        <StatsCard title="Transactions" value="250" />
      </div>
      <Footer />
    </>
  );
}

export default App;
