import { FormArray, FormControl } from "@angular/forms";

export interface ModelBaseDataFormModel {
    name: FormControl<string | null>;
    cabinCount: FormControl<string | null>;
    maxStartPerSlot: FormControl<string | null>;
    slotDuration: FormControl<string | null>;
    talkSlotCount: FormControl<string | null>;
    minimumRepresentativeBreakSlotCount: FormControl<string | null>;
    minimumStudentBreakSlotCount: FormControl<string | null>;
    dayStartTime: FormControl<string | null>,
    slots: FormArray<FormControl<string | null>>;
}
