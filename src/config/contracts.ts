export const DPOS_CONTRACT_ADDRESS =
  "0x00000000000000000000000000000000000000fe" as const;

// Minimal ABI for reading validator data
export const DPOS_ABI = [
  {
    name: "getTotalEligibleVotesCount",
    type: "function",
    stateMutability: "view",
    inputs: [],
    outputs: [{ type: "uint256" }],
  },
  {
    name: "getValidators",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "batch", type: "uint32" }],
    outputs: [
      {
        type: "tuple[]",
        components: [
          { name: "account", type: "address" },
          {
            name: "info",
            type: "tuple",
            components: [
              { name: "total_stake", type: "uint256" },
              { name: "commission_reward", type: "uint256" },
              { name: "commission", type: "uint16" },
              { name: "last_commission_change", type: "uint64" },
              { name: "undelegations_count", type: "uint16" },
              { name: "owner", type: "address" },
              { name: "description", type: "string" },
              { name: "endpoint", type: "string" },
            ],
          },
        ],
      },
      { name: "end", type: "bool" },
    ],
  },
] as const;
