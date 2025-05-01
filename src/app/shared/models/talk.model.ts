import { z } from "zod";

export const TalkModelSchema = z.object({
    startTime: z.date(),
    applicationId: z.number().int(),
})