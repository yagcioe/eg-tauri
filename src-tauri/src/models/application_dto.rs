#[derive(serde::Serialize, serde::Deserialize, specta::Type, Debug)]
pub struct ApplicationDto {
    pub id: u32,
    pub student_id: u32,
    pub company_id: u32,
    pub representative_ids: Vec<u32>,
}