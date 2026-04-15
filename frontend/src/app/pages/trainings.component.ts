import { Component, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, Search, ArrowRight } from 'lucide-angular';
import { PaginationComponent } from '../components/ui/pagination.component';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-trainings',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, LucideAngularModule, PaginationComponent],
  templateUrl: './trainings.component.html',
})
export class TrainingsComponent {
  data = inject(DataService);
  readonly pageSize = 4;

  readonly SearchIcon = Search;
  readonly ArrowRightIcon = ArrowRight;

  search = signal('');
  typeFilter = signal('All');
  levelFilters = signal<string[]>([]);
  currentPage = signal(1);

  types = ["All", "Blended", "Live"];
  levels = ["Beginner", "Intermediate", "Mid-level", "Upper-intermediate", "Advanced"];

  filteredTrainings = computed(() => {
    return this.data.publishedTrainings().filter((t) => {
      if (this.search() && !t.title.toLowerCase().includes(this.search().toLowerCase())) return false;
      if (this.typeFilter() === "Blended" && t.type !== "Blended course") return false;
      if (this.typeFilter() === "Live" && t.type !== "Live classes") return false;
      if (this.levelFilters().length > 0 && !this.levelFilters().includes(t.level)) return false;
      return true;
    });
  });

  totalPages = computed(() => Math.max(1, Math.ceil(this.filteredTrainings().length / this.pageSize)));

  paginatedTrainings = computed(() => {
    const page = Math.min(this.currentPage(), this.totalPages());
    const start = (page - 1) * this.pageSize;
    return this.filteredTrainings().slice(start, start + this.pageSize);
  });

  toggleLevel(level: string) {
    const currentFilters = this.levelFilters();
    if (currentFilters.includes(level)) {
      this.levelFilters.set(currentFilters.filter((l) => l !== level));
    } else {
      this.levelFilters.set([...currentFilters, level]);
    }
  }

  resetFilters() {
    this.search.set('');
    this.typeFilter.set('All');
    this.levelFilters.set([]);
    this.currentPage.set(1);
  }

  onPageChange(page: number) {
    this.currentPage.set(page);
  }
}
