import {
  RouterLink
} from "./chunk-I4WURJ7J.js";
import {
  ApiService,
  MatCard,
  MatCardContent,
  MatCardHeader,
  MatCardModule,
  MatCardTitle,
  MatProgressSpinner,
  MatProgressSpinnerModule
} from "./chunk-2OTR3BIU.js";
import {
  MatIcon,
  MatIconModule
} from "./chunk-GFFSABAI.js";
import {
  MatButton,
  MatButtonModule
} from "./chunk-2S7VUNQ4.js";
import "./chunk-J44C53DG.js";
import {
  CommonModule,
  NgForOf,
  NgIf,
  inject,
  ɵsetClassDebugInfo,
  ɵɵStandaloneFeature,
  ɵɵadvance,
  ɵɵdefineComponent,
  ɵɵelement,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵnextContext,
  ɵɵproperty,
  ɵɵstyleProp,
  ɵɵtemplate,
  ɵɵtext,
  ɵɵtextInterpolate
} from "./chunk-EUR4AY6M.js";

// src/app/features/dashboard/dashboard.component.ts
function DashboardComponent_div_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 4);
    \u0275\u0275element(1, "mat-spinner", 5);
    \u0275\u0275elementEnd();
  }
}
function DashboardComponent_div_3_mat_card_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "mat-card", 8)(1, "mat-card-content")(2, "div", 9)(3, "mat-icon");
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(5, "div", 10)(6, "div", 11);
    \u0275\u0275text(7);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "div", 12);
    \u0275\u0275text(9);
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    const c_r1 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275styleProp("--accent", c_r1.color);
    \u0275\u0275property("routerLink", c_r1.route);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(c_r1.icon);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx_r1.stats[c_r1.key]);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(c_r1.label);
  }
}
function DashboardComponent_div_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 6);
    \u0275\u0275template(1, DashboardComponent_div_3_mat_card_1_Template, 10, 6, "mat-card", 7);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275property("ngForOf", ctx_r1.cards);
  }
}
function DashboardComponent_mat_card_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "mat-card", 13)(1, "mat-card-header")(2, "mat-card-title");
    \u0275\u0275text(3, "Quick Actions");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(4, "mat-card-content", 14)(5, "button", 15);
    \u0275\u0275text(6, "+ New Internship");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "button", 16);
    \u0275\u0275text(8, "+ New Application");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "button", 17);
    \u0275\u0275text(10, "+ Issue Certificate");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(11, "button", 18);
    \u0275\u0275text(12, "+ New Event");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(13, "button", 19);
    \u0275\u0275text(14, "Verify Certificate");
    \u0275\u0275elementEnd()()();
  }
}
var DashboardComponent = class _DashboardComponent {
  constructor() {
    this.api = inject(ApiService);
    this.stats = null;
    this.loading = true;
    this.cards = [
      { label: "Certificates", icon: "card_membership", color: "#7c3aed", key: "certificates", route: "/certificates" },
      { label: "Internships", icon: "work", color: "#2563eb", key: "internships", route: "/internships" },
      { label: "Applications", icon: "description", color: "#d97706", key: "applications", route: "/applications" },
      { label: "Events", icon: "event", color: "#059669", key: "events", route: "/events" }
    ];
  }
  ngOnInit() {
    this.api.getDashboardStats().subscribe({
      next: (s) => {
        this.stats = s;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }
  static {
    this.\u0275fac = function DashboardComponent_Factory(t) {
      return new (t || _DashboardComponent)();
    };
  }
  static {
    this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _DashboardComponent, selectors: [["app-dashboard"]], standalone: true, features: [\u0275\u0275StandaloneFeature], decls: 5, vars: 3, consts: [[1, "page-title"], ["class", "spinner-center", 4, "ngIf"], ["class", "stat-grid", 4, "ngIf"], ["class", "info-card", 4, "ngIf"], [1, "spinner-center"], ["diameter", "48"], [1, "stat-grid"], ["class", "stat-card", 3, "--accent", "routerLink", 4, "ngFor", "ngForOf"], [1, "stat-card", 3, "routerLink"], [1, "stat-icon-wrap"], [1, "stat-info"], [1, "stat-value"], [1, "stat-label"], [1, "info-card"], [1, "actions-row"], ["mat-raised-button", "", "color", "primary", "routerLink", "/internships"], ["mat-raised-button", "", "color", "primary", "routerLink", "/applications"], ["mat-raised-button", "", "color", "primary", "routerLink", "/certificates"], ["mat-raised-button", "", "color", "primary", "routerLink", "/events"], ["mat-stroked-button", "", "color", "accent", "routerLink", "/verify"]], template: function DashboardComponent_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275elementStart(0, "h1", 0);
        \u0275\u0275text(1, "Dashboard");
        \u0275\u0275elementEnd();
        \u0275\u0275template(2, DashboardComponent_div_2_Template, 2, 0, "div", 1)(3, DashboardComponent_div_3_Template, 2, 1, "div", 2)(4, DashboardComponent_mat_card_4_Template, 15, 0, "mat-card", 3);
      }
      if (rf & 2) {
        \u0275\u0275advance(2);
        \u0275\u0275property("ngIf", ctx.loading);
        \u0275\u0275advance();
        \u0275\u0275property("ngIf", !ctx.loading && ctx.stats);
        \u0275\u0275advance();
        \u0275\u0275property("ngIf", !ctx.loading);
      }
    }, dependencies: [CommonModule, NgForOf, NgIf, RouterLink, MatCardModule, MatCard, MatCardContent, MatCardHeader, MatCardTitle, MatIconModule, MatIcon, MatButtonModule, MatButton, MatProgressSpinnerModule, MatProgressSpinner], styles: ["\n\n.page-title[_ngcontent-%COMP%] {\n  font-size: 1.6rem;\n  font-weight: 600;\n  margin-bottom: 24px;\n  color: #311b92;\n}\n.spinner-center[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: center;\n  padding: 60px;\n}\n.stat-grid[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));\n  gap: 20px;\n  margin-bottom: 28px;\n}\n.stat-card[_ngcontent-%COMP%] {\n  cursor: pointer;\n  transition: transform .2s;\n  border-top: 4px solid var(--accent);\n}\n.stat-card[_ngcontent-%COMP%]:hover {\n  transform: translateY(-3px);\n}\nmat-card-content[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 16px;\n  padding: 20px !important;\n}\n.stat-icon-wrap[_ngcontent-%COMP%] {\n  width: 52px;\n  height: 52px;\n  border-radius: 50%;\n  background: var(--accent);\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  mat-icon {\n    color: white;\n    font-size: 28px;\n    width: 28px;\n    height: 28px;\n  }\n}\n.stat-value[_ngcontent-%COMP%] {\n  font-size: 2rem;\n  font-weight: 700;\n  color: #1a1a2e;\n}\n.stat-label[_ngcontent-%COMP%] {\n  font-size: .85rem;\n  color: #666;\n  margin-top: 2px;\n}\n.info-card[_ngcontent-%COMP%] {\n  margin-top: 8px;\n}\n.actions-row[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 12px;\n  flex-wrap: wrap;\n  padding: 16px !important;\n}\n/*# sourceMappingURL=dashboard.component.css.map */"] });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(DashboardComponent, { className: "DashboardComponent", filePath: "src\\app\\features\\dashboard\\dashboard.component.ts", lineNumber: 64 });
})();
export {
  DashboardComponent
};
//# sourceMappingURL=chunk-RAYFTDSR.js.map
