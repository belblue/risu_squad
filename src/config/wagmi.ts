import { http, createConfig } from "wagmi";
import { defineChain } from "viem";
import { injected } from "wagmi/connectors";

export const taraxa = defineChain({
  id: 841,
  name: "Taraxa",
  nativeCurrency: { name: "TARA", symbol: "TARA", decimals: 18 },
  rpcUrls: {
    default: {
      http: ["https://rpc.mainnet.taraxa.io/"],
    },
  },
  blockExplorers: {
    default: {
      name: "Taraxa Explorer",
      url: "https://explorer.mainnet.taraxa.io",
    },
  },
});

export const wagmiConfig = createConfig({
  chains: [taraxa],
  connectors: [injected()],
  transports: {
    [taraxa.id]: http(),
  },
});
