import { useReadContracts } from "wagmi";
import { formatUnits } from "viem";
import { DPOS_CONTRACT_ADDRESS, DPOS_ABI } from "../config/contracts";
//import { useValidatorStats } from "./useValidatorStats";

export interface Validator {
  address: string;
  totalStake: string;
  comission: number;
  description: string;
  yield: number;
  isActive: boolean;
}
const BASE_APY = 14; // Taraxa base APY - adjust if needed

export function useValidators() {
  // Fetch batches 0-3 (covers ~100 validators at ~25 per batch)
  const { data, isLoading, error } = useReadContracts({
    contracts: [
      {
        address: DPOS_CONTRACT_ADDRESS,
        abi: DPOS_ABI,
        functionName: "getValidators",
        args: [0], //batch 0 for simplicity
        chainId: 841, // Taraxa mainnet
      },
      {
        address: DPOS_CONTRACT_ADDRESS,
        abi: DPOS_ABI,
        functionName: "getValidators",
        args: [1], //batch 1
        chainId: 841,
      },
      {
        address: DPOS_CONTRACT_ADDRESS,
        abi: DPOS_ABI,
        functionName: "getValidators",
        args: [2], //batch 2
        chainId: 841,
      },
      {
        address: DPOS_CONTRACT_ADDRESS,
        abi: DPOS_ABI,
        functionName: "getValidators",
        args: [3], //batch 3
        chainId: 841,
      },
    ],
  });

  // Combine all batches into one array
  //clean for display
  const validators: Validator[] =
    data?.flatMap(
      (batch) =>
        batch.result?.[0]?.map((v: any) => {
          const commission = v.info.comission / 100;

          return {
            // Existing data from blockchain
            address: v.account,
            totalStake: formatUnits(v.info.total_stake, 18),
            comission: commission, //convert to %
            description: v.info.description || "No description",
            // Add API stats
            yield: BASE_APY * (1 - commission / 100),
            isActive: true,
          };
        }) ?? [],
    ) ?? [];
  return {
    validators,
    isLoading,
    error,
  };
}
