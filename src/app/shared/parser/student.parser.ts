import { StudentDto } from "../../../specta-bindings/specta-bindings";
import { StudentModel } from "../models/student.model";
import { AvailabilityParser } from "./availability.parser";

export class StudentParser {
    public static toModel(dto: StudentDto): StudentModel {
        return {
            id: dto.id,
            email: dto.email,
            name: dto.name,
            availability: dto.availability.map(AvailabilityParser.toModel),
        }
    }

    public static toDto(dto: StudentModel): StudentDto {
        return {
            id: dto.id,
            email: dto.email,
            name: dto.name,
            availability: dto.availability.map(AvailabilityParser.toDto),
        }
    }
}