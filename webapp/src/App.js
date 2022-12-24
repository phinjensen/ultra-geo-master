import "./App.css";

import { BrowserRouter, Routes, Route } from "react-router-dom";

import Board from "./Board";
import Deck from "./Deck";
import Join from "./Join";
import Layout from "./Layout";
import NewGame from "./NewGame";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route path="join-board" element={<Join type="board" />} />
            <Route path="join-deck" element={<Join type="deck" />} />
            <Route path="game/:code/board" element={<Board />} />
            <Route path="game/:code/deck" element={<Deck />} />
            <Route path="game/new" element={<NewGame />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
