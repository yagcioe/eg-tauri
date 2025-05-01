#[derive(serde::Serialize, serde::Deserialize, specta::Type, Debug)]
pub struct ModelFileDto {
    name: String,
    age: i32,
}