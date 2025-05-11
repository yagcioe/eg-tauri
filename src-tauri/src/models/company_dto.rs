use super::representative_dto::RepresentativeDto;

#[derive(serde::Serialize, serde::Deserialize, specta::Type, Debug)]
pub struct CompanyDto {
    pub id: u32,
    pub name: String,
    pub representatives: Vec<RepresentativeDto>,
}
