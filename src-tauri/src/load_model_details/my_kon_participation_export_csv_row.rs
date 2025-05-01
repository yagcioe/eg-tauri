#[derive(serde::Serialize, serde::Deserialize, specta::Type, Debug)]
pub struct MyKonParticipationExportCsvRow {
    pub participation_id: u32,
    pub status: String,
    pub user_id: u32,
    pub full_name: String,
    pub email: String,
    pub event_id: u32,
    pub event_name: String,
    pub event_beginn_date: chrono::NaiveDate,
}