import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog } from '@angular/material/dialog';
import { ApiService } from '../../core/services/api.service';
import { AppEvent } from '../../core/models/models';
import { EventDialogComponent } from './event-dialog.component';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-events',
  standalone: true,
  imports: [CommonModule, FormsModule, MatCardModule, MatTableModule, MatButtonModule,
            MatIconModule, MatInputModule, MatFormFieldModule, MatTooltipModule, MatProgressSpinnerModule],
  template: `
    <div class="page-header">
      <h1 class="page-title">Events</h1>
      <button mat-raised-button color="primary" (click)="openDialog()"><mat-icon>add</mat-icon> New Event</button>
    </div>
    <mat-card>
      <mat-card-content>
        <mat-form-field appearance="outline" class="search-field" style="margin-bottom:12px">
          <mat-label>Search</mat-label>
          <input matInput [(ngModel)]="search" placeholder="title or location…"/>
          <mat-icon matSuffix>search</mat-icon>
        </mat-form-field>
        <div *ngIf="loading" class="spinner-center"><mat-spinner diameter="40"/></div>
        <table mat-table [dataSource]="paged" class="full-table" *ngIf="!loading">
          <ng-container matColumnDef="title">
            <th mat-header-cell *matHeaderCellDef>Title</th>
            <td mat-cell *matCellDef="let r">{{ r.title }}</td>
          </ng-container>
          <ng-container matColumnDef="date">
            <th mat-header-cell *matHeaderCellDef>Date</th>
            <td mat-cell *matCellDef="let r">{{ r.date | date:'medium' }}</td>
          </ng-container>
          <ng-container matColumnDef="location">
            <th mat-header-cell *matHeaderCellDef>Location</th>
            <td mat-cell *matCellDef="let r">{{ r.location || '—' }}</td>
          </ng-container>
          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef>Actions</th>
            <td mat-cell *matCellDef="let r">
              <button mat-icon-button matTooltip="Edit"   (click)="openDialog(r)"><mat-icon>edit</mat-icon></button>
              <button mat-icon-button color="warn" matTooltip="Delete" (click)="delete(r)"><mat-icon>delete</mat-icon></button>
            </td>
          </ng-container>
          <tr mat-header-row *matHeaderRowDef="cols"></tr>
          <tr mat-row *matRowDef="let row; columns: cols;"></tr>
        </table>
        <div *ngIf="!loading && paged.length===0" class="empty-state"><mat-icon>event_busy</mat-icon><p>No events found.</p></div>
        <div class="pagination" *ngIf="totalPages>1">
          <button mat-icon-button [disabled]="page===0" (click)="page=page-1"><mat-icon>chevron_left</mat-icon></button>
          <span>{{ page+1 }} / {{ totalPages }}</span>
          <button mat-icon-button [disabled]="page>=totalPages-1" (click)="page=page+1"><mat-icon>chevron_right</mat-icon></button>
        </div>
      </mat-card-content>
    </mat-card>
  `,
  styles: [`
    .page-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;}
    .page-title{font-size:1.6rem;font-weight:600;color:#311b92;margin:0;}
    .search-field{width:100%;max-width:400px;}
    .full-table{width:100%;}.spinner-center{display:flex;justify-content:center;padding:40px;}
    .empty-state{text-align:center;padding:40px;color:#999;}
    .pagination{display:flex;align-items:center;justify-content:flex-end;gap:8px;margin-top:12px;}
  `]
})
export class EventsComponent implements OnInit {
  private api    = inject(ApiService);
  private dialog = inject(MatDialog);
  events: AppEvent[] = [];
  loading=true; search=''; page=0; pageSize=8; totalPages=1;
  cols=['title','date','location','actions'];

  get paged() {
    const q=this.search.toLowerCase();
    let list=this.events.filter(e=>!q||e.title.toLowerCase().includes(q)||(e.location??'').toLowerCase().includes(q));
    this.totalPages=Math.max(1,Math.ceil(list.length/this.pageSize));
    if(this.page>=this.totalPages)this.page=0;
    return list.slice(this.page*this.pageSize,(this.page+1)*this.pageSize);
  }

  ngOnInit(){this.load();}
  load(){this.loading=true;this.api.listEvents().subscribe({next:d=>{this.events=d;this.loading=false;},error:()=>{this.loading=false;}});}
  openDialog(item?:AppEvent){
    this.dialog.open(EventDialogComponent,{data:item??null,width:'480px'})
      .afterClosed().subscribe(v=>{
        if(!v)return;
        const obs=item?this.api.updateEvent(item.id,v):this.api.createEvent(v);
        obs.subscribe(()=>this.load());
      });
  }
  delete(item:AppEvent){
    this.dialog.open(ConfirmDialogComponent,{data:{title:'Delete Event',message:`Delete "${item.title}"?`}})
      .afterClosed().subscribe(ok=>{if(ok)this.api.deleteEvent(item.id).subscribe(()=>this.load());});
  }
}
