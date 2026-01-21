import { render, screen } from "@testing-library/react";
import { ValidatorList } from "./validatorList";
import { vi } from "vitest";

// Mock the useValidators hook
vi.mock("../../hooks/useValidators", () => ({
  useValidators: vi.fn(),
}));

// Import the mocked hook so we can control its return value
import { useValidators } from "../../hooks/useValidators";

//Mock validator data
const mockValidators = [
  {
    address: "0x1234567890abcdef1234567890abcdef12345678",
    totalStake: "1000000",
    comission: 10,
    description: "validator 1",
    yield: 14.4,
    rank: 1,
    isActive: true,
  },
  {
    address: "0x1234567890abcdef1234567890abcdef12345685",
    totalStake: "1000000",
    comission: 10,
    description: "validator 2",
    yield: 14.4,
    rank: 1,
    isActive: true,
  },
];

describe("ValidatorList", () => {
  //shows loading message
  it("shows loading message", () => {
    vi.mocked(useValidators).mockReturnValue({
      validators: [],
      isLoading: true,
      error: null,
    });
    render(<ValidatorList mode="easy" />);
    expect(screen.getByText("Loading validators...")).toBeInTheDocument();
  });
  //shows error message
  it("shows error message", () => {
    vi.mocked(useValidators).mockReturnValue({
      validators: [],
      isLoading: false,
      error: new Error("Failed to fetch"),
    } as any);
    render(<ValidatorList mode="easy" />);
    expect(
      screen.getByText("Error loading validators:Failed to fetch"),
    ).toBeInTheDocument();
  });
  //shows empty message when no validators
  it("show no validators", () => {
    vi.mocked(useValidators).mockReturnValue({
      validators: [],
      isLoading: false,
      error: null,
    });
    render(<ValidatorList mode="easy" />);
    expect(screen.getByText("No validators found.")).toBeInTheDocument();
  });
  //renders validator cards
  it("show no validators", () => {
    vi.mocked(useValidators).mockReturnValue({
      validators: mockValidators,
      isLoading: false,
      error: null,
    });
    render(<ValidatorList mode="easy" />);
    expect(screen.getByText("Validators")).toBeInTheDocument();
    expect(screen.getByText("validator 1")).toBeInTheDocument();
    expect(screen.getByText("validator 2")).toBeInTheDocument();
  });

  //passes mode prop	In expert mode, full addresses are visible
  it("passes mode prop - shiwing full address in expert mode", () => {
    vi.mocked(useValidators).mockReturnValue({
      validators: mockValidators,
      isLoading: false,
      error: null,
    });
    render(<ValidatorList mode="expert" />);
    expect(
      screen.getByText("0x1234567890abcdef1234567890abcdef12345678"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("0x1234567890abcdef1234567890abcdef12345685"),
    ).toBeInTheDocument();
  });
});
