import { FormControl } from "@angular/forms";
import { Moment } from "moment";

export interface LoadModelFormModel {
    date: FormControl<Moment | null>
    modelName: FormControl<string | null>
}