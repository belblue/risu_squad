import { render, screen } from "@testing-library/react";
import { Header } from "./Header";
import { vi } from "vitest";

vi.mock("../wallet/ConnectButton", () => ({
  ConnectButton: () => <div>ConnectButton</div>,
}));

describe("Header", () => {
  it("logo renders", () => {
    const mockOnChange = vi.fn();
    render(<Header mode="easy" onModeChange={mockOnChange} />);
    expect(screen.getByAltText("Risu Squad logo")).toBeInTheDocument();
  });
});
