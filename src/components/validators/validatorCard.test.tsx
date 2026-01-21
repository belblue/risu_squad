import { render, screen } from "@testing-library/react";
import { ValidatorCard } from "./validatorCard";
import type { Validator } from "../../hooks/useValidators";

vi.mock("../wallet/ConnectButton", () => ({
  ConnectButton: () => <div>ConnectButton</div>,
}));

//Mock validator data
const mockValidator: Validator = {
  address: "0x1234567890abcdef1234567890abcdef12345678",
  totalStake: "1000000",
  comission: 10,
  description: "miaumiaumia",
  yield: 14.4,
  rank: 1,
  isActive: true,
};

describe("ValidatorCard", () => {
  //Basic rendering works
  it("description renders", () => {
    render(<ValidatorCard mode="easy" validator={mockValidator} />);
    expect(screen.getByText("miaumiaumia")).toBeInTheDocument();
  });
  //Data formatting works
  it("renders commission", () => {
    render(<ValidatorCard mode="easy" validator={mockValidator} />);
    expect(screen.getByText(/comission:.*10.*% fee/)).toBeInTheDocument();
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
  //Conditional rendering
  it("shows rank in expert mode", () => {
    render(<ValidatorCard mode="expert" validator={mockValidator} />);
    expect(screen.getByText("Rank: #1")).toBeInTheDocument();
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
});
