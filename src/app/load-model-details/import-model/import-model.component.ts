import { Component, computed, effect, inject, output, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { DateFilterFn, MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';
import moment from 'moment';
import { MyKonParticipationExportCsvRow } from '../../../specta-bindings/specta-bindings';
import { LoadModelService } from '../load-model.service';
import { ExampleModelUtil } from '../load-model/example-model.util';
import { LoadModelParser } from '../load-model/load-model.parser';
import { ImportModelFormModel, ImportModelModel, ImportModelModelSchema } from './import-model.model';
import { ROUTE_SCHEMA } from '../../app.routes';

@Component({
  selector: 'app-import-model',
  imports: [FormsModule, MatInputModule, MatDatepickerModule, ReactiveFormsModule],
  templateUrl: './import-model.component.html',
  styleUrl: './import-model.component.scss'
})
export class ImportModelComponent {

  private loadModelService = inject(LoadModelService);
  private router = inject(Router);

  public modelImport = output<ImportModelModel>()

  protected selectedImportFileName = signal<string | undefined>(undefined);
  protected rows = signal<Partial<{
    [x: string]: MyKonParticipationExportCsvRow[];
  }> | undefined>(undefined)

  protected rowImportError = signal<string | undefined>(undefined);

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

    return currentMin.toDate();
  });

  // TODO validate date is in loaded rows
  protected form = new FormGroup<ImportModelFormModel>({
    date: new FormControl(null, Validators.required),
    modelName: new FormControl(null, Validators.required)
  })

  protected isImportFormValid = signal<boolean>(false);

  constructor() {
    this.loadModelService.listenEvent().pipe(takeUntilDestroyed()).subscribe((event) => {
      console.log(" ctor of listener", event);
    })

    this.form.controls.date.valueChanges.pipe(takeUntilDestroyed()).subscribe((value) => {
      this.form.controls.modelName.setValue(moment(value)?.format("dddd") ?? null)
    });

    this.form.statusChanges.pipe(takeUntilDestroyed()).subscribe((status) => {
      this.isImportFormValid.set(status === "VALID");
    })

    effect(() => {

      const _rows = this.rows();
      if (_rows) {
        this.form.enable();
      } else {
        this.form.disable();
      }
    }
    )
  }

  protected async importModelFile() {
    const data = await this.loadModelService.importCsvFile();
    if (!data) return;

    const { fileName, content } = data;

    this.selectedImportFileName.set(fileName);
    if (content.status === "error") {

      this.rowImportError.set(content.error)
      this.rows.set(undefined)
      return;
    }
    this.rowImportError.set(undefined)
    this.rows.set(content.data)
  }

  protected dateFilter: DateFilterFn<Date | null> = (date) => {
    console.log(date)
    if (!date) return false;

    return !!(this.availableDates()?.map(availableDate => moment(availableDate)).some(availableDate => availableDate.isSame(date, "day")))
  }

  protected async createModel() {
    if (!this.isImportFormValid()) {
      return;
    }

    const rawValue = this.form.getRawValue();
    const data = ImportModelModelSchema.parse(rawValue);
    const rows = this.rows();
    if (!rows) return;
    const dateString = moment(data.date).format("yyyy-MM-DD");
    const rowsOfDate = rows[dateString];
    if (!rowsOfDate) return;

    const model = LoadModelParser.toModel(rowsOfDate, data.modelName)
    const saveResult = await this.loadModelService.persistModel(model);
    await this.openModelDetail(saveResult);
  }

  protected async createExampleModel() {
    const exampleModel = ExampleModelUtil.createExampleModel();
    const saveResult = await this.loadModelService.persistModel(exampleModel);
    await this.openModelDetail(saveResult);
  }

  private async openModelDetail(saveResult: Awaited<ReturnType<typeof this.loadModelService.persistModel>>) {
    if (!saveResult) return;

    if (saveResult.status === "error") {
      console.error(saveResult.error);
      return;
    }

    const loadResult = await this.loadModelService.loadModel(saveResult.data.filePath);
    const fileHandle = loadResult.content.status === "ok" ? loadResult.content.data.fileHandle : undefined;
    if (!fileHandle) return;

    this.router.navigate([fileHandle, ROUTE_SCHEMA.FILE_HANDLE.DETAILS])
  }

}


