import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { CasinoApp } from "./casino-app";

describe("CasinoApp (US-001)", () => {
  it("startet das Casino mit dem zentralen Spiele-Register", () => {
    render(<CasinoApp />);

    expect(screen.getByRole("heading", { name: "Casino" })).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Spielauswahl" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Guthaben: 0 Jetons")).toBeInTheDocument();
  });
});
