import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { LucideAngularModule, ArrowRight } from 'lucide-angular';
import { DataService, Training } from '../services/data.service';
import { LearningProgressService } from '../services/learning-progress.service';

@Component({
  selector: 'app-training-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, LucideAngularModule],
  templateUrl: './training-detail.component.html',
})
export class TrainingDetailComponent implements OnInit {
  private dataService = inject(DataService);
  private route = inject(ActivatedRoute);
  private learningProgress = inject(LearningProgressService);

  readonly ArrowRightIcon = ArrowRight;

  training = signal<Training | null>(null);

  ngOnInit() {
    this.route.params.subscribe(params => {
      void this.loadTraining(params['slug']);
    });
  }

  private async loadTraining(slug: string) {
    try {
      const found = await this.dataService.getTrainingBySlug(slug);
      this.training.set(found);
    } catch {
      this.training.set(this.dataService.trainings()[0] ?? null);
    }
  }

  continueLearningLink() {
    const current = this.training();
    if (!current) return ['/courses'];
    return this.learningProgress.getNextLearningRoute(current);
  }
}
