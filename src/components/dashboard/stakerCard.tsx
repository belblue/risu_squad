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
  if (isLoading) return <div className="p-4">{t(`staking.${mode}.loading`)}</div>;

  return (
    <div className="bg-secondary p-6 rounded-lg">
      <h2 className="text-xl mb-4">{t(`staking.${mode}.title`)}</h2>

      <div className="space-y-2">
        <p>
          {t(`staking.${mode}.totalStaked`, { amount: totalStaked.toLocaleString() })}
        </p>
        <p>{t(`staking.${mode}.rewards`, { amount: totalRewards.toFixed(4) })}</p>
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
          ? t(`staking.${mode}.claiming`)
          : isSuccess
            ? t(`staking.${mode}.claimed`)
            : totalRewards === 0
              ? t(`staking.${mode}.nothingToClaim`)
              : t(`staking.${mode}.claimRewards`)}
      </button>
      <p>{t(`staking.${mode}.yearlyReturn`, { amount: yearlyReturn })}</p>
      {mode === "expert" && (
        <p>{t(`staking.${mode}.apr`)}: {(apr * 100).toFixed(1)} %</p>
      )}
      {mode === "expert" && delegations.length > 0 && (
        <div>
          <p>{t(`staking.${mode}.delegations`)}: {delegations.length}</p>
          <ul>
            {delegations.map((d) => (
              <li key={d.validatorAddress}>
                <p>
                  {t(`staking.${mode}.validator`)}: {d.validatorAddress.slice(0, 6)}...
                  {d.validatorAddress.slice(-4)}
                </p>
                <p>{t(`staking.${mode}.stake`)}: {parseFloat(d.stake).toLocaleString()}</p>
                <p>{t(`staking.${mode}.rewards`, { amount: parseFloat(d.rewards).toLocaleString() })}</p>
                <button
                  disabled={isClaiming || d.rewards === "0" || isSuccess}
                  className={` ${isClaiming || d.rewards === "0" ? "bg-primary/20 cursor-not-allowed" : "bg-primary"}`}
                  onClick={() => claimSingleRewards(d.validatorAddress)}
                >
                  {isClaiming
                    ? t(`staking.${mode}.claiming`)
                    : isSuccess
                      ? t(`staking.${mode}.claimed`)
                      : d.rewards === "0"
                        ? t(`staking.${mode}.nothingToClaim`)
                        : t(`staking.${mode}.claimSingle`)}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
