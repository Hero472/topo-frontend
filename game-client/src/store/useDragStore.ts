import { create } from "zustand";
import type { Card } from "../types/types";

interface DragPosition {
  x: number;
  y: number;
}

interface DragState {
  sourceStackId: string | null;
  draggedCard: Card | null;
  isDragging: boolean;

  validTargetStackIds: string[];

  dragStartPosition: DragPosition | null;
  dragEndPosition: DragPosition | null;

  dropTargetStackId: string | null;

  startDrag: (
    sourceStackId: string,
    card: Card,
    options?: {
      validTargets?: string[];
      event?: React.DragEvent<HTMLElement>;
    }
  ) => void;

  recordDropTarget: (stackId: string) => void;

  endDrag: (
    event?: React.DragEvent<HTMLElement>,
    dropTargetStackId?: string
  ) => void;
}

export const useDragStore = create<DragState>((set) => ({
  sourceStackId: null,
  draggedCard: null,
  isDragging: false,
  validTargetStackIds: [],
  dragStartPosition: null,
  dragEndPosition: null,
  dropTargetStackId: null,

  startDrag: (sourceStackId, card, options = {}) => {
    const { validTargets = [], event } = options;

    set({
      sourceStackId,
      draggedCard: card,
      isDragging: true,
      validTargetStackIds: validTargets,
      dragStartPosition: event
        ? { x: event.clientX, y: event.clientY }
        : null,
      dragEndPosition: null,
      dropTargetStackId: null,
    });
  },

  recordDropTarget: (stackId) =>
    set({ dropTargetStackId: stackId }),

  endDrag: (event, dropTargetStackId) =>
    set({
      sourceStackId: null,
      draggedCard: null,
      isDragging: false,
      validTargetStackIds: [],
      dragStartPosition: null,
      dragEndPosition: event
        ? { x: event.clientX, y: event.clientY }
        : null,
      dropTargetStackId: dropTargetStackId ?? null,
    }),
}));