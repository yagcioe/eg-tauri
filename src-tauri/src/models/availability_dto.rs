#[derive(serde::Serialize, serde::Deserialize, specta::Type, Debug)]
pub struct AvailabilityDto {
    pub start: chrono::NaiveDate,
    pub end: chrono::NaiveDate
}