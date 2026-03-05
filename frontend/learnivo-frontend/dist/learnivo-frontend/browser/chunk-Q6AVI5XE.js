import {
  DefaultValueAccessor,
  FormsModule,
  NgControlStatus,
  NgModel
} from "./chunk-7PZ2LNBE.js";
import {
  environment
} from "./chunk-J44C53DG.js";
import {
  CommonModule,
  DatePipe,
  HttpClient,
  NgIf,
  inject,
  signal,
  ɵsetClassDebugInfo,
  ɵɵStandaloneFeature,
  ɵɵadvance,
  ɵɵclassMap,
  ɵɵdefineComponent,
  ɵɵelement,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵgetCurrentView,
  ɵɵlistener,
  ɵɵnamespaceHTML,
  ɵɵnamespaceSVG,
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
  ɵɵtwoWayBindingSet,
  ɵɵtwoWayListener,
  ɵɵtwoWayProperty
} from "./chunk-EUR4AY6M.js";

// src/app/features/verify/verify.component.ts
function VerifyComponent_span_14_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span");
    \u0275\u0275text(1, "Checking\u2026");
    \u0275\u0275elementEnd();
  }
}
function VerifyComponent_span_15_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span");
    \u0275\u0275text(1, "Verify");
    \u0275\u0275elementEnd();
  }
}
function VerifyComponent_div_16_div_41_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 30)(1, "p", 31);
    \u0275\u0275text(2, "QR Code");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "img", 32);
    \u0275\u0275listener("error", function VerifyComponent_div_16_div_41_Template_img_error_3_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.qrError = true);
    });
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const r_r3 = \u0275\u0275nextContext().ngIf;
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(3);
    \u0275\u0275property("src", ctx_r1.qrUrl(r_r3.verificationCode), \u0275\u0275sanitizeUrl);
  }
}
function VerifyComponent_div_16_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 16)(1, "div", 17)(2, "div", 18);
    \u0275\u0275namespaceSVG();
    \u0275\u0275elementStart(3, "svg", 19);
    \u0275\u0275element(4, "path", 20);
    \u0275\u0275elementEnd()();
    \u0275\u0275namespaceHTML();
    \u0275\u0275elementStart(5, "h2", 21);
    \u0275\u0275text(6, "Certificate Valid");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(7, "div", 22)(8, "dl", 23)(9, "div")(10, "dt", 24);
    \u0275\u0275text(11, "Student");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(12, "dd", 25);
    \u0275\u0275text(13);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(14, "div")(15, "dt", 24);
    \u0275\u0275text(16, "Certificate Title");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(17, "dd", 25);
    \u0275\u0275text(18);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(19, "div")(20, "dt", 24);
    \u0275\u0275text(21, "Certificate #");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(22, "dd", 26);
    \u0275\u0275text(23);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(24, "div")(25, "dt", 24);
    \u0275\u0275text(26, "Type");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(27, "dd", 27)(28, "span");
    \u0275\u0275text(29);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(30, "div")(31, "dt", 24);
    \u0275\u0275text(32, "Issue Date");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(33, "dd", 25);
    \u0275\u0275text(34);
    \u0275\u0275pipe(35, "date");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(36, "div")(37, "dt", 24);
    \u0275\u0275text(38, "Verification Code");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(39, "dd", 28);
    \u0275\u0275text(40);
    \u0275\u0275elementEnd()()();
    \u0275\u0275template(41, VerifyComponent_div_16_div_41_Template, 4, 1, "div", 29);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const r_r3 = ctx.ngIf;
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(13);
    \u0275\u0275textInterpolate(r_r3.studentName);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(r_r3.certificateTitle);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(r_r3.certificateNumber);
    \u0275\u0275advance(5);
    \u0275\u0275classMap(ctx_r1.typeBadge(r_r3.type));
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(r_r3.type);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind2(35, 9, r_r3.issueDate, "longDate"));
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate(r_r3.verificationCode);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", !ctx_r1.qrError);
  }
}
function VerifyComponent_div_17_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 16)(1, "div", 33)(2, "div", 34);
    \u0275\u0275namespaceSVG();
    \u0275\u0275elementStart(3, "svg", 19);
    \u0275\u0275element(4, "path", 35);
    \u0275\u0275elementEnd()();
    \u0275\u0275namespaceHTML();
    \u0275\u0275elementStart(5, "h2", 36);
    \u0275\u0275text(6, "Certificate Not Found");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(7, "div", 37);
    \u0275\u0275text(8, " No certificate matches code ");
    \u0275\u0275elementStart(9, "strong", 38);
    \u0275\u0275text(10);
    \u0275\u0275elementEnd();
    \u0275\u0275text(11, ". Please double-check and try again. ");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(10);
    \u0275\u0275textInterpolate(ctx_r1.code);
  }
}
function VerifyComponent_div_18_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 39)(1, "p", 40);
    \u0275\u0275text(2, "A network error occurred. Please try again later.");
    \u0275\u0275elementEnd()();
  }
}
var VerifyComponent = class _VerifyComponent {
  constructor() {
    this.http = inject(HttpClient);
    this.base = environment.apiUrl;
    this.code = "";
    this.qrError = false;
    this.loading = signal(false);
    this.result = signal(null);
    this.showError = signal(false);
    this.networkError = signal(false);
  }
  verify() {
    const c = this.code.trim();
    if (!c)
      return;
    this.loading.set(true);
    this.result.set(null);
    this.showError.set(false);
    this.networkError.set(false);
    this.qrError = false;
    this.http.get(`${this.base}/certificates/verify/${c}`).subscribe({
      next: (res) => {
        this.loading.set(false);
        if (res.valid) {
          this.result.set(res);
        } else {
          this.showError.set(true);
        }
      },
      error: (err) => {
        this.loading.set(false);
        if (err.status === 404 || err.status === 400) {
          this.showError.set(true);
        } else {
          this.networkError.set(true);
        }
      }
    });
  }
  qrUrl(verificationCode) {
    return `${this.base}/certificates/qrcode/${verificationCode}.png`;
  }
  typeBadge(type) {
    const map = {
      INTERNSHIP: "inline-block px-3 py-1 rounded-full text-xs font-bold bg-violet-100 text-violet-700",
      TRAINING: "inline-block px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700",
      COMPLETION: "inline-block px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-700",
      LEVEL: "inline-block px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700",
      PARTICIPATION: "inline-block px-3 py-1 rounded-full text-xs font-bold bg-sky-100 text-sky-700"
    };
    return map[type] ?? "inline-block px-3 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-700";
  }
  static {
    this.\u0275fac = function VerifyComponent_Factory(t) {
      return new (t || _VerifyComponent)();
    };
  }
  static {
    this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _VerifyComponent, selectors: [["app-verify"]], standalone: true, features: [\u0275\u0275StandaloneFeature], decls: 21, vars: 7, consts: [[1, "min-h-screen", "flex", "items-center", "justify-center", "bg-gradient-to-br", "from-indigo-950", "via-purple-900", "to-violet-900", "p-6"], [1, "w-full", "max-w-lg"], [1, "text-center", "mb-8"], [1, "inline-flex", "items-center", "justify-center", "w-16", "h-16", "rounded-2xl", "bg-white/10", "backdrop-blur", "mb-4"], ["fill", "none", "stroke", "currentColor", "viewBox", "0 0 24 24", 1, "w-8", "h-8", "text-white"], ["stroke-linecap", "round", "stroke-linejoin", "round", "stroke-width", "2", "d", "M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"], [1, "text-3xl", "font-bold", "text-white"], [1, "text-indigo-300", "mt-2", "text-sm"], [1, "bg-white", "rounded-2xl", "shadow-2xl", "p-6", "mb-4"], [1, "flex", "gap-3"], ["type", "text", "placeholder", "e.g. CERT-2024-ABC123", 1, "flex-1", "border", "border-gray-200", "rounded-xl", "px-4", "py-3", "text-sm", "focus:outline-none", "focus:ring-2", "focus:ring-violet-500", "focus:border-transparent", 3, "ngModelChange", "keyup.enter", "ngModel"], [1, "bg-violet-600", "hover:bg-violet-700", "disabled:opacity-50", "text-white", "font-semibold", "px-6", "py-3", "rounded-xl", "transition-colors", "text-sm", "whitespace-nowrap", 3, "click", "disabled"], [4, "ngIf"], ["class", "bg-white rounded-2xl shadow-2xl overflow-hidden", 4, "ngIf"], ["class", "bg-white rounded-2xl shadow-2xl p-6 text-center", 4, "ngIf"], [1, "text-center", "text-indigo-300/60", "text-xs", "mt-6"], [1, "bg-white", "rounded-2xl", "shadow-2xl", "overflow-hidden"], [1, "bg-emerald-50", "border-b", "border-emerald-100", "px-6", "py-4", "flex", "items-center", "gap-3"], [1, "w-8", "h-8", "rounded-full", "bg-emerald-500", "flex", "items-center", "justify-center"], ["fill", "none", "stroke", "currentColor", "viewBox", "0 0 24 24", 1, "w-5", "h-5", "text-white"], ["stroke-linecap", "round", "stroke-linejoin", "round", "stroke-width", "2.5", "d", "M5 13l4 4L19 7"], [1, "text-emerald-800", "font-bold", "text-lg"], [1, "p-6"], [1, "grid", "grid-cols-2", "gap-4", "mb-6"], [1, "text-xs", "text-gray-400", "uppercase", "tracking-wider"], [1, "font-semibold", "text-gray-800", "mt-1"], [1, "font-mono", "text-sm", "text-violet-700", "mt-1"], [1, "mt-1"], [1, "font-mono", "text-xs", "bg-violet-50", "text-violet-700", "px-2", "py-1", "rounded", "mt-1", "inline-block"], ["class", "flex flex-col items-center gap-2 border-t pt-4", 4, "ngIf"], [1, "flex", "flex-col", "items-center", "gap-2", "border-t", "pt-4"], [1, "text-xs", "text-gray-400"], ["alt", "QR Code", 1, "w-40", "h-40", "object-contain", "border", "border-gray-100", "rounded-xl", 3, "error", "src"], [1, "bg-red-50", "border-b", "border-red-100", "px-6", "py-4", "flex", "items-center", "gap-3"], [1, "w-8", "h-8", "rounded-full", "bg-red-500", "flex", "items-center", "justify-center"], ["stroke-linecap", "round", "stroke-linejoin", "round", "stroke-width", "2.5", "d", "M6 18L18 6M6 6l12 12"], [1, "text-red-800", "font-bold", "text-lg"], [1, "p-6", "text-center", "text-gray-600", "text-sm"], [1, "font-mono"], [1, "bg-white", "rounded-2xl", "shadow-2xl", "p-6", "text-center"], [1, "text-red-600", "text-sm"]], template: function VerifyComponent_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275elementStart(0, "div", 0)(1, "div", 1)(2, "div", 2)(3, "div", 3);
        \u0275\u0275namespaceSVG();
        \u0275\u0275elementStart(4, "svg", 4);
        \u0275\u0275element(5, "path", 5);
        \u0275\u0275elementEnd()();
        \u0275\u0275namespaceHTML();
        \u0275\u0275elementStart(6, "h1", 6);
        \u0275\u0275text(7, "Verify Certificate");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(8, "p", 7);
        \u0275\u0275text(9, "Enter the verification code printed on your certificate");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(10, "div", 8)(11, "div", 9)(12, "input", 10);
        \u0275\u0275twoWayListener("ngModelChange", function VerifyComponent_Template_input_ngModelChange_12_listener($event) {
          \u0275\u0275twoWayBindingSet(ctx.code, $event) || (ctx.code = $event);
          return $event;
        });
        \u0275\u0275listener("keyup.enter", function VerifyComponent_Template_input_keyup_enter_12_listener() {
          return ctx.verify();
        });
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(13, "button", 11);
        \u0275\u0275listener("click", function VerifyComponent_Template_button_click_13_listener() {
          return ctx.verify();
        });
        \u0275\u0275template(14, VerifyComponent_span_14_Template, 2, 0, "span", 12)(15, VerifyComponent_span_15_Template, 2, 0, "span", 12);
        \u0275\u0275elementEnd()()();
        \u0275\u0275template(16, VerifyComponent_div_16_Template, 42, 12, "div", 13)(17, VerifyComponent_div_17_Template, 12, 1, "div", 13)(18, VerifyComponent_div_18_Template, 3, 0, "div", 14);
        \u0275\u0275elementStart(19, "p", 15);
        \u0275\u0275text(20, " Learnivo \u2013 English School Management Platform ");
        \u0275\u0275elementEnd()()();
      }
      if (rf & 2) {
        \u0275\u0275advance(12);
        \u0275\u0275twoWayProperty("ngModel", ctx.code);
        \u0275\u0275advance();
        \u0275\u0275property("disabled", !ctx.code.trim() || ctx.loading());
        \u0275\u0275advance();
        \u0275\u0275property("ngIf", ctx.loading());
        \u0275\u0275advance();
        \u0275\u0275property("ngIf", !ctx.loading());
        \u0275\u0275advance();
        \u0275\u0275property("ngIf", ctx.result());
        \u0275\u0275advance();
        \u0275\u0275property("ngIf", ctx.showError());
        \u0275\u0275advance();
        \u0275\u0275property("ngIf", ctx.networkError());
      }
    }, dependencies: [CommonModule, NgIf, DatePipe, FormsModule, DefaultValueAccessor, NgControlStatus, NgModel], encapsulation: 2 });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(VerifyComponent, { className: "VerifyComponent", filePath: "src\\app\\features\\verify\\verify.component.ts", lineNumber: 121 });
})();
export {
  VerifyComponent
};
//# sourceMappingURL=chunk-Q6AVI5XE.js.map
