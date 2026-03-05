import { Injectable } from '@angular/core';
import { AbstractControl, FormGroup, ValidationErrors } from '@angular/forms';

/**
 * Centralized validation service for reactive forms
 * Handles error messages, form state, and UX interactions
 */
@Injectable({ providedIn: 'root' })
export class ValidationService {
  /**
   * Get human-readable error message for a control
   */
  getControlError(control: AbstractControl | null): string | null {
    if (!control || !control.errors) return null;

    const errors = control.errors;

    // Standard validators
    if (errors['required']) return 'This field is required';
    if (errors['minlength']) return `Minimum ${errors['minlength'].requiredLength} characters`;
    if (errors['maxlength']) return `Maximum ${errors['maxlength'].requiredLength} characters`;
    if (errors['email']) return 'Invalid email format';
    if (errors['pattern']) return 'Invalid format';
    if (errors['min']) return `Value must be at least ${errors['min'].min}`;
    if (errors['max']) return `Value must not exceed ${errors['max'].max}`;

    // Custom validators
    if (errors['invalidUrl']) return 'URL must start with http:// or https://';
    if (errors['dateRangeInvalid']) return 'Start date must be before end date';
    if (errors['timeRangeInvalid']) return 'Start time must be before end time';
    if (errors['minMaxInvalid']) return 'Minimum value must be less than maximum';
    if (errors['futureDate']) return 'Date must be in the future';
    if (errors['invalidScore']) return 'Score must be between 0 and 20';
    if (errors['invalidAttendance']) return 'Attendance rate must be between 0 and 100';
    if (errors['uniqueValue']) return 'This value already exists';

    return 'Invalid value';
  }

  /**
   * Check if control should display error (invalid && (touched || dirty))
   */
  shouldShowError(control: AbstractControl | null): boolean {
    if (!control) return false;
    return !!(control.invalid && (control.dirty || control.touched));
  }

  /**
   * Mark all form controls as touched to show errors
   */
  markAllAsTouched(form: FormGroup): void {
    Object.keys(form.controls).forEach(key => {
      const control = form.get(key);
      control?.markAsTouched();
      control?.markAsDirty();

      if (control instanceof FormGroup) {
        this.markAllAsTouched(control);
      }
    });
  }

  /**
   * Get first invalid control in form
   */
  getFirstInvalidControl(form: FormGroup): AbstractControl | null {
    for (const key in form.controls) {
      const control = form.get(key);
      if (control?.invalid) {
        return control;
      }
      if (control instanceof FormGroup) {
        const invalid = this.getFirstInvalidControl(control);
        if (invalid) return invalid;
      }
    }
    return null;
  }

  /**
   * Auto-focus first invalid control
   */
  focusFirstInvalid(form: FormGroup): void {
    const firstInvalid = this.getFirstInvalidControl(form);
    if (firstInvalid) {
      const inputElement = document.querySelector(
        `[formControlName="${this.getControlName(form, firstInvalid)}"]`
      ) as HTMLElement;

      if (inputElement) {
        inputElement.focus();
        inputElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }

  /**
   * Auto-scroll to first invalid field
   */
  scrollToFirstInvalid(form: FormGroup): void {
    const firstInvalid = this.getFirstInvalidControl(form);
    if (firstInvalid) {
      const controlName = this.getControlName(form, firstInvalid);
      const inputElement = document.querySelector(
        `[formControlName="${controlName}"]`
      ) as HTMLElement;

      if (inputElement) {
        inputElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        inputElement.classList.add('ring-2', 'ring-rose-600');
        setTimeout(() => {
          inputElement.classList.remove('ring-2', 'ring-rose-600');
        }, 1000);
      }
    }
  }

  /**
   * Get control name from form (internal helper)
   */
  private getControlName(form: FormGroup, control: AbstractControl): string {
    for (const key in form.controls) {
      if (form.get(key) === control) {
        return key;
      }
    }
    return '';
  }

  /**
   * Validate entire form and return error summary
   */
  getFormErrorSummary(form: FormGroup): string[] {
    const errors: string[] = [];
    Object.keys(form.controls).forEach(key => {
      const control = form.get(key);
      const error = this.getControlError(control);
      if (error) {
        errors.push(`${this.formatFieldName(key)}: ${error}`);
      }
    });
    return errors;
  }

  /**
   * Format control name for display (camelCase → Title Case)
   */
  private formatFieldName(name: string): string {
    return name
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      .trim();
  }

  /**
   * Reset form validation state
   */
  resetForm(form: FormGroup): void {
    form.reset();
    Object.keys(form.controls).forEach(key => {
      const control = form.get(key);
      control?.setErrors(null);
      control?.markAsUntouched();
      control?.markAsPristine();
    });
  }

  /**
   * Apply Tailwind error styling to field
   */
  getFieldClasses(control: AbstractControl | null): string {
    const baseClasses = 'mt-1 block w-full rounded-lg border px-3 py-2';
    const hasError = control?.invalid && (control?.dirty || control?.touched);

    if (hasError) {
      return `${baseClasses} border-rose-600 bg-rose-50 text-rose-900 placeholder:text-rose-400`;
    }

    return `${baseClasses} border-border`;
  }
}
