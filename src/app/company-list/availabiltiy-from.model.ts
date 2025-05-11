import { FormControl } from "@angular/forms";
import { z } from "zod";

export const AvailabilityModelSchema = z.object({
    isAlwaysAvailable: z.boolean(),
    availableFrom: z.string().time(),
    availableTo: z.string().time(),
})

export interface AvailabilityFormModel {
    isAlwaysAvailable: FormControl<boolean>,
    availableFrom: FormControl<string | null>
    availableTo: FormControl<string | null>
}