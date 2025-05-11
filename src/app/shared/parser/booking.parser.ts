import { BookingDto } from "../../../specta-bindings/specta-bindings";
import { BookingModel } from "../models/booking.model";
import { DateParser } from "./date.parser";

export class BookingParser {
    public static toModel(dto: BookingDto): BookingModel {
        return {
            cabin: dto.cabin,
            talks: dto.talks.map(t => {
                return {
                    applicationId: t.application_id,
                    startTime: DateParser.stringToHHmm(t.start_time)
                }
            })
        }
    }

    public static toDto(model: BookingModel): BookingDto {
        return {
            cabin: model.cabin,
            talks: model.talks.map(t => {
                return {
                    application_id: t.applicationId,
                    start_time: DateParser.stringToHHmmss(t.startTime)
                }
            })
        }
    }
}