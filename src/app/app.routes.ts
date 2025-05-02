import { Routes } from "@angular/router";
import { LoadModelDetailsComponent } from "./load-model-details/load-model-details.component";
import { ModelDetailsComponent } from "./model-details/model-details.component";

export const routes: Routes = [
    { path: '', component: LoadModelDetailsComponent },
    { path: 'details/:filepath', component: ModelDetailsComponent }
];
