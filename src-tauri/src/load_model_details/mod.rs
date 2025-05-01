mod model_file_dto;
mod my_kon_participation_export_csv_row;

use super::models::model_dto::ModelDto;
use chrono::NaiveDate;
use my_kon_participation_export_csv_row::MyKonParticipationExportCsvRow;
use specta::Type;
use specta_typescript::Typescript;
use std::collections::HashMap;
use std::fs::{File, OpenOptions};
use std::io::{Read, Write};
use std::path::Path;
use tauri::utils::config;
use tauri::{
    plugin::{Builder as PluginBuilder, TauriPlugin},
    Runtime,
};
use tauri_specta::collect_commands;

#[tauri::command]
#[specta::specta]
pub fn open_csv_file(
    filepath: String,
) -> Result<HashMap<NaiveDate, Vec<MyKonParticipationExportCsvRow>>, String> {
    let path = Path::new(&filepath);
    let display = path.display();

    let file = match File::open(&path) {
        Err(why) => return Err(format!("couldn't open {}: {}", display, why)),
        Ok(file) => file,
    };

    let mut reader = csv::ReaderBuilder::new()
        .has_headers(false)
        .from_reader(file);
    let mut grouped_rows: HashMap<NaiveDate, Vec<MyKonParticipationExportCsvRow>> = HashMap::new();
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
        grouped_rows
            .entry(application.event_beginn_date)
            .or_default()
            .push(application);
    }
    return Ok(grouped_rows);
}

#[tauri::command]
#[specta::specta]
pub fn load_model_json_file(filepath: String) -> Result<ModelDto, String> {
    let path = Path::new(&filepath);
    let display = path.display();

    let mut file = match File::open(&path) {
        Err(why) => return Err(format!("couldn't open {}: {}", display, why)),
        Ok(file) => file,
    };

    let mut json_string = String::new();
    file.read_to_string(&mut json_string)
        .map_err(|_| format!("could not read file: {}", filepath))?;

    let model: ModelDto =
        serde_json::from_str(&json_string).map_err(|_| "Could not parse json file")?;

    return Ok(model);
}

#[derive(serde::Deserialize, serde::Serialize, Type)]
pub struct SaveModelRequest {
    file_path: String,
    model: ModelDto,
}

#[tauri::command]
#[specta::specta]
pub fn save_model_json_file(request: SaveModelRequest) -> Result<String, String> {
    let filepath = request.file_path;
    let model = request.model;

    let path = Path::new(&filepath);
    let display = path.display();

    let mut file = OpenOptions::new()
        .create(true)
        .write(true)
        .append(false)
        .read(false)
        .open(path)
        .map_err(|err| format!("couldn't open {}: {}", display, err))?;

    let json_string = serde_json::to_string(&model)
        .map_err(|e| format!("Could not serialize json of model: {}", e))?;

    file.write(json_string.as_bytes())
        .map_err(|_| format!("could not read file: {}", filepath))?;

    return Ok(filepath.to_string());
}
