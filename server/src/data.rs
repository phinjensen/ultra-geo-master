use std::{
    collections::{HashMap, HashSet},
    fs,
    sync::Mutex,
};

use rand::{seq::SliceRandom, thread_rng, Rng};
use serde::{Deserialize, Serialize};

#[derive(Serialize, Clone)]
pub enum GameMode {
    AreaRank,
    PopulationRank,
}

#[derive(PartialEq, Eq, Hash, Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "kebab-case")]
pub enum Continent {
    NorthAmerica,
    SouthAmerica,
    Europe,
    Africa,
    Asia,
    Oceania,
}

#[derive(Serialize, Clone)]
struct Player {
    name: String,
    points: i32,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
struct CountryName {
    common: String,
    official: String,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
struct Currency {
    name: String,
    symbol: Option<String>,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct ISO3166 {
    #[serde(rename = "cca2")]
    pub alpha_2: String,
    #[serde(rename = "cca3")]
    pub alpha_3: String,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
#[serde(rename_all = "camelCase")]
pub struct Country {
    name: CountryName,
    #[serde(default = "Vec::new")]
    tld: Vec<String>,
    un_member: bool,
    currencies: HashMap<String, Currency>,
    capital: Vec<String>,
    #[serde(default = "Vec::new")]
    borders: Vec<String>,
    #[serde(flatten)]
    pub codes: ISO3166,
    rank_pop: u16,
    rank_area: u16,
    continent: Continent,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
#[serde(rename_all = "camelCase")]
pub struct Card {
    #[serde(flatten)]
    pub country: Country,
    pub cards_left: usize,
}

#[derive(Serialize, Clone)]
pub struct GameState {
    pub code: String,
    continents: HashSet<Continent>,
    mode: GameMode,
    players: Vec<Player>,
    deck: Vec<String>,
}

#[derive(Deserialize)]
pub struct NewGame {
    pub continents: HashSet<Continent>,
}

const CODE_CHARS: [char; 36] = [
    'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S',
    'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
];

fn gen_code<T: Rng>(rng: &mut T) -> String {
    (0..4)
        .map(|_| CODE_CHARS[rng.gen_range(0..CODE_CHARS.len())])
        .collect::<String>()
}

impl GameState {
    pub fn new<F: Fn(&str) -> bool>(
        continents: HashSet<Continent>,
        countries: &HashMap<String, Country>,
        is_used: F,
    ) -> Self {
        let mut code = gen_code(&mut thread_rng());
        while is_used(code.as_str()) {
            code = gen_code(&mut thread_rng());
        }

        let mut deck: Vec<String> = countries
            .iter()
            .filter(|(_, v)| continents.contains(&v.continent))
            .map(|(k, _)| k)
            .cloned()
            .collect();
        deck.shuffle(&mut thread_rng());
        Self {
            code,
            continents,
            players: Vec::new(),
            mode: GameMode::PopulationRank,
            deck,
        }
    }

    pub fn draw_card(&mut self) -> Option<String> {
        self.deck.pop()
    }

    pub fn cards_left(&self) -> usize {
        self.deck.len()
    }
}

pub struct AppState {
    pub games: Mutex<HashMap<String, GameState>>,
}

impl AppState {
    pub fn new() -> Self {
        Self {
            games: Mutex::new(HashMap::new()),
        }
    }
}

pub struct AppData {
    pub countries: HashMap<String, Country>,
}

impl AppData {
    pub fn new() -> Self {
        let countries =
            serde_json::from_str::<Vec<Country>>(&fs::read_to_string("countries.json").unwrap())
                .unwrap()
                .into_iter()
                .map(|c| (c.codes.alpha_3.clone(), c))
                .collect();
        Self { countries }
    }
}
