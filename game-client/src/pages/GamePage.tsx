import { useState } from "react";
import GameBoard from "../components/GameBoard";
import type { Card } from "../types/types";

const createCard = (suit: Card["suit"], value: number, deck: Card["deck"]): Card => ({
  id: `${suit}-${value}-${deck}-${Math.random().toString(36).slice(2, 8)}`,
  suit,
  value,
  deck,
});

const dummyHand = [
  createCard("hearts", 12, "blue"),
  createCard("clubs", 13, "blue"),
  createCard("diamonds", 7, "blue"),
  createCard("spades", 1, "blue"),
];

const dummyDraw = [
  createCard("hearts", 5, "blue"),
  createCard("clubs", 9, "blue"),
  createCard("diamonds", 3, "blue"),
];

const empty4 = [[], [], [], []] as Card[][];
const empty8 = Array.from({ length: 8 }, () => [] as Card[]);

export default function GamePage() {
  const [myHand, setMyHand] = useState<Card[]>(dummyHand);
  const [myDraw, setMyDraw] = useState<Card[]>(dummyDraw);
  const [myPersonal, setMyPersonal] = useState<Card[][]>(empty4);
  const [myRight, setMyRight] = useState<Card[]>([]);

  const [oppHand, setOppHand] = useState<Card[]>([]);
  const [oppDraw, setOppDraw] = useState<Card[]>([]);
  const [oppPersonal, setOppPersonal] = useState<Card[][]>(empty4);
  const [oppRight, setOppRight] = useState<Card[]>([]);

  const [commonStacks, setCommonStacks] = useState<Card[][]>(empty8);

  // Helpers – one for flat arrays, one for nested arrays
  const removeFlat = (setter: React.Dispatch<React.SetStateAction<Card[]>>, card: Card) =>
    setter((prev) => prev.filter((c) => c.id !== card.id));

  const addFlat = (setter: React.Dispatch<React.SetStateAction<Card[]>>, card: Card) =>
    setter((prev) => [...prev, card]);

  const removeNested = (
    setter: React.Dispatch<React.SetStateAction<Card[][]>>,
    index: number,
    card: Card
  ) =>
    setter((prev) => {
      const next = [...prev];
      next[index] = next[index].filter((c) => c.id !== card.id);
      return next;
    });

  const addNested = (
    setter: React.Dispatch<React.SetStateAction<Card[][]>>,
    index: number,
    card: Card
  ) =>
    setter((prev) => {
      const next = [...prev];
      next[index] = [...next[index], card];
      return next;
    });

  const moveCard = (card: Card, sourceId: string, targetId: string) => {
    if (sourceId === targetId) return;

    // --- Remove from source ---
    if (sourceId === "hand-current") removeFlat(setMyHand, card);
    else if (sourceId === "hand-opponent") removeFlat(setOppHand, card);
    else if (sourceId === "draw-current") removeFlat(setMyDraw, card);
    else if (sourceId === "draw-opponent") removeFlat(setOppDraw, card);
    else if (sourceId === "right-current") removeFlat(setMyRight, card);
    else if (sourceId === "right-opponent") removeFlat(setOppRight, card);
    else if (sourceId.startsWith("personal-")) {
      const [, player, indexStr] = sourceId.split("-");
      const idx = parseInt(indexStr);
      if (player === "current") removeNested(setMyPersonal, idx, card);
      else if (player === "opponent") removeNested(setOppPersonal, idx, card);
    } else if (sourceId.startsWith("center-")) {
      const idx = parseInt(sourceId.split("-")[1]);
      removeNested(setCommonStacks, idx, card);
    }

    // --- Add to target ---
    if (targetId === "hand-current") addFlat(setMyHand, card);
    else if (targetId === "hand-opponent") addFlat(setOppHand, card);
    else if (targetId === "draw-current") addFlat(setMyDraw, card);
    else if (targetId === "draw-opponent") addFlat(setOppDraw, card);
    else if (targetId === "right-current") addFlat(setMyRight, card);
    else if (targetId === "right-opponent") addFlat(setOppRight, card);
    else if (targetId.startsWith("personal-")) {
      const [, player, indexStr] = targetId.split("-");
      const idx = parseInt(indexStr);
      if (player === "current") addNested(setMyPersonal, idx, card);
      else if (player === "opponent") addNested(setOppPersonal, idx, card);
    } else if (targetId.startsWith("center-")) {
      const idx = parseInt(targetId.split("-")[1]);
      addNested(setCommonStacks, idx, card);
    }
  };

  return (
    <GameBoard
      currentPlayer={{
        hand: myHand,
        drawPile: myDraw,
        personalStacks: myPersonal,
        rightStack: myRight,
      }}
      opponent={{
        hand: oppHand,
        drawPile: oppDraw,
        personalStacks: oppPersonal,
        rightStack: oppRight,
      }}
      commonStacks={commonStacks}
      onCardDrop={moveCard}
    />
  );
}