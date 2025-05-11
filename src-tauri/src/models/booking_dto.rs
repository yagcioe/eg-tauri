use crate::models::talk_dto::TalkDto;

#[derive(serde::Serialize, serde::Deserialize, specta::Type, Debug, Clone)]
pub struct BookingDto{
cabin: u32,
talks: Vec<TalkDto>
}