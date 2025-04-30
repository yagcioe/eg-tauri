import { Component, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatInputModule } from '@angular/material/input';

import { DateFilterFn, MatDatepickerInputEvent, MatDatepickerModule } from '@angular/material/datepicker';
import { LoadModelService } from './load-model.service';
import { MyKonParticipationExportCsvRow } from '../../specta-bindings/specta-bindings2';
import moment, { Moment } from 'moment';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { LoadModelFormModel } from './load-model-form.model';

@Component({
  selector: 'app-load-model-details',
  imports: [FormsModule, MatInputModule, MatDatepickerModule, ReactiveFormsModule],
  templateUrl: './load-model-details.component.html',
  styleUrl: './load-model-details.component.css'
})
export class LoadModelDetailsComponent {
  private loadModelService = inject(LoadModelService);
  private id = 0;

  protected selectedFileName = signal<string | undefined>(undefined);
  protected rows = signal<Partial<{
    [x: string]: MyKonParticipationExportCsvRow[];
  }> | undefined>(undefined)

  protected availableDates = computed(() => {
    const rows = this.rows();
    if (!rows) return undefined;

    return Object.keys(rows).map((isoString) => moment(isoString))
  });

  protected minDate = computed(() => {
    const availableDates = this.availableDates();
    if (!availableDates || availableDates.length === 0) return null;

    let currentMin = availableDates[0];
    for (let i = 1; i < availableDates.length; i++) {
      if (availableDates[i].isBefore(currentMin)) {
        currentMin = availableDates[i];
      }
    }

    return currentMin;
  });

  protected form = new FormGroup<LoadModelFormModel>({
    date: new FormControl(null, Validators.required),
    modelName: new FormControl(null, Validators.required)
  })

  protected idFormValid = signal<boolean>(false);

  constructor() {
    this.loadModelService.listenEvent().pipe(takeUntilDestroyed()).subscribe((event) => {
      console.log(" ctor of listener", event);
    })

    this.form.controls.date.valueChanges.pipe(takeUntilDestroyed()).subscribe((value) => {
      this.form.controls.modelName.setValue(value?.format("dddd") ?? null)
    });

    this.form.statusChanges.pipe(takeUntilDestroyed()).subscribe((status) => {
      this.idFormValid.set(status === "VALID");
    })
  }

  protected async openFile() {
    const data = await this.loadModelService.openFile();
    if (!data) return;

    const { fileName, content } = data;

    this.selectedFileName.set(fileName);
    if (content.status === "error") {
      console.error(content.error);
      this.rows.set(undefined)
      return;
    }

    this.rows.set(content.data)
  }

  protected onFileChange($event: Event) {
    const files = ($event.target as any)?.files as FileList | null | undefined;

    console.log(files);
    const file = files?.item(0)
    file?.webkitRelativePath
  }

  protected publisDemoEvent(): void {
    this.loadModelService.publishValue({ name: "test" + (++this.id) });
  }

  protected dateFilter: DateFilterFn<moment.Moment | null> = (date) => {
    if (!date) return false;

    return !!(this.availableDates()?.map(availableDate => moment(availableDate)).some(availableDate => availableDate.isSame(date, "day")))
  }

  protected createModel() {
    if(!this.idFormValid()){
      return;
    }

    const rawValue = this.form.getRawValue();

    console.log(rawValue);
  }

}
