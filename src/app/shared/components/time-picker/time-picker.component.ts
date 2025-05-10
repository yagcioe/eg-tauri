import { Component, forwardRef, input, signal, viewChild } from '@angular/core';
import { ControlValueAccessor, FormControl, FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { MatFormField, MatInputModule } from '@angular/material/input';
import moment from 'moment';
import { NgxMaterialTimepickerComponent, NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { ValidationListPipe } from "../../pipes/validation-list.pipe";

@Component({
  selector: 'app-time-picker',
  imports: [MatFormField, NgxMaterialTimepickerModule, MatInputModule, ReactiveFormsModule, FormsModule, ValidationListPipe],
  templateUrl: './time-picker.component.html',
  styleUrl: './time-picker.component.scss',
})
export class TimePickerComponent {
  public label = input.required<string>();
  public control = input.required<FormControl<string | null>>()
}
