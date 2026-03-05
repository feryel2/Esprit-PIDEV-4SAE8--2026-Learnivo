import {
  MatSelect,
  MatSelectModule
} from "./chunk-ESAFG6EA.js";
import {
  ConfirmDialogComponent,
  MAT_DIALOG_DATA,
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatDialog,
  MatDialogActions,
  MatDialogContent,
  MatDialogModule,
  MatDialogRef,
  MatDialogTitle,
  MatError,
  MatFormField,
  MatFormFieldModule,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatInput,
  MatInputModule,
  MatLabel,
  MatRow,
  MatRowDef,
  MatSuffix,
  MatTable,
  MatTableModule,
  MatTooltip,
  MatTooltipModule
} from "./chunk-QHPFLFO5.js";
import "./chunk-AJPN7RJV.js";
import "./chunk-YRLVTG6Q.js";
import {
  ApiService,
  MatCard,
  MatCardContent,
  MatCardModule,
  MatProgressSpinner,
  MatProgressSpinnerModule
} from "./chunk-2OTR3BIU.js";
import {
  MatIcon,
  MatIconModule
} from "./chunk-GFFSABAI.js";
import {
  MatButton,
  MatButtonModule,
  MatIconButton,
  MatOption
} from "./chunk-2S7VUNQ4.js";
import {
  DefaultValueAccessor,
  FormBuilder,
  FormControlName,
  FormGroupDirective,
  FormsModule,
  NgControlStatus,
  NgControlStatusGroup,
  NgModel,
  NgSelectOption,
  NumberValueAccessor,
  ReactiveFormsModule,
  SelectControlValueAccessor,
  Validators,
  ɵNgSelectMultipleOption
} from "./chunk-7PZ2LNBE.js";
import "./chunk-J44C53DG.js";
import {
  CommonModule,
  DatePipe,
  NgIf,
  inject,
  ɵsetClassDebugInfo,
  ɵɵStandaloneFeature,
  ɵɵadvance,
  ɵɵclassMap,
  ɵɵdefineComponent,
  ɵɵdirectiveInject,
  ɵɵelement,
  ɵɵelementContainerEnd,
  ɵɵelementContainerStart,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵgetCurrentView,
  ɵɵlistener,
  ɵɵnextContext,
  ɵɵpipe,
  ɵɵpipeBind2,
  ɵɵproperty,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵtemplate,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1,
  ɵɵtextInterpolate2,
  ɵɵtwoWayBindingSet,
  ɵɵtwoWayListener,
  ɵɵtwoWayProperty
} from "./chunk-EUR4AY6M.js";

