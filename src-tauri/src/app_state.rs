use std::collections::HashMap;

use uuid::Uuid;

use crate::models::model_dto::ModelDto;

pub struct ModelFile {
    pub file_path: String,
    pub model: ModelDto,
}

#[derive(Default)]
pub struct AppState {
    pub models: HashMap<Uuid, ModelFile>,
}
