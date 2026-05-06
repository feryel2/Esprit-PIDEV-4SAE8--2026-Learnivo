import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
    DataService,
    EnglishBingoAdminOverview,
    EnglishBingoClassDto,
    EnglishBingoWordAdminDto,
} from '../../services/data.service';
import { NotificationService } from '../../services/notification.service';
import { LucideAngularModule, Plus, Trash2, Grid3x3, BookOpen } from 'lucide-angular';

@Component({
    selector: 'app-admin-english-bingo',
    standalone: true,
    imports: [CommonModule, FormsModule, LucideAngularModule],
    template: `
    <div class="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div class="space-y-1">
        <h1 class="text-3xl font-extrabold tracking-tight">
          English <span class="text-teal-600 underline decoration-2 underline-offset-4">Bingo</span>
        </h1>
        <p class="text-muted-foreground">
          Créez des <strong>classes</strong> (ex. Vegetables, Food, Drinks) avec une image, puis des <strong>mots</strong> en cochant les classes qui s’appliquent.
          Aucun plateau : la grille et le mot sont tirés au hasard pendant le jeu.
        </p>
      </div>

      <div class="bg-white border border-border rounded-3xl shadow-sm p-6 space-y-4">
        <h2 class="text-xl font-extrabold flex items-center gap-2">
          <lucide-icon [name]="Grid3x3" [size]="22"></lucide-icon>
          Classes parentes
        </h2>
        <div class="flex flex-wrap gap-3 items-end max-w-xl">
          <div class="flex-1 min-w-[160px]">
            <label class="block text-xs font-semibold text-muted-foreground mb-1">Nom de la classe</label>
            <input
              [(ngModel)]="newClassLabel"
              name="newClassLabel"
              type="text"
              placeholder="ex: Vegetables"
              class="w-full px-3 py-2 rounded-xl border border-border text-sm"
            />
          </div>
          <div>
            <label class="block text-xs font-semibold text-muted-foreground mb-1">Image (PC)</label>
            <input type="file" accept="image/*" (change)="onClassFile($event)" class="text-sm" />
          </div>
          <button
            type="button"
            (click)="createClass()"
            [disabled]="uploadingClass"
            class="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-xl text-sm font-bold disabled:opacity-50"
          >
            {{ uploadingClass ? '…' : 'Ajouter' }}
          </button>
        </div>
        <ul class="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <li
            *ngFor="let c of overview?.classes ?? []"
            class="border border-border rounded-2xl p-3 flex gap-3 items-center bg-slate-50/80"
          >
            <img [src]="c.imageUrl" [alt]="c.label" class="w-16 h-16 rounded-lg object-cover shrink-0" />
            <div class="flex-1 min-w-0">
              <p class="font-semibold truncate">{{ c.label }}</p>
              <p class="text-[10px] text-muted-foreground">id {{ c.id }}</p>
            </div>
            <button
              type="button"
              (click)="deleteClass(c)"
              class="text-rose-600 p-2 rounded-lg hover:bg-rose-50 shrink-0"
              title="Supprimer"
            >
              <lucide-icon [name]="Trash2" [size]="18"></lucide-icon>
            </button>
          </li>
        </ul>
        <p *ngIf="(overview?.classes?.length ?? 0) === 0" class="text-sm text-amber-700">Ajoutez au moins une classe pour pouvoir créer des mots.</p>
      </div>

      <div class="bg-white border border-border rounded-3xl shadow-sm p-6 space-y-4">
        <h2 class="text-xl font-extrabold flex items-center gap-2">
          <lucide-icon [name]="BookOpen" [size]="22"></lucide-icon>
          Mots
        </h2>
        <p class="text-sm text-muted-foreground">
          Exemple : <strong>pomme</strong> → cochez <strong>Vegetables</strong> et <strong>Food</strong> uniquement.
        </p>
        <div class="grid md:grid-cols-2 gap-4">
          <div>
            <label class="block text-xs font-semibold text-muted-foreground mb-1">Mot ou expression</label>
            <input
              [(ngModel)]="newWord"
              name="newWord"
              type="text"
              class="w-full px-3 py-2 rounded-xl border border-border text-sm"
              placeholder="ex: apple"
            />
          </div>
          <div class="md:col-span-2">
            <p class="text-xs font-semibold text-muted-foreground mb-2">Classes pour ce mot</p>
            <div class="flex flex-wrap gap-2">
              <label
                *ngFor="let c of overview?.classes ?? []"
                class="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-border text-sm cursor-pointer hover:bg-teal-50"
              >
                <input type="checkbox" [checked]="selectedClassIds.has(c.id)" (change)="toggleClass(c.id, $event)" />
                <span class="font-medium">{{ c.label }}</span>
              </label>
            </div>
          </div>
        </div>
        <button
          type="button"
          (click)="addWord()"
          class="bg-teal-600 hover:bg-teal-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2"
        >
          <lucide-icon [name]="Plus" [size]="18"></lucide-icon>
          Ajouter le mot
        </button>

        <div class="border-t border-border pt-4">
          <h3 class="text-sm font-bold mb-2">Mots enregistrés</h3>
          <ul class="divide-y divide-border rounded-xl border border-border overflow-hidden">
            <li *ngFor="let w of overview?.words ?? []" class="flex items-center justify-between gap-2 px-3 py-2 bg-white text-sm">
              <div>
                <span class="font-semibold">{{ w.word }}</span>
                <span class="text-muted-foreground text-xs ml-2">→ {{ parentNamesForWord(w) }}</span>
              </div>
              <button
                type="button"
                (click)="deleteWord(w.id)"
                class="text-rose-600 p-1 rounded-lg hover:bg-rose-50"
                title="Supprimer"
              >
                <lucide-icon [name]="Trash2" [size]="16"></lucide-icon>
              </button>
            </li>
            <li *ngIf="(overview?.words?.length ?? 0) === 0" class="px-3 py-4 text-sm text-muted-foreground">Aucun mot.</li>
          </ul>
        </div>
      </div>
    </div>
    `,
})
export class AdminEnglishBingoComponent implements OnInit {
    private readonly data = inject(DataService);
    private readonly notify = inject(NotificationService);

