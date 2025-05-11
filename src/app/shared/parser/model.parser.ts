import { ModelDto } from "../../../specta-bindings/specta-bindings";
import { ModelModel } from "../models/model.model";
import { ApplicationParser } from "./application.parser";
import { CompanyParser } from "./company.parser";
import { DateParser } from "./date.parser";
import { StudentParser } from "./student.parser";

export class ModelParser {
    public static toDto(model: ModelModel): ModelDto {
        return {
            cabin_count: model.cabinCount,
            day_start_time: DateParser.stringToHHmmss(model.dayStartTime),
            max_start_per_slot: model.maxStartPerSlot,
            minimum_representative_break_slot_count: model.minimumStudentBreakSlotCount,
            minimum_student_break_slot_count: model.minimumStudentBreakSlotCount,
            name: model.name,
            slot_duration: model.slotDuration,
            talk_slot_count: model.talkSlotCount,
            slots: model.slots.map(s => ({ penalty: s.penalty })),
            students: model.students.map(StudentParser.toDto),
            companies: model.companies.map(CompanyParser.toDto),
            applications: model.applications.map(ApplicationParser.toDto),
        }
    }

    public static toModel(dto: ModelDto): ModelModel {
        return {
            cabinCount: dto.cabin_count,
            dayStartTime: DateParser.stringToHHmm(dto.day_start_time),
            maxStartPerSlot: dto.max_start_per_slot,
            minimumRepresentativeBreakSlotCount: dto.minimum_representative_break_slot_count,
            minimumStudentBreakSlotCount: dto.minimum_student_break_slot_count,
            name: dto.name,
            slotDuration: DateParser.stringToHHmm(dto.slot_duration),
            talkSlotCount: dto.talk_slot_count,
            slots: dto.slots.map(s => ({ penalty: s.penalty })),
            students: dto.students.map(StudentParser.toModel),
            companies: dto.companies.map(CompanyParser.toModel),
            applications: dto.applications.map(ApplicationParser.toModel),
        }
    }
}