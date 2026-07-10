import { useState } from "react";
import { useDragStore } from "../store/useDragStore";
import type { Card } from "../types/types";
import { cardKey } from "../utils/cardKey";

export interface CardDropEvent {
  card: Card;
  sourceStackId: string;
  targetStackId: string;
}

interface UseDropTargetOptions {
  stackId: string;

  draggable?: boolean;
  allowSelfDrop?: boolean;
  allowedSourceIds?: string[];

  onCardDrop?: (event: CardDropEvent) => void;

  onDragStartCard?: (
    card: Card,
    sourceStackId: string
  ) => void;

  onDragEndCard?: (
    card: Card,
    sourceStackId: string,
    targetStackId?: string
  ) => void;
}

export function useDropTarget({
  stackId,
  draggable = true,
  allowSelfDrop = false,
  allowedSourceIds,
  onCardDrop,
  onDragStartCard,
  onDragEndCard,
}: UseDropTargetOptions) {
  const [dragOver, setDragOver] = useState(false);

  function canDrop(sourceStackId: string) {
    if (
      allowedSourceIds &&
      !allowedSourceIds.includes(sourceStackId)
    ) {
      return false;
    }

    if (!allowSelfDrop && sourceStackId === stackId) {
      return false;
    }

    return true;
  }

  function onDragStart(
    e: React.DragEvent<HTMLElement>,
    card: Card
  ) {
    if (!draggable) return;

    const drag = useDragStore.getState();
    drag.startDrag(stackId, card);
    e.dataTransfer.setData("text/plain", cardKey(card));
    e.dataTransfer.effectAllowed = "move";

    onDragStartCard?.(card, stackId);
  }

  function onDragOver(
    e: React.DragEvent<HTMLElement>
  ) {
    if (!draggable) return;

    const { sourceStackId } =
      useDragStore.getState();

    if (!sourceStackId) return;

    if (!canDrop(sourceStackId)) return;

    e.preventDefault();

    e.dataTransfer.dropEffect = "move";

    if (!dragOver) {
      setDragOver(true);
    }
  }

  function onDragLeave() {
    if (dragOver) {
      setDragOver(false);
    }
  }

  function onDrop(
    e: React.DragEvent<HTMLElement>
  ) {
    e.preventDefault();

    setDragOver(false);

    const drag = useDragStore.getState();

    const {
      draggedCard,
      sourceStackId,
    } = drag;

    if (!draggedCard || !sourceStackId) {
      return;
    }

    if (!canDrop(sourceStackId)) {
      return;
    }

    drag.setDropTarget(stackId);

    onCardDrop?.({
      card: draggedCard,
      sourceStackId,
      targetStackId: stackId,
    });
  }

  function onDragEnd() {
    const drag = useDragStore.getState();

    const {
      draggedCard,
      sourceStackId,
      dropTargetStackId,
    } = drag;

    if (draggedCard && sourceStackId) {
      onDragEndCard?.(
        draggedCard,
        sourceStackId,
        dropTargetStackId ?? undefined
      );
    }

    drag.endDrag();

    setDragOver(false);
  }

  return {
    dragOver,
    handlers: {
      onDragStart,
      onDragOver,
      onDragLeave,
      onDrop,
      onDragEnd,
    },
  };
}