    readonly Plus = Plus;
    readonly Trash2 = Trash2;
    readonly Grid3x3 = Grid3x3;
    readonly BookOpen = BookOpen;

    overview: EnglishBingoAdminOverview | null = null;
    newClassLabel = '';
    classFile: File | null = null;
    uploadingClass = false;

    newWord = '';
    selectedClassIds = new Set<number>();

    ngOnInit(): void {
        this.reload();
    }

    reload(): void {
        this.data.englishBingoAdminOverview().subscribe({
            next: o => {
                this.overview = o;
            },
            error: () => this.notify.error('Impossible de charger les données.'),
        });
    }

    onClassFile(ev: Event): void {
        const input = ev.target as HTMLInputElement;
        this.classFile = input.files?.[0] ?? null;
    }

    createClass(): void {
        const label = this.newClassLabel.trim();
        if (!label) {
            this.notify.error('Indiquez le nom de la classe.');
            return;
        }
        if (!this.classFile) {
            this.notify.error('Choisissez une image.');
            return;
        }
        this.uploadingClass = true;
        this.data.englishBingoCreateClass(label, this.classFile).subscribe({
            next: () => {
                this.uploadingClass = false;
                this.newClassLabel = '';
                this.classFile = null;
                this.notify.success('Classe ajoutée.');
                this.reload();
            },
            error: () => {
                this.uploadingClass = false;
                this.notify.error('Échec de l’envoi.');
            },
        });
    }

    deleteClass(c: EnglishBingoClassDto): void {
        if (!confirm(`Supprimer la classe « ${c.label} » ?`)) return;
        this.data.englishBingoDeleteClass(c.id).subscribe({
            next: () => {
                this.notify.success('Classe supprimée.');
                this.reload();
            },
            error: () => this.notify.error('Suppression impossible.'),
        });
    }

    toggleClass(id: number, ev: Event): void {
        const checked = (ev.target as HTMLInputElement).checked;
        if (checked) {
            this.selectedClassIds.add(id);
        } else {
            this.selectedClassIds.delete(id);
        }
        this.selectedClassIds = new Set(this.selectedClassIds);
    }

    addWord(): void {
        const w = this.newWord.trim();
        if (!w) {
            this.notify.error('Saisissez un mot.');
            return;
        }
        const ids = [...this.selectedClassIds];
        if (ids.length === 0) {
            this.notify.error('Cochez au moins une classe.');
            return;
        }
        this.data.englishBingoAddWord(w, ids).subscribe({
            next: () => {
                this.newWord = '';
                this.selectedClassIds.clear();
                this.notify.success('Mot ajouté.');
                this.reload();
            },
            error: () => this.notify.error('Impossible d’ajouter le mot.'),
        });
    }

    deleteWord(wordId: number): void {
        this.data.englishBingoDeleteWord(wordId).subscribe({
            next: () => {
                this.notify.success('Mot supprimé.');
                this.reload();
            },
            error: () => this.notify.error('Suppression impossible.'),
        });
    }

    parentNamesForWord(w: EnglishBingoWordAdminDto): string {
        const classes = this.overview?.classes ?? [];
        const byId = new Map(classes.map(c => [c.id, c.label]));
        return w.correctClassIds.map(id => byId.get(id) ?? `#${id}`).join(', ');
    }
}
