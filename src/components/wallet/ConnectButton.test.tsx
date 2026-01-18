import { render, screen } from "@testing-library/react";
import { vi } from "vitest";
import { ConnectButton } from "./ConnectButton";

//Mock wagmi hooks
vi.mock("wagmi", () => ({
  useConnection: vi.fn(),
  useConnect: vi.fn(),
  useDisconnect: vi.fn(),
  useConnectors: vi.fn(),
}));

import { useConnection, useConnect, useDisconnect, useConnectors } from "wagmi";

describe("ConnectButton", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  it("renders connect button when not connected", () => {
    //user is not connected
    vi.mocked(useConnection).mockReturnValue({
      address: undefined,
      isConnected: false,
    } as any);
    vi.mocked(useConnect).mockReturnValue({
      mutate: vi.fn(),
      isPending: false,
    } as any);
    vi.mocked(useDisconnect).mockReturnValue({
      mutate: vi.fn(),
    } as any);
    vi.mocked(useConnectors).mockReturnValue([]);
    render(<ConnectButton />);

    expect(screen.getByText("Connect wallet")).toBeInTheDocument();
  });
  it("shows address and disconnect when connected", () => {
    vi.mocked(useConnection).mockReturnValue({
      address: "0x1234567890abcdef1234567890abcdef12345678",
      isConnected: true,
    } as any);
    vi.mocked(useConnect).mockReturnValue({
      mutate: vi.fn(),
      isPending: false,
    } as any);
    vi.mocked(useDisconnect).mockReturnValue({
      mutate: vi.fn(),
    } as any);
    vi.mocked(useConnectors).mockReturnValue([]);
    render(<ConnectButton />);
    // Should show truncated address
    expect(screen.getByText(/0x1234.*5678/)).toBeInTheDocument();
    // Should show disconnect button
    expect(screen.getByText("Disconnect")).toBeInTheDocument();
  });
  it("shows Connecting... when pending", () => {
    vi.mocked(useConnection).mockReturnValue({
      address: undefined,
      isConnected: false,
    } as any),
      vi.mocked(useConnect).mockReturnValue({
        mutate: vi.fn(),
        isPending: true,
      } as any);
    vi.mocked(useConnectors).mockReturnValue([]);

    render(<ConnectButton />);
    expect(screen.getByText("Connecting...")).toBeInTheDocument();
  });
});
