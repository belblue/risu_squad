import { useState } from "react";
import { type Validator } from "../../hooks/useValidators";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";

interface ValidatorCardProps {
  validator: Validator;
  mode: "easy" | "expert";
  onDelegate?: (validatorAddress: string, amount: string) => Promise<void>;
  isDelegating?: boolean;
}

const MAX_DELEGATION = 80_000_000; //80M per validator
const BASE_APY = 14;

export function ValidatorCard({ validator, mode, onDelegate, isDelegating }: ValidatorCardProps) {
  const { t } = useTranslation();
  const [showStakeInput, setShowStakeInput] = useState(false);
  const [amount, setAmount] = useState("");

  //calculations
  const stake = parseFloat(validator.totalStake);
  const formattedStake = stake.toLocaleString(undefined, {
    maximumFractionDigits: 0,
  });
  const shortAddress = `${validator.address.slice(0, 6)}...${validator.address.slice(-4)}`;

  // Calculate delegation capacity percentage
  const delegationPercent = (stake / MAX_DELEGATION) * 100;

  const handleDelegate = async () => {
    if (!onDelegate || !amount || parseFloat(amount) <= 0) return;
    try {
      await onDelegate(validator.address, amount);
      toast.success(t(`staking.${mode}.delegateSuccess`));
      setAmount("");
      setShowStakeInput(false);
    } catch {
      toast.error(t(`staking.${mode}.delegateError`));
    }
  };

  return (
    <div
      className={`${validator.isActive ? "bg-primary/25" : "bg-secondary/40"} px-4 py-3 rounded-lg border border-surface/10`}
    >
      {/* Header: Name + Status */}
      <div className="flex items-center justify-between mb-3">
        <div className="min-w-0">
          <h3 className="text-base font-semibold truncate">
            {validator.description || shortAddress}
          </h3>
          {mode === "expert" && (
            <p className="text-xs text-surface/40 font-mono truncate">{validator.address}</p>
          )}
        </div>
        <span
          className={`text-xs px-2.5 py-0.5 rounded-full shrink-0 ml-3 ${
            validator.isActive
              ? "bg-primary/20 text-primary"
              : "bg-danger/20 text-danger"
          }`}
        >
          {validator.isActive ? "Status:active" : "Status: inactive"}
        </span>
      </div>

      {/* Stats row: label on top, value below */}
      <div className="grid grid-cols-4 gap-3">
        <div className="text-left">
          <p className="text-xs text-surface/40 uppercase tracking-wider">Staked</p>
          <p className="text-sm font-medium mt-0.5">Staked: {formattedStake}</p>
        </div>
        <div className="text-left">
          <p className="text-xs text-surface/40 uppercase tracking-wider">Commission</p>
          <p className="text-sm font-medium mt-0.5">commission: {validator.commission} % fee</p>
        </div>
        <div className="text-left">
          <p className="text-xs text-surface/40 uppercase tracking-wider">Yield</p>
          <p className="text-sm font-semibold text-primary mt-0.5">
            {validator.yield?.toFixed(1) ?? "N/A"} % APR
          </p>
        </div>
        <div className="text-left">
          <p className="text-xs text-surface/40 uppercase tracking-wider">Capacity</p>
          <div className="flex items-center gap-2 mt-1">
            <div className="flex-1 bg-dark/30 rounded-full h-1.5">
              <div
                className="bg-primary h-1.5 rounded-full transition-all"
                style={{ width: `${Math.min(delegationPercent, 100)}%` }}
              />
            </div>
            <span className="text-xs text-surface/40">{delegationPercent.toFixed(1)}%</span>
          </div>
        </div>
      </div>

      {/* Stake button and inline input */}
      {onDelegate && validator.isActive && (
        <div className="mt-2">
          {!showStakeInput ? (
            <button
              onClick={() => setShowStakeInput(true)}
              disabled={isDelegating}
              className={`px-3 py-1 rounded text-xs font-medium ${isDelegating ? "bg-surface/20 cursor-not-allowed" : "bg-dark hover:bg-dark/80"}`}
            >
              {isDelegating ? t(`staking.${mode}.delegating`) : t(`staking.${mode}.delegateBtn`)}
            </button>
          ) : (
            <div className="flex gap-2 items-center flex-wrap">
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder={t(`staking.${mode}.enterAmount`)}
                className="bg-dark border border-surface/20 rounded px-2 py-1 text-surface text-xs w-32"
                min="0"
              />
              <button
                onClick={handleDelegate}
                disabled={isDelegating || !amount || parseFloat(amount) <= 0}
                className={`px-3 py-1 rounded text-xs font-medium ${isDelegating || !amount || parseFloat(amount) <= 0 ? "bg-surface/20 cursor-not-allowed" : "bg-primary hover:bg-primary/80"}`}
              >
                {t(`staking.${mode}.confirm`)}
              </button>
              <button
                onClick={() => { setShowStakeInput(false); setAmount(""); }}
                className="px-3 py-1 rounded text-xs bg-surface/20 hover:bg-surface/30"
              >
                {t(`staking.${mode}.cancel`)}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
