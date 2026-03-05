<!-- # REFACTORING CHECKLIST & QUICK REFERENCE

Use this checklist and copy-paste templates when refactoring each admin component. -->

# Refactoring Checklist - Copy & Paste Templates

## Quick Checklist for Each Component

```
☐ Step 1: Add imports
  ☐ ValidationService
  ☐ FormErrorComponent

☐ Step 2: Update @Component decorator
  ☐ Add FormErrorComponent to imports array

☐ Step 3: Inject ValidationService
  ☐ readonly validationService = inject(ValidationService);

☐ Step 4: Update template for EACH field
  ☐ Add [ngClass]="validationService.getFieldClasses(form.get('fieldName')!)"
  ☐ Replace error div with <app-form-error> component

☐ Step 5: Update save() method
  ☐ Replace this.form.markAllAsTouched() with validationService.markAllAsTouched()
  ☐ Add validationService.scrollToFirstInvalid(this.form)

☐ Step 6: Update cancel() method
  ☐ Replace this.form.reset() with validationService.resetForm()

☐ Step 7: Delete methods
  ☐ Remove isInvalid() method entirely
  ☐ Remove getError() method entirely

☐ Step 8: Test
  ☐ Submit invalid form → errors appear
  ☐ Scroll to first invalid field works
  ☐ Cancel clears all errors
  ☐ Save with valid data works
```

---

## Copy-Paste Template Blocks

### Template Block 1: Text Input Field
Copy this for regular text inputs:

```html
<!-- REFACTORED: Text Input with Validation -->
<div>
  <label class="block text-sm font-medium">Field Name *</label>
  <input 
    formControlName="fieldName" 
    [ngClass]="validationService.getFieldClasses(form.get('fieldName')!)"
    class="mt-1 block w-full rounded-lg px-3 py-2"
  />
  <app-form-error 
    [control]="form.get('fieldName')!" 
    [fieldName]="'Field Name'"
  ></app-form-error>
</div>
```

### Template Block 2: Textarea Field
Copy this for textarea inputs:

```html
<!-- REFACTORED: Textarea with Validation -->
<div class="md:col-span-2">
  <label class="block text-sm font-medium">Field Name</label>
  <textarea 
    formControlName="fieldName" 
    [ngClass]="validationService.getFieldClasses(form.get('fieldName')!)"
    class="mt-1 block w-full rounded-lg px-3 py-2"
  ></textarea>
  <app-form-error 
    [control]="form.get('fieldName')!" 
    [fieldName]="'Field Name'"
  ></app-form-error>
</div>
```

### Template Block 3: Select/Dropdown Field
Copy this for select dropdowns:

```html
<!-- REFACTORED: Select with Validation -->
<div>
  <label class="block text-sm font-medium">Status *</label>
  <select 
    formControlName="status" 
    [ngClass]="validationService.getFieldClasses(form.get('status')!)"
    class="mt-1 block w-full rounded-lg px-3 py-2"
  >
    <option value="">Select...</option>
    <option value="OPTION1">Option 1</option>
    <option value="OPTION2">Option 2</option>
  </select>
  <app-form-error 
    [control]="form.get('status')!" 
    [fieldName]="'Status'"
  ></app-form-error>
</div>
```

### Template Block 4: Date Input Field
Copy this for date inputs:

```html
<!-- REFACTORED: Date Input with Validation -->
<div>
  <label class="block text-sm font-medium">Start Date *</label>
  <input 
    type="date" 
    formControlName="startDate" 
    [ngClass]="validationService.getFieldClasses(form.get('startDate')!)"
    class="mt-1 block w-full rounded-lg px-3 py-2"
  />
  <app-form-error 
    [control]="form.get('startDate')!" 
    [fieldName]="'Start date'"
  ></app-form-error>
</div>
```

### Template Block 5: Time Input Field
Copy this for time inputs:

```html
<!-- REFACTORED: Time Input with Validation -->
<div>
  <label class="block text-sm font-medium">Start Time *</label>
  <input 
    type="time" 
    formControlName="startTime" 
    [ngClass]="validationService.getFieldClasses(form.get('startTime')!)"
    class="mt-1 block w-full rounded-lg px-3 py-2"
  />
  <app-form-error 
    [control]="form.get('startTime')!" 
    [fieldName]="'Start time'"
  ></app-form-error>
</div>
```

