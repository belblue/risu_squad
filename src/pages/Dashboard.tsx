import { StatsCard } from "../components/dahsboard/StatsCard";
import { useConnection, useBalance } from "wagmi";
import { formatUnits } from "viem";

export function Dashboard() {
  const { address, isConnected } = useConnection();

  //fetch native token balance (TARA)
  const { data: balance } = useBalance({
    address: address,
  });
  //fortmat with commas and 2 decimal places
  const formattedBalance = balance
    ? parseFloat(formatUnits(balance.value, 18)).toLocaleString(undefined, {
        maximumFractionDigits: 2,
      })
    : "0";

  if (!isConnected) {
    //not connected
    return (
      <div>
        <h1 className="text-primary">Dashboard</h1>
        <h2 className="text-2xl font-bold text-surface mb-4">
          Welcome to Taraxa Dashboard
        </h2>
        <p className="text-surface/60">
          Connect your wallet to view your balance
        </p>
      </div>
    );
  }
  return (
    <div>
      <h1>Your dashboard</h1>
      <p>
        Connected: {address?.slice(0, 6)}...{address?.slice(-4)}
      </p>

      <StatsCard
        title="Available Balance"
        value={`${formattedBalance}"TARA"`}
        subtitle="Your current balance"
      />
      <StatsCard title="Staked Tara" value="250" subtitle="Earning rewards" />
      <StatsCard
        title="Total earnings"
        value="250"
        subtitle="Lifetime returns"
      />
    </div>
  );
}
