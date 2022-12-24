import "./Layout.css";

import { Link, Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <div id="app">
      <nav id="nav">
        <ul>
          <li>
            <Link to="/game/new">New game</Link>
          </li>
          <li>
            <Link to="/join-board">Join game (board)</Link>
          </li>
          <li>
            <Link to="/join-deck">Join game (deck)</Link>
          </li>
        </ul>
      </nav>
      <div id="content">
        <Outlet />
      </div>
    </div>
  );
}
