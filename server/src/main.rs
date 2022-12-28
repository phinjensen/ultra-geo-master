use actix_cors::Cors;
use actix_web::{get, post, web, App, HttpResponse, HttpServer, Responder};

use serde::{Deserialize, Deserializer};
use ultra_geo_master::data::{AppData, AppState, Card, GameState, NewGame};

#[derive(Deserialize)]
struct CodePath {
    #[serde(deserialize_with = "uppercase")]
    code: String,
}

fn uppercase<'de, D>(deserializer: D) -> Result<String, D::Error>
where
    D: Deserializer<'de>,
{
    let s: &str = Deserialize::deserialize(deserializer)?;
    Ok(String::from(s).to_uppercase())
}

#[post("/game")]
async fn game_new(
    req_body: String,
    state: web::Data<AppState>,
    data: web::Data<AppData>,
) -> impl Responder {
    let settings: NewGame = serde_json::from_str(&req_body).unwrap();
    let mut games = state.games.lock().unwrap();
    let game = GameState::new(settings.continents, &data.countries, |c| {
        games.contains_key(c)
    });
    let response = HttpResponse::Ok().json(&game);
    games.insert(game.code.clone(), game);
    response
}

#[get("/game/{code}")]
async fn game_status(path: web::Path<CodePath>, state: web::Data<AppState>) -> impl Responder {
    let CodePath { code } = path.into_inner();
    let games = state.games.lock().unwrap();
    let game = games.get(&code);
    if let Some(game) = game {
        HttpResponse::Ok().json(game.clone())
    } else {
        HttpResponse::NotFound().body("{}")
    }
}

#[get("/game/{code}/card")]
async fn game_draw_card(
    path: web::Path<CodePath>,
    state: web::Data<AppState>,
    data: web::Data<AppData>,
) -> impl Responder {
    let CodePath { code } = path.into_inner();
    let mut games = state.games.lock().unwrap();
    let game = games.get_mut(&code);
    if let Some(game) = game {
        let code = game.draw_card();
        if let Some(code) = code {
            let card = Card {
                country: data.countries.get(&code).unwrap().clone(),
                cards_left: game.cards_left(),
            };
            HttpResponse::Ok().json(card)
        } else {
            HttpResponse::NotFound().body("Empty deck!")
        }
    } else {
        HttpResponse::NotFound().body("{}")
    }
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    let state = web::Data::new(AppState::new());
    let data = web::Data::new(AppData::new());
    HttpServer::new(move || {
        let cors = Cors::default()
            .allow_any_origin()
            .allow_any_method()
            .allow_any_header()
            .max_age(3600);
        App::new()
            .wrap(cors)
            .app_data(state.clone())
            .app_data(data.clone())
            .service(game_new)
            .service(game_status)
            .service(game_draw_card)
    })
    .bind(("0.0.0.0", 8080))?
    .run()
    .await
}
