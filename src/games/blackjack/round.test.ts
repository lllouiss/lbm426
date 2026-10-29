import { describe, expect, it } from "vitest";
import type { Card, Rank } from "./cards";
import { BlackjackRound } from "./round";

const cards = (...ranks: Rank[]): Card[] =>
  ranks.map((rank) => ({ rank, suit: "hearts" }));

/**
 * Kartenreihenfolge: zuerst 2 Karten fuer den Spieler, dann 2 pro Gegner,
 * danach der Stapel fuer Hit bzw. das Ziehen der Gegner.
 */
function createRound(deck: Rank[], opponentCount = 1, bet = 10) {
  return new BlackjackRound({ bet, opponentCount, deck: cards(...deck) });
}

describe("BlackjackRound: Austeilen", () => {
  it("teilt Spieler und jedem Gegner zwei Karten aus", () => {
    const round = createRound(["2", "3", "4", "5", "6", "7", "8"], 2);

    expect(round.playerHand).toEqual(cards("2", "3"));
    expect(round.opponentHands).toEqual([cards("4", "5"), cards("6", "7")]);
    expect(round.phase).toBe("playing");
    expect(round.outcome).toBeNull();
  });

  it("lehnt eine ungueltige Gegnerzahl ab", () => {
    expect(() => createRound(["2", "3", "4", "5"], 0)).toThrow(RangeError);
    expect(() => createRound(["2", "3", "4", "5"], 6)).toThrow(RangeError);
  });

  it("lehnt einen ungueltigen Einsatz ab", () => {
    expect(() => createRound(["2", "3", "4", "5"], 1, 0)).toThrow(RangeError);
  });
});

describe("BlackjackRound: Hit", () => {
  it("gibt dem Spieler die naechste Karte", () => {
    const round = createRound(["2", "3", "4", "5", "6"]);

    round.hit();

    expect(round.playerHand).toEqual(cards("2", "3", "6"));
    expect(round.phase).toBe("playing");
  });

  it("verliert sofort, wenn der Spieler ueber 21 kommt", () => {
    const round = createRound(["K", "Q", "2", "3", "5"]);

    round.hit();

    expect(round.phase).toBe("finished");
    expect(round.outcome).toBe("loss");
    expect(round.payout).toBe(0);
  });

  it("laesst die Gegner nach einem Bust des Spielers nicht mehr ziehen", () => {
    const round = createRound(["K", "Q", "2", "3", "5", "9"]);

    round.hit();

    expect(round.opponentHands).toEqual([cards("2", "3")]);
  });

  it("zaehlt ein Ass als 1, damit der Spieler nicht bust geht", () => {
    const round = createRound(["A", "K", "2", "3", "9"]);

    round.hit();

    expect(round.outcome).toBeNull();
    expect(round.phase).toBe("playing");
  });

  it("ist nach Rundenende nicht mehr moeglich", () => {
    const round = createRound(["K", "Q", "2", "3", "5", "5"]);
    round.hit();

    expect(() => round.hit()).toThrow();
  });
});

describe("BlackjackRound: Stand und Gegner", () => {
  it("laesst Gegner ziehen, solange sie unter 17 liegen", () => {
    const round = createRound(["10", "9", "2", "3", "4", "K"]);

    round.stand();

    expect(round.opponentHands[0]).toEqual(cards("2", "3", "4", "K"));
  });

  it("laesst Gegner bei 17 oder mehr stehen", () => {
    const round = createRound(["10", "9", "10", "7", "5"]);

    round.stand();

    expect(round.opponentHands[0]).toEqual(cards("10", "7"));
  });

  it("laesst jeden Gegner einzeln bis 17 ziehen", () => {
    const round = createRound(
      ["10", "9", "5", "5", "6", "6", "2", "K", "K"],
      2,
    );

    round.stand();

    expect(round.opponentHands).toEqual([
      cards("5", "5", "2", "K"),
      cards("6", "6", "K"),
    ]);
  });

  it("beendet die Runde", () => {
    const round = createRound(["10", "9", "10", "7"]);

    round.stand();

    expect(round.phase).toBe("finished");
  });

  it("ist nach Rundenende nicht mehr moeglich", () => {
    const round = createRound(["10", "9", "10", "7"]);
    round.stand();

    expect(() => round.stand()).toThrow();
  });
});

describe("BlackjackRound: Ergebnis und Auszahlung", () => {
  it("gewinnt gegen einen Gegner mit der niedrigeren Hand", () => {
    const round = createRound(["10", "9", "10", "7"], 1, 10);

    round.stand();

    expect(round.outcome).toBe("win");
    expect(round.payout).toBe(20);
  });

  it("gewinnt, wenn der Gegner ueber 21 kommt", () => {
    const round = createRound(["10", "2", "10", "6", "K"], 1, 10);

    round.stand();

    expect(round.opponentHands[0]).toEqual(cards("10", "6", "K"));
    expect(round.outcome).toBe("win");
  });

  it("verliert gegen einen Gegner mit der hoeheren Hand", () => {
    const round = createRound(["10", "8", "10", "9"], 1, 10);

    round.stand();

    expect(round.outcome).toBe("loss");
    expect(round.payout).toBe(0);
  });

  it("gibt bei Gleichstand den Einsatz zurueck", () => {
    const round = createRound(["10", "8", "10", "8"], 1, 10);

    round.stand();

    expect(round.outcome).toBe("push");
    expect(round.payout).toBe(10);
  });

  it("muss alle Gegner schlagen, um zu gewinnen", () => {
    const round = createRound(["10", "9", "10", "7", "10", "9"], 2, 10);

    round.stand();

    expect(round.outcome).toBe("push");
  });

  it("verliert, wenn nur ein Gegner den Spieler schlaegt", () => {
    const round = createRound(["10", "9", "10", "7", "10", "K"], 2, 10);

    round.stand();

    expect(round.outcome).toBe("loss");
  });

  it("zahlt mit mehr Gegnern mehr aus", () => {
    const round = createRound(
      ["10", "9", "10", "7", "10", "7", "10", "7"],
      3,
      10,
    );

    round.stand();

    expect(round.outcome).toBe("win");
    expect(round.payout).toBe(40);
  });

  it("hat vor Rundenende keinen Ausgang und keine Auszahlung", () => {
    const round = createRound(["10", "9", "10", "7"]);

    expect(round.outcome).toBeNull();
    expect(round.payout).toBe(0);
  });
});
