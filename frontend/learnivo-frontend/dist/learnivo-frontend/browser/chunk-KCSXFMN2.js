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
  MatIconButton
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
  ReactiveFormsModule,
  Validators
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

// src/app/features/events/event-dialog.component.ts
var EventDialogComponent = class _EventDialogComponent {
  constructor(ref, data, fb) {
    this.ref = ref;
    this.data = data;
    this.fb = fb;
    this.form = this.fb.group({
      title: [data?.title ?? "", Validators.required],
      date: [data?.date ?? "", Validators.required],
      location: [data?.location ?? ""],
      description: [data?.description ?? ""]
    });
  }
  save() {
    if (this.form.valid)
      this.ref.close(this.form.value);
  }
  static {
    this.\u0275fac = function EventDialogComponent_Factory(t) {
      return new (t || _EventDialogComponent)(\u0275\u0275directiveInject(MatDialogRef), \u0275\u0275directiveInject(MAT_DIALOG_DATA), \u0275\u0275directiveInject(FormBuilder));
    };
  }
  static {
    this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _EventDialogComponent, selectors: [["app-event-dialog"]], standalone: true, features: [\u0275\u0275StandaloneFeature], decls: 28, vars: 3, consts: [["mat-dialog-title", ""], [1, "dialog-form", 3, "formGroup"], ["appearance", "outline"], ["matInput", "", "formControlName", "title"], ["matInput", "", "type", "datetime-local", "formControlName", "date"], ["matInput", "", "formControlName", "location"], ["matInput", "", "formControlName", "description", "rows", "3"], ["align", "end"], ["mat-button", "", 3, "click"], ["mat-flat-button", "", "color", "primary", 3, "click", "disabled"]], template: function EventDialogComponent_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275elementStart(0, "h2", 0);
        \u0275\u0275text(1);
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(2, "mat-dialog-content", 1)(3, "mat-form-field", 2)(4, "mat-label");
        \u0275\u0275text(5, "Title");
        \u0275\u0275elementEnd();
        \u0275\u0275element(6, "input", 3);
        \u0275\u0275elementStart(7, "mat-error");
        \u0275\u0275text(8, "Required");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(9, "mat-form-field", 2)(10, "mat-label");
        \u0275\u0275text(11, "Date");
        \u0275\u0275elementEnd();
        \u0275\u0275element(12, "input", 4);
        \u0275\u0275elementStart(13, "mat-error");
        \u0275\u0275text(14, "Required");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(15, "mat-form-field", 2)(16, "mat-label");
        \u0275\u0275text(17, "Location");
        \u0275\u0275elementEnd();
        \u0275\u0275element(18, "input", 5);
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(19, "mat-form-field", 2)(20, "mat-label");
        \u0275\u0275text(21, "Description");
        \u0275\u0275elementEnd();
        \u0275\u0275element(22, "textarea", 6);
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(23, "mat-dialog-actions", 7)(24, "button", 8);
        \u0275\u0275listener("click", function EventDialogComponent_Template_button_click_24_listener() {
          return ctx.ref.close();
        });
        \u0275\u0275text(25, "Cancel");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(26, "button", 9);
        \u0275\u0275listener("click", function EventDialogComponent_Template_button_click_26_listener() {
          return ctx.save();
        });
        \u0275\u0275text(27, "Save");
        \u0275\u0275elementEnd()();
      }
      if (rf & 2) {
        \u0275\u0275advance();
        \u0275\u0275textInterpolate1("", ctx.data ? "Edit" : "New", " Event");
        \u0275\u0275advance();
        \u0275\u0275property("formGroup", ctx.form);
        \u0275\u0275advance(24);
        \u0275\u0275property("disabled", ctx.form.invalid);
      }
    }, dependencies: [CommonModule, ReactiveFormsModule, DefaultValueAccessor, NgControlStatus, NgControlStatusGroup, FormGroupDirective, FormControlName, MatDialogModule, MatDialogTitle, MatDialogActions, MatDialogContent, MatFormFieldModule, MatFormField, MatLabel, MatError, MatInputModule, MatInput, MatButtonModule, MatButton], styles: ["\n\n.dialog-form[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 4px;\n  min-width: 400px;\n  padding-top: 12px;\n}\nmat-form-field[_ngcontent-%COMP%] {\n  width: 100%;\n}\n/*# sourceMappingURL=event-dialog.component.css.map */"] });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(EventDialogComponent, { className: "EventDialogComponent", filePath: "src\\app\\features\\events\\event-dialog.component.ts", lineNumber: 38 });
})();

