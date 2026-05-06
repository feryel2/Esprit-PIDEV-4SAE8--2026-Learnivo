import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import {
    DataService,
    PlatformEvent,
    AdminEventFormData,
    LiveCheckInSummaryDto,
    LiveCheckInParticipantDto,
} from '../../services/data.service';
import { NotificationService } from '../../services/notification.service';
import {
    Calendar,
    Plus,
    MapPin,
    Clock,
    ChevronRight,
    MoreVertical,
    CheckCircle2,
    AlertCircle
} from 'lucide-angular';
import { LucideAngularModule } from 'lucide-angular';

@Component({
    selector: 'app-admin-events',
    standalone: true,
    imports: [CommonModule, FormsModule, LucideAngularModule],
    template: `
    <div class="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div class="space-y-1">
          <h1 class="text-3xl font-extrabold tracking-tight">Event <span class="text-teal-600 underline decoration-2 underline-offset-4">Manager</span></h1>
          <p class="text-muted-foreground">Schedule and manage platform-wide events and summits.</p>
        </div>
        <button (click)="onCreateEvent()" class="bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 transition-all transform hover:scale-105 shadow-lg shadow-teal-600/20 active:scale-95 group">
          <lucide-icon [name]="Plus" [size]="18" class="group-hover:rotate-90 transition-transform"></lucide-icon>
          Create New Event
        </button>
      </div>

      <!-- Search -->
      <div class="flex justify-end">
        <input
          [(ngModel)]="searchTerm"
          (ngModelChange)="currentPage = 1"
          type="text"
          placeholder="Search events..."
          class="w-full md:w-72 px-3 py-2 rounded-xl border border-border text-sm"
        />
      </div>

      <!-- Event Form (Create / Edit) -->
      <div *ngIf="formVisible" class="bg-white border border-border rounded-3xl shadow-sm p-6 space-y-4">
        <div class="flex items-center justify-between">
          <h2 class="text-xl font-extrabold">
            {{ formMode === 'create' ? 'Create new event' : 'Edit event' }}
          </h2>
          <button type="button" class="text-sm text-muted-foreground hover:text-foreground" (click)="closeForm()">
            Close
          </button>
        </div>
        <form (ngSubmit)="submitForm(eventForm)" #eventForm="ngForm" class="grid gap-4 md:grid-cols-2">
          <div class="md:col-span-2">
            <label class="block text-xs font-semibold text-muted-foreground mb-1">Title</label>
            <input
              [(ngModel)]="formData.title"
              name="title"
              required
              minlength="3"
              #titleCtrl="ngModel"
              class="w-full px-3 py-2 rounded-xl border border-border text-sm"
            />
            <p *ngIf="submitted && titleCtrl.invalid" class="mt-1 text-[11px] text-rose-600">
              Le titre est obligatoire (min. 3 caractères).
            </p>
          </div>
          <div class="md:col-span-2">
            <label class="block text-xs font-semibold text-muted-foreground mb-1">Description</label>
            <textarea
              [(ngModel)]="formData.description"
              name="description"
              rows="3"
              required
              minlength="10"
              #descCtrl="ngModel"
              class="w-full px-3 py-2 rounded-xl border border-border text-sm"
            ></textarea>
            <p *ngIf="submitted && descCtrl.invalid" class="mt-1 text-[11px] text-rose-600">
              La description est obligatoire (minimum 10 caractères).
            </p>
          </div>
          <div class="md:col-span-2">
            <label class="block text-xs font-semibold text-muted-foreground mb-1">Location (click on map)</label>
            <input
              [(ngModel)]="formData.location"
              name="location"
              required
              #locationCtrl="ngModel"
              class="w-full px-3 py-2 rounded-xl border border-border text-sm"
              placeholder="Nom de la place ou adresse"
            />
            <p *ngIf="submitted && locationCtrl.invalid" class="mt-1 text-[11px] text-rose-600">
              Le lieu est obligatoire (cliquez sur la carte ou saisissez une adresse).
            </p>
            <div id="event-map" class="mt-3 h-64 rounded-2xl border border-border"></div>
            <p class="mt-1 text-[11px] text-muted-foreground">
              Cliquez sur la carte OpenStreetMap pour remplir automatiquement les coordonnées dans le champ location.
            </p>
          </div>
          <div>
            <label class="block text-xs font-semibold text-muted-foreground mb-1">Status</label>
            <select
              [(ngModel)]="formData.status"
              name="status"
              required
              #statusCtrl="ngModel"
              class="w-full px-3 py-2 rounded-xl border border-border text-sm"
            >
              <option value="PLANNED">PLANNED</option>
              <option value="ONGOING">ONGOING</option>
              <option value="COMPLETED">COMPLETED</option>
            </select>
            <p *ngIf="submitted && statusCtrl.invalid" class="mt-1 text-[11px] text-rose-600">
              Le statut est obligatoire.
            </p>
          </div>
          <div>
            <label class="block text-xs font-semibold text-muted-foreground mb-1">Start time</label>
            <input
              [(ngModel)]="formData.start"
              name="start"
              type="datetime-local"
              required
              #startCtrl="ngModel"
              class="w-full px-3 py-2 rounded-xl border border-border text-sm"
            />
            <p *ngIf="submitted && startCtrl.invalid" class="mt-1 text-[11px] text-rose-600">
              La date de début est obligatoire.
            </p>
          </div>
          <div>
            <label class="block text-xs font-semibold text-muted-foreground mb-1">End time</label>
            <input
              [(ngModel)]="formData.end"
              name="end"
              type="datetime-local"
              required
              #endCtrl="ngModel"
              class="w-full px-3 py-2 rounded-xl border border-border text-sm"
            />
            <p *ngIf="submitted && endCtrl.invalid" class="mt-1 text-[11px] text-rose-600">
              La date de fin est obligatoire.
            </p>
          </div>
          <div>
            <label class="block text-xs font-semibold text-muted-foreground mb-1">Max Participants</label>
            <input
              [(ngModel)]="formData.maxParticipants"
              name="maxParticipants"
              type="number"
              min="1"
              #maxParticipantsCtrl="ngModel"
              class="w-full px-3 py-2 rounded-xl border border-border text-sm"
              placeholder="Unlimited"
            />
          </div>
          <div>
            <label class="block text-xs font-semibold text-muted-foreground mb-1">Club (optional)</label>
            <select
              [(ngModel)]="formData.clubName"
              name="clubName"
              class="w-full px-3 py-2 rounded-xl border border-border text-sm"
            >
              <option [ngValue]="null">— Événement public (aucun club) —</option>
              <option *ngFor="let club of data.clubs()" [ngValue]="club.name">{{ club.name }}</option>
            </select>
          </div>
          <div class="md:col-span-2">
            <label class="block text-xs font-semibold text-muted-foreground mb-1">Publier à (optionnel)</label>
            <input
              [(ngModel)]="formData.publishAt"
              name="publishAt"
              type="datetime-local"
              class="w-full px-3 py-2 rounded-xl border border-border text-sm"
              placeholder="Laisser vide = visible immédiatement"
            />
            <p class="mt-1 text-[11px] text-muted-foreground">
              Si vous renseignez une date et heure, l'événement restera en attente et ne sera affiché qu'à partir de ce moment.
            </p>
          </div>
          <div class="md:col-span-2">
            <p *ngIf="submitted && !isDateRangeValid()" class="text-[11px] text-rose-600">
              La date de fin doit être après la date de début.
            </p>
          </div>
          <div class="md:col-span-2 flex justify-end gap-2 pt-2">
            <button type="button" class="px-4 py-2 rounded-xl border border-border text-sm font-medium" (click)="closeForm()">Cancel</button>
            <button type="submit" class="px-4 py-2 rounded-xl bg-teal-600 text-white text-sm font-bold">
              {{ formMode === 'create' ? 'Save event' : 'Update event' }}
            </button>
          </div>
        </form>
      </div>

      <!-- Events List -->
      <div class="space-y-4">
        <div *ngFor="let event of pagedEvents()" class="bg-white p-4 rounded-3xl border border-border shadow-sm hover:shadow-md transition-all group">
            <div class="flex flex-col lg:flex-row lg:items-center gap-6">
                <div class="relative w-full lg:w-48 h-32 rounded-2xl overflow-hidden shrink-0">
                    <img [src]="event.image" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500">
                    <div class="absolute inset-0 bg-black/20"></div>
                </div>
                
                <div class="flex-1 space-y-2">
                    <div class="flex items-center gap-2">
                        <span [class]="event.type === 'next' ? 'bg-teal-600' : 'bg-muted-foreground'" 
                              class="text-[10px] uppercase font-black tracking-widest px-2 py-0.5 rounded text-white italic">
                            {{ event.type }} event
                        </span>
                        <div *ngIf="event.type === 'next'" class="flex items-center gap-1 text-[10px] font-bold text-teal-600">
                            <lucide-icon [name]="CheckCircle2" [size]="12"></lucide-icon>
                            Published
                        </div>
                    </div>
                    <h3 class="text-xl font-extrabold tracking-tight group-hover:text-teal-600 transition-colors">{{ event.title }}</h3>
                    <div class="flex flex-wrap items-center gap-4 text-xs text-muted-foreground font-medium">
                        <div class="flex items-center gap-1.5">
                            <lucide-icon [name]="Calendar" [size]="14"></lucide-icon>
                            {{ event.date }}
                        </div>
                        <div class="flex items-center gap-1.5">
                            <lucide-icon [name]="MapPin" [size]="14"></lucide-icon>
                            {{ event.location }}
                        </div>
                        <div class="flex items-center gap-1.5">
                            <lucide-icon [name]="Clock" [size]="14"></lucide-icon>
                            2:00 PM - 5:00 PM
                        </div>
                        <div *ngIf="event.maxParticipants" class="flex items-center gap-1.5">
                            {{ event.registeredParticipants || 0 }} / {{ event.maxParticipants }} participants
                        </div>
                        <div *ngIf="event.clubId" class="flex items-center gap-1.5">
                            <span class="bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full">Club Event</span>
                        </div>
                        <div *ngIf="isEventScheduled(event)" class="flex items-center gap-1.5">
                            <span class="bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">En attente</span>
                        </div>
                    </div>
                </div>

                <div class="flex flex-wrap items-center gap-2 shrink-0 self-end lg:self-center">
                    <button (click)="onEditEvent(event)" class="px-4 py-2 hover:bg-muted rounded-xl transition-all font-bold text-sm">Edit</button>
                    <button
                      *ngIf="event.id"
                      type="button"
                      (click)="openCheckInsModal(event)"
                      class="px-4 py-2 rounded-xl border border-teal-200 bg-teal-50/80 text-teal-900 font-bold text-sm hover:bg-teal-100 transition-all"
                    >
                      Liste des check-ins
                    </button>
                    <button class="px-4 py-2 bg-muted hover:bg-muted/80 rounded-xl transition-all font-bold text-sm flex items-center gap-2 group/btn">
                        Manage
                        <lucide-icon [name]="ChevronRight" [size]="14" class="group-hover/btn:translate-x-1 transition-transform"></lucide-icon>
                    </button>
                    <button (click)="onDeleteEvent(event)" class="p-2 hover:bg-rose-50 rounded-xl transition-all text-rose-600" title="Delete">
                        <lucide-icon [name]="MoreVertical" [size]="18"></lucide-icon>
                    </button>
                </div>
            </div>
        </div>
        <div class="px-2 py-4 flex items-center justify-between text-xs text-muted-foreground">
          <span>Page {{ currentPage }} / {{ totalPages }}</span>
          <div class="flex items-center gap-2">
            <button
              class="px-3 py-1 rounded-lg border border-border disabled:opacity-50"
              (click)="goToPage(currentPage - 1)"
              [disabled]="currentPage === 1"
            >
              Prev
            </button>
            <button
              class="px-3 py-1 rounded-lg border border-border disabled:opacity-50"
              (click)="goToPage(currentPage + 1)"
              [disabled]="currentPage === totalPages"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      <div *ngIf="liveCheckInEvent" class="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/50" (click)="closeLiveCheckInModal()">
        <div class="bg-white rounded-3xl border border-border shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-4" (click)="$event.stopPropagation()">
          <div class="flex items-start justify-between gap-2">
            <div>
              <h2 class="text-lg font-extrabold tracking-tight">Check-ins de présence</h2>
              <p class="text-sm text-muted-foreground mt-1">
                Événement : <span class="font-semibold text-foreground">{{ liveCheckInEvent.title }}</span>
              </p>
            </div>
            <button type="button" class="text-sm text-muted-foreground hover:text-foreground shrink-0" (click)="closeLiveCheckInModal()">Fermer</button>
          </div>
          <p *ngIf="liveCheckInCanSend" class="text-sm text-muted-foreground">
            L’événement est <span class="font-medium text-teal-700">en cours</span> : vous pouvez envoyer un nouvel appel de présence. Les inscrits (non annulés) reçoivent une notification à confirmer.
          </p>
          <p *ngIf="!liveCheckInCanSend" class="text-sm text-muted-foreground">
            Consultez tous les tours de check-in déjà lancés pour cet événement. Pour en envoyer un nouveau, l’événement doit être en cours (entre date de début et fin).
          </p>
          <div *ngIf="liveCheckInCanSend" class="space-y-3 pt-1 border-t border-border">
            <h3 class="text-xs font-bold uppercase tracking-wider text-muted-foreground">Nouvel envoi</h3>
            <div>
              <label class="block text-xs font-semibold text-muted-foreground mb-1">Message (optionnel)</label>
              <textarea
                [(ngModel)]="liveCheckInMessage"
                name="liveCheckInMessage"
                rows="3"
                class="w-full px-3 py-2 rounded-xl border border-border text-sm"
                placeholder="Ex. Merci de confirmer votre présence pour le premier atelier."
              ></textarea>
            </div>
            <button
              type="button"
              (click)="sendLiveCheckIn()"
              class="w-full py-3 rounded-xl bg-teal-600 text-white font-bold text-sm hover:bg-teal-700 transition-colors"
            >
              Envoyer le check-in aux participants
            </button>
          </div>
          <div class="space-y-2 pt-2 border-t border-border">
            <div class="flex items-center justify-between gap-2">
              <h3 class="text-xs font-bold uppercase tracking-wider text-muted-foreground">Liste des check-ins</h3>
              <span *ngIf="liveCheckInHistoryLoading" class="text-[11px] text-muted-foreground">Chargement…</span>
            </div>
            <div *ngIf="!liveCheckInHistoryLoading && !liveCheckInHistory.length" class="text-sm text-muted-foreground py-6 text-center rounded-xl border border-dashed border-border bg-muted/30">
              Aucun check-in enregistré pour cet événement.
            </div>
            <div *ngIf="liveCheckInHistory.length" class="overflow-x-auto rounded-xl border border-border">
              <table class="w-full text-left text-xs">
                <thead>
                  <tr class="bg-muted/50 text-muted-foreground font-bold uppercase tracking-wider border-b border-border">
                    <th class="px-3 py-2 w-36">Date</th>
                    <th class="px-3 py-2">Message</th>
                    <th class="px-3 py-2 w-28 text-right">Réponses</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    *ngFor="let row of liveCheckInHistory"
                    (click)="selectCheckInRow(row)"
                    class="cursor-pointer border-b border-border/80 hover:bg-teal-50/50 transition-colors"
                    [class.bg-teal-50]="liveCheckInSelectedId === row.id"
                  >
                    <td class="px-3 py-2 align-top whitespace-nowrap font-medium">{{ row.createdAt | date:'short' }}</td>
                    <td class="px-3 py-2 align-top text-muted-foreground line-clamp-2">{{ row.message }}</td>
                    <td class="px-3 py-2 align-top text-right font-semibold text-teal-800">{{ row.respondedCount }} / {{ row.expectedCount }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p class="text-[11px] text-muted-foreground">Cliquez sur une ligne pour voir le détail par participant (présent / absent).</p>
          </div>
          <div *ngIf="liveCheckInParticipants.length" class="space-y-2 pt-2 border-t border-border">
            <h3 class="text-xs font-bold uppercase tracking-wider text-muted-foreground">Détail — tour sélectionné</h3>
            <ul class="text-xs space-y-1 max-h-52 overflow-y-auto rounded-xl border border-border divide-y divide-border/80">
              <li *ngFor="let p of liveCheckInParticipants" class="flex justify-between gap-2 px-3 py-2">
                <span>{{ p.studentName }}</span>
                <span [class.text-teal-700]="p.present" [class.text-rose-600]="!p.present" class="font-semibold shrink-0">
                  {{ p.present ? 'Présent' : 'Absent' }}
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  `
})
export class AdminEventsComponent implements OnInit {
    data = inject(DataService);
    private notifications = inject(NotificationService);

