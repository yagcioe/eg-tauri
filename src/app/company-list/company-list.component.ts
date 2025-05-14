import { ChangeDetectionStrategy, Component, computed, DestroyRef, effect, inject, linkedSignal, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormArray, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatSortModule, Sort } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { LoadModelService } from '../load-model-details/load-model.service';
import { TimePickerComponent } from '../shared/components/time-picker/time-picker.component';
import { AvailabilityModel } from '../shared/models/availability.model';
import { CompanyModel } from '../shared/models/company.model';
import { RepresentativeModel } from '../shared/models/representative.model';
import { ValidatorService } from '../shared/services/validator.service';
import { HtmlUtil } from '../shared/utils/html.util';
import { ModelUtil } from '../shared/utils/model.util';
import { AvailabilityFormModel, AvailabilityModelSchema } from './availabiltiy-from.model';
import moment from 'moment';
import { DateParser } from '../shared/parser/date.parser';
import { MatError } from '@angular/material/input';
import { ValidationListPipe } from "../shared/pipes/validation-list.pipe";

@Component({
  selector: 'app-company-list',
  imports: [MatTableModule, MatButtonModule, MatIconModule, MatCheckboxModule, ReactiveFormsModule, FormsModule, TimePickerComponent, MatSortModule, MatError, ValidationListPipe],
  templateUrl: './company-list.component.html',
  styleUrl: './company-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CompanyListComponent {
  private readonly activeRoute = inject(ActivatedRoute);
  private readonly loadModelService = inject(LoadModelService);
  private readonly validatorService = inject(ValidatorService);
  private readonly destroyRef = inject(DestroyRef);

  protected modelData = ModelUtil.createModelSignals(this.activeRoute, this.loadModelService);

  protected companies = linkedSignal(() => this.modelData.modelContent()?.companies ?? [])

  protected tableSort = signal<Sort | undefined>(undefined)

  protected tableData = computed(() => {
    return this.companies().map((c, cindex) => {
      return {
        name: c.name,
        id: c.id,
        index: cindex,
        representatives: c.representatives.map((r, rindex) => ({ ...r, index: rindex })),
      }
    })
  })

  protected sortedTableData = computed(() => {
    const tableData = [...this.tableData()];
    const sort = this.tableSort();
    if (!sort || !sort.active || !sort.direction) {
      return tableData;
    }

    tableData.sort((a, b) => {
      const isAsc = sort.direction === "asc";
      const activeSort = sort.active as typeof this.displayedColumns[number];
      switch (activeSort) {
        case "id":
          return this.compare(a.id, b.id, isAsc)
        case "name":
          return this.compare(a.name, b.name, isAsc)
        default:
          return 0;
      }
    })

    return tableData;
  })

  protected displayedColumns = ["id", "name", "representatives"] as const;

  protected availabilityForm = new FormArray<FormArray<FormGroup<AvailabilityFormModel>>>([]);

  constructor() {
    effect(() => {
      const companies = this.companies();
      companies.forEach(c => {
        const companyFormArray = new FormArray<FormGroup<AvailabilityFormModel>>([]);
        c.representatives.forEach(r => {
          const representativeFormGroup = this.createRepresentativeFormGroup(r);

          companyFormArray.push(representativeFormGroup);
        })
        this.availabilityForm.push(companyFormArray);

      })
    })
  }


  public async saveForm(): Promise<boolean> {
    if (!this.availabilityForm.valid) {
      this.availabilityForm.markAllAsTouched();
      HtmlUtil.scrollToFirstInvalidElement();
      return false;
    }
    const fileHandle = this.modelData.fileHandle();
    if (!fileHandle) return false;

    const companies = this.getCompanySaveModels();
    if (!companies) return false;
    console.log(companies);
    const updateResult = (await this.loadModelService.update.companies(fileHandle, companies));
    if (updateResult.status !== "ok") {
      console.error(updateResult.error);
      return false;
    }
    return true;
  }

  protected onDeleteRepresentative(company: CompanyModel & { index: number }, representative: RepresentativeModel & { index: number }): void {
    this.availabilityForm.controls[company.index].removeAt(representative.index);
    company.representatives = company.representatives.splice(representative.index, 1)
    this.companies.update(cs => {
      const cs_cloned = [...cs]
      const indexToReplace = cs_cloned.findIndex(c => c.id === company.id)
      const newComp: CompanyModel = JSON.parse(JSON.stringify(cs_cloned[indexToReplace]));

      newComp.representatives.splice(representative.index, 1);
      cs_cloned[indexToReplace] = newComp
      return cs_cloned
    })
  }

  protected onAddRepresentative(company: CompanyModel & { index: number }) {
    const newRepresentativeId = company.representatives[company.representatives.length - 1].id + 1;
    const representative = this.createRepresentative(newRepresentativeId);
    const representativeFormGroup = this.createRepresentativeFormGroup(representative);
    this.companies.update(cs => {
      const cs_cloned = [...cs]
      const indexToReplace = cs_cloned.findIndex(c => c.id === company.id)
      const newComp: CompanyModel = JSON.parse(JSON.stringify(cs_cloned[indexToReplace]));
      newComp.representatives.push(representative);
      cs_cloned[indexToReplace] = newComp
      return cs_cloned
    })
    this.availabilityForm.controls[company.index].push(representativeFormGroup);
  }

  private createRepresentative(representativeId: number): RepresentativeModel {
    return {
      availability: [],
      bookings: [],
      id: representativeId,
    }
  }

  private createRepresentativeFormGroup(r: RepresentativeModel): FormGroup<AvailabilityFormModel> {
    const availability: AvailabilityModel | undefined = r.availability[0];
    const representativeFormGroup = new FormGroup<AvailabilityFormModel>({
      availableFrom: new FormControl(availability?.start ?? null, { validators: [this.validatorService.required(), this.validatorService.zodObject(AvailabilityModelSchema, "availableFrom")] }),
      availableTo: new FormControl(availability?.end ?? null, { validators: [this.validatorService.required(), this.validatorService.zodObject(AvailabilityModelSchema, "availableTo")] }),
      isAlwaysAvailable: new FormControl<boolean>(!availability, { nonNullable: true, validators: [this.validatorService.zodObject(AvailabilityModelSchema, "isAlwaysAvailable")] })
    }, {
      validators: [this.validatorService.validatorFactory("endTimeMustBeforeStartTime", (control) => {
        const formGroup = control as FormGroup<AvailabilityFormModel>;
        const start = formGroup.controls.availableFrom.getRawValue();
        const end = formGroup.controls.availableTo.getRawValue();
        const isAlwaysAvailable = formGroup.controls.isAlwaysAvailable.getRawValue();
        if (isAlwaysAvailable || !start || !end || DateParser.stringToTime(start).isBefore(DateParser.stringToTime(end))) return { status: "valid" };
        return { status: "error", message: signal('"Verfügbar ab" muss kleiner sein als "Verfügbar bis"') }
      })]
    });

    const setAvailability = (isAlwaysAvailable: boolean) => {
      if (isAlwaysAvailable) {
        representativeFormGroup.controls.availableFrom.disable();
        representativeFormGroup.controls.availableTo.disable();
      }
      else {
        representativeFormGroup.controls.availableFrom.enable();
        representativeFormGroup.controls.availableTo.enable();
      }
    }
    setAvailability(!availability)

    representativeFormGroup.controls.isAlwaysAvailable.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(setAvailability);

    return representativeFormGroup;
  }

  private compare(a: number | string, b: number | string, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

  private getCompanySaveModels(): CompanyModel[] | undefined {
    if (this.availabilityForm.status !== "VALID") {
      HtmlUtil.scrollToFirstInvalidElement();
      return;
    }

    const companies = this.companies();
    return companies.map((c, companyIndex) => {
      return {
        ...c, representatives: c.representatives.map((r, representativeIndex) => {
          const availabiltiyFormModel = this.availabilityForm.controls[companyIndex].controls[representativeIndex].getRawValue();
          const availability: AvailabilityModel[] = availabiltiyFormModel.isAlwaysAvailable ? [] : [{ start: availabiltiyFormModel.availableFrom as string, end: availabiltiyFormModel.availableTo as string }]
          return { ...r, availability: availability }
        })
      }
    })

  }
}
