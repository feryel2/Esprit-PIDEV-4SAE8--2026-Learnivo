import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss'],
})
export class AdminDashboardComponent implements OnInit {
  totalUsers = 0;
  activeUsers = 0;
  coursesCount = 0; // placeholder; backend endpoint not present
  recentUsers: any[] = [];

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    // fetch a large page to compute simple stats (suitable for small datasets)
    this.userService.getAllUsers(0, 1000).subscribe((page) => {
      this.totalUsers = page.totalElements;
      this.activeUsers = page.content.filter((u) => u.status === 'ACTIVE').length;
      this.recentUsers = page.content.slice(0, 5);
    });
  }
}
