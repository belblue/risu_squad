import { useEffect } from "react";
import { type Validator } from "../../hooks/useValidators";

interface ValidatorCardProps {
  validator: Validator;
  mode: "easy" | "expert";
}

const MAX_DELEGATION = 80_000_000; //80M per validator
const BASE_APY = 14;

export function ValidatorCard({ validator, mode }: ValidatorCardProps) {
  //calculations
  const stake = parseFloat(validator.totalStake);
  const formattedStake = stake.toLocaleString(undefined, {
    maximumFractionDigits: 0,
  });
  const shortAddress = `${validator.address.slice(0, 6)}...${validator.address.slice(-4)}`;

  // Calculate delegation capacity percentage
  const delegationPercent = (stake / MAX_DELEGATION) * 100;

  return (
    <div
      className={`${validator.isActive ? "bg-primary" : "bg-secondary"} p-4 rounded-lg border border-surface/20`}
    >
      <div className="flex justify-between items-start">
        {/* Header row*/}
        <div>
          <h3>{validator.description || shortAddress}</h3>
          {mode === "expert" && <p>{validator.address}</p>}
          <p>comission: {validator.comission} % fee</p>
          <p>Staked: {formattedStake}</p>
        </div>

        {/* Right side: Yield and status */}
        <div>
          <p className="text-primary">
            {validator.yield?.toFixed(1) ?? "N/A"} % APR
          </p>
        </div>
        <div>
          {validator.isActive ? <p>Status:active </p> : <p>Status: inactive</p>}
        </div>
        {/* Delegation capacity progress bar */}
        <div className="mt-3">
          <div className="flex justify-between text-sm text-surface/60 mb-1">
            <span>Capacity</span>
            <span>{delegationPercent.toFixed(1)}%</span>
          </div>

          {/* Progress bar background */}
          <div className="w-full bg-surface/20 rounded-full h-2">
            {/* Progress bar fill - width based on percentage */}
            <div
              className="bg-primary h-2 rounded-full transition-all"
              style={{ width: `${Math.min(delegationPercent, 100)}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
