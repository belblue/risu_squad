import { StatsCard } from "../components/dashboard/StatsCard";
import { useConnection, useBalance } from "wagmi";
import { formatUnits } from "viem";
//import { useValidators } from "../hooks/useValidators";
import { ValidatorList } from "../components/validators/validatorList";
import { StakerCard } from "../components/dashboard/stakerCard";

interface DashboardProps {
  mode: "easy" | "expert";
}

export function Dashboard({ mode }: DashboardProps) {
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
  //load validators
  //const { validators, isLoading, error } = useValidators();

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
  //expert mode
  if (mode == "expert") {
    return (
      <div>
        <h1>Your information</h1>
        <p>
          Connected: {address?.slice(0, 6)}...{address?.slice(-4)}
        </p>
        <StakerCard mode={mode} />
        <StatsCard
          title="Available Balance"
          value={`${formattedBalance}"TARA"`}
          subtitle="Your current balance"
        />
        <StatsCard title="Staked Tara" value="250" subtitle="Earning rewards" />
        <StatsCard title="APY" value="250" subtitle="Lifetime returns" />
        <p>Compounded APY vs Simple APR</p>
        <ValidatorList mode={mode} />
      </div>
    );
  }

  //easy mode by default-new users have less patience than seasoned ones
  return (
    <div>
      <h1>Your information</h1>
      <p>
        Connected: {address?.slice(0, 6)}...{address?.slice(-4)}
      </p>
      <StatsCard
        title="Available Balance in your wallet"
        value={`${formattedBalance}"TARA"`}
        subtitle="Your current balance"
      />
      <StakerCard /> {/*mode={mode}*/}
      <StatsCard title="Staked Tara" value="250" subtitle="Earning rewards" />
      <StatsCard
        title="Total earnings"
        value="250"
        subtitle="Lifetime returns"
      />
      <StatsCard
        title="Yearly return in your current validator"
        value="250"
        subtitle="Expected yearly earning"
      />
      <p> If you stake 10,000 TARA, you'll earn ~1,450 TARA per year</p>
      <p>
        Compound: With auto-reinvest: 15.2% yearly" vs "Without: 14.5% yearly"
      </p>
      <div>
        <ValidatorList mode={mode} />
      </div>
    </div>
  );
}