// src/app/features/events/events.component.ts
function EventsComponent_div_15_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 10);
    \u0275\u0275element(1, "mat-spinner", 11);
    \u0275\u0275elementEnd();
  }
}
function EventsComponent_table_16_th_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "th", 21);
    \u0275\u0275text(1, "Title");
    \u0275\u0275elementEnd();
  }
}
function EventsComponent_table_16_td_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "td", 22);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const r_r1 = ctx.$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(r_r1.title);
  }
}
function EventsComponent_table_16_th_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "th", 21);
    \u0275\u0275text(1, "Date");
    \u0275\u0275elementEnd();
  }
}
function EventsComponent_table_16_td_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "td", 22);
    \u0275\u0275text(1);
    \u0275\u0275pipe(2, "date");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const r_r2 = ctx.$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind2(2, 1, r_r2.date, "medium"));
  }
}
function EventsComponent_table_16_th_8_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "th", 21);
    \u0275\u0275text(1, "Location");
    \u0275\u0275elementEnd();
  }
}
function EventsComponent_table_16_td_9_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "td", 22);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const r_r3 = ctx.$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(r_r3.location || "\u2014");
  }
}
function EventsComponent_table_16_th_11_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "th", 21);
    \u0275\u0275text(1, "Actions");
    \u0275\u0275elementEnd();
  }
}
function EventsComponent_table_16_td_12_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "td", 22)(1, "button", 23);
    \u0275\u0275listener("click", function EventsComponent_table_16_td_12_Template_button_click_1_listener() {
      const r_r5 = \u0275\u0275restoreView(_r4).$implicit;
      const ctx_r5 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r5.openDialog(r_r5));
    });
    \u0275\u0275elementStart(2, "mat-icon");
    \u0275\u0275text(3, "edit");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(4, "button", 24);
    \u0275\u0275listener("click", function EventsComponent_table_16_td_12_Template_button_click_4_listener() {
      const r_r5 = \u0275\u0275restoreView(_r4).$implicit;
      const ctx_r5 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r5.delete(r_r5));
    });
    \u0275\u0275elementStart(5, "mat-icon");
    \u0275\u0275text(6, "delete");
    \u0275\u0275elementEnd()()();
  }
}
function EventsComponent_table_16_tr_13_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "tr", 25);
  }
}
function EventsComponent_table_16_tr_14_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "tr", 26);
  }
}
function EventsComponent_table_16_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "table", 12);
    \u0275\u0275elementContainerStart(1, 13);
    \u0275\u0275template(2, EventsComponent_table_16_th_2_Template, 2, 0, "th", 14)(3, EventsComponent_table_16_td_3_Template, 2, 1, "td", 15);
    \u0275\u0275elementContainerEnd();
    \u0275\u0275elementContainerStart(4, 16);
    \u0275\u0275template(5, EventsComponent_table_16_th_5_Template, 2, 0, "th", 14)(6, EventsComponent_table_16_td_6_Template, 3, 4, "td", 15);
    \u0275\u0275elementContainerEnd();
    \u0275\u0275elementContainerStart(7, 17);
    \u0275\u0275template(8, EventsComponent_table_16_th_8_Template, 2, 0, "th", 14)(9, EventsComponent_table_16_td_9_Template, 2, 1, "td", 15);
    \u0275\u0275elementContainerEnd();
    \u0275\u0275elementContainerStart(10, 18);
    \u0275\u0275template(11, EventsComponent_table_16_th_11_Template, 2, 0, "th", 14)(12, EventsComponent_table_16_td_12_Template, 7, 0, "td", 15);
    \u0275\u0275elementContainerEnd();
    \u0275\u0275template(13, EventsComponent_table_16_tr_13_Template, 1, 0, "tr", 19)(14, EventsComponent_table_16_tr_14_Template, 1, 0, "tr", 20);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r5 = \u0275\u0275nextContext();
    \u0275\u0275property("dataSource", ctx_r5.paged);
    \u0275\u0275advance(13);
    \u0275\u0275property("matHeaderRowDef", ctx_r5.cols);
    \u0275\u0275advance();
    \u0275\u0275property("matRowDefColumns", ctx_r5.cols);
  }
}
function EventsComponent_div_17_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 27)(1, "mat-icon");
    \u0275\u0275text(2, "event_busy");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "p");
    \u0275\u0275text(4, "No events found.");
    \u0275\u0275elementEnd()();
  }
}
function EventsComponent_div_18_Template(rf, ctx) {
  if (rf & 1) {
    const _r7 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 28)(1, "button", 29);
    \u0275\u0275listener("click", function EventsComponent_div_18_Template_button_click_1_listener() {
      \u0275\u0275restoreView(_r7);
      const ctx_r5 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r5.page = ctx_r5.page - 1);
    });
    \u0275\u0275elementStart(2, "mat-icon");
    \u0275\u0275text(3, "chevron_left");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(4, "span");
    \u0275\u0275text(5);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "button", 29);
    \u0275\u0275listener("click", function EventsComponent_div_18_Template_button_click_6_listener() {
      \u0275\u0275restoreView(_r7);
      const ctx_r5 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r5.page = ctx_r5.page + 1);
    });
    \u0275\u0275elementStart(7, "mat-icon");
    \u0275\u0275text(8, "chevron_right");
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r5 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275property("disabled", ctx_r5.page === 0);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate2("", ctx_r5.page + 1, " / ", ctx_r5.totalPages, "");
    \u0275\u0275advance();
    \u0275\u0275property("disabled", ctx_r5.page >= ctx_r5.totalPages - 1);
  }
}
var EventsComponent = class _EventsComponent {
  constructor() {
    this.api = inject(ApiService);
    this.dialog = inject(MatDialog);
    this.events = [];
    this.loading = true;
    this.search = "";
    this.page = 0;
    this.pageSize = 8;
    this.totalPages = 1;
    this.cols = ["title", "date", "location", "actions"];
  }
  get paged() {
    const q = this.search.toLowerCase();
    let list = this.events.filter((e) => !q || e.title.toLowerCase().includes(q) || (e.location ?? "").toLowerCase().includes(q));
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
    this.api.listEvents().subscribe({ next: (d) => {
      this.events = d;
      this.loading = false;
    }, error: () => {
      this.loading = false;
    } });
  }
  openDialog(item) {
    this.dialog.open(EventDialogComponent, { data: item ?? null, width: "480px" }).afterClosed().subscribe((v) => {
      if (!v)
        return;
      const obs = item ? this.api.updateEvent(item.id, v) : this.api.createEvent(v);
      obs.subscribe(() => this.load());
    });
  }
  delete(item) {
    this.dialog.open(ConfirmDialogComponent, { data: { title: "Delete Event", message: `Delete "${item.title}"?` } }).afterClosed().subscribe((ok) => {
      if (ok)
        this.api.deleteEvent(item.id).subscribe(() => this.load());
    });
  }
  static {
    this.\u0275fac = function EventsComponent_Factory(t) {
      return new (t || _EventsComponent)();
    };
  }
  static {
    this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _EventsComponent, selectors: [["app-events"]], standalone: true, features: [\u0275\u0275StandaloneFeature], decls: 19, vars: 5, consts: [[1, "page-header"], [1, "page-title"], ["mat-raised-button", "", "color", "primary", 3, "click"], ["appearance", "outline", 1, "search-field", 2, "margin-bottom", "12px"], ["matInput", "", "placeholder", "title or location\u2026", 3, "ngModelChange", "ngModel"], ["matSuffix", ""], ["class", "spinner-center", 4, "ngIf"], ["mat-table", "", "class", "full-table", 3, "dataSource", 4, "ngIf"], ["class", "empty-state", 4, "ngIf"], ["class", "pagination", 4, "ngIf"], [1, "spinner-center"], ["diameter", "40"], ["mat-table", "", 1, "full-table", 3, "dataSource"], ["matColumnDef", "title"], ["mat-header-cell", "", 4, "matHeaderCellDef"], ["mat-cell", "", 4, "matCellDef"], ["matColumnDef", "date"], ["matColumnDef", "location"], ["matColumnDef", "actions"], ["mat-header-row", "", 4, "matHeaderRowDef"], ["mat-row", "", 4, "matRowDef", "matRowDefColumns"], ["mat-header-cell", ""], ["mat-cell", ""], ["mat-icon-button", "", "matTooltip", "Edit", 3, "click"], ["mat-icon-button", "", "color", "warn", "matTooltip", "Delete", 3, "click"], ["mat-header-row", ""], ["mat-row", ""], [1, "empty-state"], [1, "pagination"], ["mat-icon-button", "", 3, "click", "disabled"]], template: function EventsComponent_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275elementStart(0, "div", 0)(1, "h1", 1);
        \u0275\u0275text(2, "Events");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(3, "button", 2);
        \u0275\u0275listener("click", function EventsComponent_Template_button_click_3_listener() {
          return ctx.openDialog();
        });
        \u0275\u0275elementStart(4, "mat-icon");
        \u0275\u0275text(5, "add");
        \u0275\u0275elementEnd();
        \u0275\u0275text(6, " New Event");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(7, "mat-card")(8, "mat-card-content")(9, "mat-form-field", 3)(10, "mat-label");
        \u0275\u0275text(11, "Search");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(12, "input", 4);
        \u0275\u0275twoWayListener("ngModelChange", function EventsComponent_Template_input_ngModelChange_12_listener($event) {
          \u0275\u0275twoWayBindingSet(ctx.search, $event) || (ctx.search = $event);
          return $event;
        });
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(13, "mat-icon", 5);
        \u0275\u0275text(14, "search");
        \u0275\u0275elementEnd()();
        \u0275\u0275template(15, EventsComponent_div_15_Template, 2, 0, "div", 6)(16, EventsComponent_table_16_Template, 15, 3, "table", 7)(17, EventsComponent_div_17_Template, 5, 0, "div", 8)(18, EventsComponent_div_18_Template, 9, 4, "div", 9);
        \u0275\u0275elementEnd()();
      }
      if (rf & 2) {
        \u0275\u0275advance(12);
        \u0275\u0275twoWayProperty("ngModel", ctx.search);
        \u0275\u0275advance(3);
        \u0275\u0275property("ngIf", ctx.loading);
        \u0275\u0275advance();
        \u0275\u0275property("ngIf", !ctx.loading);
        \u0275\u0275advance();
        \u0275\u0275property("ngIf", !ctx.loading && ctx.paged.length === 0);
        \u0275\u0275advance();
        \u0275\u0275property("ngIf", ctx.totalPages > 1);
      }
    }, dependencies: [CommonModule, NgIf, DatePipe, FormsModule, DefaultValueAccessor, NgControlStatus, NgModel, MatCardModule, MatCard, MatCardContent, MatTableModule, MatTable, MatHeaderCellDef, MatHeaderRowDef, MatColumnDef, MatCellDef, MatRowDef, MatHeaderCell, MatCell, MatHeaderRow, MatRow, MatButtonModule, MatButton, MatIconButton, MatIconModule, MatIcon, MatInputModule, MatInput, MatFormField, MatLabel, MatSuffix, MatFormFieldModule, MatTooltipModule, MatTooltip, MatProgressSpinnerModule, MatProgressSpinner], styles: ["\n\n.page-header[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  margin-bottom: 20px;\n}\n.page-title[_ngcontent-%COMP%] {\n  font-size: 1.6rem;\n  font-weight: 600;\n  color: #311b92;\n  margin: 0;\n}\n.search-field[_ngcontent-%COMP%] {\n  width: 100%;\n  max-width: 400px;\n}\n.full-table[_ngcontent-%COMP%] {\n  width: 100%;\n}\n.spinner-center[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: center;\n  padding: 40px;\n}\n.empty-state[_ngcontent-%COMP%] {\n  text-align: center;\n  padding: 40px;\n  color: #999;\n}\n.pagination[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: flex-end;\n  gap: 8px;\n  margin-top: 12px;\n}\n/*# sourceMappingURL=events.component.css.map */"] });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(EventsComponent, { className: "EventsComponent", filePath: "src\\app\\features\\events\\events.component.ts", lineNumber: 77 });
})();
export {
  EventsComponent
};
//# sourceMappingURL=chunk-KCSXFMN2.js.map
