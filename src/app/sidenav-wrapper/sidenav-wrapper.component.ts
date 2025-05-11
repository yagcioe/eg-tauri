import { Component, inject } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ROUTE_INDEX, ROUTE_SCHEMA } from '../app.routes';
import { map } from 'rxjs';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-sidenav-wrapper',
  imports: [RouterModule, MatSidenavModule],
  templateUrl: './sidenav-wrapper.component.html',
  styleUrl: './sidenav-wrapper.component.scss',
})
export class SidenavWrapperComponent {
  private activeRoute = inject(ActivatedRoute);
  protected routeSchema = ROUTE_SCHEMA;
  protected routeIndex: typeof ROUTE_INDEX = ROUTE_INDEX;

  protected fileHandle = toSignal(this.activeRoute.params.pipe(map(params => params[ROUTE_SCHEMA.FILE_HANDLE[ROUTE_INDEX]] as string), takeUntilDestroyed()))
}
