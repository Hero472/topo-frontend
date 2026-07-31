import { useEffect, useRef, useState } from "react";
import { useDragStore } from "../store/useDragStore";
import type { Card } from "../types/types";

export interface CardDropEvent {
  card: Card;
  sourceStackId: string;
  targetStackId: string;
}

interface UseDropTargetOptions {
  stackId: string;

  allowSelfDrop?: boolean;
  allowedSourceIds?: string[];
}

export function useDropTarget({
  stackId,
  allowSelfDrop = false,
  allowedSourceIds,
}: UseDropTargetOptions) {
  const ref = useRef<HTMLDivElement>(null);
  const [dragOver, setDragOver] = useState(false);

  const {
    dragging,
    sourceStackId,
    x,
    y,
    hoverStackId,
    setHover,
  } = useDragStore();

  function canDrop(source: string) {
    if (allowedSourceIds && !allowedSourceIds.includes(source)) {
      return false;
    }

    if (!allowSelfDrop && source === stackId) {
      return false;
    }

    return true;
  }

  useEffect(() => {
    if (!dragging || !ref.current || !sourceStackId) {
      setDragOver(false);
      return;
    }

    const rect = ref.current.getBoundingClientRect();

    const inside =
      x >= rect.left &&
      x <= rect.right &&
      y >= rect.top &&
      y <= rect.bottom;

    if (inside && canDrop(sourceStackId)) {
      setDragOver(true);

      if (hoverStackId !== stackId) {
        setHover(stackId);
      }
    } else {
      setDragOver(false);

      if (hoverStackId === stackId) {
        setHover(null);
      }
    }
  }, [
    dragging,
    x,
    y,
    hoverStackId,
    sourceStackId,
  ]);

  return {
    ref,
    dragOver,
  };
}