### Template Block 6: Email Input Field
Copy this for email inputs:

```html
<!-- REFACTORED: Email Input with Validation -->
<div>
  <label class="block text-sm font-medium">Email *</label>
  <input 
    type="email" 
    formControlName="email" 
    [ngClass]="validationService.getFieldClasses(form.get('email')!)"
    class="mt-1 block w-full rounded-lg px-3 py-2"
  />
  <app-form-error 
    [control]="form.get('email')!" 
    [fieldName]="'Email'"
  ></app-form-error>
</div>
```

### Template Block 7: Cross-Field Error (Date Range)
Copy this for cross-field validation errors:

```html
<!-- REFACTORED: Cross-Field Error Display -->
<div *ngIf="validationService.shouldShowError(form) && form.errors?.['dateRangeInvalid']" 
  class="md:col-span-2 text-rose-600 text-sm p-2 bg-rose-50 rounded-lg border border-rose-200"
  role="alert"
>
  Start date must be before end date
</div>
```

### Template Block 8: Cross-Field Error (Time Range)
Copy this for time range validation:

```html
<!-- REFACTORED: Time Range Cross-Field Error -->
<div *ngIf="validationService.shouldShowError(form) && form.errors?.['timeRangeInvalid']" 
  class="md:col-span-2 text-rose-600 text-sm p-2 bg-rose-50 rounded-lg border border-rose-200"
  role="alert"
>
  Start time must be before end time
</div>
```

### Component Method 1: Updated save() Method
Copy this entire method:

```typescript
/**
 * REFACTORED: Uses ValidationService for centralized validation
 * - Marks all controls as touched
 * - Scrolls to first invalid field
 * - Creates/updates entity on valid form
 */
save() {
  // REFACTORED: Use ValidationService instead of form.markAllAsTouched()
  if (this.form.invalid) {
    this.validationService.markAllAsTouched(this.form);
    this.validationService.scrollToFirstInvalid(this.form);  // NEW: Auto-scroll to error
    return;
  }

  const raw = this.form.getRawValue();
  const dto: YourDtoType = {
    // Map form values to DTO
  };

  const obs = this.editingItem
    ? this.service.update(this.editingItem.id, dto)
    : this.service.create(dto);

  obs.subscribe(() => {
    this.load();
    this.cancel();
  });
}
```

### Component Method 2: Updated cancel() Method
Copy this entire method:

```typescript
/**
 * REFACTORED: Uses ValidationService for form reset
 * - Clears all values
 * - Resets all validation state (pristine/untouched)
 * - Closes editing mode
 */
cancel() {
  this.editing.set(false);
  this.editingItem = undefined;
  this.validationService.resetForm(this.form);  // REFACTORED: Centralized reset
}
```

### Component Imports: BEFORE
Copy from existing component:

```typescript
import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SomeService } from '../../api/services/some.service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { customValidator } from '../../shared/validators/custom-validators';
import { SomeIcon } from 'lucide-angular';
import { LucideAngularModule } from 'lucide-angular';
```

### Component Imports: AFTER
Replace with this:

```typescript
import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SomeService } from '../../api/services/some.service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { customValidator } from '../../shared/validators/custom-validators';
import { ValidationService } from '../../shared/services/validation.service';  // NEW
import { FormErrorComponent } from '../../shared/components/form-error.component';  // NEW
import { SomeIcon } from 'lucide-angular';
import { LucideAngularModule } from 'lucide-angular';
```

### Component Class: BEFORE
```typescript
@Component({
  selector: 'app-admin-something',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, ReactiveFormsModule],
  template: `...`
})
export class AdminSomethingComponent {
  private service = inject(SomeService);
  private fb = inject(FormBuilder);
```

### Component Class: AFTER
```typescript
@Component({
  selector: 'app-admin-something',
  standalone: true,
  imports: [
    CommonModule,
    LucideAngularModule,
    ReactiveFormsModule,
    FormErrorComponent  // NEW
  ],
  template: `...`
})
export class AdminSomethingComponent {
  private service = inject(SomeService);
  private fb = inject(FormBuilder);
  readonly validationService = inject(ValidationService);  // NEW
```

---

## Validator Configuration Templates

### FormGroup with dateRangeValidator
Copy this for date range forms:

```typescript
form = this.fb.group(
  {
    startDate: ['', Validators.required],
    endDate: ['', Validators.required],
    // ... other fields
  },
  { validators: dateRangeValidator }  // Add this
);
```

