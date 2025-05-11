import { RepresentativeDto } from "../../../specta-bindings/specta-bindings";
import { RepresentativeModel } from "../models/representative.model";
import { AvailabilityParser } from "./availability.parser";
import { BookingParser } from "./booking.parser";

export class RepresentativeParser {
    public static toModel(dto: RepresentativeDto): RepresentativeModel {
        return {
            id: dto.id,
            bookings: dto.bookings.map(BookingParser.toModel),
            availability: dto.availability.map(AvailabilityParser.toModel),
        }

    }

    public static toDto(model: RepresentativeModel): RepresentativeDto {
        return {
            id: model.id,
            bookings: model.bookings.map(BookingParser.toDto),
            availability: model.availability.map(AvailabilityParser.toDto),
        }
    }
}