import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { VerifyComponent } from './components/auth/verify/verify.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AdminDashboardComponent } from './components/admin/admin-dashboard.component';
import { UsersComponent } from './components/admin/users/users.component';
import { CoursesComponent } from './components/student/courses.component';
import { ProfessorDashboardComponent } from './components/professor/professor-dashboard.component';
import { RoleGuard } from './guards/role.guard';
import { Role } from './models/user.model';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'verify', component: VerifyComponent },
  { path: 'dashboard', component: DashboardComponent },
  {
    path: 'admin',
    component: AdminDashboardComponent,
    canActivate: [RoleGuard],
    data: { roles: [Role.ADMIN] },
  },
  {
    path: 'admin/users',
    component: UsersComponent,
    canActivate: [RoleGuard],
    data: { roles: [Role.ADMIN] },
  },
  {
    path: 'courses',
    component: CoursesComponent,
    canActivate: [RoleGuard],
    data: { roles: [Role.STUDENT] },
  },
  {
    path: 'professor',
    component: ProfessorDashboardComponent,
    canActivate: [RoleGuard],
    data: { roles: [Role.PROFESSOR] },
  },
  { path: 'needs', component: DashboardComponent },
  { path: 'profile', component: DashboardComponent },
  // future: dashboard, admin, tickets...
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
