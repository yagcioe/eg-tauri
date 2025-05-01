import { z } from "zod";

export const SlotModelSchema = z.object({
    penalty: z.number(),
})