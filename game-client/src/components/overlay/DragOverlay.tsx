import { useDragStore } from "../../store/useDragStore";
import CardView from "../game/CardView";

export default function DragOverlay() {
  const { dragging, card, x, y } = useDragStore();

  if (!dragging || !card) return null;

  return (
    <div
      style={{
        position: "fixed",
        left: x,
        top: y,
        transform: "translate(-50%, -50%)",
        pointerEvents: "none",
        zIndex: 99999,
      }}
    >
      <CardView card={card} />
    </div>
  );
}