import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home.component';
import { TrainingsComponent } from './pages/trainings.component';
import { TrainingDetailComponent } from './pages/training-detail.component';
import { ChapterDetailComponent } from './pages/chapter-detail.component';
import { ClubsComponent } from './pages/clubs.component';
import { ClubDetailComponent } from './pages/club-detail.component';
import { EventsComponent } from './pages/events.component';
import { EventDetailComponent } from './pages/event-detail.component';
import { CertificateComponent } from './pages/certificate.component';

import { AdminLayoutComponent } from './components/admin/admin-layout.component';
import { AdminDashboardComponent } from './pages/admin/admin-dashboard.component';
import { AdminTrainingsComponent } from './pages/admin/admin-trainings.component';
import { AdminCourseCreateComponent } from './pages/admin/admin-course-create.component';
import { AdminCourseEditComponent } from './pages/admin/admin-course-edit.component';
import { AdminClubsComponent } from './pages/admin/admin-clubs.component';
import { AdminEventsComponent } from './pages/admin/admin-events.component';
import { CompetitionsComponent } from './pages/competitions.component';
import { CompetitionDetailComponent } from './pages/competition-detail.component';
import { ClassesComponent } from './pages/classes.component';
import { AdminCompetitionsComponent } from './pages/admin/admin-competitions.component';
import { AdminClassesComponent } from './pages/admin/admin-classes.component';
import { AdminQuizzesComponent } from './pages/admin/admin-quizzes.component';
import { AdminQuizCreateComponent } from './pages/admin/admin-quiz-create.component';
import { AdminQuizEditComponent } from './pages/admin/admin-quiz-edit.component';
import { LoginComponent } from './pages/login.component';
import { StudentDashboardComponent } from './pages/student-dashboard.component';
import { guestOnlyGuard, roleGuard } from './guards/auth.guards';

export const routes: Routes = [
    {
        path: 'teacher',
        component: AdminLayoutComponent,
        canActivate: [roleGuard('TEACHER')],
        children: [
            { path: '', component: AdminDashboardComponent },
            { path: 'courses', component: AdminTrainingsComponent },
            { path: 'courses/new', component: AdminCourseCreateComponent },
            { path: 'courses/:id/edit', component: AdminCourseEditComponent },
            { path: 'quizzes', component: AdminQuizzesComponent },
            { path: 'quizzes/new', component: AdminQuizCreateComponent },
            { path: 'quizzes/:id/edit', component: AdminQuizEditComponent },
            { path: 'clubs', component: AdminClubsComponent },
            { path: 'events', component: AdminEventsComponent },
            { path: 'competitions', component: AdminCompetitionsComponent },
            { path: 'classes', component: AdminClassesComponent },
        ]
    },
    { path: '', component: HomeComponent },
    { path: 'login', component: LoginComponent, canActivate: [guestOnlyGuard] },
    { path: 'student', component: StudentDashboardComponent, canActivate: [roleGuard('STUDENT')] },
    { path: 'courses', component: TrainingsComponent },
    { path: 'courses/:slug', component: TrainingDetailComponent },
    { path: 'courses/:slug/:chapterId', component: ChapterDetailComponent },
    { path: 'clubs', component: ClubsComponent },
    { path: 'clubs/:slug', component: ClubDetailComponent },
    { path: 'events', component: EventsComponent },
    { path: 'events/:slug', component: EventDetailComponent },
    { path: 'competitions', component: CompetitionsComponent },
    { path: 'competitions/:slug', component: CompetitionDetailComponent },
    { path: 'classes', component: ClassesComponent },
    { path: 'certificate', component: CertificateComponent },

    // Backward-compatible teacher alias for existing management pages
    {
        path: 'admin',
        component: AdminLayoutComponent,
        canActivate: [roleGuard('TEACHER')],
        children: [
            { path: '', component: AdminDashboardComponent },
            { path: 'courses', component: AdminTrainingsComponent },
            { path: 'courses/new', component: AdminCourseCreateComponent },
            { path: 'courses/:id/edit', component: AdminCourseEditComponent },
            { path: 'quizzes', component: AdminQuizzesComponent },
            { path: 'quizzes/new', component: AdminQuizCreateComponent },
            { path: 'quizzes/:id/edit', component: AdminQuizEditComponent },
            { path: 'clubs', component: AdminClubsComponent },
            { path: 'events', component: AdminEventsComponent },
            { path: 'competitions', component: AdminCompetitionsComponent },
            { path: 'classes', component: AdminClassesComponent },
        ]
    }
];