### FormGroup with timeRangeValidator
Copy this for time range forms:

```typescript
form = this.fb.group(
  {
    startTime: ['', Validators.required],
    endTime: ['', Validators.required],
    // ... other fields
  },
  { validators: timeRangeValidator }  // Add this
);
```

### FormGroup with minMaxValidator
Copy this for min/max range forms:

```typescript
form = this.fb.group(
  {
    min: ['', Validators.required],
    max: ['', Validators.required],
    // ... other fields
  },
  { validators: minMaxValidator }  // Add this
);
```

### FormControl with scoreValidator
Copy this for score fields (0-20):

```typescript
score: ['', [Validators.required, scoreValidator(0, 20)]]  // Custom range
```

### FormControl with percentageValidator
Copy this for percentage fields (0-100):

```typescript
attendance: ['', [Validators.required, percentageValidator]]
```

### FormControl with urlValidator
Copy this for URL fields:

```typescript
website: ['', [Validators.required, urlValidator]]
```

### FormControl with emailValidator
Copy this for email fields:

```typescript
email: ['', [Validators.required, emailValidator]]
```

### FormControl with phoneValidator
Copy this for phone fields:

```typescript
phone: ['', [Validators.required, phoneValidator]]
```

---

## Error Message Types Handled by ValidationService

The ValidationService.getControlError() method handles these 14+ error types automatically:

```
✓ required       → "Field name is required"
✓ minlength     → "Field name must be at least X characters"
✓ maxlength     → "Field name must not exceed X characters"
✓ email         → "Invalid email format" (or "Field Email is invalid")
✓ pattern       → "Invalid format for Field name"
✓ min           → "Field name must be at least X"
✓ max           → "Field name must not exceed X"
✓ invalidUrl    → "Invalid URL format (must start with http:// or https://)"
✓ invalidEmail  → "Invalid email format"
✓ invalidPhone  → "Invalid phone number format"
✓ invalidScore  → "Invalid score value"
✓ invalidAlphanumeric → "Invalid format (alphanumeric, hyphen, underscore only)"
✓ futureDate    → "Date must be in the future"
✓ uniqueValue   → "This value already exists"
✓ dateRangeInvalid → "Start date must be before end date" (custom in template)
✓ timeRangeInvalid → "Start time must be before end time" (custom in template)
✓ minMaxInvalid    → "Minimum must be less than maximum" (custom in template)
```

---

## Component Refactoring Order (Recommended)

**Priority 1 (Simplest - Start Here)**
1. admin-evaluations.component.ts (4-6 fields, simple validators)
2. admin-certification-rules.component.ts (4-5 fields, percentageValidator)

**Priority 2 (Medium - Next)**
3. admin-documents.component.ts (5-7 fields, urlValidator)
4. admin-certificates.component.ts (6-8 fields, mixed validators)

**Priority 3 (Complex - Last)**
5. admin-applications.component.ts (5-7 fields, URL validation)
6. admin-offers.component.ts (8-10 fields, multiple validation rules)
7. admin-events.component.ts (8-10 fields, timeRangeValidator)

---

## Estimated Refactoring Time

| Component | Fields | Est. Time | Difficulty |
|-----------|--------|-----------|-----------|
| admin-evaluations | 4-6 | 10 min | Easy |
| admin-certification-rules | 4-5 | 10 min | Easy |
| admin-documents | 5-7 | 12 min | Easy |
| admin-certificates | 6-8 | 15 min | Medium |
| admin-applications | 5-7 | 15 min | Medium |
| admin-offers | 8-10 | 20 min | Medium |
| admin-events | 8-10 | 20 min | Medium |
| **TOTAL** | **45-63** | **102 min** | --- |

**Expected average: 15 minutes per component**

---

## Validation Quick Reference

### Error Styling (Automatic via getFieldClasses)
- **Invalid:** border-rose-600, bg-rose-50
- **Valid:** border-border (gray)

### Error Animation
- Fade-in-slide-in over 200ms when error appears
- Fade-out when error is cleared

