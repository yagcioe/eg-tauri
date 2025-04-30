use chrono::NaiveDate;
use serde::{Deserialize, Serialize};
use specta_typescript::Typescript;
use std::collections::HashMap;
use std::fs::File;
use std::path::Path;
use tauri::utils::config;
use tauri::{
    plugin::{Builder as PluginBuilder, TauriPlugin},
    Runtime,
};
use tauri_specta::collect_commands;

#[derive(Serialize, Deserialize, specta::Type, Debug)]
pub struct MyKonParticipationExportCsvRow {
    pub participation_id: u32,
    pub status: String,
    pub user_id: u32,
    pub full_name: String,
    pub email: String,
    pub event_id: u32,
    pub event_name: String,
    pub event_beginn_date: NaiveDate,
}

#[derive(Serialize, Deserialize, specta::Type, Debug)]
pub struct ModelFileDto {
    name: String,
    age: i32,
}

#[tauri::command]
#[specta::specta]
pub fn open_csv_file(filepath: &str) -> Result<HashMap<NaiveDate, Vec<MyKonParticipationExportCsvRow>>, String> {
    let path = Path::new(filepath);
    let display = path.display();

    let file = match File::open(&path) {
        Err(why) => return Err(format!("couldn't open {}: {}", display, why)),
        Ok(file) => file,
    };

    let mut reader = csv::ReaderBuilder::new()
        .has_headers(false)
        .from_reader(file);
    let mut grouped_rows:HashMap<NaiveDate, Vec<MyKonParticipationExportCsvRow>> = HashMap::new();
    for result in reader.records() {
        let row = result.map_err(|_| "failed to parse row")?;

        let application = MyKonParticipationExportCsvRow {
            participation_id: row[0]
                .parse()
                .map_err(|_| "failed to parse participation_id")?,
            status: row[1].to_string(),
            user_id: row[2].parse().map_err(|_| "failed to parse user_id")?,
            full_name: row[3].to_string(),
            email: row[4].to_string(),
            event_id: row[5].parse().map_err(|_| "failed to parse event_id")?,
            event_name: row[6].to_string(),
            event_beginn_date: row[7].parse().map_err(|_| "failed to parse beginn date")?,
        };
        grouped_rows.entry(application.event_beginn_date).or_default().push(application);
    }
    return Ok(grouped_rows);
}

pub fn init<R: Runtime>() -> TauriPlugin<R, Option<config::Config>> {
    generate_speacta_bindings();
    PluginBuilder::<R, Option<config::Config>>::new("fs")
        .invoke_handler(tauri::generate_handler![open_csv_file])
        .build()
}

pub fn generate_speacta_bindings() {
    tauri_specta::Builder::<tauri::Wry>::new()
        // Then register them (separated by a comma)
        .commands(collect_commands![open_csv_file])
        .export(
            Typescript::default(),
            "../src/specta-bindings/specta-bindings2.ts",
        )
        .expect("Failed to export typescript bindings");
}
