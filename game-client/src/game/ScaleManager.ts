// src/game/ScaleManager.ts
import type { Card } from "../types/types";

export class ScaleManager {
  /**
   * Walk the stack and determine the next expected value and suit.
   * Returns null if the stack is internally invalid.
   */
  private static getNextExpected(
    stack: Card[]
  ): { value: number; suit: string } | null {
    if (stack.length === 0) return null;

    const suit = stack[0].suit;
    let expectedValue = 1;

    for (const card of stack) {
      if (card.value === 13) {
        // King → wildcard, advances the expected value by one
        expectedValue++;
        continue;
      }
      if (card.suit !== suit || card.value !== expectedValue) {
        return null; // invalid stack
      }
      expectedValue++;
    }

    return { value: expectedValue, suit };
  }

  /** Check if a card can be placed on an existing non‑empty scale. */
  static canPlaceOnScale(
    stacks: Card[][],
    scaleId: number,
    card: Card
  ): boolean {
    const stack = stacks[scaleId];
    if (!stack || stack.length === 0) return false;

    const next = this.getNextExpected(stack);
    if (!next) return false;

    // No two consecutive Kings
    const top = stack[stack.length - 1];
    if (top.value === 13 && card.value === 13) return false;

    if (card.value === 13) {
      return true;
    }

    // Normal card must match expected value and suit
    return card.value === next.value && card.suit === next.suit;
  }

  /**
   * Returns the index of the first empty stack if an Ace is played,
   * otherwise null.
   */
  static openScale(stacks: Card[][], card: Card): number | null {
    if (card.value !== 1) return null;
    const freeIdx = stacks.findIndex((stack) => stack.length === 0);
    return freeIdx === -1 ? null : freeIdx;
  }

  /** A scale is complete when all values 1‑12 have been placed (length == 12). */
  static isScaleComplete(stack: Card[]): boolean {
    return stack.length === 12;
  }
}