// src/app/features/applications/application-dialog.component.ts
function ApplicationDialogComponent_mat_form_field_21_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "mat-form-field", 2)(1, "mat-label");
    \u0275\u0275text(2, "Status");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "mat-select", 11)(4, "mat-option", 12);
    \u0275\u0275text(5, "Pending");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "mat-option", 13);
    \u0275\u0275text(7, "Approved");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "mat-option", 14);
    \u0275\u0275text(9, "Rejected");
    \u0275\u0275elementEnd()()();
  }
}
var ApplicationDialogComponent = class _ApplicationDialogComponent {
  constructor(ref, data, fb) {
    this.ref = ref;
    this.data = data;
    this.fb = fb;
    this.form = this.fb.group({
      internshipId: [data?.internshipId ?? "", Validators.required],
      studentName: [data?.studentName ?? "", Validators.required],
      studentEmail: [data?.studentEmail ?? "", [Validators.required, Validators.email]],
      status: [data?.status ?? "PENDING"],
      coverLetter: [data?.coverLetter ?? ""]
    });
  }
  save() {
    if (this.form.valid)
      this.ref.close(this.form.value);
  }
  static {
    this.\u0275fac = function ApplicationDialogComponent_Factory(t) {
      return new (t || _ApplicationDialogComponent)(\u0275\u0275directiveInject(MatDialogRef), \u0275\u0275directiveInject(MAT_DIALOG_DATA), \u0275\u0275directiveInject(FormBuilder));
    };
  }
  static {
    this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _ApplicationDialogComponent, selectors: [["app-application-dialog"]], standalone: true, features: [\u0275\u0275StandaloneFeature], decls: 31, vars: 4, consts: [["mat-dialog-title", ""], [1, "dialog-form", 3, "formGroup"], ["appearance", "outline"], ["matInput", "", "type", "number", "formControlName", "internshipId"], ["matInput", "", "formControlName", "studentName"], ["matInput", "", "type", "email", "formControlName", "studentEmail"], ["appearance", "outline", 4, "ngIf"], ["matInput", "", "formControlName", "coverLetter", "rows", "4"], ["align", "end"], ["mat-button", "", 3, "click"], ["mat-flat-button", "", "color", "primary", 3, "click", "disabled"], ["formControlName", "status"], ["value", "PENDING"], ["value", "APPROVED"], ["value", "REJECTED"]], template: function ApplicationDialogComponent_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275elementStart(0, "h2", 0);
        \u0275\u0275text(1);
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(2, "mat-dialog-content", 1)(3, "mat-form-field", 2)(4, "mat-label");
        \u0275\u0275text(5, "Internship ID");
        \u0275\u0275elementEnd();
        \u0275\u0275element(6, "input", 3);
        \u0275\u0275elementStart(7, "mat-error");
        \u0275\u0275text(8, "Required");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(9, "mat-form-field", 2)(10, "mat-label");
        \u0275\u0275text(11, "Student Name");
        \u0275\u0275elementEnd();
        \u0275\u0275element(12, "input", 4);
        \u0275\u0275elementStart(13, "mat-error");
        \u0275\u0275text(14, "Required");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(15, "mat-form-field", 2)(16, "mat-label");
        \u0275\u0275text(17, "Student Email");
        \u0275\u0275elementEnd();
        \u0275\u0275element(18, "input", 5);
        \u0275\u0275elementStart(19, "mat-error");
        \u0275\u0275text(20, "Valid email required");
        \u0275\u0275elementEnd()();
        \u0275\u0275template(21, ApplicationDialogComponent_mat_form_field_21_Template, 10, 0, "mat-form-field", 6);
        \u0275\u0275elementStart(22, "mat-form-field", 2)(23, "mat-label");
        \u0275\u0275text(24, "Cover Letter");
        \u0275\u0275elementEnd();
        \u0275\u0275element(25, "textarea", 7);
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(26, "mat-dialog-actions", 8)(27, "button", 9);
        \u0275\u0275listener("click", function ApplicationDialogComponent_Template_button_click_27_listener() {
          return ctx.ref.close();
        });
        \u0275\u0275text(28, "Cancel");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(29, "button", 10);
        \u0275\u0275listener("click", function ApplicationDialogComponent_Template_button_click_29_listener() {
          return ctx.save();
        });
        \u0275\u0275text(30, "Save");
        \u0275\u0275elementEnd()();
      }
      if (rf & 2) {
        \u0275\u0275advance();
        \u0275\u0275textInterpolate1("", ctx.data ? "Edit" : "New", " Application");
        \u0275\u0275advance();
        \u0275\u0275property("formGroup", ctx.form);
        \u0275\u0275advance(19);
        \u0275\u0275property("ngIf", ctx.data);
        \u0275\u0275advance(8);
        \u0275\u0275property("disabled", ctx.form.invalid);
      }
    }, dependencies: [CommonModule, NgIf, ReactiveFormsModule, DefaultValueAccessor, NumberValueAccessor, NgControlStatus, NgControlStatusGroup, FormGroupDirective, FormControlName, MatDialogModule, MatDialogTitle, MatDialogActions, MatDialogContent, MatFormFieldModule, MatFormField, MatLabel, MatError, MatInputModule, MatInput, MatSelectModule, MatSelect, MatOption, MatButtonModule, MatButton], styles: ["\n\n.dialog-form[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 4px;\n  min-width: 420px;\n  padding-top: 12px;\n}\nmat-form-field[_ngcontent-%COMP%] {\n  width: 100%;\n}\n/*# sourceMappingURL=application-dialog.component.css.map */"] });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(ApplicationDialogComponent, { className: "ApplicationDialogComponent", filePath: "src\\app\\features\\applications\\application-dialog.component.ts", lineNumber: 54 });
})();

