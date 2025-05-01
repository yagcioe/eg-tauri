import { FormControl } from "@angular/forms";
import { z } from "zod";

export const ImportModelModelSchema = z.object({
    date: z.date(),
    modelName: z.string(),
})
export type ImportModelModel = z.infer<typeof ImportModelModelSchema>;

export interface ImportModelFormModel {
    date: FormControl<Date | null>,
    modelName: FormControl<string | null>
}
