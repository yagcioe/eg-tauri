#[derive(serde::Serialize, serde::Deserialize, specta::Type, Debug)]
pub struct TalkDto {
    start_time: chrono::NaiveTime,
    application_id: u32,
}
