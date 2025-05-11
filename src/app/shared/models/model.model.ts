import { z } from "zod";
import { ApplicationModelSchema } from "./application.model";
import { CompanyModelSchema } from "./company.model";
import { StudentModelSchema } from "./student.model";
import { SlotModelSchema } from "./slot.model";

export const ModelModelSchema = z.object({
    name: z.string().min(1),
    cabinCount: z.coerce.number().int(),
    maxStartPerSlot: z.coerce.number().int(),
    slotDuration: z.string().time(),
    talkSlotCount: z.coerce.number().int(),
    minimumRepresentativeBreakSlotCount: z.coerce.number().int(),
    minimumStudentBreakSlotCount: z.coerce.number().int(),
    dayStartTime: z.string().time(),
    students: z.array(StudentModelSchema),
    companies: z.array(CompanyModelSchema),
    applications: z.array(ApplicationModelSchema),
    slots: z.array(SlotModelSchema),
})

export type ModelModel = z.infer<typeof ModelModelSchema>;