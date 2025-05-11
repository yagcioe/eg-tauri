import { z } from "zod";
import { RepresentativeModelSchema } from "./representative.model";

export const CompanyModelSchema = z.object({
    id: z.number().int(),
    name: z.string(),
    representatives: z.array(RepresentativeModelSchema)
});

export type CompanyModel = z.infer<typeof CompanyModelSchema>;