import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ModeToggle } from "./ModeToggle";

describe("modeToggle", () => {
  it("renders easy and expert buttons", () => {
    const mockOnChange = vi.fn();
    render(<ModeToggle mode="easy" onModeChange={mockOnChange} />);
    expect(screen.getByText("Easy")).toBeInTheDocument();
    expect(screen.getByText("Expert")).toBeInTheDocument();
  });
  it("click on easy calls onModeChange", async () => {
    const mockOnChange = vi.fn();
    render(<ModeToggle mode="expert" onModeChange={mockOnChange} />);
    await userEvent.click(screen.getByText("Easy"));
    expect(mockOnChange).toHaveBeenCalledWith("easy");
  });
  it("click on 'expert' calls onModeChange", async () => {
    const mockOnChange = vi.fn();
    render(<ModeToggle mode="easy" onModeChange={mockOnChange} />);
    await userEvent.click(screen.getByText("Expert"));
    expect(mockOnChange).toHaveBeenCalledWith("expert");
  });
});
