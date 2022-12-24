const csv = require("csv-parse/sync");
const fs = require("fs");
//const wiki = require("wikijs").default;

let qgis_int_keys = ["rankPop", "rankArea"];
let qgis_name_keys = [
  "SOVEREIGNT",
  "ADMIN",
  "GEOUNIT",
  "NAME",
  "NAME_LONG",
  "FORMAL_EN",
];
let rest_keys = [
  "name",
  "tld",
  "unMember",
  "currencies",
  "capital",
  "borders",
  "cca2",
  "cca3",
  "region",
];

let continents = ["north-america", "south-america", "europe", "asia", "africa", "oceania"];
let rest_countries = JSON.parse(fs.readFileSync("countries.json"));

let matched = [];

for (let continent of continents) {
  let qgis_data = csv.parse(fs.readFileSync(continent + ".csv"), {
    columns: true,
  });
  for (let country of qgis_data) {
    let name_set = qgis_name_keys.map((k) => country[k].toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""));
    if (name_set.includes("vatican")) name_set.push("vatican city");
    let rest_country = rest_countries.find((c) =>
      [c.name.common, c.name.official].find((name) => name_set.includes(name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")))
    );
    if (rest_country) {
    matched.push(
      Object.fromEntries(
        rest_keys
          .map((k) => [k, rest_country[k]])
          .concat(qgis_int_keys.map((k) => [k, parseInt(country[k])]))
          .concat([["continent", continent]])
      )
    );
    } else {
      console.error(`No REST countries data for ${country.SOVEREIGNT}.`);
    }
  }
}

//console.log(found[0]);
console.log(JSON.stringify(matched, null, 2));
