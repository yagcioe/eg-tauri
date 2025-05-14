import { Injectable, signal } from '@angular/core';
import { AbstractControl, ValidatorFn } from '@angular/forms';
import { z } from 'zod';
import { zodSignal } from '../utils/zod-angular-interop';
import { fromError } from 'zod-validation-error';

export const InvalidValidationResult = z.object({
  status: z.union([z.literal("error"), z.literal("warning")]),
  message: zodSignal(z.string())
})

type ValidationResult = z.infer<typeof InvalidValidationResult> | {
  status: "valid";
};

@Injectable({
  providedIn: 'root'
})
export class ValidatorService {

  public required(): ValidatorFn {
    return this.validatorFactory("required", (control) => {
      const value = control.value;
      if (value === null || value === undefined || value === "" || (Array.isArray(value) && value.length === 0)) {
        return { status: "error", message: signal("Dieses Feld ist erforderlich") }
      }

      return { status: "valid" };
    })
  }

  public zodObject<T extends z.ZodRawShape>(schema: z.ZodObject<T>, validationErrorKey: string & keyof T,): ValidatorFn {
    return this.zod(validationErrorKey, schema.shape[validationErrorKey])
  }

  public zod(validationErrorKey: string, schema: z.Schema): ValidatorFn {
    return this.validatorFactory(validationErrorKey, (control: AbstractControl) => {
      const parseResult = schema.safeParse(control.getRawValue());
      if (!parseResult.success) {
        return {
          status: "error", message: signal(fromError(parseResult.error, {
            prefix: null,
          }).message)
        }
      }

      return { status: "valid" }
    })
  }

  public validatorFactory(validationErrorKey: string, predicate: (control: AbstractControl) => ValidationResult): ValidatorFn {
    const validator = (control: AbstractControl) => {

      const validationResult = predicate(control);
      if (validationResult.status === "valid") return null;

      return { [validationErrorKey]: validationResult }
    }

    return validator
  }
}
