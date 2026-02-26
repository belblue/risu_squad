import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import { ValidatorCard } from "./validatorCard";
import type { Validator } from "../../hooks/useValidators";

//init i18n so t() returns real translations
import "../../i18n";

//mock react-hot-toast
vi.mock("react-hot-toast", () => ({
  default: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

import toast from "react-hot-toast";

//Mock validator data
const mockValidator: Validator = {
  address: "0x1234567890abcdef1234567890abcdef12345678",
  totalStake: "1000000",
  commission: 10,
  description: "miaumiaumia",
  yield: 14.4,
  isActive: true,
};

describe("ValidatorCard", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  //Basic rendering works
  it("description renders", () => {
    render(<ValidatorCard mode="easy" validator={mockValidator} />);
    expect(screen.getByText("miaumiaumia")).toBeInTheDocument();
  });
  //Data formatting works
  it("renders commission", () => {
    render(<ValidatorCard mode="easy" validator={mockValidator} />);
    expect(screen.getByText(/commission:.*10.*% fee/)).toBeInTheDocument();
  });
  //Number formatting (1,000,000)
  it("renders formatted stake", () => {
    render(<ValidatorCard mode="easy" validator={mockValidator} />);
    expect(screen.getByText(/Staked:.*1,000,000/)).toBeInTheDocument();
  });
  //Mode toggle works correctly
  it("shows full address in expert mode", () => {
    render(<ValidatorCard mode="expert" validator={mockValidator} />);
    expect(
      screen.getByText("0x1234567890abcdef1234567890abcdef12345678"),
    ).toBeInTheDocument();
  });
  it("hides full address in easy mode", () => {
    render(<ValidatorCard mode="easy" validator={mockValidator} />);
    expect(
      screen.queryByText("0x1234567890abcdef1234567890abcdef12345678"),
    ).not.toBeInTheDocument();
  });

  //isActive boolean handling
  it("active status", () => {
    render(<ValidatorCard mode="easy" validator={mockValidator} />);
    expect(screen.getByText(/Status:active/)).toBeInTheDocument();
  });
  it("inactive status", () => {
    const inactiveValidator = { ...mockValidator, isActive: false };
    render(<ValidatorCard mode="easy" validator={inactiveValidator} />);
    expect(screen.getByText("Status: inactive")).toBeInTheDocument();
  });
  // Yield display
  it("renders yield percentage", () => {
    render(<ValidatorCard mode="easy" validator={mockValidator} />);
    expect(screen.getByText(/14\.4.*% APR/)).toBeInTheDocument();
  });

  //Stake button renders when onDelegate is provided
  it("renders stake button when onDelegate is provided", () => {
    render(<ValidatorCard mode="expert" validator={mockValidator} onDelegate={vi.fn()} />);
    expect(screen.getByText("Stake")).toBeInTheDocument();
  });

  //Stake button does not render when no onDelegate
  it("does not render stake button without onDelegate", () => {
    render(<ValidatorCard mode="expert" validator={mockValidator} />);
    expect(screen.queryByText("Stake")).not.toBeInTheDocument();
  });

  //Stake button does not render for inactive validators
  it("does not render stake button for inactive validators", () => {
    const inactiveValidator = { ...mockValidator, isActive: false };
    render(<ValidatorCard mode="expert" validator={inactiveValidator} onDelegate={vi.fn()} />);
    expect(screen.queryByText("Stake")).not.toBeInTheDocument();
  });

  //Clicking stake shows inline input
  it("shows inline input when stake button is clicked", async () => {
    render(<ValidatorCard mode="expert" validator={mockValidator} onDelegate={vi.fn()} />);
    await userEvent.click(screen.getByText("Stake"));
    expect(screen.getByPlaceholderText("Amount in TARA")).toBeInTheDocument();
    expect(screen.getByText("Confirm")).toBeInTheDocument();
    expect(screen.getByText("Cancel")).toBeInTheDocument();
  });

  //Cancel hides the input
  it("hides input when cancel is clicked", async () => {
    render(<ValidatorCard mode="expert" validator={mockValidator} onDelegate={vi.fn()} />);
    await userEvent.click(screen.getByText("Stake"));
    await userEvent.click(screen.getByText("Cancel"));
    expect(screen.queryByPlaceholderText("Amount in TARA")).not.toBeInTheDocument();
    expect(screen.getByText("Stake")).toBeInTheDocument();
  });

  //Confirm calls onDelegate with correct args
  it("calls onDelegate with validator address and amount on confirm", async () => {
    const mockDelegate = vi.fn().mockResolvedValue(undefined);
    render(<ValidatorCard mode="expert" validator={mockValidator} onDelegate={mockDelegate} />);
    await userEvent.click(screen.getByText("Stake"));
    await userEvent.type(screen.getByPlaceholderText("Amount in TARA"), "1000");
    await userEvent.click(screen.getByText("Confirm"));
    expect(mockDelegate).toHaveBeenCalledWith(mockValidator.address, "1000");
  });

  //Shows success toast on successful delegation
  it("shows success toast on successful delegation", async () => {
    const mockDelegate = vi.fn().mockResolvedValue(undefined);
    render(<ValidatorCard mode="expert" validator={mockValidator} onDelegate={mockDelegate} />);
    await userEvent.click(screen.getByText("Stake"));
    await userEvent.type(screen.getByPlaceholderText("Amount in TARA"), "1000");
    await userEvent.click(screen.getByText("Confirm"));
    expect(toast.success).toHaveBeenCalledWith("Staked successfully!");
  });

  //Shows error toast on failed delegation
  it("shows error toast on failed delegation", async () => {
    const mockDelegate = vi.fn().mockRejectedValue(new Error("tx failed"));
    render(<ValidatorCard mode="expert" validator={mockValidator} onDelegate={mockDelegate} />);
    await userEvent.click(screen.getByText("Stake"));
    await userEvent.type(screen.getByPlaceholderText("Amount in TARA"), "1000");
    await userEvent.click(screen.getByText("Confirm"));
    expect(toast.error).toHaveBeenCalledWith("Failed to stake");
  });
});
