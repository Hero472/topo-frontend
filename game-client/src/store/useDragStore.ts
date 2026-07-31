import { create } from "zustand";
import type { Card } from "../types/types";

interface DragState {
  dragging: boolean;

  card: Card | null;

  sourceStackId: string | null;

  x: number;
  y: number;

  hoverStackId: string | null;

  startDrag(
    card: Card,
    stackId: string,
    x: number,
    y: number
  ): void;

  move(x: number, y: number): void;

  setHover(stackId: string | null): void;

  endDrag(): void;
}

export const useDragStore = create<DragState>((set) => ({
  dragging: false,
  card: null,
  sourceStackId: null,
  x: 0,
  y: 0,
  hoverStackId: null,

  startDrag: (card, stackId, x, y) =>
    set({
      dragging: true,
      card,
      sourceStackId: stackId,
      x,
      y,
      hoverStackId: null,
    }),

  move: (x, y) =>
    set({
      x,
      y,
    }),

  setHover: (stackId) =>
    set({
      hoverStackId: stackId,
    }),

  endDrag: () =>
    set({
      dragging: false,
      card: null,
      sourceStackId: null,
      x: 0,
      y: 0,
      hoverStackId: null,
    }),
}));