import { ApplicationConfig, LOCALE_ID, provideExperimentalZonelessChangeDetection } from "@angular/core";
import { provideRouter, withHashLocation } from "@angular/router";

import { provideNativeDateAdapter } from "@angular/material/core";
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import 'moment/locale/de';
import { routes } from "./app.routes";

export const appConfig: ApplicationConfig = {
  providers: [
    provideExperimentalZonelessChangeDetection(),
    provideRouter(routes, withHashLocation()),
    provideAnimationsAsync(),
    provideNativeDateAdapter(),
    { provide: LOCALE_ID, useValue: "de-DE" }
  ],
};
