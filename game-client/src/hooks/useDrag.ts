import { useCallback } from "react";
import { useDragStore } from "../store/useDragStore";
import type { Card } from "../types/types";
import type { CardDropEvent } from "./useDropTarget";

interface UseDragOptions {
  card: Card;
  stackId: string;
  enabled?: boolean;
  onDrop?: (event: CardDropEvent) => void;
}

export function useDrag({
  card,
  stackId,
  enabled = true,
  onDrop,
}: UseDragOptions) {
  const startDrag = useDragStore((s) => s.startDrag);
  const move = useDragStore((s) => s.move);
  const endDrag = useDragStore((s) => s.endDrag);

  const onPointerDown = useCallback(
  (e: React.PointerEvent<HTMLElement>) => {
    if (!enabled) return;

    e.preventDefault();

    const target = e.currentTarget;
    const pointerId = e.pointerId;

    target.setPointerCapture(pointerId);

    startDrag(card, stackId, e.clientX, e.clientY);

    function handlePointerMove(ev: PointerEvent) {
      move(ev.clientX, ev.clientY);
    }

    function cleanup() {
      if (target.hasPointerCapture(pointerId)) {
        target.releasePointerCapture(pointerId);
      }

      window.removeEventListener(
        "pointermove",
        handlePointerMove
      );
      window.removeEventListener(
        "pointerup",
        handlePointerUp
      );
      window.removeEventListener(
        "pointercancel",
        handlePointerCancel
      );
    }

    function handlePointerUp() {
      const drag = useDragStore.getState();

      if (
        drag.card &&
        drag.sourceStackId &&
        drag.hoverStackId
      ) {
        onDrop?.({
        card: drag.card,
        sourceStackId: drag.sourceStackId,
        targetStackId: drag.hoverStackId,
        });
      }

      endDrag();
      cleanup();
    }

    function handlePointerCancel() {
      endDrag();
      cleanup();
    }

    window.addEventListener(
      "pointermove",
      handlePointerMove
    );

    window.addEventListener(
      "pointerup",
      handlePointerUp,
      { once: true }
    );

    window.addEventListener(
      "pointercancel",
      handlePointerCancel,
      { once: true }
    );
  }, [card, stackId, enabled, startDrag, move, endDrag, onDrop]
  );

  return {
    onPointerDown,
  };
}