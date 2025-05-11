import { z } from "zod";
import { TalkModelSchema } from "./talk.model";

export const BookingModelSchema = z.object({
    cabin: z.number().int(),
    talks: z.array(TalkModelSchema),
})

export type BookingModel = z.infer<typeof BookingModelSchema>