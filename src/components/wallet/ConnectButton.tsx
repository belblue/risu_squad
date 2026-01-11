import { useConnection, useConnect, useDisconnect, useConnectors } from "wagmi";

export function ConnectButton() {
  const { address, isConnected } = useConnection();
  const connectors = useConnectors();
  const { mutate: connect, isPending } = useConnect();
  const { mutate: disconnect } = useDisconnect();

  if (isConnected) {
    return (
      <div className="flex items-center gap-3">
        <span className="text-md text-surface">
          {address?.slice(0, 6)}...{address?.slice(-4)}
        </span>

        <button onClick={() => disconnect()}>Disconnect</button>
      </div>
    );
  }
  return (
    <button
      onClick={() => connect({ connector: connectors[0] })}
      disabled={isPending}
    >
      {isPending ? "Connecting..." : "Connect wallet"}
    </button>
  );
}
