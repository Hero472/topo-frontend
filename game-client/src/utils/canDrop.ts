import { ScaleManager } from "../game/ScaleManager";
import type { Card, FullState } from "../types/types";

export function canDropOnTarget(
    state: FullState,
    card: Card,
    targetStackId: string
): boolean {

    if (targetStackId.startsWith("center-")) {

        const scaleIdx = Number(targetStackId.split("-")[1]) - 1;

        const stacks = state.phase == "playing" ? state.scales.map(scale => scale?.cards ?? []) : [];

        // Empty scale
        if (stacks[scaleIdx].length === 0) {
            return ScaleManager.openScale(stacks, card) === scaleIdx;
        }

        return ScaleManager.canPlaceOnScale(
            stacks,
            scaleIdx,
            card
        );
    }

    if (targetStackId.startsWith("side-")) {
        return true;
    }

    if (targetStackId === "hand") {
        return true;
    }

    return false;
}