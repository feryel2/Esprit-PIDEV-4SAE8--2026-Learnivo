import {
  RouterLink
} from "./chunk-I4WURJ7J.js";
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
  signal,
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
  ɵɵsanitizeUrl,
  ɵɵtemplate,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1,
  ɵɵtextInterpolate2,
  ɵɵtwoWayBindingSet,
  ɵɵtwoWayListener,
  ɵɵtwoWayProperty
} from "./chunk-EUR4AY6M.js";

// src/app/features/certificates/certificate-dialog.component.ts
var CertificateDialogComponent = class _CertificateDialogComponent {
  constructor(ref, data, fb) {
    this.ref = ref;
    this.data = data;
    this.fb = fb;
    this.form = this.fb.group({
      studentName: [data?.studentName ?? "", Validators.required],
      certificateNumber: [data?.certificateNumber ?? "", Validators.required],
      type: [data?.type ?? "INTERNSHIP", Validators.required],
      issuedAt: [data?.issuedAt ?? "", Validators.required],
      internshipId: [data?.internshipId ?? null]
    });
  }
  save() {
    if (this.form.valid)
      this.ref.close(this.form.value);
  }
  static {
    this.\u0275fac = function CertificateDialogComponent_Factory(t) {
      return new (t || _CertificateDialogComponent)(\u0275\u0275directiveInject(MatDialogRef), \u0275\u0275directiveInject(MAT_DIALOG_DATA), \u0275\u0275directiveInject(FormBuilder));
    };
  }
  static {
    this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _CertificateDialogComponent, selectors: [["app-certificate-dialog"]], standalone: true, features: [\u0275\u0275StandaloneFeature], decls: 42, vars: 3, consts: [["mat-dialog-title", ""], [1, "dialog-form", 3, "formGroup"], ["appearance", "outline"], ["matInput", "", "formControlName", "studentName"], ["matInput", "", "formControlName", "certificateNumber"], ["formControlName", "type"], ["value", "INTERNSHIP"], ["value", "TRAINING"], ["value", "COMPLETION"], ["matInput", "", "type", "date", "formControlName", "issuedAt"], ["matInput", "", "type", "number", "formControlName", "internshipId"], ["align", "end"], ["mat-button", "", 3, "click"], ["mat-flat-button", "", "color", "primary", 3, "click", "disabled"]], template: function CertificateDialogComponent_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275elementStart(0, "h2", 0);
        \u0275\u0275text(1);
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(2, "mat-dialog-content", 1)(3, "mat-form-field", 2)(4, "mat-label");
        \u0275\u0275text(5, "Student Name");
        \u0275\u0275elementEnd();
        \u0275\u0275element(6, "input", 3);
        \u0275\u0275elementStart(7, "mat-error");
        \u0275\u0275text(8, "Required");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(9, "mat-form-field", 2)(10, "mat-label");
        \u0275\u0275text(11, "Certificate Number");
        \u0275\u0275elementEnd();
        \u0275\u0275element(12, "input", 4);
        \u0275\u0275elementStart(13, "mat-error");
        \u0275\u0275text(14, "Required");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(15, "mat-form-field", 2)(16, "mat-label");
        \u0275\u0275text(17, "Type");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(18, "mat-select", 5)(19, "mat-option", 6);
        \u0275\u0275text(20, "Internship");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(21, "mat-option", 7);
        \u0275\u0275text(22, "Training");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(23, "mat-option", 8);
        \u0275\u0275text(24, "Completion");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(25, "mat-error");
        \u0275\u0275text(26, "Required");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(27, "mat-form-field", 2)(28, "mat-label");
        \u0275\u0275text(29, "Issued At");
        \u0275\u0275elementEnd();
        \u0275\u0275element(30, "input", 9);
        \u0275\u0275elementStart(31, "mat-error");
        \u0275\u0275text(32, "Required");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(33, "mat-form-field", 2)(34, "mat-label");
        \u0275\u0275text(35, "Internship ID (optional)");
        \u0275\u0275elementEnd();
        \u0275\u0275element(36, "input", 10);
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(37, "mat-dialog-actions", 11)(38, "button", 12);
        \u0275\u0275listener("click", function CertificateDialogComponent_Template_button_click_38_listener() {
          return ctx.ref.close();
        });
        \u0275\u0275text(39, "Cancel");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(40, "button", 13);
        \u0275\u0275listener("click", function CertificateDialogComponent_Template_button_click_40_listener() {
          return ctx.save();
        });
        \u0275\u0275text(41, "Save");
        \u0275\u0275elementEnd()();
      }
      if (rf & 2) {
        \u0275\u0275advance();
        \u0275\u0275textInterpolate1("", ctx.data ? "Edit" : "Issue", " Certificate");
        \u0275\u0275advance();
        \u0275\u0275property("formGroup", ctx.form);
        \u0275\u0275advance(38);
        \u0275\u0275property("disabled", ctx.form.invalid);
      }
    }, dependencies: [CommonModule, ReactiveFormsModule, DefaultValueAccessor, NumberValueAccessor, NgControlStatus, NgControlStatusGroup, FormGroupDirective, FormControlName, MatDialogModule, MatDialogTitle, MatDialogActions, MatDialogContent, MatFormFieldModule, MatFormField, MatLabel, MatError, MatInputModule, MatInput, MatSelectModule, MatSelect, MatOption, MatButtonModule, MatButton], styles: ["\n\n.dialog-form[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 4px;\n  min-width: 420px;\n  padding-top: 12px;\n}\nmat-form-field[_ngcontent-%COMP%] {\n  width: 100%;\n}\n/*# sourceMappingURL=certificate-dialog.component.css.map */"] });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(CertificateDialogComponent, { className: "CertificateDialogComponent", filePath: "src\\app\\features\\certificates\\certificate-dialog.component.ts", lineNumber: 55 });
})();

