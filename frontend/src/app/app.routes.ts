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
import { AdminClubsComponent } from './pages/admin/admin-clubs.component';
import { AdminEventsComponent } from './pages/admin/admin-events.component';
import { CompetitionsComponent } from './pages/competitions.component';
import { CompetitionDetailComponent } from './pages/competition-detail.component';
import { ClassesComponent } from './pages/classes.component';
import { AdminCompetitionsComponent } from './pages/admin/admin-competitions.component';
import { AdminClassesComponent } from './pages/admin/admin-classes.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'trainings', component: TrainingsComponent },
    { path: 'trainings/:slug', component: TrainingDetailComponent },
    { path: 'trainings/:slug/:chapterId', component: ChapterDetailComponent },
    { path: 'clubs', component: ClubsComponent },
    { path: 'clubs/:slug', component: ClubDetailComponent },
    { path: 'events', component: EventsComponent },
    { path: 'events/:slug', component: EventDetailComponent },
    { path: 'competitions', component: CompetitionsComponent },
    { path: 'competitions/:slug', component: CompetitionDetailComponent },
    { path: 'classes', component: ClassesComponent },
    { path: 'certificate', component: CertificateComponent },

    // Admin Routes
    {
        path: 'admin',
        component: AdminLayoutComponent,
        children: [
            { path: '', component: AdminDashboardComponent },
            { path: 'trainings', component: AdminTrainingsComponent },
            { path: 'clubs', component: AdminClubsComponent },
            { path: 'events', component: AdminEventsComponent },
            { path: 'competitions', component: AdminCompetitionsComponent },
            { path: 'classes', component: AdminClassesComponent },
        ]
    }
];
