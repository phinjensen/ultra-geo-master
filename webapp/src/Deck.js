import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { url } from "./config";
import Card from "./Card";

export default function Deck() {
  let { code } = useParams();

  let [card, setCard] = useState();
  let [cardsLeft, setCardsLeft] = useState();

  let drawCard = useCallback(() => {
    fetch(`${url}/game/${code}/card`)
      .then((response) => response.json())
      .then((data) => {
        setCard(data);
        setCardsLeft(data.cardsLeft);
      });
  }, [code]);

  // Webhooks to keep deck size up to date?
  useEffect(() => {
    fetch(`${url}/game/${code}`)
      .then((response) => response.json())
      .then((game) => setCardsLeft(game.deck.length));
  }, [code]);

  return (
    <>
      <div className="row">
        <div className="col">
          <button onClick={drawCard}>Draw Card</button>
        </div>
        <div className="col">
          <p>Cards left: {cardsLeft}</p>
        </div>
      </div>
      <div className="row">
        <div className="col">
          <Card card={card} />
        </div>
      </div>
    </>
  );
}
