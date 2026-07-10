import { ScaleManager } from "../game/ScaleManager";
import type { Card, FullState } from "../types/types";

export function canDropOnTarget(
    state: FullState,
    card: Card,
    targetStackId: string
): boolean {

    // Center scales
    if (targetStackId.startsWith("center-")) {

        const scaleIdx = Number(targetStackId.split("-")[1]) - 1;

        const stacks = state.scales.map(scale => scale?.cards ?? []);

        // Empty scale
        if (stacks[scaleIdx].length === 0) {
            return ScaleManager.openScale(stacks, card) === scaleIdx;
        }

        // Existing scale
        return ScaleManager.canPlaceOnScale(
            stacks,
            scaleIdx,
            card
        );
    }

    // Side piles
    if (targetStackId.startsWith("side-")) {
        return true;
    }

    // Hand
    if (targetStackId === "hand") {
        return true;
    }

    return false;
}