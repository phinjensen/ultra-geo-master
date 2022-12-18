const csv = require("csv-parse/sync");
const fs = require('fs');
const wiki = require('wikijs').default;

let api_data = JSON.parse(fs.readFileSync("pages/countries.json"));
let country_names = csv
  .parse(fs.readFileSync("north-america.csv"), { columns: true })
  .map(country => ["SOVEREIGNT", "ADMIN", "GEOUNIT", "NAME", "NAME_LONG", "FORMAL_EN"].map(k => country[k]));

let found = [];

for (let name_set of country_names) {
  let country = api_data.find(c => [c.name.common, c.name.official].find(name => name_set.includes(name)));
  if (country) {
    found.push(country);
  }
}

console.log(found[0]);
//console.log(JSON.stringify(found));
