import { Component } from '@angular/core';
import { Search, Bell, User, Menu } from 'lucide-angular';
import { LucideAngularModule } from 'lucide-angular';

@Component({
    selector: 'app-admin-header',
    standalone: true,
    imports: [LucideAngularModule],
    template: `
    <header class="h-16 bg-white border-b border-border flex items-center justify-between px-8 sticky top-0 z-10">
      <div class="flex items-center gap-4">
        <button class="p-2 hover:bg-muted rounded-lg lg:hidden">
          <lucide-icon [name]="Menu" [size]="20"></lucide-icon>
        </button>
        <div class="relative hidden md:block">
          <lucide-icon [name]="Search" [size]="18" class="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"></lucide-icon>
          <input type="text" placeholder="Search for anything..." 
                 class="pl-10 pr-4 py-2 bg-muted/50 border-none rounded-xl text-sm focus:ring-2 focus:ring-teal-600 transition-all w-64">
        </div>
      </div>

      <div class="flex items-center gap-4">
        <button class="relative p-2 hover:bg-muted rounded-lg transition-all group">
          <lucide-icon [name]="Bell" [size]="20"></lucide-icon>
          <span class="absolute top-2 right-2 w-2 h-2 bg-teal-600 rounded-full border-2 border-white"></span>
          <!-- Tooltip or dropdown could go here -->
        </button>
        
        <div class="h-8 w-px bg-border mx-2"></div>
        
        <button class="flex items-center gap-3 p-1.5 hover:bg-muted rounded-xl transition-all group">
          <div class="w-8 h-8 rounded-lg bg-teal-50 flex items-center justify-center text-teal-600 font-bold group-hover:bg-teal-600 group-hover:text-white transition-all">
            <lucide-icon [name]="User" [size]="18"></lucide-icon>
          </div>
          <div class="text-left hidden sm:block">
            <p class="text-xs font-bold leading-tight">Admin User</p>
            <p class="text-[10px] text-muted-foreground">Super Admin</p>
          </div>
        </button>
      </div>
    </header>
  `
})
export class AdminHeaderComponent {
    readonly Search = Search;
    readonly Bell = Bell;
    readonly User = User;
    readonly Menu = Menu;
}
