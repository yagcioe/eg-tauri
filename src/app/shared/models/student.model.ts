import { z } from "zod";
import { AvailabilityModelSchema } from "./availability.model";

export const StudentModelSchema = z.object({
    id: z.number().int(),
    name: z.string(),
    email: z.string(),
    availability: z.array(AvailabilityModelSchema),
})

export type StudentModel = z.infer<typeof StudentModelSchema>