import { Routes, CanDeactivateFn } from "@angular/router";
import { LoadModelDetailsComponent } from "./load-model-details/load-model-details.component";
import { ModelDetailsComponent } from "./model-details/model-details.component";
import { SidenavWrapperComponent } from "./sidenav-wrapper/sidenav-wrapper.component";
import { CompanyListComponent } from "./company-list/company-list.component";
import { StudentListComponent } from "./student-list/student-list.component";
import { CompanyScheduleComponent } from "./company-schedule/company-schedule.component";
import { StudentScheduleComponent } from "./student-schedule/student-schedule.component";
import { ModelExportComponent } from "./model-export/model-export.component";

export const ROUTE_INDEX: unique symbol = Symbol();

export const ROUTE_SCHEMA = {
    [ROUTE_INDEX]: "",
    FILE_HANDLE: {
        [ROUTE_INDEX]: "fileHandle",
        DETAILS: "details",
        COMPANY: "company",
        STUDENT: "student",
        OPTIMIZATION: "optimization",
        COMPANY_SCHEDULE: "company-schedule",
        STUDENT_SCHEDULE: "student-schedule",
        EXPORT: "export"
    }
} as const

export const routes: Routes = [
    { path: ROUTE_SCHEMA[ROUTE_INDEX], component: LoadModelDetailsComponent },
    {
        path: `:${ROUTE_SCHEMA.FILE_HANDLE[ROUTE_INDEX]}`, component: SidenavWrapperComponent, children: [
            { path: ROUTE_SCHEMA.FILE_HANDLE.DETAILS, component: ModelDetailsComponent },
            {
                path: ROUTE_SCHEMA.FILE_HANDLE.COMPANY, component: CompanyListComponent,
                canDeactivate: [((component) => { return component.saveForm(); }) satisfies CanDeactivateFn<CompanyListComponent>]
            },
            { path: ROUTE_SCHEMA.FILE_HANDLE.STUDENT, component: StudentListComponent },
            { path: ROUTE_SCHEMA.FILE_HANDLE.OPTIMIZATION, component: CompanyScheduleComponent },
            { path: ROUTE_SCHEMA.FILE_HANDLE.COMPANY_SCHEDULE, component: CompanyScheduleComponent },
            { path: ROUTE_SCHEMA.FILE_HANDLE.STUDENT_SCHEDULE, component: StudentScheduleComponent },
            { path: ROUTE_SCHEMA.FILE_HANDLE.EXPORT, component: ModelExportComponent },
        ]
    },
];
