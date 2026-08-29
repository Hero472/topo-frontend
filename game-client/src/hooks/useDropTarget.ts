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
  
  // Use refs to track state synchronously and prevent infinite loops
  const dragOverRef = useRef(false);
  const isHoveredRef = useRef(false);

  // Only subscribe to `dragging` to trigger the effect setup/teardown
  const dragging = useDragStore((s) => s.dragging);

  function canDrop(source: string) {
    if (allowedSourceIds && !allowedSourceIds.includes(source)) return false;
    if (!allowSelfDrop && source === stackId) return false;
    return true;
  }

  useEffect(() => {
    // If not dragging, ensure states are clean and exit
    if (!dragging) {
      if (dragOverRef.current) {
        dragOverRef.current = false;
        setDragOver(false);
      }
      if (isHoveredRef.current) {
        isHoveredRef.current = false;
        useDragStore.getState().setHover(null);
      }
      return;
    }

    // Subscribe directly to the store to avoid React re-render loops on every mouse move
    const unsubscribe = useDragStore.subscribe((state) => {
      if (!state.dragging || !ref.current || !state.sourceStackId) {
        if (dragOverRef.current) {
          dragOverRef.current = false;
          setDragOver(false);
        }
        if (isHoveredRef.current) {
          isHoveredRef.current = false;
          useDragStore.getState().setHover(null);
        }
        return;
      }

      const rect = ref.current.getBoundingClientRect();
      const inside =
        state.x >= rect.left &&
        state.x <= rect.right &&
        state.y >= rect.top &&
        state.y <= rect.bottom;

      const canDropHere = inside && canDrop(state.sourceStackId);

      if (canDropHere) {
        if (!dragOverRef.current) {
          dragOverRef.current = true;
          setDragOver(true);
        }
        if (!isHoveredRef.current) {
          isHoveredRef.current = true;
          useDragStore.getState().setHover(stackId);
        }
      } else {
        if (dragOverRef.current) {
          dragOverRef.current = false;
          setDragOver(false);
        }
        if (isHoveredRef.current) {
          isHoveredRef.current = false;
          useDragStore.getState().setHover(null);
        }
      }
    });

    return () => {
      unsubscribe();
      // Cleanup on unmount
      if (isHoveredRef.current) {
        useDragStore.getState().setHover(null);
      }
    };
  }, [dragging, stackId, allowedSourceIds, allowSelfDrop]);

  return {
    ref,
    dragOver,
  };
}