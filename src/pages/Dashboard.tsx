import { StatsCard } from "../components/dashboard/StatsCard";
import { useConnection, useBalance } from "wagmi";
import { formatUnits } from "viem";
//import { useValidators } from "../hooks/useValidators";
import { ValidatorList } from "../components/validators/validatorList";
import { StakerCard } from "../components/dashboard/stakerCard";
import { useStaking } from "../hooks/useStaking";

interface DashboardProps {
  mode: "easy" | "expert";
}

export function Dashboard({ mode }: DashboardProps) {
  const { address, isConnected } = useConnection();
  //fetch native token balance (TARA)
  const { data: balance } = useBalance({
    address: address,
  });
  //fetch staking data
  const { totalStaked, totalRewards } = useStaking(address);
  const apr = 0.14;
  const yearlyReturn = (totalStaked * apr).toLocaleString(undefined, {
    maximumFractionDigits: 0,
  });
  //format with commas and 2 decimal places
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
  //expert mode
  if (mode == "expert") {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold">Your information</h1>
          <p className="text-sm text-surface/50 mt-1">
            Connected: {address?.slice(0, 6)}...{address?.slice(-4)}
          </p>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-3 gap-4">
          <StatsCard
            title="Available Balance"
            value={`${formattedBalance} TARA`}
            subtitle="Your current balance"
          />
          <StatsCard title="Staked Tara" value={`${totalStaked.toLocaleString()} TARA`} subtitle="Earning rewards" />
          <StatsCard title="APR" value={`${(apr * 100).toFixed(1)}%`} subtitle="Current annual rate" highlight />
        </div>

        {/* Staking section */}
        <StakerCard mode={mode} />

        <ValidatorList mode={mode} />
      </div>
    );
  }

  //easy mode by default-new users have less patience than seasoned ones
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Your information</h1>
        <p className="text-sm text-surface/50 mt-1">
          Connected: {address?.slice(0, 6)}...{address?.slice(-4)}
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatsCard
          title="Available Balance"
          value={`${formattedBalance} TARA`}
          subtitle="Your current balance"
        />
        <StatsCard title="Deposited" value={`${totalStaked.toLocaleString()} TARA`} subtitle="Earning rewards" />
        <StatsCard
          title="Total earnings"
          value={`${totalRewards.toFixed(4)} TARA`}
          subtitle="Lifetime returns"
          highlight
        />
        <StatsCard
          title="Estimated yearly return"
          value={`~${yearlyReturn} TARA`}
          subtitle="Expected yearly earning"
        />
      </div>

      {/* Compound tip */}
      <div className="bg-secondary/40 rounded-lg px-4 py-3 text-sm text-surface/60">
        <p>If you stake 10,000 TARA, you'll earn ~1,450 TARA per year</p>
        <p className="mt-1">With auto-reinvest: 15.2% yearly vs Without: 14.5% yearly</p>
      </div>

      {/* Staking section */}
      <StakerCard mode={mode} />

      <ValidatorList mode={mode} />
    </div>
  );
}
