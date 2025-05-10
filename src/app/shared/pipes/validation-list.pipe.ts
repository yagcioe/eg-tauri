import { Pipe, PipeTransform } from '@angular/core';
import { ValidationErrors } from '@angular/forms';
import { InvalidValidationResult } from '../services/validator.service';

@Pipe({
  name: 'validationList',
  pure: true
})
export class ValidationListPipe implements PipeTransform {

  public transform(errors: ValidationErrors | null, ...args: unknown[]) {

    if (errors === null) return [];
    const entries = Object.entries(errors);
    if (entries.length === null) return [];

    const parsedErrors = entries.map(e =>
      InvalidValidationResult.safeParse(e[1])
    )
    return parsedErrors.filter(e => e.success).map(e => e.data.message)
  }

}