    ngOnInit() {
        this.data.loadEventsFromBackend(true);
    }
    readonly Calendar = Calendar;
    readonly Plus = Plus;
    readonly MapPin = MapPin;
    readonly Clock = Clock;
    readonly ChevronRight = ChevronRight;
    readonly MoreVertical = MoreVertical;
    readonly CheckCircle2 = CheckCircle2;
    readonly AlertCircle = AlertCircle;

    formVisible = false;
    formMode: 'create' | 'edit' = 'create';
    editingId: number | string | null = null;
    formData: AdminEventFormData = {
        title: '',
        description: '',
        location: '',
        status: 'PLANNED',
        start: '',
        end: '',
        maxParticipants: 0,
        clubName: null,
        publishAt: null
    };

    private map: any = null;
    private mapLib: any = null;
    private mapMarker: any = null;

    searchTerm = '';
    currentPage = 1;
    pageSize = 5;

    onCreateEvent() {
        this.formMode = 'create';
        this.editingId = null;
        this.formData = {
            title: '',
            description: '',
            location: '',
            status: 'PLANNED',
            start: '',
            end: '',
            maxParticipants: 0,
            clubName: null,
            publishAt: null
        };
        this.formVisible = true;
        setTimeout(() => this.ensureMap(), 100);
    }

