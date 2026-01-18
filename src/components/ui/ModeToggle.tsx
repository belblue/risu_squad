interface ModeToggleProps {
  mode: "easy" | "expert";
  onModeChange: (mode: "easy" | "expert") => void;
}

export function ModeToggle({ mode, onModeChange }: ModeToggleProps) {
  return (
    <div className="flex bg-secondary rounded-lg p-1">
      <button
        onClick={() => onModeChange("easy")}
        className={`px-3 py-1 rounded-md text-md ${
          mode == "easy" ? "bg-primary text-dark" : "text-surface/60"
        }`}
      >
        {" "}
        Easy
      </button>

      <button
        onClick={() => onModeChange("expert")}
        className={`px-3 py-1 rounded-md text-md ${mode == "expert" ? "bg-primary text-dark" : "text-surface/60"}`}
      >
        Expert
      </button>
    </div>
  );
}
