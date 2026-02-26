import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";

import { wagmiConfig } from "./config/wagmi.ts";
import "./i18n";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <App />
        <Toaster
          position="bottom-right"
          toastOptions={{
            success: {
              style: { background: "#302f4d", color: "#f0d3f7", border: "1px solid #15ab5a" },
            },
            error: {
              style: { background: "#302f4d", color: "#f0d3f7", border: "1px solid #df4444" },
            },
          }}
        />
      </QueryClientProvider>
    </WagmiProvider>
  </StrictMode>,
);