// src/app/features/certificates/certificates.component.ts
function CertificatesComponent_div_49_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 26);
    \u0275\u0275element(1, "mat-spinner", 27);
    \u0275\u0275elementEnd();
  }
}
function CertificatesComponent_div_50_th_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "th", 41);
    \u0275\u0275text(1, "Student");
    \u0275\u0275elementEnd();
  }
}
function CertificatesComponent_div_50_td_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "td", 42);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const r_r1 = ctx.$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(r_r1.studentName);
  }
}
function CertificatesComponent_div_50_th_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "th", 41);
    \u0275\u0275text(1, "Certificate #");
    \u0275\u0275elementEnd();
  }
}
function CertificatesComponent_div_50_td_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "td", 42)(1, "code", 43);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const r_r2 = ctx.$implicit;
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(r_r2.certificateNumber);
  }
}
function CertificatesComponent_div_50_th_9_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "th", 41);
    \u0275\u0275text(1, "Verification Code");
    \u0275\u0275elementEnd();
  }
}
function CertificatesComponent_div_50_td_10_span_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "span", 46)(1, "code", 47);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "button", 48);
    \u0275\u0275listener("click", function CertificatesComponent_div_50_td_10_span_1_Template_button_click_3_listener() {
      \u0275\u0275restoreView(_r3);
      const r_r4 = \u0275\u0275nextContext().$implicit;
      const ctx_r4 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r4.copyCode(r_r4.verificationCode));
    });
    \u0275\u0275elementStart(4, "mat-icon", 49);
    \u0275\u0275text(5, "content_copy");
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const r_r4 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(r_r4.verificationCode);
  }
}
function CertificatesComponent_div_50_td_10_span_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 50);
    \u0275\u0275text(1, "\u2014");
    \u0275\u0275elementEnd();
  }
}
function CertificatesComponent_div_50_td_10_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "td", 42);
    \u0275\u0275template(1, CertificatesComponent_div_50_td_10_span_1_Template, 6, 1, "span", 44)(2, CertificatesComponent_div_50_td_10_span_2_Template, 2, 0, "span", 45);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const r_r4 = ctx.$implicit;
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", r_r4.verificationCode);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", !r_r4.verificationCode);
  }
}
function CertificatesComponent_div_50_th_12_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "th", 41);
    \u0275\u0275text(1, "Type");
    \u0275\u0275elementEnd();
  }
}
function CertificatesComponent_div_50_td_13_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "td", 42)(1, "span");
    \u0275\u0275text(2);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const r_r6 = ctx.$implicit;
    const ctx_r4 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275classMap(ctx_r4.typeClass(r_r6.type));
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(r_r6.type);
  }
}
function CertificatesComponent_div_50_th_15_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "th", 41);
    \u0275\u0275text(1, "Status");
    \u0275\u0275elementEnd();
  }
}
function CertificatesComponent_div_50_td_16_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "td", 42)(1, "span");
    \u0275\u0275text(2);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const r_r7 = ctx.$implicit;
    const ctx_r4 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275classMap(ctx_r4.statusClass(r_r7.status));
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(r_r7.status);
  }
}
function CertificatesComponent_div_50_th_18_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "th", 41);
    \u0275\u0275text(1, "Issued At");
    \u0275\u0275elementEnd();
  }
}
function CertificatesComponent_div_50_td_19_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "td", 42);
    \u0275\u0275text(1);
    \u0275\u0275pipe(2, "date");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const r_r8 = ctx.$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind2(2, 1, r_r8.issuedAt, "shortDate"));
  }
}
function CertificatesComponent_div_50_th_21_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "th", 41);
    \u0275\u0275text(1, "Actions");
    \u0275\u0275elementEnd();
  }
}
function CertificatesComponent_div_50_td_22_Template(rf, ctx) {
  if (rf & 1) {
    const _r9 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "td", 42)(1, "button", 51);
    \u0275\u0275listener("click", function CertificatesComponent_div_50_td_22_Template_button_click_1_listener() {
      const r_r10 = \u0275\u0275restoreView(_r9).$implicit;
      const ctx_r4 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r4.openDialog(r_r10));
    });
    \u0275\u0275elementStart(2, "mat-icon");
    \u0275\u0275text(3, "edit");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(4, "button", 52);
    \u0275\u0275listener("click", function CertificatesComponent_div_50_td_22_Template_button_click_4_listener() {
      const r_r10 = \u0275\u0275restoreView(_r9).$implicit;
      const ctx_r4 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r4.downloadPdf(r_r10));
    });
    \u0275\u0275elementStart(5, "mat-icon");
    \u0275\u0275text(6, "download");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(7, "button", 53);
    \u0275\u0275listener("click", function CertificatesComponent_div_50_td_22_Template_button_click_7_listener() {
      const r_r10 = \u0275\u0275restoreView(_r9).$implicit;
      const ctx_r4 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r4.showQr(r_r10));
    });
    \u0275\u0275elementStart(8, "mat-icon");
    \u0275\u0275text(9, "qr_code");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(10, "button", 54);
    \u0275\u0275listener("click", function CertificatesComponent_div_50_td_22_Template_button_click_10_listener() {
      const r_r10 = \u0275\u0275restoreView(_r9).$implicit;
      const ctx_r4 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r4.delete(r_r10));
    });
    \u0275\u0275elementStart(11, "mat-icon");
    \u0275\u0275text(12, "delete");
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const r_r10 = ctx.$implicit;
    \u0275\u0275advance(7);
    \u0275\u0275property("disabled", !r_r10.verificationCode);
  }
}
function CertificatesComponent_div_50_tr_23_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "tr", 55);
  }
}
function CertificatesComponent_div_50_tr_24_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "tr", 56);
  }
}
function CertificatesComponent_div_50_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 28)(1, "table", 29);
    \u0275\u0275elementContainerStart(2, 30);
    \u0275\u0275template(3, CertificatesComponent_div_50_th_3_Template, 2, 0, "th", 31)(4, CertificatesComponent_div_50_td_4_Template, 2, 1, "td", 32);
    \u0275\u0275elementContainerEnd();
    \u0275\u0275elementContainerStart(5, 33);
    \u0275\u0275template(6, CertificatesComponent_div_50_th_6_Template, 2, 0, "th", 31)(7, CertificatesComponent_div_50_td_7_Template, 3, 1, "td", 32);
    \u0275\u0275elementContainerEnd();
    \u0275\u0275elementContainerStart(8, 34);
    \u0275\u0275template(9, CertificatesComponent_div_50_th_9_Template, 2, 0, "th", 31)(10, CertificatesComponent_div_50_td_10_Template, 3, 2, "td", 32);
    \u0275\u0275elementContainerEnd();
    \u0275\u0275elementContainerStart(11, 35);
    \u0275\u0275template(12, CertificatesComponent_div_50_th_12_Template, 2, 0, "th", 31)(13, CertificatesComponent_div_50_td_13_Template, 3, 3, "td", 32);
    \u0275\u0275elementContainerEnd();
    \u0275\u0275elementContainerStart(14, 36);
    \u0275\u0275template(15, CertificatesComponent_div_50_th_15_Template, 2, 0, "th", 31)(16, CertificatesComponent_div_50_td_16_Template, 3, 3, "td", 32);
    \u0275\u0275elementContainerEnd();
    \u0275\u0275elementContainerStart(17, 37);
    \u0275\u0275template(18, CertificatesComponent_div_50_th_18_Template, 2, 0, "th", 31)(19, CertificatesComponent_div_50_td_19_Template, 3, 4, "td", 32);
    \u0275\u0275elementContainerEnd();
    \u0275\u0275elementContainerStart(20, 38);
    \u0275\u0275template(21, CertificatesComponent_div_50_th_21_Template, 2, 0, "th", 31)(22, CertificatesComponent_div_50_td_22_Template, 13, 1, "td", 32);
    \u0275\u0275elementContainerEnd();
    \u0275\u0275template(23, CertificatesComponent_div_50_tr_23_Template, 1, 0, "tr", 39)(24, CertificatesComponent_div_50_tr_24_Template, 1, 0, "tr", 40);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r4 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275property("dataSource", ctx_r4.paged);
    \u0275\u0275advance(22);
    \u0275\u0275property("matHeaderRowDef", ctx_r4.cols);
    \u0275\u0275advance();
    \u0275\u0275property("matRowDefColumns", ctx_r4.cols);
  }
}
function CertificatesComponent_div_51_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 57)(1, "mat-icon");
    \u0275\u0275text(2, "card_membership");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "p");
    \u0275\u0275text(4, "No certificates found.");
    \u0275\u0275elementEnd()();
  }
}
function CertificatesComponent_div_52_Template(rf, ctx) {
  if (rf & 1) {
    const _r11 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 58)(1, "button", 59);
    \u0275\u0275listener("click", function CertificatesComponent_div_52_Template_button_click_1_listener() {
      \u0275\u0275restoreView(_r11);
      const ctx_r4 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r4.page = ctx_r4.page - 1);
    });
    \u0275\u0275elementStart(2, "mat-icon");
    \u0275\u0275text(3, "chevron_left");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(4, "span");
    \u0275\u0275text(5);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "button", 59);
    \u0275\u0275listener("click", function CertificatesComponent_div_52_Template_button_click_6_listener() {
      \u0275\u0275restoreView(_r11);
      const ctx_r4 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r4.page = ctx_r4.page + 1);
    });
    \u0275\u0275elementStart(7, "mat-icon");
    \u0275\u0275text(8, "chevron_right");
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r4 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275property("disabled", ctx_r4.page === 0);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate2("", ctx_r4.page + 1, " / ", ctx_r4.totalPages, "");
    \u0275\u0275advance();
    \u0275\u0275property("disabled", ctx_r4.page >= ctx_r4.totalPages - 1);
  }
}
function CertificatesComponent_div_53_img_9_Template(rf, ctx) {
  if (rf & 1) {
    const _r13 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "img", 68);
    \u0275\u0275listener("error", function CertificatesComponent_div_53_img_9_Template_img_error_0_listener() {
      \u0275\u0275restoreView(_r13);
      const ctx_r4 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r4.qrLoadError = true);
    });
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r4 = \u0275\u0275nextContext(2);
    \u0275\u0275property("src", ctx_r4.qrImageUrl(), \u0275\u0275sanitizeUrl);
  }
}
function CertificatesComponent_div_53_p_10_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 69);
    \u0275\u0275text(1, "QR image could not be loaded.");
    \u0275\u0275elementEnd();
  }
}
function CertificatesComponent_div_53_Template(rf, ctx) {
  if (rf & 1) {
    const _r12 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 60);
    \u0275\u0275listener("click", function CertificatesComponent_div_53_Template_div_click_0_listener() {
      \u0275\u0275restoreView(_r12);
      const ctx_r4 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r4.qrVisible.set(false));
    });
    \u0275\u0275elementStart(1, "div", 61);
    \u0275\u0275listener("click", function CertificatesComponent_div_53_Template_div_click_1_listener($event) {
      \u0275\u0275restoreView(_r12);
      return \u0275\u0275resetView($event.stopPropagation());
    });
    \u0275\u0275elementStart(2, "div", 62)(3, "span");
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "button", 63);
    \u0275\u0275listener("click", function CertificatesComponent_div_53_Template_button_click_5_listener() {
      \u0275\u0275restoreView(_r12);
      const ctx_r4 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r4.qrVisible.set(false));
    });
    \u0275\u0275elementStart(6, "mat-icon");
    \u0275\u0275text(7, "close");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(8, "div", 64);
    \u0275\u0275template(9, CertificatesComponent_div_53_img_9_Template, 1, 1, "img", 65)(10, CertificatesComponent_div_53_p_10_Template, 2, 0, "p", 66);
    \u0275\u0275elementStart(11, "p", 67);
    \u0275\u0275text(12);
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    let tmp_1_0;
    let tmp_4_0;
    const ctx_r4 = \u0275\u0275nextContext();
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate1("QR Code \u2013 ", (tmp_1_0 = ctx_r4.qrCert()) == null ? null : tmp_1_0.certificateNumber, "");
    \u0275\u0275advance(5);
    \u0275\u0275property("ngIf", !ctx_r4.qrLoadError);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r4.qrLoadError);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate((tmp_4_0 = ctx_r4.qrCert()) == null ? null : tmp_4_0.verificationCode);
  }
}
function CertificatesComponent_div_54_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 70);
    \u0275\u0275text(1, "Copied!");
    \u0275\u0275elementEnd();
  }
}
var CertificatesComponent = class _CertificatesComponent {
  constructor() {
    this.api = inject(ApiService);
    this.dialog = inject(MatDialog);
    this.certificates = [];
    this.loading = true;
    this.search = "";
    this.filterType = "";
    this.filterStatus = "";
    this.page = 0;
    this.pageSize = 8;
    this.totalPages = 1;
    this.cols = ["student", "number", "verificationCode", "type", "status", "issuedAt", "actions"];
    this.qrVisible = signal(false);
    this.qrCert = signal(null);
    this.qrLoadError = false;
    this.copied = signal(false);
  }
  get paged() {
    const q = this.search.toLowerCase();
    let list = this.certificates.filter((c) => (!q || c.studentName.toLowerCase().includes(q) || c.certificateNumber.toLowerCase().includes(q)) && (!this.filterType || c.type === this.filterType) && (!this.filterStatus || c.status === this.filterStatus));
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
    this.api.listCertificates().subscribe({
      next: (d) => {
        this.certificates = Array.isArray(d) ? d : d?.content ?? [];
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }
  typeClass(t) {
    return `chip chip-${t.toLowerCase()}`;
  }
  statusClass(s) {
    return `chip chip-${s.toLowerCase()}`;
  }
  downloadPdf(cert) {
    window.open(this.api.downloadCertificateUrl(cert.id), "_blank");
  }
  showQr(cert) {
    this.qrCert.set(cert);
    this.qrLoadError = false;
    this.qrVisible.set(true);
  }
  qrImageUrl() {
    const code = this.qrCert()?.verificationCode;
    return code ? this.api.qrCodeUrl(code) : "";
  }
  copyCode(code) {
    navigator.clipboard.writeText(code).then(() => {
      this.copied.set(true);
      setTimeout(() => this.copied.set(false), 1800);
    });
  }
  openDialog(item) {
    this.dialog.open(CertificateDialogComponent, { data: item ?? null, width: "500px" }).afterClosed().subscribe((v) => {
      if (!v)
        return;
      const obs = item ? this.api.updateCertificate(item.id, v) : this.api.createCertificate(v);
      obs.subscribe(() => this.load());
    });
  }
  delete(item) {
    this.dialog.open(ConfirmDialogComponent, {
      data: { title: "Delete Certificate", message: `Delete certificate "${item.certificateNumber}"?` }
    }).afterClosed().subscribe((ok) => {
      if (ok)
        this.api.deleteCertificate(item.id).subscribe(() => this.load());
    });
  }
  static {
    this.\u0275fac = function CertificatesComponent_Factory(t) {
      return new (t || _CertificatesComponent)();
    };
  }
  static {
    this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _CertificatesComponent, selectors: [["app-certificates"]], standalone: true, features: [\u0275\u0275StandaloneFeature], decls: 55, vars: 9, consts: [[1, "page-header"], [1, "page-title"], [1, "header-actions"], ["mat-stroked-button", "", "color", "accent", "routerLink", "/verify"], ["mat-raised-button", "", "color", "primary", 3, "click"], [1, "toolbar"], ["appearance", "outline", 1, "search-field"], ["matInput", "", "placeholder", "student or certificate number\u2026", 3, "ngModelChange", "ngModel"], ["matSuffix", ""], ["appearance", "outline", 1, "filter-field"], ["matNativeControl", "", 3, "ngModelChange", "ngModel"], ["value", ""], ["value", "INTERNSHIP"], ["value", "TRAINING"], ["value", "COMPLETION"], ["value", "LEVEL"], ["value", "PARTICIPATION"], ["value", "ISSUED"], ["value", "REVOKED"], ["value", "EXPIRED"], ["class", "spinner-center", 4, "ngIf"], ["class", "table-wrap", 4, "ngIf"], ["class", "empty-state", 4, "ngIf"], ["class", "pagination", 4, "ngIf"], ["class", "qr-overlay", 3, "click", 4, "ngIf"], ["class", "copy-toast", 4, "ngIf"], [1, "spinner-center"], ["diameter", "40"], [1, "table-wrap"], ["mat-table", "", 1, "full-table", 3, "dataSource"], ["matColumnDef", "student"], ["mat-header-cell", "", 4, "matHeaderCellDef"], ["mat-cell", "", 4, "matCellDef"], ["matColumnDef", "number"], ["matColumnDef", "verificationCode"], ["matColumnDef", "type"], ["matColumnDef", "status"], ["matColumnDef", "issuedAt"], ["matColumnDef", "actions"], ["mat-header-row", "", 4, "matHeaderRowDef"], ["mat-row", "", 4, "matRowDef", "matRowDefColumns"], ["mat-header-cell", ""], ["mat-cell", ""], [1, "cert-code"], ["class", "verify-code-wrap", 4, "ngIf"], ["class", "text-muted", 4, "ngIf"], [1, "verify-code-wrap"], [1, "verify-code"], ["mat-icon-button", "", "matTooltip", "Copy code", 1, "copy-btn", 3, "click"], [2, "font-size", "14px", "width", "14px", "height", "14px"], [1, "text-muted"], ["mat-icon-button", "", "matTooltip", "Edit", 3, "click"], ["mat-icon-button", "", "color", "primary", "matTooltip", "Download PDF", 3, "click"], ["mat-icon-button", "", "color", "accent", "matTooltip", "View QR Code", 3, "click", "disabled"], ["mat-icon-button", "", "color", "warn", "matTooltip", "Delete", 3, "click"], ["mat-header-row", ""], ["mat-row", ""], [1, "empty-state"], [1, "pagination"], ["mat-icon-button", "", 3, "click", "disabled"], [1, "qr-overlay", 3, "click"], [1, "qr-modal", 3, "click"], [1, "qr-modal-header"], ["mat-icon-button", "", 3, "click"], [1, "qr-modal-body"], ["alt", "QR Code", "class", "qr-image", 3, "src", "error", 4, "ngIf"], ["class", "qr-error", 4, "ngIf"], [1, "qr-code-text"], ["alt", "QR Code", 1, "qr-image", 3, "error", "src"], [1, "qr-error"], [1, "copy-toast"]], template: function CertificatesComponent_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275elementStart(0, "div", 0)(1, "h1", 1);
        \u0275\u0275text(2, "Certificates");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(3, "div", 2)(4, "button", 3)(5, "mat-icon");
        \u0275\u0275text(6, "verified");
        \u0275\u0275elementEnd();
        \u0275\u0275text(7, " Verify");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(8, "button", 4);
        \u0275\u0275listener("click", function CertificatesComponent_Template_button_click_8_listener() {
          return ctx.openDialog();
        });
        \u0275\u0275elementStart(9, "mat-icon");
        \u0275\u0275text(10, "add");
        \u0275\u0275elementEnd();
        \u0275\u0275text(11, " Issue Certificate");
        \u0275\u0275elementEnd()()();
        \u0275\u0275elementStart(12, "mat-card")(13, "mat-card-content")(14, "div", 5)(15, "mat-form-field", 6)(16, "mat-label");
        \u0275\u0275text(17, "Search");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(18, "input", 7);
        \u0275\u0275twoWayListener("ngModelChange", function CertificatesComponent_Template_input_ngModelChange_18_listener($event) {
          \u0275\u0275twoWayBindingSet(ctx.search, $event) || (ctx.search = $event);
          return $event;
        });
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(19, "mat-icon", 8);
        \u0275\u0275text(20, "search");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(21, "mat-form-field", 9)(22, "mat-label");
        \u0275\u0275text(23, "Type");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(24, "select", 10);
        \u0275\u0275twoWayListener("ngModelChange", function CertificatesComponent_Template_select_ngModelChange_24_listener($event) {
          \u0275\u0275twoWayBindingSet(ctx.filterType, $event) || (ctx.filterType = $event);
          return $event;
        });
        \u0275\u0275elementStart(25, "option", 11);
        \u0275\u0275text(26, "All");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(27, "option", 12);
        \u0275\u0275text(28, "Internship");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(29, "option", 13);
        \u0275\u0275text(30, "Training");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(31, "option", 14);
        \u0275\u0275text(32, "Completion");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(33, "option", 15);
        \u0275\u0275text(34, "Level");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(35, "option", 16);
        \u0275\u0275text(36, "Participation");
        \u0275\u0275elementEnd()()();
        \u0275\u0275elementStart(37, "mat-form-field", 9)(38, "mat-label");
        \u0275\u0275text(39, "Status");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(40, "select", 10);
        \u0275\u0275twoWayListener("ngModelChange", function CertificatesComponent_Template_select_ngModelChange_40_listener($event) {
          \u0275\u0275twoWayBindingSet(ctx.filterStatus, $event) || (ctx.filterStatus = $event);
          return $event;
        });
        \u0275\u0275elementStart(41, "option", 11);
        \u0275\u0275text(42, "All");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(43, "option", 17);
        \u0275\u0275text(44, "Issued");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(45, "option", 18);
        \u0275\u0275text(46, "Revoked");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(47, "option", 19);
        \u0275\u0275text(48, "Expired");
        \u0275\u0275elementEnd()()()();
        \u0275\u0275template(49, CertificatesComponent_div_49_Template, 2, 0, "div", 20)(50, CertificatesComponent_div_50_Template, 25, 3, "div", 21)(51, CertificatesComponent_div_51_Template, 5, 0, "div", 22)(52, CertificatesComponent_div_52_Template, 9, 4, "div", 23);
        \u0275\u0275elementEnd()();
        \u0275\u0275template(53, CertificatesComponent_div_53_Template, 13, 4, "div", 24)(54, CertificatesComponent_div_54_Template, 2, 0, "div", 25);
      }
      if (rf & 2) {
        \u0275\u0275advance(18);
        \u0275\u0275twoWayProperty("ngModel", ctx.search);
        \u0275\u0275advance(6);
        \u0275\u0275twoWayProperty("ngModel", ctx.filterType);
        \u0275\u0275advance(16);
        \u0275\u0275twoWayProperty("ngModel", ctx.filterStatus);
        \u0275\u0275advance(9);
        \u0275\u0275property("ngIf", ctx.loading);
        \u0275\u0275advance();
        \u0275\u0275property("ngIf", !ctx.loading);
        \u0275\u0275advance();
        \u0275\u0275property("ngIf", !ctx.loading && ctx.paged.length === 0);
        \u0275\u0275advance();
        \u0275\u0275property("ngIf", ctx.totalPages > 1);
        \u0275\u0275advance();
        \u0275\u0275property("ngIf", ctx.qrVisible());
        \u0275\u0275advance();
        \u0275\u0275property("ngIf", ctx.copied());
      }
    }, dependencies: [CommonModule, NgIf, DatePipe, FormsModule, NgSelectOption, \u0275NgSelectMultipleOption, DefaultValueAccessor, SelectControlValueAccessor, NgControlStatus, NgModel, RouterLink, MatCardModule, MatCard, MatCardContent, MatTableModule, MatTable, MatHeaderCellDef, MatHeaderRowDef, MatColumnDef, MatCellDef, MatRowDef, MatHeaderCell, MatCell, MatHeaderRow, MatRow, MatButtonModule, MatButton, MatIconButton, MatIconModule, MatIcon, MatInputModule, MatInput, MatFormField, MatLabel, MatSuffix, MatFormFieldModule, MatTooltipModule, MatTooltip, MatProgressSpinnerModule, MatProgressSpinner, MatDialogModule], styles: ["\n\n.page-header[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  margin-bottom: 20px;\n}\n.header-actions[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 12px;\n}\n.page-title[_ngcontent-%COMP%] {\n  font-size: 1.6rem;\n  font-weight: 600;\n  color: #311b92;\n  margin: 0;\n}\n.toolbar[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 16px;\n  flex-wrap: wrap;\n  margin-bottom: 12px;\n}\n.search-field[_ngcontent-%COMP%] {\n  flex: 1;\n  min-width: 200px;\n}\n.filter-field[_ngcontent-%COMP%] {\n  width: 155px;\n}\n.table-wrap[_ngcontent-%COMP%] {\n  overflow-x: auto;\n}\n.full-table[_ngcontent-%COMP%] {\n  width: 100%;\n  min-width: 760px;\n}\n.spinner-center[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: center;\n  padding: 40px;\n}\n.empty-state[_ngcontent-%COMP%] {\n  text-align: center;\n  padding: 40px;\n  color: #999;\n}\n.pagination[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: flex-end;\n  gap: 8px;\n  margin-top: 12px;\n}\n.text-muted[_ngcontent-%COMP%] {\n  color: #bbb;\n  font-size: .85rem;\n}\n.chip[_ngcontent-%COMP%] {\n  padding: 3px 10px;\n  border-radius: 12px;\n  font-size: .78rem;\n  font-weight: 600;\n}\n.chip-issued[_ngcontent-%COMP%] {\n  background: #d1fae5;\n  color: #065f46;\n}\n.chip-revoked[_ngcontent-%COMP%] {\n  background: #fee2e2;\n  color: #991b1b;\n}\n.chip-expired[_ngcontent-%COMP%] {\n  background: #f3f4f6;\n  color: #6b7280;\n}\n.chip-internship[_ngcontent-%COMP%] {\n  background: #ede9fe;\n  color: #5b21b6;\n}\n.chip-training[_ngcontent-%COMP%] {\n  background: #dbeafe;\n  color: #1e40af;\n}\n.chip-completion[_ngcontent-%COMP%] {\n  background: #fef3c7;\n  color: #92400e;\n}\n.chip-level[_ngcontent-%COMP%] {\n  background: #d1fae5;\n  color: #065f46;\n}\n.chip-participation[_ngcontent-%COMP%] {\n  background: #e0f2fe;\n  color: #0369a1;\n}\n.cert-code[_ngcontent-%COMP%] {\n  background: #f3f4f6;\n  padding: 2px 6px;\n  border-radius: 4px;\n  font-size: .8rem;\n}\n.verify-code-wrap[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  gap: 2px;\n}\n.verify-code[_ngcontent-%COMP%] {\n  background: #ede9fe;\n  color: #5b21b6;\n  padding: 2px 8px;\n  border-radius: 6px;\n  font-size: .75rem;\n  letter-spacing: .03em;\n}\n.copy-btn[_ngcontent-%COMP%] {\n  width: 22px !important;\n  height: 22px !important;\n  line-height: 22px !important;\n}\n.qr-overlay[_ngcontent-%COMP%] {\n  position: fixed;\n  inset: 0;\n  background: rgba(0, 0, 0, .5);\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  z-index: 1000;\n}\n.qr-modal[_ngcontent-%COMP%] {\n  background: #fff;\n  border-radius: 16px;\n  overflow: hidden;\n  width: 300px;\n  box-shadow: 0 25px 50px rgba(0, 0, 0, .25);\n}\n.qr-modal-header[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  padding: 12px 16px;\n  background: #f8f9fa;\n  font-weight: 600;\n  font-size: .9rem;\n}\n.qr-modal-body[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  padding: 24px;\n  gap: 12px;\n}\n.qr-image[_ngcontent-%COMP%] {\n  width: 200px;\n  height: 200px;\n  object-fit: contain;\n  border: 1px solid #e5e7eb;\n  border-radius: 8px;\n}\n.qr-error[_ngcontent-%COMP%] {\n  color: #ef4444;\n  font-size: .85rem;\n}\n.qr-code-text[_ngcontent-%COMP%] {\n  font-family: monospace;\n  font-size: .75rem;\n  color: #6b7280;\n}\n.copy-toast[_ngcontent-%COMP%] {\n  position: fixed;\n  bottom: 24px;\n  left: 50%;\n  transform: translateX(-50%);\n  background: #1e1b4b;\n  color: #fff;\n  padding: 8px 20px;\n  border-radius: 999px;\n  font-size: .85rem;\n  z-index: 9999;\n  pointer-events: none;\n  animation: _ngcontent-%COMP%_fadeOut 1.8s forwards;\n}\n@keyframes _ngcontent-%COMP%_fadeOut {\n  0% {\n    opacity: 1;\n  }\n  70% {\n    opacity: 1;\n  }\n  100% {\n    opacity: 0;\n  }\n}\n/*# sourceMappingURL=certificates.component.css.map */"] });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(CertificatesComponent, { className: "CertificatesComponent", filePath: "src\\app\\features\\certificates\\certificates.component.ts", lineNumber: 219 });
})();
export {
  CertificatesComponent
};
//# sourceMappingURL=chunk-ZXAH5D3E.js.map
