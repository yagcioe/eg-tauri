use super::availability_dto::AvailabilityDto;

#[derive(serde::Serialize, serde::Deserialize, specta::Type, Debug, Clone)]
pub struct StudentDto {
    pub id: u32,
    pub name: String,
    pub email: String,
    pub availability: Vec<AvailabilityDto>,
}
