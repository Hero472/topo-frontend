import { create } from "zustand";
import type { Card } from "../types/types";

interface DragState {
  isDragging: boolean;
  draggedCard: Card | null;
  sourceStackId: string | null;
  sourceIndex: number | null;
  dropTargetStackId: string | null;

  startDrag: (
    sourceStackId: string,
    card: Card
  ) => void;
  setDropTarget: (
    stackId: string | null
  ) => void;
  endDrag: () => void;
  reset: () => void;
}

export const useDragStore = create<DragState>((set) => ({
  isDragging: false,
  draggedCard: null,
  sourceStackId: null,
  dropTargetStackId: null,
  sourceIndex: null,

  startDrag: (sourceStackId, card) =>
    set({
      isDragging: true,
      draggedCard: card,
      sourceStackId,
      dropTargetStackId: null,
    }),
  setDropTarget: (stackId) =>
    set({
      dropTargetStackId: stackId,
    }),
  endDrag: () =>
    set({
      isDragging: false,
      draggedCard: null,
      sourceStackId: null,
      dropTargetStackId: null,
    }),
  reset: () =>
    set({
      isDragging: false,
      draggedCard: null,
      sourceStackId: null,
      dropTargetStackId: null,
    }),
}));