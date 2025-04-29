import { ApplicationConfig, LOCALE_ID, provideExperimentalZonelessChangeDetection } from "@angular/core";
import { provideRouter } from "@angular/router";

import { routes } from "./app.routes";
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideMomentDateAdapter } from "@angular/material-moment-adapter";
import 'moment/locale/de';

export const appConfig: ApplicationConfig = {
  providers: [
    provideExperimentalZonelessChangeDetection(),
    provideRouter(routes),
    provideAnimationsAsync(),
    provideMomentDateAdapter(),
    { provide: LOCALE_ID, useValue: "de-DE" }
  ],
};
