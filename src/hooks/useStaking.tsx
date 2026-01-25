import {
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
  useSwitchChain,
  useConnection,
} from "wagmi";
import { formatUnits } from "viem";
import { DPOS_CONTRACT_ADDRESS, DPOS_ABI } from "../config/contracts";

export interface Delegation {
  validatorAddress: string;
  stake: string;
  rewards: string;
}

const TARAXA_CHAIN_ID = 841;

export function useStaking(userAddress: `0x${string}` | undefined) {
  const { chainId } = useConnection();
  const { switchChainAsync } = useSwitchChain();

  //read delagations
  const { data, isLoading, error, refetch } = useReadContract({
    //from wagmi to read the contract call
    address: DPOS_CONTRACT_ADDRESS,
    abi: DPOS_ABI,
    functionName: "getDelegations",
    args: userAddress ? [userAddress, 0] : undefined,
    chainId: 841, // Taraxa mainnet
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
  const delegations: Delegation[] =
    data?.[0]?.map((d: any) => ({
      validatorAddress: d.account,
      stake: formatUnits(d.delegation.stake, 18),
      rewards: formatUnits(d.delegation.rewards, 18),
    })) ?? [];

  //Calculate totals
  const totalStaked = delegations.reduce(
    (sum, d) => sum + parseFloat(d.stake),
    0,
  );
  const totalRewards = delegations.reduce(
    (sum, d) => sum + parseFloat(d.rewards),
    0,
  );

  //claim function
  const claimAllRewards = async () => {
    // Switch to Taraxa if not already on it
    if (chainId !== TARAXA_CHAIN_ID) {
      await switchChainAsync({ chainId: TARAXA_CHAIN_ID });
    }

    await writeContractAsync({
      address: DPOS_CONTRACT_ADDRESS,
      abi: DPOS_ABI,
      functionName: "claimAllRewards",
      args: [],
      chainId: TARAXA_CHAIN_ID,
    });
  };

  //claim a single validator rewards
  const claimSingleRewards = async (validatorAddress: string) => {
    if (chainId != TARAXA_CHAIN_ID) {
      await switchChainAsync({ chainId: TARAXA_CHAIN_ID });
    }
    await writeContractAsync({
      address: DPOS_CONTRACT_ADDRESS,
      abi: DPOS_ABI,
      functionName: "claimRewards",
      args: [validatorAddress as `0x${string}`],
      chainId: TARAXA_CHAIN_ID,
    });
  };

  return {
    delegations,
    totalStaked,
    totalRewards,
    claimAllRewards,
    claimSingleRewards,
    isLoading,
    error,
    refetch,
    isSuccess,
    isClaiming: isConfirming || isClaiming,
  };
}
