import { useState } from "react";
import reactLogo from "./assets/react.svg";
import logo from "/logo.svg";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <div>
        <img src={logo} className="h-20 w-auto" alt="logo" />
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="h-20" alt="React logo" />
        </a>
      </div>
      <h1>Taraxa Dashboard</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
    </>
  );
}

export default App;