// src/app/features/applications/applications.component.ts
function ApplicationsComponent_div_28_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 17);
    \u0275\u0275element(1, "mat-spinner", 18);
    \u0275\u0275elementEnd();
  }
}
function ApplicationsComponent_table_29_th_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "th", 29);
    \u0275\u0275text(1, "Student");
    \u0275\u0275elementEnd();
  }
}
function ApplicationsComponent_table_29_td_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "td", 30);
    \u0275\u0275text(1);
    \u0275\u0275element(2, "br");
    \u0275\u0275elementStart(3, "small");
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const r_r1 = ctx.$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(r_r1.studentName);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(r_r1.studentEmail);
  }
}
function ApplicationsComponent_table_29_th_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "th", 29);
    \u0275\u0275text(1, "Internship");
    \u0275\u0275elementEnd();
  }
}
function ApplicationsComponent_table_29_td_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "td", 30);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    let tmp_3_0;
    const r_r2 = ctx.$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate((tmp_3_0 = r_r2.internship == null ? null : r_r2.internship.title) !== null && tmp_3_0 !== void 0 ? tmp_3_0 : "#" + r_r2.internshipId);
  }
}
function ApplicationsComponent_table_29_th_8_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "th", 29);
    \u0275\u0275text(1, "Status");
    \u0275\u0275elementEnd();
  }
}
function ApplicationsComponent_table_29_td_9_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "td", 30)(1, "span");
    \u0275\u0275text(2);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const r_r3 = ctx.$implicit;
    const ctx_r3 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275classMap(ctx_r3.statusClass(r_r3.status));
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(r_r3.status);
  }
}
function ApplicationsComponent_table_29_th_11_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "th", 29);
    \u0275\u0275text(1, "Applied At");
    \u0275\u0275elementEnd();
  }
}
function ApplicationsComponent_table_29_td_12_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "td", 30);
    \u0275\u0275text(1);
    \u0275\u0275pipe(2, "date");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const r_r5 = ctx.$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind2(2, 1, r_r5.appliedAt, "shortDate"));
  }
}
function ApplicationsComponent_table_29_th_14_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "th", 29);
    \u0275\u0275text(1, "Actions");
    \u0275\u0275elementEnd();
  }
}
function ApplicationsComponent_table_29_td_15_Template(rf, ctx) {
  if (rf & 1) {
    const _r6 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "td", 30)(1, "button", 31);
    \u0275\u0275listener("click", function ApplicationsComponent_table_29_td_15_Template_button_click_1_listener() {
      const r_r7 = \u0275\u0275restoreView(_r6).$implicit;
      const ctx_r3 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r3.setStatus(r_r7, "APPROVED"));
    });
    \u0275\u0275elementStart(2, "mat-icon");
    \u0275\u0275text(3, "check_circle");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(4, "button", 32);
    \u0275\u0275listener("click", function ApplicationsComponent_table_29_td_15_Template_button_click_4_listener() {
      const r_r7 = \u0275\u0275restoreView(_r6).$implicit;
      const ctx_r3 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r3.setStatus(r_r7, "REJECTED"));
    });
    \u0275\u0275elementStart(5, "mat-icon");
    \u0275\u0275text(6, "cancel");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(7, "button", 33);
    \u0275\u0275listener("click", function ApplicationsComponent_table_29_td_15_Template_button_click_7_listener() {
      const r_r7 = \u0275\u0275restoreView(_r6).$implicit;
      const ctx_r3 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r3.openDialog(r_r7));
    });
    \u0275\u0275elementStart(8, "mat-icon");
    \u0275\u0275text(9, "edit");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(10, "button", 34);
    \u0275\u0275listener("click", function ApplicationsComponent_table_29_td_15_Template_button_click_10_listener() {
      const r_r7 = \u0275\u0275restoreView(_r6).$implicit;
      const ctx_r3 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r3.delete(r_r7));
    });
    \u0275\u0275elementStart(11, "mat-icon");
    \u0275\u0275text(12, "delete");
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const r_r7 = ctx.$implicit;
    \u0275\u0275advance();
    \u0275\u0275property("disabled", r_r7.status === "APPROVED");
    \u0275\u0275advance(3);
    \u0275\u0275property("disabled", r_r7.status === "REJECTED");
  }
}
function ApplicationsComponent_table_29_tr_16_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "tr", 35);
  }
}
function ApplicationsComponent_table_29_tr_17_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "tr", 36);
  }
}
function ApplicationsComponent_table_29_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "table", 19);
    \u0275\u0275elementContainerStart(1, 20);
    \u0275\u0275template(2, ApplicationsComponent_table_29_th_2_Template, 2, 0, "th", 21)(3, ApplicationsComponent_table_29_td_3_Template, 5, 2, "td", 22);
    \u0275\u0275elementContainerEnd();
    \u0275\u0275elementContainerStart(4, 23);
    \u0275\u0275template(5, ApplicationsComponent_table_29_th_5_Template, 2, 0, "th", 21)(6, ApplicationsComponent_table_29_td_6_Template, 2, 1, "td", 22);
    \u0275\u0275elementContainerEnd();
    \u0275\u0275elementContainerStart(7, 24);
    \u0275\u0275template(8, ApplicationsComponent_table_29_th_8_Template, 2, 0, "th", 21)(9, ApplicationsComponent_table_29_td_9_Template, 3, 3, "td", 22);
    \u0275\u0275elementContainerEnd();
    \u0275\u0275elementContainerStart(10, 25);
    \u0275\u0275template(11, ApplicationsComponent_table_29_th_11_Template, 2, 0, "th", 21)(12, ApplicationsComponent_table_29_td_12_Template, 3, 4, "td", 22);
    \u0275\u0275elementContainerEnd();
    \u0275\u0275elementContainerStart(13, 26);
    \u0275\u0275template(14, ApplicationsComponent_table_29_th_14_Template, 2, 0, "th", 21)(15, ApplicationsComponent_table_29_td_15_Template, 13, 2, "td", 22);
    \u0275\u0275elementContainerEnd();
    \u0275\u0275template(16, ApplicationsComponent_table_29_tr_16_Template, 1, 0, "tr", 27)(17, ApplicationsComponent_table_29_tr_17_Template, 1, 0, "tr", 28);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r3 = \u0275\u0275nextContext();
    \u0275\u0275property("dataSource", ctx_r3.paged);
    \u0275\u0275advance(16);
    \u0275\u0275property("matHeaderRowDef", ctx_r3.cols);
    \u0275\u0275advance();
    \u0275\u0275property("matRowDefColumns", ctx_r3.cols);
  }
}
function ApplicationsComponent_div_30_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 37)(1, "mat-icon");
    \u0275\u0275text(2, "inbox");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "p");
    \u0275\u0275text(4, "No applications found.");
    \u0275\u0275elementEnd()();
  }
}
function ApplicationsComponent_div_31_Template(rf, ctx) {
  if (rf & 1) {
    const _r8 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 38)(1, "button", 39);
    \u0275\u0275listener("click", function ApplicationsComponent_div_31_Template_button_click_1_listener() {
      \u0275\u0275restoreView(_r8);
      const ctx_r3 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r3.page = ctx_r3.page - 1);
    });
    \u0275\u0275elementStart(2, "mat-icon");
    \u0275\u0275text(3, "chevron_left");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(4, "span");
    \u0275\u0275text(5);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "button", 39);
    \u0275\u0275listener("click", function ApplicationsComponent_div_31_Template_button_click_6_listener() {
      \u0275\u0275restoreView(_r8);
      const ctx_r3 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r3.page = ctx_r3.page + 1);
    });
    \u0275\u0275elementStart(7, "mat-icon");
    \u0275\u0275text(8, "chevron_right");
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r3 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275property("disabled", ctx_r3.page === 0);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate2("", ctx_r3.page + 1, " / ", ctx_r3.totalPages, "");
    \u0275\u0275advance();
    \u0275\u0275property("disabled", ctx_r3.page >= ctx_r3.totalPages - 1);
  }
}
var ApplicationsComponent = class _ApplicationsComponent {
  constructor() {
    this.api = inject(ApiService);
    this.dialog = inject(MatDialog);
    this.applications = [];
    this.loading = true;
    this.search = "";
    this.filterStatus = "";
    this.page = 0;
    this.pageSize = 8;
    this.totalPages = 1;
    this.cols = ["student", "internship", "status", "date", "actions"];
  }
  get paged() {
    const q = this.search.toLowerCase();
    let list = this.applications.filter((a) => (!q || a.studentName.toLowerCase().includes(q) || a.studentEmail.toLowerCase().includes(q)) && (!this.filterStatus || a.status === this.filterStatus));
    this.totalPages = Math.max(1, Math.ceil(list.length / this.pageSize));
    if (this.page >= this.totalPages)
      this.page = 0;
    return list.slice(this.page * this.pageSize, (this.page + 1) * this.pageSize);
  }
  ngOnInit() {
    this.load();
  }
  load() {
    this.loading = true;
    this.api.listApplications().subscribe({ next: (d) => {
      this.applications = d;
      this.loading = false;
    }, error: () => {
      this.loading = false;
    } });
  }
  statusClass(s) {
    return `chip chip-${s.toLowerCase()}`;
  }
  setStatus(item, status) {
    this.api.updateApplication(item.id, { status }).subscribe(() => this.load());
  }
  openDialog(item) {
    this.dialog.open(ApplicationDialogComponent, { data: item ?? null, width: "500px" }).afterClosed().subscribe((v) => {
      if (!v)
        return;
      const obs = item ? this.api.updateApplication(item.id, v) : this.api.createApplication(v);
      obs.subscribe(() => this.load());
    });
  }
  delete(item) {
    this.dialog.open(ConfirmDialogComponent, { data: { title: "Delete Application", message: `Delete application from "${item.studentName}"?` } }).afterClosed().subscribe((ok) => {
      if (ok)
        this.api.deleteApplication(item.id).subscribe(() => this.load());
    });
  }
  static {
    this.\u0275fac = function ApplicationsComponent_Factory(t) {
      return new (t || _ApplicationsComponent)();
    };
  }
  static {
    this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _ApplicationsComponent, selectors: [["app-applications"]], standalone: true, features: [\u0275\u0275StandaloneFeature], decls: 32, vars: 6, consts: [[1, "page-header"], [1, "page-title"], ["mat-raised-button", "", "color", "primary", 3, "click"], [1, "toolbar"], ["appearance", "outline", 1, "search-field"], ["matInput", "", "placeholder", "student name or email\u2026", 3, "ngModelChange", "ngModel"], ["matSuffix", ""], ["appearance", "outline", 1, "filter-field"], ["matNativeControl", "", 3, "ngModelChange", "ngModel"], ["value", ""], ["value", "PENDING"], ["value", "APPROVED"], ["value", "REJECTED"], ["class", "spinner-center", 4, "ngIf"], ["mat-table", "", "class", "full-table", 3, "dataSource", 4, "ngIf"], ["class", "empty-state", 4, "ngIf"], ["class", "pagination", 4, "ngIf"], [1, "spinner-center"], ["diameter", "40"], ["mat-table", "", 1, "full-table", 3, "dataSource"], ["matColumnDef", "student"], ["mat-header-cell", "", 4, "matHeaderCellDef"], ["mat-cell", "", 4, "matCellDef"], ["matColumnDef", "internship"], ["matColumnDef", "status"], ["matColumnDef", "date"], ["matColumnDef", "actions"], ["mat-header-row", "", 4, "matHeaderRowDef"], ["mat-row", "", 4, "matRowDef", "matRowDefColumns"], ["mat-header-cell", ""], ["mat-cell", ""], ["mat-icon-button", "", "color", "primary", "matTooltip", "Approve", 3, "click", "disabled"], ["mat-icon-button", "", "color", "warn", "matTooltip", "Reject", 3, "click", "disabled"], ["mat-icon-button", "", "matTooltip", "Edit", 3, "click"], ["mat-icon-button", "", "color", "warn", "matTooltip", "Delete", 3, "click"], ["mat-header-row", ""], ["mat-row", ""], [1, "empty-state"], [1, "pagination"], ["mat-icon-button", "", 3, "click", "disabled"]], template: function ApplicationsComponent_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275elementStart(0, "div", 0)(1, "h1", 1);
        \u0275\u0275text(2, "Applications");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(3, "button", 2);
        \u0275\u0275listener("click", function ApplicationsComponent_Template_button_click_3_listener() {
          return ctx.openDialog();
        });
        \u0275\u0275elementStart(4, "mat-icon");
        \u0275\u0275text(5, "add");
        \u0275\u0275elementEnd();
        \u0275\u0275text(6, " New Application");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(7, "mat-card")(8, "mat-card-content")(9, "div", 3)(10, "mat-form-field", 4)(11, "mat-label");
        \u0275\u0275text(12, "Search");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(13, "input", 5);
        \u0275\u0275twoWayListener("ngModelChange", function ApplicationsComponent_Template_input_ngModelChange_13_listener($event) {
          \u0275\u0275twoWayBindingSet(ctx.search, $event) || (ctx.search = $event);
          return $event;
        });
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(14, "mat-icon", 6);
        \u0275\u0275text(15, "search");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(16, "mat-form-field", 7)(17, "mat-label");
        \u0275\u0275text(18, "Status");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(19, "select", 8);
        \u0275\u0275twoWayListener("ngModelChange", function ApplicationsComponent_Template_select_ngModelChange_19_listener($event) {
          \u0275\u0275twoWayBindingSet(ctx.filterStatus, $event) || (ctx.filterStatus = $event);
          return $event;
        });
        \u0275\u0275elementStart(20, "option", 9);
        \u0275\u0275text(21, "All");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(22, "option", 10);
        \u0275\u0275text(23, "Pending");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(24, "option", 11);
        \u0275\u0275text(25, "Approved");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(26, "option", 12);
        \u0275\u0275text(27, "Rejected");
        \u0275\u0275elementEnd()()()();
        \u0275\u0275template(28, ApplicationsComponent_div_28_Template, 2, 0, "div", 13)(29, ApplicationsComponent_table_29_Template, 18, 3, "table", 14)(30, ApplicationsComponent_div_30_Template, 5, 0, "div", 15)(31, ApplicationsComponent_div_31_Template, 9, 4, "div", 16);
        \u0275\u0275elementEnd()();
      }
      if (rf & 2) {
        \u0275\u0275advance(13);
        \u0275\u0275twoWayProperty("ngModel", ctx.search);
        \u0275\u0275advance(6);
        \u0275\u0275twoWayProperty("ngModel", ctx.filterStatus);
        \u0275\u0275advance(9);
        \u0275\u0275property("ngIf", ctx.loading);
        \u0275\u0275advance();
        \u0275\u0275property("ngIf", !ctx.loading);
        \u0275\u0275advance();
        \u0275\u0275property("ngIf", !ctx.loading && ctx.paged.length === 0);
        \u0275\u0275advance();
        \u0275\u0275property("ngIf", ctx.totalPages > 1);
      }
    }, dependencies: [CommonModule, NgIf, DatePipe, FormsModule, NgSelectOption, \u0275NgSelectMultipleOption, DefaultValueAccessor, SelectControlValueAccessor, NgControlStatus, NgModel, MatCardModule, MatCard, MatCardContent, MatTableModule, MatTable, MatHeaderCellDef, MatHeaderRowDef, MatColumnDef, MatCellDef, MatRowDef, MatHeaderCell, MatCell, MatHeaderRow, MatRow, MatButtonModule, MatButton, MatIconButton, MatIconModule, MatIcon, MatInputModule, MatInput, MatFormField, MatLabel, MatSuffix, MatFormFieldModule, MatTooltipModule, MatTooltip, MatProgressSpinnerModule, MatProgressSpinner], styles: ["\n\n.page-header[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  margin-bottom: 20px;\n}\n.page-title[_ngcontent-%COMP%] {\n  font-size: 1.6rem;\n  font-weight: 600;\n  color: #311b92;\n  margin: 0;\n}\n.toolbar[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 16px;\n  flex-wrap: wrap;\n  margin-bottom: 12px;\n}\n.search-field[_ngcontent-%COMP%] {\n  flex: 1;\n  min-width: 200px;\n}\n.filter-field[_ngcontent-%COMP%] {\n  width: 160px;\n}\n.full-table[_ngcontent-%COMP%] {\n  width: 100%;\n}\n.spinner-center[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: center;\n  padding: 40px;\n}\n.empty-state[_ngcontent-%COMP%] {\n  text-align: center;\n  padding: 40px;\n  color: #999;\n  mat-icon {\n    font-size: 3rem;\n    width: 3rem;\n    height: 3rem;\n  }\n}\n.pagination[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: flex-end;\n  gap: 8px;\n  margin-top: 12px;\n}\n.chip[_ngcontent-%COMP%] {\n  padding: 3px 10px;\n  border-radius: 12px;\n  font-size: .78rem;\n  font-weight: 600;\n}\n.chip-approved[_ngcontent-%COMP%] {\n  background: #d1fae5;\n  color: #065f46;\n}\n.chip-pending[_ngcontent-%COMP%] {\n  background: #fef3c7;\n  color: #92400e;\n}\n.chip-rejected[_ngcontent-%COMP%] {\n  background: #fee2e2;\n  color: #991b1b;\n}\nsmall[_ngcontent-%COMP%] {\n  color: #888;\n  font-size: .75rem;\n}\n/*# sourceMappingURL=applications.component.css.map */"] });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(ApplicationsComponent, { className: "ApplicationsComponent", filePath: "src\\app\\features\\applications\\applications.component.ts", lineNumber: 98 });
})();
export {
  ApplicationsComponent
};
//# sourceMappingURL=chunk-IDLWATZ7.js.map
