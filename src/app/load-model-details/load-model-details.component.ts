import { Component, computed, effect, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { DateFilterFn } from '@angular/material/datepicker';
import moment from 'moment';
import { MyKonParticipationExportCsvRow } from '../../specta-bindings/specta-bindings';
import { LoadModelFormModel } from './import-model/import-model-form.model';
import { ImportModelComponent } from './import-model/import-model.component';
import { LoadModelService } from './load-model.service';
import { MatError } from '@angular/material/input';
import { LoadModelComponent } from './load-model/load-model.component';

@Component({
  selector: 'app-load-model-details',
  imports: [ImportModelComponent, MatCardModule, LoadModelComponent],
  templateUrl: './load-model-details.component.html',
  styleUrl: './load-model-details.component.scss'
})
export class LoadModelDetailsComponent {
  private loadModelService = inject(LoadModelService);


}
