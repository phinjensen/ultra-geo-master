function getFields(card) {
  return {
    "Official name:": card.name.official,
    "Captial:": Array.isArray(card.capital)
      ? card.capital.join(", ")
      : card.capital,
    "Member of the UN?": card.unMember ? "Yes" : "No",
    "Currency(ies):": Object.entries(card.currencies).map(
      ([key, currency]) => `${currency.name} (${key}, ${currency.symbol})`
    ),
    "TLD & 2- and 3- character ISO 3611:": (
      <>
        {card.tld.join(", ")}
        <br />
        {card.cca2}
        <br />
        {card.cca3}
      </>
    ),
  };
}

export default function Card({ card }) {
  if (!card) {
    return <div className="card">No card drawn.</div>;
  }
  let flagCode = card.cca2.toLowerCase();
  return (
    <div className="card">
      <header>
        <h4>
          {card.name.common} — {card.rankPop}
        </h4>
      </header>
      <div className="row">
        <div className="col">
          <img
            src={`https://flagcdn.com/h120/${flagCode}.png`}
            srcSet={`https://flagcdn.com/h240/${flagCode}.png 2x`}
            height="120"
            alt={card.name.common}
          />
        </div>
      </div>
      {Object.entries(getFields(card)).map(([label, value]) => (
        <div className="row" key={label}>
          <div className="col-2">
            <b>{label}</b>
          </div>
          <div className="col">{value}</div>
        </div>
      ))}
    </div>
  );
}
