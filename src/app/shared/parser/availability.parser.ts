import { AvailabilityDto } from "../../../specta-bindings/specta-bindings";
import { AvailabilityModel } from "../models/availability.model";
import { DateParser } from "./date.parser";

export class AvailabilityParser {
    public static toModel(dto: AvailabilityDto): AvailabilityModel {
        return {
            start: DateParser.stringToHHmm(dto.start),
            end: DateParser.stringToHHmm(dto.end)
        }
    }

        public static toDto(model: AvailabilityModel): AvailabilityDto {
        return {
            start: DateParser.stringToHHmmss(model.start),
            end: DateParser.stringToHHmmss(model.end)
        }
    }
}