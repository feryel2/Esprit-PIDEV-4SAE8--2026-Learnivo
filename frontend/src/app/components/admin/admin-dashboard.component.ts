import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { UserService } from '../../services/user.service';
import { SidebarComponent } from '../shared/sidebar/sidebar.component';

@Component({
  selector: 'app-user-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, SidebarComponent],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss'],
})
export class UserAdminDashboardComponent implements OnInit {
  totalUsers = 0;
  activeUsers = 0;
  coursesCount = 0;
  recentUsers: any[] = [];

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.userService.getAllUsers(0, 1000).subscribe((page) => {
      this.totalUsers = page.totalElements;
      this.activeUsers = page.content.filter((u) => u.status === 'ACTIVE').length;
      this.recentUsers = page.content.slice(0, 5);
    });
  }
}
