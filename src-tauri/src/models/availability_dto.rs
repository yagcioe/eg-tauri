#[derive(serde::Serialize, serde::Deserialize, specta::Type, Debug, Clone)]
pub struct AvailabilityDto {
    pub start: chrono::NaiveDate,
    pub end: chrono::NaiveDate
}