    onEditEvent(event: PlatformEvent) {
        this.formMode = 'edit';
        this.editingId = event.id ?? null;
        const startTime = this.formatDateForInput(event.date, event.time);
        const endTime = this.formatEndDateForInput(event.date, event.time);
        const publishAt = event.publishAt ? this.formatPublishAtForInput(event.publishAt) : null;
        this.formData = {
            title: event.title,
            description: event.description,
            location: event.location,
            status: event.type === 'next' ? 'PLANNED' : 'COMPLETED',
            start: startTime,
            end: endTime,
            maxParticipants: event.maxParticipants ?? 0,
            clubName: event.clubName ?? null,
            publishAt
        };
        this.formVisible = true;
        setTimeout(() => this.ensureMap(), 100);
    }

    private formatDateForInput(dateStr: string, timeStr: string): string {
        // Assuming date format is like "2024-05-20" and time is "09:00"
        const [hours, minutes] = timeStr.split(':');
        const date = new Date(dateStr);
        date.setHours(parseInt(hours), parseInt(minutes));
        return date.toISOString().slice(0, 16); // Format: "YYYY-MM-DDTHH:MM"
    }

    private formatEndDateForInput(dateStr: string, timeStr: string): string {
        // Set end time to 2 hours after start time by default
        const [hours, minutes] = timeStr.split(':');
        const date = new Date(dateStr);
        date.setHours(parseInt(hours) + 2, parseInt(minutes));
        return date.toISOString().slice(0, 16); // Format: "YYYY-MM-DDTHH:MM"
    }

