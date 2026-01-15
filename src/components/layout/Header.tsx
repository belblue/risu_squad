import { ConnectButton } from "../wallet/ConnectButton";
import logo from "/logo.svg";

export function Header() {
  return (
    <header className="flex items-center justify-between p-4">
      <img src={logo} className="h-20 w-auto" alt="Risu Squad logo" />
      <ConnectButton />
    </header>
  );
}
