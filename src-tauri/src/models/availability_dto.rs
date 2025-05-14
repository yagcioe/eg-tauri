#[derive(serde::Serialize, serde::Deserialize, specta::Type, Debug, Clone)]
pub struct AvailabilityDto {
    pub start: chrono::NaiveTime,
    pub end: chrono::NaiveTime
}