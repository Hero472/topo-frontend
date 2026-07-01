import { useDragStore } from "../store/useDragStore";
import type { Card } from "../types/types";
import { useState } from "react";

interface UseDropTargetOptions {
  draggable: boolean;
  stackId: string;
  onCardDrop?: (card: Card, sourceStackId: string) => void;
  allowedSourceIds?: string[];
  onDragStartCard?: (card: Card, sourceStackId: string) => void;
  onDragEndCard?: (
    card: Card,
    sourceStackId: string,
    targetStackId?: string
  ) => void;
  allowSelfDrop: boolean;
}

export function useDropTarget({
  draggable,
  stackId,
  onCardDrop,
  allowedSourceIds,
  onDragStartCard,
  onDragEndCard,
  allowSelfDrop,
}: UseDropTargetOptions) {
  const [dragOver, setDragOver] = useState(false);

  const handleDragStart = (e: React.DragEvent<HTMLElement>, card: Card) => {
    if (!draggable) return;
    useDragStore.getState().startDrag(stackId, card, { event: e });
    e.dataTransfer.setData("text/plain", stackId);
    e.dataTransfer.effectAllowed = "move";
    onDragStartCard?.(card, stackId);
  };

  const handleDragOver = (e: React.DragEvent<HTMLElement>) => {
    if (!draggable) return;
    const sourceId = useDragStore.getState().sourceStackId;
    if (!sourceId) return;

    const isSelf = sourceId === stackId;
    const allowedByList =
      !allowedSourceIds || allowedSourceIds.includes(sourceId);
    const allowed = allowedByList && (allowSelfDrop || !isSelf);

    if (allowed) {
      e.preventDefault();
      e.dataTransfer.dropEffect = "move";
      setDragOver(true);
    } else {
      e.dataTransfer.dropEffect = "none";
    }
  };

  const handleDragLeave = () => setDragOver(false);

  const handleDrop = (e: React.DragEvent<HTMLElement>) => {
    if (!draggable || !onCardDrop) return;
    e.preventDefault();
    setDragOver(false);

    const { sourceStackId, draggedCard } = useDragStore.getState();
    if (!draggedCard || !sourceStackId) return;

    // Validate source
    if (allowedSourceIds && !allowedSourceIds.includes(sourceStackId)) return;
    if (!allowSelfDrop && sourceStackId === stackId) return;

    try {
      onCardDrop(draggedCard, sourceStackId);
      useDragStore.getState().recordDropTarget(stackId);
      onDragEndCard?.(draggedCard, sourceStackId, stackId);
    } catch (error) {
      console.error("Drop callback failed:", error);
    }
  };

  const handleDragEnd = () => {
    if (!draggable) return;
    const { sourceStackId, draggedCard, dropTargetStackId } =
      useDragStore.getState();

    if (!dropTargetStackId && draggedCard && sourceStackId) {
      onDragEndCard?.(draggedCard, sourceStackId, undefined);
    }

    useDragStore.getState().endDrag();
  };

  return {
    dragOver,
    handlers: {
      onDragStart: handleDragStart,
      onDragOver: handleDragOver,
      onDragLeave: handleDragLeave,
      onDrop: handleDrop,
      onDragEnd: handleDragEnd,
    },
  };
}