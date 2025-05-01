import { z } from "zod";
import { ApplicationModelSchema } from "./application.model";
import { CompanyModelSchema } from "./company.model";
import { StudentModelSchema } from "./student.model";
import { SlotModelSchema } from "./slot.model";

export const ModelModelSchema = z.object({
    name: z.string(),
    cabinCount: z.number().int(),
    maxStartPerSlot: z.number().int(),
    slotDurationMinutes: z.date(),
    talkSlotCount: z.number().int(),
    minimumRepresentativeBreakSlotCount: z.number().int(),
    minimumStudentBreakSlotCount: z.number().int(),
    dayStartTime: z.date(),
    students: z.array(StudentModelSchema),
    companies: z.array(CompanyModelSchema),
    applications: z.array(ApplicationModelSchema),
    slots: z.array(SlotModelSchema),
})

export type ModelModel = z.infer<typeof ModelModelSchema>;