    formatPublishAtForInput(publishAt: string): string {
        if (!publishAt) return '';
        const d = new Date(publishAt);
        return Number.isNaN(d.getTime()) ? '' : d.toISOString().slice(0, 16);
    }

    isEventScheduled(event: PlatformEvent): boolean {
        if (!event.publishAt) return false;
        return new Date(event.publishAt).getTime() > Date.now();
    }

    onDeleteEvent(event: PlatformEvent) {
        if (!event.id) {
            return;
        }
        const confirmDelete = confirm(`Supprimer l événement « ${event.title} » ?`);
        if (!confirmDelete) {
            return;
        }
        this.data.deleteEvent(event.id);
    }

    submitted = false;

    submitForm(form?: NgForm) {
        this.submitted = true;
        if (form && form.invalid) {
            return;
        }
        if (!this.isDateRangeValid()) {
            return;
        }
        if (this.formMode === 'create') {
            this.data.createEvent(this.formData);
        } else if (this.editingId != null) {
            this.data.updateEvent(this.editingId, this.formData);
        }
        this.formVisible = false;
        this.submitted = false;
    }

    closeForm() {
        this.formVisible = false;
    }

    isDateRangeValid(): boolean {
        if (!this.formData.start || !this.formData.end) {
            return true;
        }
        const start = new Date(this.formData.start).getTime();
        const end = new Date(this.formData.end).getTime();
        return !Number.isNaN(start) && !Number.isNaN(end) && end > start;
    }

