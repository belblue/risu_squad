import { useReadContract } from "wagmi";
import { formatUnits } from "viem";
import { DPOS_CONTRACT_ADDRESS, DPOS_ABI } from "../config/contracts";

export interface Validator {
  address: string;
  totalStake: string;
  comission: number;
  description: string;
}

export function useValidators() {
  const { data, isLoading, error } = useReadContract({
    address: DPOS_CONTRACT_ADDRESS,
    abi: DPOS_ABI,
    functionName: "getValidators",
    args: [0], //batch 0 for simplicity
  });
  //clean for display
  const validators: Validator[] =
    data?.[0]?.map((v) => ({
      address: v.account,
      totalStake: formatUnits(v.info.total_stake, 18),
      comission: v.info.commission / 100, //convert to %
      description: v.info.description || "No description",
    })) ?? [];

  return {
    validators,
    isLoading,
    error,
  };
}
