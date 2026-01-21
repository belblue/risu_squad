import { useQuery } from "@tanstack/react-query";

export interface ValidatorStats {
  address: string;
  yield: number;
  rank: number;
  pbftCount: number;
  isActive: boolean;
}

interface ApiValidator {
  address: string;
  yield: string;
  rank: number;
  pbft_count: number;
}

async function fetchValidatorsStats(): Promise<ValidatorStats[]> {
  const response = await fetch(
    "https://indexer.mainnet.taraxa.io/api/validators",
  );
  if (!response.ok) {
    throw new Error("Failed to fetch validator stats");
  }
  //parse json response
  const json = await response.json();
  //transfrom api data to new array by transforming each item
  return json.data.map((v: ApiValidator) => ({
    address: v.address.toLowerCase(),
    yield: parseFloat(v.yield) || 0,
    rank: v.rank,
    pbftCount: v.pbft_count,
    isActive: v.pbft_count > 0,
  }));
}
///custom hook
export function useValidatorStats() {
  return useQuery({
    // Unique key to identify this data in the cache
    queryKey: ["validtorStats"],
    // The function that fetches the data
    queryFn: fetchValidatorsStats,
    // Don't refetch if data is less than 1 minute old
    staleTime: 60 * 1000,
    // Automatically refetch every minute for "real-time"
    refetchInterval: 60 * 1000,
  });
}
