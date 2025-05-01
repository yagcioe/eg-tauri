import { z } from "zod";

export const ApplicationModelSchema = z.object({
    id: z.number().int(),
    studentId: z.number().int(),
    companyId: z.number().int(),
    representativeIds: z.array(z.number().int())
})