### Form Submission Flow
1. User clicks Save
2. save() checks form.invalid
3. If invalid:
   - markAllAsTouched() → marks all controls as touched
   - scrollToFirstInvalid() → auto-scroll to first error
   - return early (don't submit)
4. Errors display with animation
5. User fixes errors
6. Form becomes valid
7. User clicks Save again
8. Form submits successfully

### Cross-Field Validation Flow
1. User fills startDate: 2024-01-15
2. User fills endDate: 2024-01-10 (before startDate)
3. dateRangeValidator checks and sets form.errors['dateRangeInvalid']
4. Error message appears only after validationService.shouldShowError() is true
5. User fixes endDate: 2024-01-20
6. Form.errors['dateRangeInvalid'] is cleared
7. Error message disappears

---

## Testing Checklist for Refactored Component

After refactoring each component, verify:

```
TEMPLATE RENDERING
☐ FormErrorComponent renders error message
☐ Error message text is accurate
☐ Error message disappears when fixed
☐ Cross-field errors display correctly

INPUT STYLING
☐ Invalid inputs: rose-600 border + rose-50 background
☐ Valid inputs: normal gray border
☐ Styling updates immediately on change

FORM SUBMISSION
☐ Submit invalid form → all errors appear
☐ Page scrolls to first invalid field
☐ Submit button disabled for invalid form
☐ Submit button enabled for valid form
☐ Submit valid form → creates/updates record
☐ Success: form closes, list reloads

FORM CANCELLATION
☐ Click Cancel → form closes
☐ Form state completely reset
☐ No errors visible on next open
☐ Form has default values

USER EXPERIENCE
☐ Error messages are helpful and specific
☐ Form is easy to navigate
☐ Keyboard navigation works
☐ Mobile layout is responsive
```

---

## File Locations

```
Core Refactoring Infrastructure:
  └── src/app/
      └── shared/
          ├── services/
          │   └── validation.service.ts      (NEW - Centralized validation logic)
          ├── components/
          │   └── form-error.component.ts    (NEW - Reusable error renderer)
          └── validators/
              └── custom-validators.ts       (UPDATED - 12+ validators)

Reference Example:
  └── src/app/pages/admin/
      └── admin-internships-refactored.component.ts (Template to follow)

Documentation:
  └── REFACTORING_GUIDE.md         (Comprehensive guide)
  └── REFACTORING_TEMPLATES.md     (This file - copy-paste blocks)

Components to Refactor (8 total):
  └── src/app/pages/admin/
      ├── admin-internships.component.ts        (Skip - reference example exists)
      ├── admin-offers.component.ts             (TODO)
      ├── admin-documents.component.ts          (TODO)
      ├── admin-certificates.component.ts       (TODO)
      ├── admin-evaluations.component.ts        (TODO)
      ├── admin-applications.component.ts       (TODO)
      ├── admin-certification-rules.component.ts (TODO)
      └── admin-events.component.ts             (TODO)
```

---

## Key Differences: Before vs After

### Before Refactoring
```
- 8 isInvalid() methods (duplicated)
- 8 getError() methods (duplicated)
- 8 error <div> blocks in templates
- 8 different error styling implementations
- Manual form.markAllAsTouched() in each save()
- No auto-scroll to errors
- No centralized error messages
- Inconsistent error display logic
```

### After Refactoring
```
+ 1 ValidationService with 9 methods
+ 1 FormErrorComponent (reusable)
+ 12+ custom validators in one file
+ Consistent error styling (via getFieldClasses)
+ Centralized form state management
+ Auto-scroll to first invalid field
+ Centralized error message generation
+ Single source of truth for validation logic
+ -80 lines of code per component
+ 100% code reusability
```

---

## Common Component Structures

### Simple CRUD Component (4-6 fields)
Estimate: 10 minutes to refactor
Examples: admin-evaluations, admin-certification-rules

### Medium CRUD Component (6-8 fields)
Estimate: 15 minutes to refactor
Examples: admin-documents, admin-certificates

### Complex CRUD Component (8-10 fields)
Estimate: 20 minutes to refactor
Examples: admin-offers, admin-events

---

## Success Criteria

After completing ALL 8 component refactoring, you should have:

✅ Zero duplicated isInvalid() or getError() methods
✅ All forms using FormErrorComponent for error display
✅ All inputs using validationService.getFieldClasses()
✅ All save() methods using ValidationService methods
✅ Consistent error styling across entire admin section
✅ Auto-scroll to first error on form submission
✅ Centralized validation logic that's easy to maintain
✅ Reusable validator library with 12+ validators
✅ ~600 lines of duplicated code eliminated
✅ 100% code reusability for future forms

