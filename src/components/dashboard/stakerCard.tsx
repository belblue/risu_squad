import { useConnection } from "wagmi";
import { useStaking } from "../../hooks/useStaking";

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
  if (isLoading) return <div className="p-4">{t("staking.loading")}</div>;

  return (
    <div className="bg-secondary p-6 rounded-lg">
      <h2 className="text-xl mb-4">{t("staking.title")}</h2>

      <div className="space-y-2">
        <p>
          {t("staking.totalStaked", { amount: totalStaked.toLocaleString() })}
        </p>
        <p>{t("staking.rewards", { amount: totalRewards.toFixed(4) })}</p>
      </div>

      <button
        onClick={claimAllRewards}
        disabled={isClaiming || totalRewards === 0}
        className={`mt-4 px-4 py-2 rounded w-full
            ${
              isClaiming || totalRewards === 0
                ? "bg-surface/20 text-surface/40 cursor-not-allowed"
                : "bg-primary hover:bg-primary/80"
            }
        `}
      >
        {isClaiming
          ? t("staking.claiming")
          : isSuccess
            ? t("staking.claimed")
            : totalRewards === 0
              ? t("staking.nothingToClaim")
              : t("staking.claimRewards")}
      </button>
      <p>{t("staking.yearlyReturn", { amount: yearlyReturn })}</p>
      {/*expert mode show apr*/}
      {mode === "expert" && <p>APR: {(apr * 100).toFixed(1)} %</p>}
      {/*expert mode*/}
      {mode === "expert" && delegations.length > 0 && (
        <div>
          <p>Number of delegations: {delegations.length}</p>
          <ul>
            {delegations.map((d) => (
              <li key={d.validatorAddress}>
                <p>
                  {d.validatorAddress.slice(0, 6)}...
                  {d.validatorAddress.slice(-4)}
                </p>
                <p>Stake: {parseFloat(d.stake).toLocaleString()}</p>
                <p>Rewards: {parseFloat(d.rewards).toLocaleString()}</p>
                <button
                  disabled={isClaiming || d.rewards === "0" || isSuccess}
                  className={` ${isClaiming || d.rewards === "0" ? "bg-primary/20 cursor-not-allowed" : "bg-primary"}`}
                  onClick={() => claimSingleRewards(d.validatorAddress)}
                >
                  {isClaiming
                    ? t("staking.claiming")
                    : isSuccess
                      ? t("staking.claimed")
                      : d.rewards === "0"
                        ? t("staking.nothingToClaim")
                        : t("staking.claimSingle")}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
