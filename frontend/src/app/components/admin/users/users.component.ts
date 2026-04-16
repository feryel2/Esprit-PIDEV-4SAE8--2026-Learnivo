import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { UserService, PageResponse, UserCreate, UserUpdate } from '../../../services/user.service';
import { User, Role } from '../../../models/user.model';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent implements OnInit {
  users: User[] = [];
  page = 0;
  size = 20;
  totalElements = 0;

  form: FormGroup;
  editingId: number | null = null;
  showForm = false;

  roles = Object.values(Role);

  constructor(private userService: UserService, private fb: FormBuilder) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: [''],
      role: [Role.STUDENT, [Validators.required]],
      firstName: [''],
      lastName: [''],
      status: ['ACTIVE'],
    });
  }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.userService.getAllUsers(this.page, this.size).subscribe((p: PageResponse<User>) => {
      this.users = p.content;
      this.totalElements = p.totalElements;
    });
  }

  openCreate(): void {
    this.showForm = true;
    this.editingId = null;
    this.form.reset({ role: Role.STUDENT, status: 'ACTIVE' });
  }

  openEdit(user: User): void {
    this.showForm = true;
    this.editingId = user.id;
    this.form.patchValue({
      email: user.email,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
      status: user.status,
    });
  }

  cancel(): void {
    this.showForm = false;
    this.editingId = null;
  }

  submit(): void {
    if (this.form.invalid) return;
    const value = this.form.value;
    if (this.editingId) {
      const payload: UserUpdate = {
        email: value.email,
        role: value.role,
        status: value.status,
        firstName: value.firstName,
        lastName: value.lastName,
      };
      if (value.password) (payload as any).password = value.password;
      this.userService.updateUser(this.editingId, payload).subscribe(() => {
        this.loadUsers();
        this.cancel();
      });
    } else {
      const payload: UserCreate = {
        email: value.email,
        password: value.password || 'changeme',
        role: value.role,
        firstName: value.firstName,
        lastName: value.lastName,
      };
      this.userService.createUser(payload).subscribe(() => {
        this.loadUsers();
        this.cancel();
      });
    }
  }

  deleteUser(id: number): void {
    if (!confirm('Delete user?')) return;
    this.userService.deleteUser(id).subscribe(() => this.loadUsers());
  }

  prevPage(): void {
    this.page = Math.max(0, this.page - 1);
    this.loadUsers();
  }

  nextPage(): void {
    this.page = this.page + 1;
    this.loadUsers();
  }
}
