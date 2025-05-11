import moment from "moment";
import { CompanyDto, MyKonParticipationExportCsvRow, RepresentativeDto, SlotDto, StudentDto } from "../../../specta-bindings/specta-bindings";
import { ModelModel } from "../../shared/models/model.model";
import { DateParser } from "../../shared/parser/date.parser";
import { ModelParser } from "../../shared/parser/model.parser";
import { ObjectUtil } from "../../shared/utils/object.util";

export class LoadModelParser {
    public static readonly defaultCabinCount = 20;
    public static readonly defaultStartTime = moment({ hour: 8, minutes: 30 });
    public static readonly defaultMaxStartPerSlot = 5;
    public static readonly defaultTalkSlotCount = 3;
    public static readonly defaultMinimumRepresentativeBreakSlotCount = 1;
    public static readonly defaultMinimumStudentBreakSlotCount = 2;
    public static readonly defaultSlotDuration = moment.duration(10, "minutes")

    public static toModel(rows: MyKonParticipationExportCsvRow[], name: string): ModelModel {
        const slots: SlotDto[] = [];
        for (let i = 0; i < 54; i++) {
            slots.push({
                penalty: i < 9 || i >= 51 ? 10 : 0
            })
        };
        const companies: CompanyDto[] = rows.map(r => ({
            id: r.event_id,
            name: r.event_name,
            representatives: [this.createDefaultRepresentative()]
        } satisfies CompanyDto))

        const companyMap = ObjectUtil.toMap(companies, c => c.id);

        const students: StudentDto[] = rows.map(row => ({ id: row.user_id, email: row.email, availability: [], name: row.full_name }))

        const applications = rows.map(row => ({ company_id: row.event_id, id: row.participation_id, representative_ids: companyMap[row.event_id].representatives.map(r => r.id), student_id: row.user_id }));
        const slot_duration = DateParser.durationToHHmm(this.defaultSlotDuration);
        return ModelParser.toModel({
            name,
            cabin_count: this.defaultCabinCount,
            max_start_per_slot: this.defaultMaxStartPerSlot,
            talk_slot_count: this.defaultTalkSlotCount,
            minimum_representative_break_slot_count: this.defaultMinimumRepresentativeBreakSlotCount,
            minimum_student_break_slot_count: this.defaultMinimumStudentBreakSlotCount,
            day_start_time: this.defaultStartTime.format("hh:mm:ss"),
            slot_duration,
            slots,
            applications,
            companies,
            students,
        })
    }

    public static createDefaultRepresentative(): RepresentativeDto {
        return {
            availability: [],
            bookings: [],
            id: 0,
        }
    }
}