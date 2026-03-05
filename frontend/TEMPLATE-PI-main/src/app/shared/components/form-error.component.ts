import { Component, Input, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl } from '@angular/forms';
import { ValidationService } from '../services/validation.service';

/**
 * Reusable error message component for form controls
 * Automatically displays error messages for invalid controls
 * Eliminates duplicated error rendering logic in admin components
 */
@Component({
  selector: 'app-form-error',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div 
      *ngIf="control && validationService.shouldShowError(control)"
      class="text-rose-600 text-sm mt-1 animate-in fade-in slide-in-from-top-1 duration-200"
      role="alert"
    >
      {{ validationService.getControlError(control) }}
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
      }
      @keyframes fadeInSlide {
        from {
          opacity: 0;
          transform: translateY(-4px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
    `
  ]
})
export class FormErrorComponent implements OnInit {
  @Input() control: AbstractControl | null = null;
  @Input() fieldName?: string;

  validationService = inject(ValidationService);

  ngOnInit(): void {
    if (!this.control) {
      console.warn(
        'FormErrorComponent: control input is required'
      );
    }
  }
}
