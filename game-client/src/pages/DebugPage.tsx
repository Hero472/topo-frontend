import { useState } from "react";
import CardView from "../components/game/CardView";
import CardPile from "../components/game/CardPile";
import type { Card } from "../types/types";
import type { CardDropEvent } from "../hooks/useDropTarget";
import "./DebugPage.css";
import { Button } from "../components/ui/Button";

const initialCards: Card[] = [
  { suit: "hearts", value: 1, deck: "red" },
  { suit: "diamonds", value: 7, deck: "blue" },
  { suit: "clubs", value: 10, deck: "red" },
  { suit: "spades", value: 13, deck: "blue" },
  { suit: "hearts", value: 1, deck: "red" },
  { suit: "diamonds", value: 7, deck: "blue" },
  { suit: "clubs", value: 10, deck: "red" },
  { suit: "spades", value: 13, deck: "blue" },
];

export default function DebugPage() {
  return (
    <main className="debug-page">
      <Button variant="primary">button</Button>
      <CardView card={initialCards[0]}/>
      <CardPile cards={initialCards} stackId={""} layout={"stack"}/>
    </main>
  );
}