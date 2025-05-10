import { Routes } from "@angular/router";
import { LoadModelDetailsComponent } from "./load-model-details/load-model-details.component";
import { ModelDetailsComponent } from "./model-details/model-details.component";
import { SidenavWrapperComponent } from "./sidenav-wrapper/sidenav-wrapper.component";

export const routes: Routes = [
    { path: '', component: LoadModelDetailsComponent },
    {
        path: 'file', component: SidenavWrapperComponent, children: [
            { path: ":filepath/details", component: ModelDetailsComponent }
        ]
    },
];
