import { useState, type SubmitEvent } from "react";
import { convertToChips } from "@/lib/chips/convert-to-chips";
import type { Wallet } from "@/lib/wallet/wallet";

interface DepositFormProps {
  wallet: Wallet;
}

export function DepositForm({ wallet }: DepositFormProps) {
  const [amount, setAmount] = useState("");
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      convertToChips(wallet, amount);
      setAmount("");
      setError(null);
    } catch (rejection) {
      if (!(rejection instanceof RangeError)) throw rejection;
      setError(rejection.message);
    }
  }

  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-2xl font-semibold">Jetons kaufen</h2>
      <form onSubmit={handleSubmit} className="flex flex-wrap items-end gap-3">
        <label className="flex flex-col gap-1">
          Betrag
          <input
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
            inputMode="numeric"
            className="rounded-lg border px-3 py-2"
          />
        </label>
        <button
          type="submit"
          className="rounded-full border px-5 py-2 font-medium"
        >
          In Jetons umwandeln
        </button>
      </form>
      {error && (
        <p role="alert" className="text-red-600">
          {error}
        </p>
      )}
    </section>
  );
}
