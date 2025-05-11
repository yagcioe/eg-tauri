use super::availability_dto::AvailabilityDto;
use super::booking_dto::BookingDto;

#[derive(serde::Serialize, serde::Deserialize, specta::Type, Debug, Clone)]
pub struct RepresentativeDto {
    id: u32,
    availability: Vec<AvailabilityDto>,
    bookings: Vec<BookingDto>,
}
