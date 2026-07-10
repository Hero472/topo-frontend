import type { Card } from "../types/types";

export class ScaleManager {
  /**
   * Walk the stack and determine the next expected value and suit.
   * Returns null if the stack is internally invalid.
   */
  private static getNextExpected(stack: Card[]): number | null {
    if (stack.length === 0) return null;

    let expectedValue = 1;

    for (const card of stack) {
      if (card.value === 13) {
        // King acts as a wildcard – advances the expected number
        expectedValue++;
        continue;
      }
      // Any suit is fine; we just check the value
      if (card.value !== expectedValue) {
        return null; // invalid stack order
      }
      expectedValue++;
    }

    return expectedValue;
  }

  /** Check if a card can be placed on an existing non‑empty scale. */
  static canPlaceOnScale(
    stacks: Card[][],
    scaleId: number,
    card: Card
  ): boolean {
    const stack = stacks[scaleId];
    if (!stack || stack.length === 0) return false;

    const nextValue = this.getNextExpected(stack);
    if (nextValue === null) return false;

    const top = stack[stack.length - 1];

    // No two consecutive Kings
    if (top.value === 13 && card.value === 13) return false;

    // King can be played at any time (except consecutive, already checked)
    if (card.value === 13) return true;

    // Normal card – must match the next expected value
    return card.value === nextValue;
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