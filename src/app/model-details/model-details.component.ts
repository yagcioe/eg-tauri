import { Component, computed, effect, inject } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { FormArray, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute } from '@angular/router';
import { map, merge, Observable, of, switchMap } from 'rxjs';
import { LoadModelService } from '../load-model-details/load-model.service';
import { TimePickerComponent } from '../shared/components/time-picker/time-picker.component';
import { ModelModelSchema } from '../shared/models/model.model';
import { SlotModelSchema } from '../shared/models/slot.model';
import { ValidationListPipe } from '../shared/pipes/validation-list.pipe';
import { ValidatorService } from '../shared/services/validator.service';
import { ModelBaseDataFormModel } from './model-base-data.form-model';
import moment from 'moment';
import { DateParser } from '../shared/parser/date.parser';
import { ROUTE_INDEX, ROUTE_SCHEMA } from '../app.routes';

@Component({
  selector: 'app-model-details',
  imports: [MatInputModule, FormsModule, ReactiveFormsModule, ValidationListPipe, TimePickerComponent, MatButtonModule, MatIconModule],
  templateUrl: './model-details.component.html',
  styleUrl: './model-details.component.scss'
})
export class ModelDetailsComponent {
  private readonly activeRoute = inject(ActivatedRoute);
  private readonly loadModelService = inject(LoadModelService);
  private readonly validatorService = inject(ValidatorService);

  private modelFilePath: Observable<string | undefined> = this.activeRoute.parent?.params.pipe(map(params => decodeURI(params[ROUTE_SCHEMA.FILE_HANDLE[ROUTE_INDEX]]) as string), takeUntilDestroyed()) ?? of(undefined)
  protected modelLoadingResult = toSignal(this.modelFilePath.pipe(switchMap(path => path ? this.loadModelService.loadModelJsonFile(path) : of(undefined)), takeUntilDestroyed()))
  protected fileName = computed(() => this.modelLoadingResult()?.fileName);

  protected modelContent = computed(() => {
    const mod = this.modelLoadingResult()?.content;

    if (!mod) return;

    if (mod.status === "ok") {
      return mod.data;
    }
    return;
  });

  protected form = new FormGroup<ModelBaseDataFormModel>({
    name: new FormControl(null, [this.validatorService.zodObject(ModelModelSchema, "name")]),
    cabinCount: new FormControl(null, [this.validatorService.zodObject(ModelModelSchema, "cabinCount")]),
    dayStartTime: new FormControl(null, [this.validatorService.zodObject(ModelModelSchema, "dayStartTime")]),
    maxStartPerSlot: new FormControl(null, [this.validatorService.zodObject(ModelModelSchema, "maxStartPerSlot")]),
    minimumRepresentativeBreakSlotCount: new FormControl(null, [this.validatorService.zodObject(ModelModelSchema, "minimumRepresentativeBreakSlotCount")]),
    minimumStudentBreakSlotCount: new FormControl(null, [this.validatorService.zodObject(ModelModelSchema, "minimumStudentBreakSlotCount")]),
    slotDuration: new FormControl(null, [this.validatorService.zodObject(ModelModelSchema, "slotDuration")]),
    talkSlotCount: new FormControl(null, [this.validatorService.zodObject(ModelModelSchema, "talkSlotCount")]),
    slots: new FormArray<FormControl<string | null>>([], [this.validatorService.zodObject(ModelModelSchema, "slots")]),
  })

  protected slotDisplayData = toSignal(merge(this.form.controls.dayStartTime.valueChanges, this.form.controls.slotDuration.valueChanges, this.form.controls.slots.valueChanges).pipe(map(() => {
    const startTime = moment.duration(this.form.controls.dayStartTime.value);
    const slotDuration = moment.duration(this.form.controls.slotDuration.value);

    return this.form.controls.slots.controls.map((slot, index) => {
      const time = startTime.clone().add(moment.duration(slotDuration.asMilliseconds() * index));
      return { slot, time: DateParser.durationToHHmm(time), index };
    })
  })), { initialValue: [] })


  constructor() {
    effect(() => {
      const model = this.modelContent();
      if (!model) {
        this.form.reset();
        return;
      }
      this.form.patchValue({
        cabinCount: model.cabinCount + "",
        dayStartTime: model.dayStartTime,
        maxStartPerSlot: model.maxStartPerSlot + "",
        minimumRepresentativeBreakSlotCount: model.minimumRepresentativeBreakSlotCount + "",
        minimumStudentBreakSlotCount: model.minimumStudentBreakSlotCount + "",
        name: model.name,
        slotDuration: model.slotDuration,
        talkSlotCount: model.talkSlotCount + ""
      })
      this.form.controls.slots.clear();
      let i = 0;
      for (; i < model.slots.length - 1; i++) {
        this.addSlot(false, model.slots[i].penalty, { emitEvent: false })
      }
      if (i < model.slots.length) {
        this.addSlot(false, model.slots[i].penalty)
      }
    })
  }

  addSlot(beginning: boolean, penalty: number, opt?: { emitEvent: boolean }) {
    const control = new FormControl<string | null>(penalty + "", [this.validatorService.required(), this.validatorService.zodObject(SlotModelSchema, "penalty")])
    const index = beginning ? 0 : this.form.controls.slots.length;

    this.form.controls.slots.insert(index, control, opt)
  }

  removeSlot(index: number) {
    this.form.controls.slots.removeAt(index)
  }
}
