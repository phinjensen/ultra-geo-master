use std::collections::HashSet;

use actix_web::{get, post, web, App, HttpResponse, HttpServer, Responder};

use ultra_geo_master::data::{AppData, AppState, Continent, Country, GameState};

#[post("/game")]
async fn game_new(state: web::Data<AppState>, data: web::Data<AppData>) -> impl Responder {
    let mut games = state.games.lock().unwrap();
    let game = GameState::new(
        HashSet::from([Continent::NorthAmerica]),
        &data.countries,
        |c| games.contains_key(c),
    );
    let response = HttpResponse::Ok().json(&game);
    games.insert(game.code.clone(), game);
    response
}

#[get("/game/{code}")]
async fn game_status(path: web::Path<String>, state: web::Data<AppState>) -> impl Responder {
    let code = path.into_inner();
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
    path: web::Path<String>,
    state: web::Data<AppState>,
    data: web::Data<AppData>,
) -> impl Responder {
    let code = path.into_inner();
    let mut games = state.games.lock().unwrap();
    let game = games.get_mut(&code);
    if let Some(game) = game {
        let code = game.draw_card();
        if let Some(code) = code {
            let card = data.countries.get(&code).unwrap();
            HttpResponse::NotFound().json(card)
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
        App::new()
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
