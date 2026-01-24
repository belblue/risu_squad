import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import { StakerCard } from "./stakerCard";

//mock useConnection
vi.mock("wagmi", () => ({
  useConnection: vi.fn(), //false address
}));

//mock useStaking hook
vi.mock("../../hooks/useStaking", () => ({
  useStaking: vi.fn(),
}));

//mock imports
import { useStaking } from "../../hooks/useStaking";
import { useConnection } from "wagmi";

describe("StakerCard", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    //default mock for useConnection
    vi.mocked(useConnection).mockReturnValue({
      address: "0x1234567890abcdef1234567890abcdef12345678",
    } as any);
  });
  //isLoading true displayis is loading
  it("isLoading displays loading", () => {
    vi.mocked(useStaking).mockReturnValue({
      delegations: [],
      totalStaked: 0,
      totalRewards: 0,
      claimAllRewards: vi.fn(),
      isLoading: true,
      error: null,
      refetch: vi.fn(),
      isSuccess: false,
      isClaiming: false,
    });
    render(<StakerCard />);
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });
  //totalstaked displays
  it("renders total staked amount", () => {
    vi.mocked(useStaking).mockReturnValue({
      delegations: [],
      totalStaked: 1500,
      totalRewards: 100,
      claimAllRewards: vi.fn(),
      isLoading: false,
      error: null,
      refetch: vi.fn(),
      isSuccess: false,
      isClaiming: false,
    });
    render(<StakerCard />);
    expect(
      screen.getByText(/Total Staked: 1,500 TARA/),
    ).toBeInTheDocument();
  });
  //toatalreward displays
  it("renders totalRewards", () => {
    vi.mocked(useStaking).mockReturnValue({
      delegations: [],
      totalStaked: 1500,
      totalRewards: 112,
      claimAllRewards: vi.fn(),
      isLoading: false,
      error: null,
      refetch: vi.fn(),
      isSuccess: false,
      isClaiming: false,
    });
    render(<StakerCard />);
    expect(screen.getByText("Rewards: 112.0000 TARA")).toBeInTheDocument();
  });
  //buton claim exists

  it("render claim button", () => {
    vi.mocked(useStaking).mockReturnValue({
      delegations: [],
      totalStaked: 1500,
      totalRewards: 112,
      claimAllRewards: vi.fn(),
      isLoading: false,
      error: null,
      refetch: vi.fn(),
      isSuccess: false,
      isClaiming: false,
    });
    render(<StakerCard />);
    expect(screen.getByText("Claim Rewards")).toBeInTheDocument();
  });
  //isclaiming show button text claiming
  it("show claiming when isclaiming true", () => {
    vi.mocked(useStaking).mockReturnValue({
      delegations: [],
      totalStaked: 1500,
      totalRewards: 112,
      claimAllRewards: vi.fn(),
      isLoading: false,
      error: null,
      refetch: vi.fn(),
      isSuccess: false,
      isClaiming: true,
    });
    render(<StakerCard />);
    expect(screen.getByText("Claiming...")).toBeInTheDocument();
  });
  //norewards disabled button
  it("disable button when no rewards", () => {
    vi.mocked(useStaking).mockReturnValue({
      delegations: [],
      totalStaked: 1500,
      totalRewards: 0,
      claimAllRewards: vi.fn(),
      isLoading: false,
      error: null,
      refetch: vi.fn(),
      isSuccess: false,
      isClaiming: false,
    });
    render(<StakerCard />);
    expect(
      screen.getByRole("button", { name: "Claim Rewards" }),
    ).toBeDisabled();
  });

  //calls claimAllrewards on click
  it("calls claimAllRewards on click", async () => {
    const mockClaimAllRewards = vi.fn();
    vi.mocked(useStaking).mockReturnValue({
      delegations: [],
      totalStaked: 1500,
      totalRewards: 112,
      claimAllRewards: mockClaimAllRewards,
      isLoading: false,
      error: null,
      refetch: vi.fn(),
      isSuccess: false,
      isClaiming: false,
    });
    render(<StakerCard />);

    await userEvent.click(
      screen.getByRole("button", { name: "Claim Rewards" }),
    );
    expect(mockClaimAllRewards).toHaveBeenCalledTimes(1);
  });
});
