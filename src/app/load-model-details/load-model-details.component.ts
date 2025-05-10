import { Component } from '@angular/core';

import { MatCardModule } from '@angular/material/card';
import { ImportModelComponent } from './import-model/import-model.component';
import { LoadModelComponent } from './load-model/load-model.component';

@Component({
  selector: 'app-load-model-details',
  imports: [ImportModelComponent, MatCardModule, LoadModelComponent],
  templateUrl: './load-model-details.component.html',
  styleUrl: './load-model-details.component.scss'
})
export class LoadModelDetailsComponent {}
