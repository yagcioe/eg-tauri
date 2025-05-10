import { Component } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-sidenav-wrapper',
  imports: [RouterModule, MatSidenavModule],
  templateUrl: './sidenav-wrapper.component.html',
  styleUrl: './sidenav-wrapper.component.scss',
})
export class SidenavWrapperComponent {

}
