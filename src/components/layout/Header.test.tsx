import { render, screen } from "@testing-library/react";
import { Header } from "./Header";

describe("Header", () => {
  it("logo renders", () => {
    vi.mock("../wallet/ConnectButton", () => ({
      ConnectButton: () => <div>ConnectButton</div>,
    }));
    render(<Header />);
    expect(screen.getByAltText("Risu Squad logo")).toBeInTheDocument();
  });
});
