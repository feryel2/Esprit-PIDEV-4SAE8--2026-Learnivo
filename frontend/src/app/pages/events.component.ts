import { Component, signal, computed, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LucideAngularModule, MapPin, Clock, Users, DollarSign, Heart } from 'lucide-angular';
import { PaginationComponent } from '../components/ui/pagination.component';
import { DataService, PlatformEvent } from '../services/data.service';
import { FavoritesService } from '../services/favorites.service';

@Component({
  selector: 'app-events',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideAngularModule, PaginationComponent],
  templateUrl: './events.component.html',
})
export class EventsComponent implements OnInit {
  data = inject(DataService);
  favorites = inject(FavoritesService);

  ngOnInit() {
    this.data.loadEventsFromBackend(false);
  }

  readonly MapPinIcon = MapPin;
  readonly ClockIcon = Clock;
  readonly UsersIcon = Users;
  readonly DollarSignIcon = DollarSign;
  readonly HeartIcon = Heart;

  tabs = ["All", "Today", "Past event", "Next event", "Favorites"];
  activeTab = signal('All');

  isFavorite(eventId: number | string): boolean {
    return this.favorites.isFavorite(eventId);
  }

  toggleFavorite(event: PlatformEvent, $event: Event): void {
    $event.preventDefault();
    $event.stopPropagation();
    this.favorites.toggleFavorite(event.id);
  }
  currentPage = signal(1);
  readonly pageSize = 9;

  filteredEvents = computed(() => {
    const tab = this.activeTab();
    const events = this.data.events();
    this.favorites.favorites(); // dépendance réactive pour le filtre Favoris
    if (tab === "All") return events;
    if (tab === "Today") return [];
    if (tab === "Favorites") return events.filter((e) => this.favorites.isFavorite(e.id));
    return events.filter((e) => e.badge === tab);
  });

  totalPages = computed(() => {
    const total = this.filteredEvents().length;
    if (total === 0) return 1;
    return Math.ceil(total / this.pageSize);
  });

  effectiveCurrentPage = computed(() =>
    Math.min(Math.max(1, this.currentPage()), this.totalPages()));

  pagedEvents = computed(() => {
    const list = this.filteredEvents();
    const page = this.effectiveCurrentPage();
    const start = (page - 1) * this.pageSize;
    return list.slice(start, start + this.pageSize);
  });

  setActiveTab(tab: string) {
    this.activeTab.set(tab);
    this.currentPage.set(1);
  }

  onPageChange(page: number) {
    const maxPage = this.totalPages();
    this.currentPage.set(Math.max(1, Math.min(page, maxPage)));
  }

  isEventFull(event: PlatformEvent): boolean {
    return !!event.maxParticipants && 
           !!event.registeredParticipants && 
           event.registeredParticipants >= event.maxParticipants;
  }

  getAvailablePlaces(event: PlatformEvent): number {
    if (!event.maxParticipants || !event.registeredParticipants) return 0;
    return event.maxParticipants - event.registeredParticipants;
  }

  isEventAccessible(event: PlatformEvent): boolean {
    return event.isPublic !== false;
  }
}
