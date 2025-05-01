import { z } from "zod";

export const AvailabilityModelSchema = z.object({
    start: z.date(),
    end: z.date()
})