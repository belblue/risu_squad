import { ConnectButton } from "../wallet/ConnectButton";
import { ModeToggle } from "../ui/ModeToggle";
import logo from "/logo.svg";

interface HeaderProps {
  mode: "easy" | "expert";
  onModeChange: (mode: "easy" | "expert") => void;
}

export function Header({ mode, onModeChange }: HeaderProps) {
  return (
    <header className="flex items-center justify-between p-4">
      <img src={logo} className="h-20 w-auto" alt="Risu Squad logo" />
      <ModeToggle mode={mode} onModeChange={onModeChange} />
      <ConnectButton />
    </header>
  );
}
