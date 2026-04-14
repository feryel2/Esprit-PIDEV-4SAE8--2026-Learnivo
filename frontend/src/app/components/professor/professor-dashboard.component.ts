import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SidebarComponent } from '../shared/sidebar/sidebar.component';

@Component({
  selector: 'app-professor-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, SidebarComponent],
  templateUrl: './professor-dashboard.component.html',
  styleUrls: ['./professor-dashboard.component.scss'],
})
export class ProfessorDashboardComponent {}
