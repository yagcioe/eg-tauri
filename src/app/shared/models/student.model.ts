import { z } from "zod";
import { AvailabilityModelSchema } from "./availability.model";

export const StudentModelSchema = z.object({
    id: z.number().int(),
    name: z.string(),
    comment: z.string(),
    availability: z.array(AvailabilityModelSchema),
})