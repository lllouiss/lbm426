import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { DepositForm } from "./deposit-form";
import { Wallet } from "@/lib/wallet/wallet";

function renderForm(wallet = new Wallet()) {
  render(<DepositForm wallet={wallet} />);
  return {
    wallet,
    amountField: screen.getByRole("textbox", { name: "Betrag" }),
    convertButton: screen.getByRole("button", { name: "In Jetons umwandeln" }),
  };
}

describe("DepositForm (US-001)", () => {
  describe("gueltiger Betrag", () => {
    it("wandelt den Betrag in Jetons um", async () => {
      const { wallet, amountField, convertButton } = renderForm();

      await userEvent.type(amountField, "150");
      await userEvent.click(convertButton);

      expect(wallet.balance).toBe(150);
    });

    it("wandelt auch mit der Enter-Taste um", async () => {
      const { wallet, amountField } = renderForm();

      await userEvent.type(amountField, "60{Enter}");

      expect(wallet.balance).toBe(60);
    });

    it("leert danach das Eingabefeld", async () => {
      const { amountField, convertButton } = renderForm();

      await userEvent.type(amountField, "150");
      await userEvent.click(convertButton);

      expect(amountField).toHaveValue("");
    });
  });

  describe("ungueltiger Betrag", () => {
    it.each(["0", "-20", "abc", "12.5"])(
      "lehnt «%s» mit einer Fehlermeldung ab",
      async (input) => {
        const { wallet, amountField, convertButton } = renderForm();

        await userEvent.type(amountField, input);
        await userEvent.click(convertButton);

        expect(screen.getByRole("alert")).toHaveTextContent(
          /positive ganze Zahl/,
        );
        expect(wallet.balance).toBe(0);
      },
    );

    it("lehnt ein leeres Feld ab", async () => {
      const { wallet, convertButton } = renderForm();

      await userEvent.click(convertButton);

      expect(screen.getByRole("alert")).toBeInTheDocument();
      expect(wallet.balance).toBe(0);
    });

    it("entfernt die Fehlermeldung nach einer gueltigen Eingabe", async () => {
      const { amountField, convertButton } = renderForm();
      await userEvent.type(amountField, "abc");
      await userEvent.click(convertButton);

      await userEvent.clear(amountField);
      await userEvent.type(amountField, "40");
      await userEvent.click(convertButton);

      expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    });
  });
});
