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

  //APR calcualtion

  return (
    <div className="bg-background-dark p-4 rounded-lg border border-surface/20">
      <div className="flex justify-between items-start">
        <div>
          <h3>{validator.description || shortAddress}</h3>
          {mode === "expert" && <p>{validator.address}</p>}
          <p>comission: {validator.comission}</p>
          <p>Staked: {formattedStake}</p>
        </div>
      </div>
    </div>
  );
}
