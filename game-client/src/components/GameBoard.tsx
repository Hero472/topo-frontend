import type { CardDropEvent } from "../hooks/useDropTarget";
import { useGameStore } from "../store/useGameStore";
import { canDropOnTarget } from "../utils/canDrop";
import CenterBoard from "./CenterBoard";
import OpponentBoard from "./OpponentBoard";
import PlayerBoard from "./PlayerBoard";

export default function GameBoard() {

  const {
    fullState,
    drawCard,
    openScale,
    playHand,
    playPersonal,
    playSide,
    moveToSide,
    movePersonalToSide,
  } = useGameStore();


  function handleDrop(event: CardDropEvent) {

    if (!fullState) return;


    if (!canDropOnTarget(
      fullState,
      event.card,
      event.targetStackId
    )) {
      return;
    }


    switch (event.sourceStackId) {

      case "draw": {

        if (event.targetStackId === "hand") {
          drawCard();
        }

        return;
      }


      case "hand": {

        const handIdx =
          fullState.your_board.hand.findIndex(
            c => c.id === event.card.id
          );


        if (handIdx === -1) return;


        if (event.targetStackId.startsWith("center-")) {

          const scaleIdx =
            Number(event.targetStackId.split("-")[1]) - 1;


          const scale =
            fullState.scales[scaleIdx];


          if (scale === null) {
            openScale(handIdx);
          }
          else {
            playHand(handIdx, scaleIdx);
          }

          return;
        }


        if (event.targetStackId.startsWith("side-")) {

          const stackIdx =
            Number(event.targetStackId.split("-")[1]) - 1;

          moveToSide(handIdx, stackIdx);

          return;
        }


        return;
      }


      case "personal": {

        if (event.targetStackId.startsWith("center-")) {

          const scaleIdx =
            Number(event.targetStackId.split("-")[1]) - 1;

          playPersonal(scaleIdx);

          return;
        }


        if (event.targetStackId.startsWith("side-")) {

          const stackIdx =
            Number(event.targetStackId.split("-")[1]) - 1;

          movePersonalToSide(stackIdx);

          return;
        }

        return;
      }

    }


    if (event.sourceStackId.startsWith("side-")) {

      if (!event.targetStackId.startsWith("center-"))
        return;


      const stackIdx =
        Number(event.sourceStackId.split("-")[1]) - 1;


      const scaleIdx =
        Number(event.targetStackId.split("-")[1]) - 1;


      playSide(stackIdx, scaleIdx);
    }
  }


  if (!fullState) {
    return <div>Loading...</div>;
  }


  return (
    <>
      <OpponentBoard
        board={fullState.opponent}
      />


      <CenterBoard
        scales={fullState.scales}
        dealerCount={fullState.dealer_count}
        dealerTop={fullState.dealer_top}
        onDrop={handleDrop}
      />


      <PlayerBoard
        board={fullState.your_board}
        onDrop={handleDrop}
      />
    </>
  );
}