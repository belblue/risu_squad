import {
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { formatUnits } from "viem";
import { DPOS_CONTRACT_ADDRESS, DPOS_ABI } from "../config/contracts";

export interface Delegation {
  validatorAddress: string;
  stake: string;
  rewards: string;
}

export function useStaking(userAddress: `0x${string}` | undefined) {
  //read delagations
  const { data, isLoading, error, refetch } = useReadContract({
    //from wagmi to read the contract call
    address: DPOS_CONTRACT_ADDRESS,
    abi: DPOS_ABI,
    functionName: "getDelegations",
    args: userAddress ? [userAddress, 0] : undefined,
    query: { enabled: !!userAddress },
  });
  //write function for claiming-send tx
  const {
    writeContractAsync,
    data: txHash,
    isPending: isClaiming,
  } = useWriteContract();
  //wait for transaction
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash: txHash,
  });

  //parse delegation
  const delegations: Delegation[] = data?.[0]?.map((d:any)=>({
    validatorAddress: d.account, 
    stake: formatUnits(d.delegation.stake,18),
    rewards: formatUnits(d.delegation.rewards,18)
  })) ?? [];

//Calculate totals
const totalStaked = delegations.reduce(
    (sum, d)=>sum + parseFloat(d.stake), 0 
);
const totalRewards = delegations.reduce(
    (sum,d)=>sum + parseFloat(d.rewards), 0
);

//claim function
const claimAllRewards = async () => {
    await writeContractAsync({
        address: DPOS_CONTRACT_ADDRESS,
        abi: DPOS_ABI,
        functionName: "claimAllRewards",
        args: [],
    });
}
return{
    delegations, 
    totalStaked,
    totalRewards,
    claimAllRewards,
    isLoading, 
    error,
    refetch,
    isSuccess,
    isClaiming: isConfirming || isClaiming,

};

}