    private async ensureMap() {
        if (!this.formVisible) {
            return;
        }

        const leafletModule: any = await import('leaflet');
        const L = leafletModule.default ?? leafletModule;

        const container = document.getElementById('event-map');
        if (!container) {
            return;
        }

        if (!this.map) {
            this.map = L.map(container).setView([35.8, 10.6], 6);
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 19,
                attribution: '&copy; OpenStreetMap contributors'
            }).addTo(this.map);

            this.map.on('click', (e: any) => {
                const { lat, lng } = e.latlng;
                if (this.mapMarker) {
                    this.mapMarker.setLatLng(e.latlng);
                } else {
                    this.mapMarker = L.marker(e.latlng).addTo(this.map);
                }
                this.reverseGeocode(lat, lng);
            });
        } else {
            this.map.invalidateSize();
        }
    }

    private async reverseGeocode(lat: number, lng: number) {
        const fallback = `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
        try {
            const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`;
            const res = await fetch(url, {
                headers: {
                    'Accept': 'application/json'
                }
            });
            if (!res.ok) {
                this.formData.location = fallback;
                return;
            }
            const data: any = await res.json();
            this.formData.location = data?.display_name ?? fallback;
        } catch {
            this.formData.location = fallback;
        }
    }

    private filteredEvents(): PlatformEvent[] {
        const term = this.searchTerm.trim().toLowerCase();
        const list = this.data.events();
        if (!term) {
            return list;
        }
        return list.filter(ev =>
            (ev.title ?? '').toLowerCase().includes(term) ||
            (ev.location ?? '').toLowerCase().includes(term) ||
            (ev.description ?? '').toLowerCase().includes(term)
        );
    }

    get totalPages(): number {
        const total = this.filteredEvents().length;
        return Math.max(1, Math.ceil(total / this.pageSize));
    }

    pagedEvents(): PlatformEvent[] {
        const start = (this.currentPage - 1) * this.pageSize;
        return this.filteredEvents().slice(start, start + this.pageSize);
    }

    goToPage(page: number) {
        if (page < 1 || page > this.totalPages) {
            return;
        }
        this.currentPage = page;
    }

    liveCheckInEvent: PlatformEvent | null = null;
    liveCheckInCanSend = false;
    liveCheckInMessage = '';
    liveCheckInHistory: LiveCheckInSummaryDto[] = [];
    liveCheckInHistoryLoading = false;
    liveCheckInSelectedId: number | null = null;
    liveCheckInParticipants: LiveCheckInParticipantDto[] = [];

    isEventLive(event: PlatformEvent): boolean {
        if (!event.startTime || !event.endTime) {
            return false;
        }
        const t0 = new Date(event.startTime as string).getTime();
        const t1 = new Date(event.endTime as string).getTime();
        const now = Date.now();
        return Number.isFinite(t0) && Number.isFinite(t1) && now >= t0 && now <= t1;
    }

    openCheckInsModal(event: PlatformEvent): void {
        if (!event.id) {
            return;
        }
        this.liveCheckInEvent = event;
        this.liveCheckInCanSend = this.isEventLive(event);
        this.liveCheckInMessage = '';
        this.liveCheckInSelectedId = null;
        this.liveCheckInParticipants = [];
        this.refreshLiveCheckInHistory();
    }

    closeLiveCheckInModal(): void {
        this.liveCheckInEvent = null;
        this.liveCheckInCanSend = false;
        this.liveCheckInParticipants = [];
        this.liveCheckInSelectedId = null;
        this.liveCheckInHistoryLoading = false;
    }

    refreshLiveCheckInHistory(): void {
        const ev = this.liveCheckInEvent;
        if (!ev?.id) {
            return;
        }
        this.liveCheckInHistoryLoading = true;
        this.data.listLiveEventCheckIns(ev.id).subscribe({
            next: list => {
                this.liveCheckInHistory = list;
                this.liveCheckInHistoryLoading = false;
            },
            error: () => {
                this.liveCheckInHistory = [];
                this.liveCheckInHistoryLoading = false;
                this.notifications.error('Impossible de charger la liste des check-ins.');
            },
        });
    }

    sendLiveCheckIn(): void {
        const ev = this.liveCheckInEvent;
        if (!ev?.id) {
            return;
        }
        this.data.createLiveEventCheckIn(ev.id, this.liveCheckInMessage).subscribe({
            next: () => {
                this.notifications.success(
                    'Les étudiants inscrits voient une notification : ils doivent cocher et valider pour confirmer leur présence.',
                    'Check-in envoyé'
                );
                this.liveCheckInMessage = '';
                this.refreshLiveCheckInHistory();
            },
            error: (err: { error?: { error?: string } }) => {
                const msg = err?.error?.error ?? 'Échec de l’envoi du check-in.';
                this.notifications.error(msg);
            },
        });
    }

    selectCheckInRow(row: LiveCheckInSummaryDto): void {
        this.liveCheckInSelectedId = row.id;
        const ev = this.liveCheckInEvent;
        if (!ev?.id) {
            return;
        }
        this.data.getLiveCheckInParticipants(ev.id, row.id).subscribe({
            next: list => {
                this.liveCheckInParticipants = list;
            },
            error: () => {
                this.liveCheckInParticipants = [];
            },
        });
    }
}
