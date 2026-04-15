import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService } from '../../services/data.service';
import {
    Users,
    Plus,
    Search,
    MoreHorizontal,
    Mail,
    UserPlus
} from 'lucide-angular';
import { LucideAngularModule } from 'lucide-angular';

@Component({
    selector: 'app-admin-clubs',
    standalone: true,
    imports: [CommonModule, LucideAngularModule],
    template: `
    <div class="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div class="space-y-1">
          <h1 class="text-3xl font-extrabold tracking-tight">Manage <span class="text-teal-600 underline decoration-2 underline-offset-4">Clubs</span></h1>
          <p class="text-muted-foreground">Manage student clubs and community engagement.</p>
        </div>
        <button class="bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 transition-all transform hover:scale-105 shadow-lg shadow-teal-600/20 active:scale-95 group">
          <lucide-icon [name]="Plus" [size]="18" class="group-hover:rotate-90 transition-transform"></lucide-icon>
          Create New Club
        </button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <div *ngFor="let club of data.clubs()" class="bg-white rounded-3xl border border-border shadow-sm overflow-hidden group hover:shadow-xl transition-all duration-300">
            <div class="relative h-40">
                <img [src]="club.image" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500">
                <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div class="absolute bottom-4 left-4 text-white">
                    <h3 class="font-bold text-lg">{{ club.name }}</h3>
                    <p class="text-xs text-white/80">{{ club.members || 0 }} Active Members</p>
                </div>
                <button class="absolute top-4 right-4 p-2 bg-white/20 backdrop-blur-md rounded-xl text-white hover:bg-white/40 transition-all opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100">
                    <lucide-icon [name]="MoreHorizontal" [size]="18"></lucide-icon>
                </button>
            </div>
            <div class="p-6 space-y-4">
                <p class="text-sm text-muted-foreground line-clamp-2">{{ club.description }}</p>
                <div class="flex items-center justify-between pt-4 border-t border-border">
                    <div class="flex -space-x-2">
                        <div *ngFor="let i of [1,2,3,4]" class="w-8 h-8 rounded-lg border-2 border-white bg-teal-50 flex items-center justify-center text-[10px] font-bold text-teal-600 shadow-sm">
                            AD
                        </div>
                        <div class="w-8 h-8 rounded-lg border-2 border-white bg-muted flex items-center justify-center text-[10px] font-bold text-muted-foreground shadow-sm">
                            +{{ (club.members || 0) > 4 ? (club.members || 0) - 4 : 0 }}
                        </div>
                    </div>
                    <div class="flex items-center gap-2">
                        <button class="p-2 hover:bg-teal-50 text-teal-600 rounded-lg transition-all" title="Message Center">
                            <lucide-icon [name]="Mail" [size]="16"></lucide-icon>
                        </button>
                        <button class="p-2 hover:bg-teal-50 text-teal-600 rounded-lg transition-all" title="Invite Members">
                            <lucide-icon [name]="UserPlus" [size]="16"></lucide-icon>
                        </button>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  `
})
export class AdminClubsComponent {
    data = inject(DataService);
    readonly Users = Users;
    readonly Plus = Plus;
    readonly Search = Search;
    readonly MoreHorizontal = MoreHorizontal;
    readonly Mail = Mail;
    readonly UserPlus = UserPlus;
}
