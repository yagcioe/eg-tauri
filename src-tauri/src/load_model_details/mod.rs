use serde::{Deserialize, Serialize};
use specta_typescript::Typescript;
use std::fs::File;
use std::io::{BufReader, Read};
use std::path::Path;
use tauri::utils::config;
use tauri::{
    plugin::{Builder as PluginBuilder, TauriPlugin},
    Runtime,
};
use tauri_specta::collect_commands;

#[derive(Serialize, Deserialize, specta::Type,Debug)]
pub struct ModelFileDto {
    name: String,
    age: i32,
}

#[tauri::command]
#[specta::specta]
pub fn open_json_file(filepath: &str) -> Result<ModelFileDto, String> {
    let path = Path::new(filepath);
    let display = path.display();

    let file = match File::open(&path) {
        Err(why) => return Err(format!("couldn't open {}: {}", display, why)),
        Ok(file) => file,
    };

    let reader = BufReader::new(file);

    let file_model_dto:ModelFileDto = match serde_json::from_reader(reader){
        Err(_) => return  Err("could not parse json file".to_string()),
        Ok( reader) => reader
    };

    return  Ok(file_model_dto);
}

pub fn init<R: Runtime>() -> TauriPlugin<R, Option<config::Config>> {
    PluginBuilder::<R, Option<config::Config>>::new("fs")
        .invoke_handler(tauri::generate_handler![open_json_file])
        .build()
}
pub fn generate_speacta_bindings() {
    tauri_specta::Builder::<tauri::Wry>::new()
        // Then register them (separated by a comma)
        .commands(collect_commands![open_json_file])
        .export(Typescript::default(), "../src/specta-bindings2.ts")
        .expect("Failed to export typescript bindings");
}
