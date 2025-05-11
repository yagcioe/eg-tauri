
#[derive(serde::Serialize, serde::Deserialize, specta::Type, Debug, Clone)]
pub struct SlotDto{
    pub penalty: u32,
}