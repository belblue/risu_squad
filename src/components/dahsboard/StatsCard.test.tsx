import { render, screen } from "@testing-library/react";
import { StatsCard } from "./StatsCard";

describe("StatsCard", () => {
  it("renders title and value without subtitle", () => {
    render(<StatsCard title="Balance" value="100 TARA" />);

    expect(screen.getByText("Balance")).toBeInTheDocument();
    expect(screen.getByText("100 TARA")).toBeInTheDocument();
    expect(screen.queryByText("Available")).not.toBeInTheDocument();
  });
});
it("renders subtitle when provided", () => {
  render(<StatsCard title="Balance" value="100 TARA" subtitle="Available" />);
  expect(screen.getByText("Available")).toBeInTheDocument();
});
