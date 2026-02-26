import { useConnection } from "wagmi";
import { useStaking } from "../../hooks/useStaking";
import toast from "react-hot-toast";

import { useTranslation } from "react-i18next";

interface StakerCardProps {
  mode: "easy" | "expert";
}
export function StakerCard({ mode }: StakerCardProps) {
  const { t } = useTranslation();
  const { address } = useConnection();
  const {
    delegations,
    totalStaked,
    totalRewards,
    claimAllRewards,
    claimSingleRewards,
    isLoading,
    isClaiming,
    isSuccess,
  } = useStaking(address);
  const apr = 0.14;
  //calculate year return
  const yearlyReturn = (totalStaked * apr).toLocaleString(undefined, {
    maximumFractionDigits: 0,
  }); //given the apr is 14
  if (isLoading) return <div className="p-4">{t(`staking.${mode}.loading`)}</div>;

  return (
    <div className="bg-secondary/60 border border-surface/10 rounded-xl px-5 py-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">{t(`staking.${mode}.title`)}</h2>
        {mode === "expert" && (
          <span className="text-xs text-surface/40">
            {t(`staking.${mode}.apr`)}: {(apr * 100).toFixed(1)} %
          </span>
        )}
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-3 gap-4">
        <div>
          <p className="text-xs text-surface/40 uppercase tracking-wider">Staked</p>
          <p className="text-sm font-medium mt-0.5">
            {t(`staking.${mode}.totalStaked`, { amount: totalStaked.toLocaleString() })}
          </p>
        </div>
        <div>
          <p className="text-xs text-surface/40 uppercase tracking-wider">Rewards</p>
          <p className="text-sm font-semibold text-primary mt-0.5">
            {t(`staking.${mode}.rewards`, { amount: totalRewards.toFixed(4) })}
          </p>
        </div>
        <div>
          <p className="text-xs text-surface/40 uppercase tracking-wider">Yearly return</p>
          <p className="text-sm font-medium mt-0.5">
            {t(`staking.${mode}.yearlyReturn`, { amount: yearlyReturn })}
          </p>
        </div>
      </div>

      {/* Claim all button */}
      <button
        onClick={async () => {
          try {
            await claimAllRewards();
            toast.success(t(`staking.${mode}.claimSuccess`));
          } catch {
            toast.error(t(`staking.${mode}.claimError`));
          }
        }}
        disabled={isClaiming || totalRewards === 0}
        className={`px-4 py-2 rounded-lg text-sm font-medium w-full
            ${
              isClaiming || totalRewards === 0
                ? "bg-surface/20 text-surface/40 cursor-not-allowed"
                : "bg-primary hover:bg-primary/80"
            }
        `}
      >
        {isClaiming
          ? t(`staking.${mode}.claiming`)
          : isSuccess
            ? t(`staking.${mode}.claimed`)
            : totalRewards === 0
              ? t(`staking.${mode}.nothingToClaim`)
              : t(`staking.${mode}.claimRewards`)}
      </button>

      {/* Expert: delegation list */}
      {mode === "expert" && delegations.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs text-surface/40 uppercase tracking-wider">
            {t(`staking.${mode}.delegations`)}: {delegations.length}
          </p>
          <div className="space-y-2">
            {delegations.map((d) => (
              <div key={d.validatorAddress} className="bg-dark/30 rounded-lg px-4 py-3 flex items-center justify-between gap-4">
                <div className="grid grid-cols-3 gap-4 flex-1 text-sm">
                  <div>
                    <p className="text-xs text-surface/40">Validator</p>
                    <p className="font-mono mt-0.5">
                      {t(`staking.${mode}.validator`)}: {d.validatorAddress.slice(0, 6)}...
                      {d.validatorAddress.slice(-4)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-surface/40">Stake</p>
                    <p className="mt-0.5">{t(`staking.${mode}.stake`)}: {parseFloat(d.stake).toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-surface/40">Rewards</p>
                    <p className="text-primary font-semibold mt-0.5">
                      {t(`staking.${mode}.rewards`, { amount: parseFloat(d.rewards).toLocaleString() })}
                    </p>
                  </div>
                </div>
                <button
                  disabled={isClaiming || d.rewards === "0" || isSuccess}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium shrink-0 ${isClaiming || d.rewards === "0" ? "bg-surface/20 text-surface/40 cursor-not-allowed" : "bg-primary hover:bg-primary/80"}`}
                  onClick={async () => {
                    try {
                      await claimSingleRewards(d.validatorAddress);
                      toast.success(t(`staking.${mode}.claimSuccess`));
                    } catch {
                      toast.error(t(`staking.${mode}.claimError`));
                    }
                  }}
                >
                  {isClaiming
                    ? t(`staking.${mode}.claiming`)
                    : isSuccess
                      ? t(`staking.${mode}.claimed`)
                      : d.rewards === "0"
                        ? t(`staking.${mode}.nothingToClaim`)
                        : t(`staking.${mode}.claimSingle`)}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
