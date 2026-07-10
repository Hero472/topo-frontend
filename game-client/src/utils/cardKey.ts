import type { Card } from "../types/types";

export function cardKey(card: Card): string {
  return `${card.deck}-${card.suit}-${card.value}`;
}