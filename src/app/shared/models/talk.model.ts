import { z } from "zod";

export const TalkModelSchema = z.object({
    startTime: z.string().time(),
    applicationId: z.number().int(),
})