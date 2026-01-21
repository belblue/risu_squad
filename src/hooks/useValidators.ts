import { useReadContracts } from "wagmi";
import { formatUnits } from "viem";
import { DPOS_CONTRACT_ADDRESS, DPOS_ABI } from "../config/contracts";
import { useValidatorStats } from "./useValidatorStats";

export interface Validator {
  address: string;
  totalStake: string;
  comission: number;
  description: string;
  yield?: number;
  rank?: number;
  isActive?: boolean;
}

export function useValidators() {
  // Fetch batches 0-3 (covers ~100 validators at ~25 per batch)
  const { data, isLoading, error } = useReadContracts({
    contracts: [
      {
        address: DPOS_CONTRACT_ADDRESS,
        abi: DPOS_ABI,
        functionName: "getValidators",
        args: [0], //batch 0 for simplicity
      },
      {
        address: DPOS_CONTRACT_ADDRESS,
        abi: DPOS_ABI,
        functionName: "getValidators",
        args: [1], //batch 1
      },
      {
        address: DPOS_CONTRACT_ADDRESS,
        abi: DPOS_ABI,
        functionName: "getValidators",
        args: [2], //batch 2
      },
      {
        address: DPOS_CONTRACT_ADDRESS,
        abi: DPOS_ABI,
        functionName: "getValidators",
        args: [3], //batch 3
      },
    ],
  });

  //fetch stats from taraxa API
  const { data: stats } = useValidatorStats();
  //create a map for fast lookups
  const statsMap = new Map(
    stats?.map((stat) => [stat.address.toLowerCase(), stat]) ?? [],
  );

  // Combine all batches into one array
  //clean for display
  const validators: Validator[] =
    data?.flatMap(
      (batch) =>
        batch.result?.[0]?.map((v: any) => {
          // Get the address in lowercase for consistent matching
          const address = v.account.toLowerCase();
          // Look up this validator's stats from the API data
          const validatorStats = statsMap.get(address);

          return {
            // Existing data from blockchain
            address: v.account,
            totalStake: formatUnits(v.info.total_stake, 18),
            comission: v.info.commission / 100, //convert to %
            description: v.info.description || "No description",
            // Add API stats
            yield: validatorStats?.yield,
            rank: validatorStats?.rank,
            isActive: validatorStats?.isActive,
          };
        }) ?? [],
    ) ?? [];
  return {
    validators,
    isLoading,
    error,
  };
}
