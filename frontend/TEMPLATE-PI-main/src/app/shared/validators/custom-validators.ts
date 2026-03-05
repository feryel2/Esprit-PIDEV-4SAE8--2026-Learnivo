import { AbstractControl, FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';

/**
 * Enterprise-grade custom validators for reactive forms
 * Centralized validation logic for reusability across the application
 */

/**
 * Validates URL format (must start with http:// or https://)
 * Usage: formControl = new FormControl('', urlValidator)
 */
export const urlValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  if (!control.value) return null;
  const urlPattern = /^https?:\/\/.+/i;
  return urlPattern.test(control.value) ? null : { invalidUrl: true };
};

/**
 * Validates email format
 * Usage: formControl = new FormControl('', emailValidator)
 */
export const emailValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  if (!control.value) return null;
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailPattern.test(control.value) ? null : { invalidEmail: true };
};

/**
 * Cross-field validator: ensures startDate <= endDate
 * Usage: form = fb.group({...}, { validators: dateRangeValidator })
 */
export const dateRangeValidator: ValidatorFn = (formGroup: AbstractControl): ValidationErrors | null => {
  const start = formGroup.get('startDate')?.value;
  const end = formGroup.get('endDate')?.value;

  if (!start || !end) return null;

  const startDate = new Date(start);
  const endDate = new Date(end);

  return startDate <= endDate ? null : { dateRangeInvalid: true };
};

/**
 * Cross-field validator: ensures startTime <= endTime
 * Usage: form = fb.group({...}, { validators: timeRangeValidator })
 */
export const timeRangeValidator: ValidatorFn = (formGroup: AbstractControl): ValidationErrors | null => {
  const start = formGroup.get('startTime')?.value;
  const end = formGroup.get('endTime')?.value;

  if (!start || !end) return null;

  const startTime = new Date(start);
  const endTime = new Date(end);

  return startTime <= endTime ? null : { timeRangeInvalid: true };
};

/**
 * Cross-field validator: ensures min <= max for numeric ranges
 * Usage: form = fb.group({...}, { validators: minMaxValidator })
 */
export const minMaxValidator: ValidatorFn = (formGroup: AbstractControl): ValidationErrors | null => {
  const min = formGroup.get('min')?.value;
  const max = formGroup.get('max')?.value;

  if (min === undefined || max === undefined || min === null || max === null) {
    return null;
  }

  return Number(min) <= Number(max) ? null : { minMaxInvalid: true };
};

/**
 * Validates that a date is in the future
 * Usage: formControl = new FormControl('', futureDateValidator)
 */
export const futureDateValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  if (!control.value) return null;

  const selectedDate = new Date(control.value);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return selectedDate > today ? null : { futureDate: true };
};

/**
 * Validates score is between 0 and 20 (typical grading scale)
 * Usage: formControl = new FormControl('', scoreValidator(0, 20))
 */
export const scoreValidator = (min: number = 0, max: number = 20): ValidatorFn => {
  return (control: AbstractControl): ValidationErrors | null => {
    if (control.value === null || control.value === undefined || control.value === '') {
      return null;
    }

    const score = Number(control.value);
    if (isNaN(score)) return { invalidScore: true };

    return score >= min && score <= max ? null : { invalidScore: true };
  };
};

/**
 * Validates percentage is between 0 and 100
 * Usage: formControl = new FormControl('', percentageValidator)
 */
export const percentageValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  if (control.value === null || control.value === undefined || control.value === '') {
    return null;
  }

  const value = Number(control.value);
  if (isNaN(value)) return { invalidAttendance: true };

  return value >= 0 && value <= 100 ? null : { invalidAttendance: true };
};

/**
 * Validates unique value against a list (for checking duplicates)
 * Usage: formControl = new FormControl('', uniqueValueValidator(['existing1', 'existing2']))
 */
export const uniqueValueValidator = (
  existingValues: string[]
): ValidatorFn => {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) return null;

    return existingValues.includes(control.value.toLowerCase())
      ? { uniqueValue: true }
      : null;
  };
};

/**
 * Validates phone number format (international)
 * Usage: formControl = new FormControl('', phoneValidator)
 */
export const phoneValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  if (!control.value) return null;

  const phonePattern = /^[+]?[(]?[0-9]{3}[)]?[-\s]?[0-9]{3}[-\s]?[0-9]{4,6}$/;
  return phonePattern.test(control.value) ? null : { invalidPhone: true };
};

/**
 * Validates alphanumeric with optional hyphens and underscores
 * Usage: formControl = new FormControl('', alphanumericValidator)
 */
export const alphanumericValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  if (!control.value) return null;

  const pattern = /^[a-zA-Z0-9_-]+$/;
  return pattern.test(control.value) ? null : { invalidAlphanumeric: true };
};

/**
 * Conditional validator: validates only if control value is not null/empty
 * Usage: fb.control('', conditionalValidator(Validators.required))
 */
export const conditionalValidator = (validator: ValidatorFn): ValidatorFn => {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) return null;
    return validator(control);
  };
};
