import { useReadContracts } from "wagmi";
import { formatUnits } from "viem";
import { DPOS_CONTRACT_ADDRESS, DPOS_ABI } from "../config/contracts";
//import { useValidatorStats } from "./useValidatorStats";

export interface Validator {
  address: string;
  totalStake: string;
  commission: number;
  description: string;
  yield: number;
  isActive: boolean;
}
const BASE_APY = 14; // Taraxa base APY - adjust if needed

export function useValidators() {
  // Fetch batches 0-7 (covers ~200 validators at ~25 per batch)
  const batches = Array.from({ length: 8 }, (_, i) => ({
    address: DPOS_CONTRACT_ADDRESS,
    abi: DPOS_ABI,
    functionName: "getValidators" as const,
    args: [i],
    chainId: 841,
  }));
  const { data, isLoading, error } = useReadContracts({ contracts: batches });

  // Combine all batches into one array
  //clean for display
  const validators: Validator[] =
    data?.flatMap(
      (batch) =>
        batch.result?.[0]?.map((v: any) => {
          const commission = v.info.commission / 100;

          return {
            // Existing data from blockchain
            address: v.account,
            totalStake: formatUnits(v.info.total_stake, 18),
            commission: commission, //convert to %
            description: v.info.description || "No description",
            // Add API stats
            yield: BASE_APY * (1 - commission / 100),
            isActive: v.info.endpoint !== "",
          };
        }) ?? [],
    ) ?? [];
  validators.sort((a, b) => Number(b.isActive) - Number(a.isActive));
  return {
    validators,
    isLoading,
    error,
  };
}
