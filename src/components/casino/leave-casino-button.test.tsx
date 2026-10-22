import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { LeaveCasinoButton } from "./leave-casino-button";

describe("LeaveCasinoButton (US-006)", () => {
  it("zeigt einen Button «Aufhören»", () => {
    render(<LeaveCasinoButton disabled={false} onLeave={() => {}} />);

    expect(screen.getByRole("button", { name: "Aufhören" })).toBeEnabled();
  });

  it("ruft beim Klick onLeave auf", async () => {
    const onLeave = vi.fn();
    render(<LeaveCasinoButton disabled={false} onLeave={onLeave} />);

    await userEvent.click(screen.getByRole("button", { name: "Aufhören" }));

    expect(onLeave).toHaveBeenCalledTimes(1);
  });

  it("ist waehrend einer laufenden Runde deaktiviert und reagiert nicht", async () => {
    const onLeave = vi.fn();
    render(<LeaveCasinoButton disabled onLeave={onLeave} />);

    const button = screen.getByRole("button", { name: "Aufhören" });
    await userEvent.click(button);

    expect(button).toBeDisabled();
    expect(onLeave).not.toHaveBeenCalled();
  });
});
