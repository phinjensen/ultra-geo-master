import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Join.css";

export default function Join({ type }) {
  const navigate = useNavigate();
  const [code, setCode] = useState("");

  return (
    <form onSubmit={() => navigate(`/game/${code}/${type}`)}>
      <p>To join a game, simply enter your four-letter game code below:</p>
      <p>
        <input
          type="text"
          placeholder="Game Code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />
      </p>
    </form>
  );
}
