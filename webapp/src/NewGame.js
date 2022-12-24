import "./NewGame.css";

import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useSet } from "react-use";

import { url } from "./config";
import { uppercaseId } from "./util";

export default function NewGame() {
  const navigate = useNavigate();

  const [continents, { has: hasContinent, toggle: toggleContinent }] = useSet(
    new Set()
  );

  const startGame = useCallback(() => {
    fetch(`${url}/game`, {
      method: "POST",
      body: JSON.stringify({ continents: [...continents] }),
    })
      .then((response) => response.json())
      .then(({ code }) => navigate(`/game/${code}/board`));
  }, [continents, navigate]);

  return (
    <div className="new-game">
      <div className="row">
        <div className="col">
          <h4>Configure game</h4>
        </div>
      </div>
      <div className="row">
        <div className="col continents">
          <h5>Select continents</h5>
          <ul>
            {[
              "north-america",
              "south-america",
              "europe",
              "asia",
              "africa",
              "oceania",
            ].map((region) => (
              <li key={region}>
                <label htmlFor={region}>
                  <input
                    id={region}
                    name={uppercaseId(region)}
                    type="checkbox"
                    checked={hasContinent(region)}
                    onChange={() => toggleContinent(region)}
                  />
                  {uppercaseId(region)}
                </label>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="row">
        <div className="col">
          <button className="button primary" onClick={startGame}>
            Start game
          </button>
        </div>
      </div>
    </div>
  );
}
