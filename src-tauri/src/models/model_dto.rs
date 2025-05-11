use super::student_dto::StudentDto;
use super::company_dto::CompanyDto;
use super:: application_dto::ApplicationDto;
use super::slot_dto::SlotDto;

#[derive(serde::Serialize, serde::Deserialize, specta::Type, Debug, Clone)]
pub struct ModelDto{
    pub name: String,
    pub cabin_count: u32,
    pub max_start_per_slot: u32,
    pub slot_duration: chrono::NaiveTime,
    pub talk_slot_count: u32,
    pub minimum_representative_break_slot_count: u32,
    pub minimum_student_break_slot_count: u32,
    pub day_start_time: chrono::NaiveTime,
    pub students: Vec<StudentDto>,
    pub companies: Vec<CompanyDto>,
    pub applications: Vec<ApplicationDto>,
    pub slots: Vec<SlotDto>,
}