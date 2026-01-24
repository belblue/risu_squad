import { useConnection } from "wagmi";
import { useStaking } from "../../hooks/useStaking";

export function StakerCard() {
  const { address } = useConnection();
  const { totalStaked, totalRewards, claimAllRewards, isLoading, isClaiming } =
    useStaking(address);

  if (isLoading) return <div className="p-4">Loading...</div>;

  return (
    <div className="bg-secondary p-6 rounded-lg">
      <h2 className="text-xl mb-4">Your Staking</h2>

      <div className="space-y-2">
        <p>Total Staked: {totalStaked.toLocaleString()} TARA</p>
        <p>Rewards: {totalRewards.toFixed(4)} TARA</p>
      </div>

      <button
        onClick={claimAllRewards}
        disabled={isClaiming || totalRewards === 0}
        className="mt-4 bg-primary px-4 py-2 rounded"
      >
        {isClaiming ? "Claiming..." : "Claim Rewards"}
      </button>
    </div>
  );
}
