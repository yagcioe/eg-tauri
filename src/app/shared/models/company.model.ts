import { z } from "zod";
import { RepresentativeModelSchema } from "./representative.model";

export const CompanyModelSchema = z.object({
    id: z.number().int(),
    name: z.string(),
    comment: z.string().nullable(),
    representatives: z.array(RepresentativeModelSchema)
})