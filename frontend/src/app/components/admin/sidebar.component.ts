import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import {
  LayoutDashboard,
  GraduationCap,
  Users,
  Calendar,
  Settings,
  LogOut,
  ChevronRight,
  Trophy,
  Video,
  Grid3x3,
  Grid
} from 'lucide-angular';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, LucideAngularModule],
  template: `
    <aside class="sidebar-wrapper fixed top-0 left-0 h-screen w-64 bg-white border-r border-slate-200 flex flex-col z-[100] overflow-hidden">
      <!-- Logo Section -->
      <div class="p-6 border-b border-slate-100 flex items-center gap-3 bg-white">
        <div class="logo-orb">
            <span class="text-white font-black text-xl">L</span>
        </div>
        <div class="flex flex-col min-w-0">
          <span class="font-black text-lg tracking-tight text-slate-900 truncate">Learn<span class="text-teal-500">ivo</span></span>
          <span class="text-[9px] uppercase tracking-widest font-bold text-slate-400">Admin Control</span>
        </div>
      </div>

      <!-- Navigation -->
      <nav class="flex-1 px-4 py-6 space-y-1 overflow-y-auto custom-scrollbar bg-white">
        <div class="nav-section-label">General</div>
        
        <a routerLink="/admin" routerLinkActive="nav-active" [routerLinkActiveOptions]="{exact: true}" 
           class="nav-link group">
          <div class="flex items-center gap-3">
            <lucide-icon [name]="LayoutDashboard" [size]="18" class="icon-nav"></lucide-icon>
            <span class="link-text">Dashboard</span>
          </div>
        </a>

        <div class="nav-section-label pt-4">Management</div>

        <a routerLink="/admin/trainings" routerLinkActive="nav-active" class="nav-link group">
          <div class="flex items-center gap-3">
             <lucide-icon [name]="GraduationCap" [size]="18" class="icon-nav"></lucide-icon>
             <span class="link-text">Trainings</span>
          </div>
        </a>

        <a routerLink="/admin/students" routerLinkActive="nav-active" class="nav-link group">
          <div class="flex items-center gap-3">
            <lucide-icon [name]="Users" [size]="18" class="icon-nav"></lucide-icon>
            <span class="link-text">Students</span>
          </div>
        </a>

        <a routerLink="/admin/professors" routerLinkActive="nav-active" class="nav-link group">
          <div class="flex items-center gap-3">
            <lucide-icon [name]="Users" [size]="18" class="icon-nav"></lucide-icon>
            <span class="link-text">Professors</span>
          </div>
        </a>

        <div class="nav-section-label pt-4">Engagement</div>

        <a routerLink="/admin/clubs" routerLinkActive="nav-active" class="nav-link group">
          <div class="flex items-center gap-3">
            <lucide-icon [name]="Users" [size]="18" class="icon-nav"></lucide-icon>
            <span class="link-text">Clubs</span>
          </div>
        </a>

        <a routerLink="/admin/club-memberships" routerLinkActive="nav-active" class="nav-link group">
          <div class="flex items-center gap-3">
            <lucide-icon [name]="Users" [size]="18" class="icon-nav"></lucide-icon>
            <span class="link-text">Club Members</span>
          </div>
        </a>

        <a routerLink="/admin/events" routerLinkActive="nav-active" class="nav-link group">
          <div class="flex items-center gap-3">
            <lucide-icon [name]="Calendar" [size]="18" class="icon-nav"></lucide-icon>
            <span class="link-text">Events</span>
          </div>
        </a>

        <a routerLink="/admin/event-registrations" routerLinkActive="nav-active" class="nav-link group">
          <div class="flex items-center gap-3">
            <lucide-icon [name]="Calendar" [size]="18" class="icon-nav"></lucide-icon>
            <span class="link-text">Registrations</span>
          </div>
        </a>

        <a routerLink="/admin/competitions" routerLinkActive="nav-active" class="nav-link group">
          <div class="flex items-center gap-3">
            <lucide-icon [name]="Trophy" [size]="18" class="icon-nav"></lucide-icon>
            <span class="link-text">Competitions</span>
          </div>
        </a>

        <a routerLink="/admin/classes" routerLinkActive="nav-active" class="nav-link group">
          <div class="flex items-center gap-3">
            <lucide-icon [name]="Video" [size]="18" class="icon-nav"></lucide-icon>
            <span class="link-text">Classes</span>
          </div>
        </a>

        <div class="nav-section-label pt-4">Gamer Zone</div>

        <a routerLink="/admin/english-bingo" routerLinkActive="nav-active" class="nav-link group">
          <div class="flex items-center gap-3">
            <lucide-icon [name]="Grid3x3" [size]="18" class="icon-nav"></lucide-icon>
            <span class="link-text">English Bingo</span>
          </div>
        </a>

        <a routerLink="/admin/crossword" routerLinkActive="nav-active" class="nav-link group">
          <div class="flex items-center gap-3">
            <lucide-icon [name]="Grid" [size]="18" class="icon-nav"></lucide-icon>
            <span class="link-text">Crossword Studio</span>
          </div>
        </a>
      </nav>

      <!-- Bottom Actions -->
      <div class="p-4 border-t border-slate-100 bg-white space-y-2">
        <a routerLink="/admin/settings" routerLinkActive="nav-active" 
           class="nav-link group text-slate-500">
           <div class="flex items-center gap-3">
             <lucide-icon [name]="Settings" [size]="18"></lucide-icon>
             <span class="link-text">Settings</span>
           </div>
        </a>
        
        <a routerLink="/" class="logout-btn">
          <lucide-icon [name]="LogOut" [size]="18"></lucide-icon>
          <span class="font-bold">Exit Console</span>
        </a>
      </div>
    </aside>
  `,
  styles: [`
    .sidebar-wrapper {
      box-shadow: 4px 0 24px rgba(0,0,0,0.02);
      font-family: 'Outfit', sans-serif;
    }

    .logo-orb {
      width: 40px; height: 40px;
      background: linear-gradient(135deg, #14b8a6, #0d9488);
      border-radius: 12px;
      display: flex; align-items: center; justify-content: center;
      flex-shrink: 0;
    }

    .nav-section-label {
      font-size: 10px; font-weight: 800; text-transform: uppercase;
      letter-spacing: 1px; color: #94a3b8; padding: 0 12px 8px 12px;
    }

    .nav-link {
      display: flex; align-items: center;
      padding: 10px 16px; border-radius: 12px; color: #64748b;
      transition: all 0.2s; text-decoration: none;
    }

    .nav-link:hover { background: #f8fafc; color: #1e293b; }
    
    .nav-link.nav-active { 
       background: #14b8a6; color: white !important;
       box-shadow: 0 4px 12px rgba(20, 184, 166, 0.25);
    }

    .link-text { font-weight: 600; font-size: 14px; }
    .icon-nav { opacity: 0.7; }
    .nav-active .icon-nav { opacity: 1; color: white !important; }

    .logout-btn {
      display: flex; align-items: center; gap: 10px; padding: 12px;
      background: #fff1f2; color: #e11d48; border-radius: 12px;
      transition: all 0.2s; cursor: pointer; text-decoration: none;
      font-size: 14px;
    }
    .logout-btn:hover { background: #e11d48; color: white !important; }

    .custom-scrollbar::-webkit-scrollbar { width: 4px; }
    .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
  `]
})
export class SidebarComponent {
  readonly LayoutDashboard = LayoutDashboard;
  readonly GraduationCap = GraduationCap;
  readonly Users = Users;
  readonly Calendar = Calendar;
  readonly Settings = Settings;
  readonly LogOut = LogOut;
  readonly ChevronRight = ChevronRight;
  readonly Trophy = Trophy;
  readonly Video = Video;
  readonly Grid3x3 = Grid3x3;
  readonly Grid = Grid;
}
