import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { LucideAngularModule, Calendar, Clock, MapPin, CheckSquare, Play, Users, DollarSign, Heart } from 'lucide-angular';
import { DataService, PlatformEvent } from '../services/data.service';
import { FavoritesService } from '../services/favorites.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-event-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideAngularModule],
  templateUrl: './event-detail.component.html',
})
export class EventDetailComponent implements OnInit {
  private dataService = inject(DataService);
  private route = inject(ActivatedRoute);
  private authService = inject(AuthService);
  readonly favoritesService = inject(FavoritesService);

  readonly CalendarIcon = Calendar;
  readonly ClockIcon = Clock;
  readonly MapPinIcon = MapPin;
  readonly CheckSquareIcon = CheckSquare;
  readonly PlayIcon = Play;
  readonly UsersIcon = Users;
  readonly DollarSignIcon = DollarSign;
  readonly HeartIcon = Heart;

  isFavorite(eventId: number | string): boolean {
    return this.favoritesService.isFavorite(eventId);
  }

  toggleFavorite(): void {
    const ev = this.event();
    if (ev) this.favoritesService.toggleFavorite(ev.id);
  }

  event = signal<PlatformEvent | null>(null);
  isAccessible = signal<boolean>(true);
  effectivePrice = signal<number>(0);
  availablePlaces = signal<number>(0);
  canRegister = signal<boolean>(false);
  loading = signal<boolean>(false);

  ngOnInit() {
    this.route.params.subscribe(params => {
      const slug = params['slug'];
      const found = this.dataService.events().find(e => e.slug === slug);
      this.event.set(found || this.dataService.events()[0]);
      
      if (found) {
        this.loadEventDetails(found.id as number);
      }
    });
  }

  loadEventDetails(eventId: number) {
    this.loading.set(true);
    
    const user = this.authService.getCurrentUser();
    const studentId =
      user?.type === 'STUDENT' && user?.id != null ? Number(user.id) : 1;

    // Check event accessibility
    this.dataService.checkEventAccessibility(eventId, studentId).subscribe({
      next: (accessible) => {
        this.isAccessible.set(accessible);
      },
      error: (err) => {
        console.error('Error checking accessibility:', err);
      }
    });

    // Get effective price for student
    this.dataService.getEventPriceForStudent(eventId, studentId).subscribe({
      next: (price) => {
        this.effectivePrice.set(price);
      },
      error: (err) => {
        console.error('Error getting price:', err);
      }
    });

    // Get available places
    this.dataService.getAvailablePlaces(eventId).subscribe({
      next: (places) => {
        this.availablePlaces.set(places);
      },
      error: (err) => {
        console.error('Error getting available places:', err);
      }
    });

    // Check registration eligibility
    this.dataService.checkRegistrationEligibility(eventId, studentId).subscribe({
      next: (eligible) => {
        this.canRegister.set(eligible);
      },
      error: (err) => {
        console.error('Error checking eligibility:', err);
      },
      complete: () => {
        this.loading.set(false);
      }
    });
  }

  isEventFull(): boolean {
    const event = this.event();
    return !!event && event.maxParticipants !== undefined && 
           event.registeredParticipants !== undefined && 
           event.registeredParticipants >= event.maxParticipants;
  }

  hasPrice(): boolean {
    const event = this.event();
    return !!event && event.price !== undefined && event.price > 0;
  }

  hasDiscount(): boolean {
    const event = this.event();
    const price = event?.price;
    const effective = this.effectivePrice();
    return this.hasPrice() && effective !== undefined && price !== undefined && price > effective;
  }
}
