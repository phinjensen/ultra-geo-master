import "./Board.css";

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { url } from "./config";
import MapGrid from "./MapGrid";

export default function Board({ ...props }) {
  const { code } = useParams();
  const [game, setGame] = useState();

  useEffect(() => {
    fetch(`${url}/game/${code}`)
      .then((response) => response.json())
      .then((game) => setGame(game));
  }, [code]);

  console.log(game);

  return (
    <div className="board">
      <h4>Game code: {code.toUpperCase()}</h4>
      {game ? <MapGrid continents={game.continents} /> : "Loading..."}
    </div>
  );
}
