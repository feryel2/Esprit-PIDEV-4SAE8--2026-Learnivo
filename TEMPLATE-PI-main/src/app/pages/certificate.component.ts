import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Download } from 'lucide-angular';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-certificate',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './certificate.component.html',
})
export class CertificateComponent {
  readonly DownloadIcon = Download;
  
  constructor(private dataService: DataService) {}

  downloadCertificate(eventId: number | string, studentId: number | string) {
    this.dataService.downloadCertificate(eventId, studentId);
  }
}
