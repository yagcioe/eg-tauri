import { z } from "zod";

export const AvailabilityModelSchema = z.object({
    start: z.string().time(),
    end: z.string().time()
})

export type AvailabilityModel = z.infer<typeof AvailabilityModelSchema>;