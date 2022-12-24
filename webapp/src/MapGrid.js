import "./MapGrid.css";

import Map from "./Map";

export default function MapGrid({ continents }) {
  let result;
  if (continents.length <= 2) {
    result = (
      <div className="maprow full">
        {continents.map((cont) => (
          <div className="mapcol" key={cont}>
            <Map continent={cont} full />
          </div>
        ))}
      </div>
    );
  } else {
    result = (
      <>
        <div className="maprow half">
          {continents.slice(0, Math.ceil(continents.length / 2)).map((cont) => (
            <div className="mapcol" key={cont}>
              <Map continent={cont} />
            </div>
          ))}
        </div>
        <div className="maprow half">
          {continents.slice(Math.ceil(continents.length / 2)).map((cont) => (
            <div className="mapcol" key={cont}>
              <Map continent={cont} />
            </div>
          ))}
        </div>
      </>
    );
  }
  return <div className="container map-grid">{result}</div>;
}
