import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import { StakerCard } from "./stakerCard";

//init i18n so t() returns real translations
import "../../i18n";

//mock useConnection
vi.mock("wagmi", () => ({
  useConnection: vi.fn(), //false address
}));

//mock useStaking hook
vi.mock("../../hooks/useStaking", () => ({
  useStaking: vi.fn(),
}));

//mock react-hot-toast
vi.mock("react-hot-toast", () => ({
  default: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

//mock imports
import { useStaking } from "../../hooks/useStaking";
import { useConnection } from "wagmi";
import toast from "react-hot-toast";

const defaultMock = {
  delegations: [],
  totalStaked: 0,
  totalRewards: 0,
  claimAllRewards: vi.fn(),
  claimSingleRewards: vi.fn(),
  isLoading: false,
  error: null,
  refetch: vi.fn(),
  isSuccess: false,
  isClaiming: false,
};

describe("StakerCard", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    //default mock for useConnection
    vi.mocked(useConnection).mockReturnValue({
      address: "0x1234567890abcdef1234567890abcdef12345678",
    } as any);
  });
  //isLoading true displays loading
  it("isLoading displays loading", () => {
    vi.mocked(useStaking).mockReturnValue({
      ...defaultMock,
      isLoading: true,
    });
    render(<StakerCard mode="expert" />);
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });
  //totalstaked displays
  it("renders total staked amount", () => {
    vi.mocked(useStaking).mockReturnValue({
      ...defaultMock,
      totalStaked: 1500,
      totalRewards: 100,
    });
    render(<StakerCard mode="expert" />);
    expect(
      screen.getByText(/Total Staked: 1,500 TARA/),
    ).toBeInTheDocument();
  });
  //totalreward displays
  it("renders totalRewards", () => {
    vi.mocked(useStaking).mockReturnValue({
      ...defaultMock,
      totalStaked: 1500,
      totalRewards: 112,
    });
    render(<StakerCard mode="expert" />);
    expect(screen.getByText("Rewards: 112.0000 TARA")).toBeInTheDocument();
  });
  //button claim exists
  it("render claim button", () => {
    vi.mocked(useStaking).mockReturnValue({
      ...defaultMock,
      totalStaked: 1500,
      totalRewards: 112,
    });
    render(<StakerCard mode="expert" />);
    expect(screen.getByText("Claim Rewards")).toBeInTheDocument();
  });
  //isclaiming show button text claiming
  it("show claiming when isclaiming true", () => {
    vi.mocked(useStaking).mockReturnValue({
      ...defaultMock,
      totalStaked: 1500,
      totalRewards: 112,
      isClaiming: true,
    });
    render(<StakerCard mode="expert" />);
    expect(screen.getByText("Claiming...")).toBeInTheDocument();
  });
  //norewards disabled button
  it("disable button when no rewards", () => {
    vi.mocked(useStaking).mockReturnValue({
      ...defaultMock,
      totalStaked: 1500,
      totalRewards: 0,
    });
    render(<StakerCard mode="expert" />);
    expect(
      screen.getByRole("button", { name: "Nothing to claim" }),
    ).toBeDisabled();
  });

  //calls claimAllrewards on click
  it("calls claimAllRewards on click", async () => {
    const mockClaimAllRewards = vi.fn();
    vi.mocked(useStaking).mockReturnValue({
      ...defaultMock,
      totalStaked: 1500,
      totalRewards: 112,
      claimAllRewards: mockClaimAllRewards,
    });
    render(<StakerCard mode="expert" />);

    await userEvent.click(
      screen.getByRole("button", { name: "Claim Rewards" }),
    );
    expect(mockClaimAllRewards).toHaveBeenCalledTimes(1);
  });

  //expert mode shows delegations with single claim button
  it("renders single claim button for each delegation in expert mode", () => {
    vi.mocked(useStaking).mockReturnValue({
      ...defaultMock,
      delegations: [
        { validatorAddress: "0xabc123def456abc123def456abc123def456abc1", stake: "1000", rewards: "50" },
      ],
      totalStaked: 1000,
      totalRewards: 50,
    });
    render(<StakerCard mode="expert" />);
    expect(screen.getByText("Claim")).toBeInTheDocument();
  });

  //single claim button disabled when no rewards
  it("disables single claim button when validator has no rewards", () => {
    vi.mocked(useStaking).mockReturnValue({
      ...defaultMock,
      delegations: [
        { validatorAddress: "0xabc123def456abc123def456abc123def456abc1", stake: "1000", rewards: "0" },
      ],
      totalStaked: 1000,
      totalRewards: 0,
    });
    render(<StakerCard mode="expert" />);
    const buttons = screen.getAllByRole("button", { name: "Nothing to claim" });
    expect(buttons).toHaveLength(2); //main button + single validator button
    expect(buttons[1]).toBeDisabled(); //single validator button
  });

  //calls claimSingleRewards on single claim button click
  it("calls claimSingleRewards on single claim button click", async () => {
    const mockClaimSingle = vi.fn();
    vi.mocked(useStaking).mockReturnValue({
      ...defaultMock,
      delegations: [
        { validatorAddress: "0xabc123def456abc123def456abc123def456abc1", stake: "1000", rewards: "50" },
      ],
      totalStaked: 1000,
      totalRewards: 50,
      claimSingleRewards: mockClaimSingle,
    });
    render(<StakerCard mode="expert" />);

    await userEvent.click(screen.getByText("Claim"));
    expect(mockClaimSingle).toHaveBeenCalledWith("0xabc123def456abc123def456abc123def456abc1");
  });

  //easy mode uses easy translations
  it("renders easy mode translations", () => {
    vi.mocked(useStaking).mockReturnValue({
      ...defaultMock,
      totalStaked: 1500,
      totalRewards: 100,
    });
    render(<StakerCard mode="easy" />);
    expect(screen.getByText(/Total Deposited: 1,500 TARA/)).toBeInTheDocument();
    expect(screen.getByText("Collect Earnings")).toBeInTheDocument();
  });

  //shows success toast on claim all
  it("shows success toast when claimAllRewards succeeds", async () => {
    const mockClaimAll = vi.fn().mockResolvedValue(undefined);
    vi.mocked(useStaking).mockReturnValue({
      ...defaultMock,
      totalStaked: 1500,
      totalRewards: 112,
      claimAllRewards: mockClaimAll,
    });
    render(<StakerCard mode="expert" />);

    await userEvent.click(screen.getByRole("button", { name: "Claim Rewards" }));
    expect(toast.success).toHaveBeenCalledWith("Rewards claimed successfully!");
  });

  //shows error toast on claim all failure
  it("shows error toast when claimAllRewards fails", async () => {
    const mockClaimAll = vi.fn().mockRejectedValue(new Error("tx failed"));
    vi.mocked(useStaking).mockReturnValue({
      ...defaultMock,
      totalStaked: 1500,
      totalRewards: 112,
      claimAllRewards: mockClaimAll,
    });
    render(<StakerCard mode="expert" />);

    await userEvent.click(screen.getByRole("button", { name: "Claim Rewards" }));
    expect(toast.error).toHaveBeenCalledWith("Failed to claim rewards");
  });

  //shows success toast on single claim
  it("shows success toast when claimSingleRewards succeeds", async () => {
    const mockClaimSingle = vi.fn().mockResolvedValue(undefined);
    vi.mocked(useStaking).mockReturnValue({
      ...defaultMock,
      delegations: [
        { validatorAddress: "0xabc123def456abc123def456abc123def456abc1", stake: "1000", rewards: "50" },
      ],
      totalStaked: 1000,
      totalRewards: 50,
      claimSingleRewards: mockClaimSingle,
    });
    render(<StakerCard mode="expert" />);

    await userEvent.click(screen.getByText("Claim"));
    expect(toast.success).toHaveBeenCalledWith("Rewards claimed successfully!");
  });

  //shows error toast on single claim failure
  it("shows error toast when claimSingleRewards fails", async () => {
    const mockClaimSingle = vi.fn().mockRejectedValue(new Error("tx failed"));
    vi.mocked(useStaking).mockReturnValue({
      ...defaultMock,
      delegations: [
        { validatorAddress: "0xabc123def456abc123def456abc123def456abc1", stake: "1000", rewards: "50" },
      ],
      totalStaked: 1000,
      totalRewards: 50,
      claimSingleRewards: mockClaimSingle,
    });
    render(<StakerCard mode="expert" />);

    await userEvent.click(screen.getByText("Claim"));
    expect(toast.error).toHaveBeenCalledWith("Failed to claim rewards");
  });

  //easy mode does not show delegations
  it("does not show delegations in easy mode", () => {
    vi.mocked(useStaking).mockReturnValue({
      ...defaultMock,
      delegations: [
        { validatorAddress: "0xabc123def456abc123def456abc123def456abc1", stake: "1000", rewards: "50" },
      ],
      totalStaked: 1000,
      totalRewards: 50,
    });
    render(<StakerCard mode="easy" />);
    expect(screen.queryByText("Number of delegations")).not.toBeInTheDocument();
  });
});
