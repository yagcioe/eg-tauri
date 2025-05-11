use crate::app_state::{AppState, ModelFile};

use super::super::models::model_dto::ModelDto;
use super::my_kon_participation_export_csv_row::MyKonParticipationExportCsvRow;
use chrono::NaiveDate;
use std::collections::HashMap;
use std::fs::{File, OpenOptions};
use std::io::{Read, Write};
use std::path::Path;
use std::sync::Mutex;
use tauri::State;
use tauri_helper::auto_collect_command;
use uuid::Uuid;

#[tauri::command]
#[specta::specta]
#[auto_collect_command]
pub fn open_csv_file(
    file_handle: String,
) -> Result<HashMap<NaiveDate, Vec<MyKonParticipationExportCsvRow>>, String> {
    let path = Path::new(&file_handle);
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
#[auto_collect_command]
pub fn load_model(state: State<'_, Mutex<AppState>>, file_path: String) -> Result<String, String> {
    let mut state = state.lock().unwrap();

    let path = Path::new(&file_path);
    let display = path.display();

    let mut file = match File::open(&path) {
        Err(why) => return Err(format!("couldn't open {}: {}", display, why)),
        Ok(file) => file,
    };

    let mut json_string = String::new();
    file.read_to_string(&mut json_string)
        .map_err(|_| format!("could not read file: {}", file_path))?;

    let model: ModelDto =
        serde_json::from_str(&json_string).map_err(|_| "Could not parse json file")?;
    let file_handle = Uuid::new_v4();

    state.models.insert(
        file_handle.clone(),
        ModelFile {
            file_path: file_path.clone(),
            model: model.clone(),
        },
    );

    return Ok(file_handle.to_string());
}

#[tauri::command]
#[specta::specta]
#[auto_collect_command]
pub fn get_model(
    state: State<'_, Mutex<AppState>>,
    file_handle: String,
) -> Result<Option<ModelDto>, String> {
    let file_handle_uuid =
        Uuid::parse_str(&file_handle).map_err(|_| "Failed to parse uuid".to_string())?;
    let state = state.lock().unwrap();

    return match state.models.get(&file_handle_uuid) {
        None => Ok(None),
        Some(model_file) => Ok(Some(model_file.model.clone())),
    };
}

#[tauri::command]
#[specta::specta]
#[auto_collect_command]
pub fn update_model(
    state: State<'_, Mutex<AppState>>,
    file_handle: String,
    model: ModelDto,
) -> Result<Option<String>, String> {
    let mut state = state.lock().unwrap();
    let file_handle_uuid =
        Uuid::parse_str(&file_handle).map_err(|_| "Failed to parse uuid".to_string())?;
    return Ok(match state.models.remove(&file_handle_uuid) {
        None => None,
        Some(model_file) => {
            let file_path = model_file.file_path;
            state
                .models
                .insert(file_handle_uuid, ModelFile { file_path, model });
            Some(file_handle_uuid.to_string())
        }
    });
}

#[tauri::command]
#[specta::specta]
#[auto_collect_command]
pub fn persist_handle(
    state: State<'_, Mutex<AppState>>,
    file_handle: String,
) -> Result<String, String> {
    let state = state.lock().unwrap();
    let file_handle_uuid =
        Uuid::parse_str(&file_handle).map_err(|_| "Failed to parse uuid".to_string())?;

    return match state.models.get(&file_handle_uuid) {
        None => Err("Could not find model with respective file handle".to_string()),
        Some(model_file) => persist_model(model_file.file_path.clone(), model_file.model.clone()),
    };
}

#[tauri::command]
#[specta::specta]
#[auto_collect_command]
pub fn persist_model(file_path: String, model: ModelDto) -> Result<String, String> {
    let path = Path::new(&file_path);
    let display = path.display();

    let mut file = OpenOptions::new()
        .create(true)
        .write(true)
        .append(false)
        .read(false)
        .truncate(true)
        .open(path)
        .map_err(|err| format!("couldn't open {}: {}", display, err))?;

    let json_string = serde_json::to_string(&model)
        .map_err(|e| format!("Could not serialize json of model: {}", e))?;

    file.write(json_string.as_bytes())
        .map_err(|_| format!("could not read file: {}", file_path))?;

    return Ok(file_path);
}
