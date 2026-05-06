import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClubPostService, ClubPost, Comment } from '../../services/club-post.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-club-feed',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="club-feed-container max-w-2xl mx-auto py-8">
      <h2 class="text-2xl font-bold text-gray-800 mb-8 flex items-center gap-3">
        <span class="p-2 bg-teal-50 text-teal-600 rounded-lg">💬</span>
        Fil d'actualité du club
      </h2>

      <!-- Auth Check / Login prompt -->
      <div *ngIf="!currentUser" class="bg-gradient-to-br from-teal-600 to-teal-800 p-8 rounded-2xl shadow-lg mb-8 text-white relative overflow-hidden">
        <div class="relative z-10">
          <h3 class="text-xl font-bold mb-2">Rejoignez la discussion !</h3>
          <p class="mb-6 opacity-80 text-sm">Connectez-vous pour voir les publications et interagir avec les membres.</p>
          <div class="flex gap-2 max-w-md">
            <input type="email" [(ngModel)]="loginEmail" placeholder="votre@email.com" 
                   class="flex-1 p-3 rounded-full border-none text-gray-800 text-sm outline-none focus:ring-2 focus:ring-teal-400">
            <button (click)="quickLogin()" class="bg-white text-teal-700 px-6 py-2 rounded-full font-bold hover:bg-teal-50 transition transform hover:scale-105 active:scale-95 whitespace-nowrap">
                Continuer
            </button>
          </div>
          <p *ngIf="loginError" class="text-red-200 text-xs mt-2 font-medium">{{loginError}}</p>
        </div>
        <div class="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
      </div>

      <!-- New Post Form (Only for logged in members) -->
      <div *ngIf="currentUser && isMember" class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-8 transition-all focus-within:shadow-md focus-within:border-teal-100">
        <div class="flex gap-4">
            <div class="w-10 h-10 rounded-full bg-teal-600 flex items-center justify-center text-white font-bold text-sm shrink-0 shadow-sm shadow-teal-200">
                {{ currentUser.name?.charAt(0) || '?' }}
            </div>
            <div class="flex-1">
                <textarea [(ngModel)]="newPostContent" [placeholder]="'Quoi de neuf, ' + currentUser.name + ' ?'" 
                          class="w-full p-2 border-none focus:ring-0 text-gray-700 resize-none placeholder-gray-400 min-h-[80px]" rows="2"></textarea>
                
                <!-- Preview -->
                <div *ngIf="selectedFilePreview" class="relative mt-3 inline-block group">
                    <img *ngIf="newPostMediaType === 'IMAGE'" [src]="selectedFilePreview" class="max-h-64 rounded-xl border border-gray-100 object-cover shadow-sm">
                    <div *ngIf="newPostMediaType === 'VIDEO'" class="w-64 h-40 bg-gray-900 rounded-xl flex items-center justify-center text-white text-xs">
                        <span class="bg-white/10 px-3 py-1 rounded-full backdrop-blur-sm">Vidéo sélectionnée</span>
                    </div>
                    <button (click)="selectedFile = null; selectedFilePreview = null" 
                            class="absolute -top-2 -right-2 bg-red-500 text-white w-6 h-6 rounded-full flex items-center justify-center shadow-lg hover:bg-red-600 transition-colors">
                        ×
                    </button>
                </div>
                
                <div class="flex items-center justify-between mt-4">
                    <div class="flex gap-1">
                        <input type="file" #fileInput (change)="onFileSelected($event)" accept="image/*,video/*" class="hidden">
                        <button (click)="fileInput.click()" class="flex items-center gap-2 text-xs font-semibold text-gray-500 hover:text-teal-600 hover:bg-teal-50 px-4 py-2 rounded-full transition-all">
                            <span>🖼️</span> Média
                        </button>
                    </div>
                    
                    <button (click)="submitPost()" [disabled]="!newPostContent || submittingPost" 
                            class="bg-teal-600 text-white px-8 py-2 rounded-full font-bold hover:bg-teal-700 transition-all disabled:opacity-50 disabled:bg-gray-300 shadow-md shadow-teal-100 active:transform active:scale-95">
                        {{ submittingPost ? 'Envoi...' : 'Publier' }}
                    </button>
                </div>
            </div>
        </div>
      </div>

      <!-- Member Only Message -->
      <div *ngIf="currentUser && !isMember" class="bg-amber-50 border border-amber-100 p-6 rounded-2xl mb-8 flex items-center gap-4">
        <div class="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center text-xl">🛡️</div>
        <div>
            <h4 class="font-bold text-amber-900 text-sm">Contenu protégé</h4>
            <p class="text-amber-800 text-xs mt-1">Seuls les membres officiels de ce club peuvent publier et commenter.</p>
        </div>
      </div>

      <!-- Feed List -->
      <div class="posts-list space-y-8">
        <div *ngFor="let post of posts" class="post-card bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
          <!-- Post Header -->
          <div class="p-5 flex items-center justify-between">
            <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-full bg-teal-50 text-teal-700 flex items-center justify-center font-bold border border-teal-100">
                    {{ post.authorName.charAt(0) || '?' }}
                </div>
                <div>
                    <h4 class="font-bold text-gray-900 leading-none text-sm">{{ post.authorName }}</h4>
                    <p class="text-[10px] text-gray-400 mt-1 font-medium">{{ post.createdAt | date:'longDate' }}</p>
                </div>
            </div>
            <button class="text-gray-300 hover:text-gray-600 text-lg">⋯</button>
          </div>

          <!-- Post Content -->
          <div class="px-5 pb-5">
            <p class="text-gray-800 text-sm leading-relaxed whitespace-pre-wrap">{{ post.content }}</p>
          </div>

          <!-- Media Display -->
          <div *ngIf="post.mediaUrl" class="bg-gray-50 border-y border-gray-50 group overflow-hidden">
            <img *ngIf="post.mediaType === 'IMAGE'" [src]="post.mediaUrl" class="w-full h-auto block max-h-[600px] object-contain transition-transform duration-700 group-hover:scale-[1.02]" alt="Post image">
            <video *ngIf="post.mediaType === 'VIDEO'" [src]="post.mediaUrl" controls class="w-full max-h-[600px]"></video>
          </div>

          <!-- Interaction Bar -->
          <div class="px-5 py-3 flex items-center justify-between border-t border-gray-50">
            <div class="flex items-center gap-4">
                <button class="flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-teal-600 transition-colors">
                    <span>👍</span> J'aime
                </button>
                <button class="flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-teal-600 transition-colors">
                    <span>💬</span> {{ post.comments?.length || 0 }} Commentaires
                </button>
            </div>
            <button class="text-xs font-semibold text-gray-500 hover:text-teal-600 flex items-center gap-1">
                <span>🔗</span> Partager
            </button>
          </div>

          <!-- Comments Section -->
          <div class="bg-gray-50/60 p-5 space-y-4 border-t border-gray-50">
            <div *ngIf="post.comments && post.comments.length > 0" class="space-y-4">
                <div *ngFor="let comment of post.comments" class="flex gap-3 group">
                  <div class="w-8 h-8 rounded-full bg-white flex items-center justify-center text-gray-400 text-[10px] font-bold shrink-0 border border-gray-100 shadow-sm">
                    {{ comment.authorName.charAt(0) || '?' }}
                  </div>
                  <div class="flex-1">
                    <div class="bg-white p-3 rounded-2xl rounded-tl-none shadow-sm border border-gray-100">
                        <div class="flex justify-between items-center mb-1">
                            <span class="font-bold text-[11px] text-gray-900">{{ comment.authorName }}</span>
                            <span class="text-[9px] text-gray-400 font-medium">{{ comment.createdAt | date:'shortTime' }}</span>
                        </div>
                        <p class="text-xs text-gray-700 leading-snug">{{ comment.content }}</p>
                    </div>
                  </div>
                </div>
            </div>

            <!-- Add Comment Form -->
            <div *ngIf="currentUser && isMember" class="flex gap-3 pt-2">
              <div class="w-8 h-8 rounded-full bg-teal-600 flex items-center justify-center text-white font-bold text-[10px] shrink-0 border-2 border-white shadow-sm">
                {{ currentUser.name?.charAt(0) || '?' }}
              </div>
              <div class="flex-1 relative">
                <input type="text" [(ngModel)]="commentInputs[post.id!]" placeholder="Ajouter un commentaire..." 
                       (keyup.enter)="submitComment(post)"
                       class="w-full p-2.5 pr-12 border-none bg-white shadow-sm rounded-full text-xs focus:ring-2 focus:ring-teal-500 transition px-5 border border-gray-100 outline-none">
                <button (click)="submitComment(post)" 
                        class="absolute right-1.5 top-1.5 h-7 w-7 bg-teal-600 text-white rounded-full flex items-center justify-center hover:bg-teal-700 transition shadow-sm shadow-teal-100">
                    <span class="transform -rotate-45 text-[10px]">➤</span>
                </button>
              </div>
            </div>
            
            <p *ngIf="currentUser && !isMember" class="text-[10px] text-amber-600 text-center py-2 bg-amber-50 rounded-xl border border-amber-100 font-medium tracking-tight">
                Rejoignez le club pour participer à la discussion
            </p>
            <p *ngIf="!currentUser" class="text-[10px] text-gray-400 italic text-center py-2 font-medium">
                Connectez-vous pour voir et ajouter des commentaires
            </p>
          </div>
        </div>
        
        <!-- Empty State -->
        <div *ngIf="posts.length === 0" class="text-center py-24 bg-white rounded-3xl border border-dashed border-gray-200">
            <div class="text-5xl mb-6 opacity-30 grayscale blur-[1px]">🍃</div>
            <h4 class="text-gray-900 font-bold text-sm mb-1">C'est bien calme ici...</h4>
            <p class="text-gray-400 text-xs">Soyez le premier à partager quelque chose avec les membres !</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .post-card { animation: slideIn 0.5s ease-out forwards; }
    @keyframes slideIn {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `]
})
export class ClubFeedComponent implements OnInit {
  @Input() clubId!: number | string;
  
  posts: ClubPost[] = [];
  currentUser: any = null;
  isMember = false;
  
  // Form models
  newPostContent = '';
  newPostMediaUrl = '';
  newPostMediaType: 'IMAGE' | 'VIDEO' = 'IMAGE';
  selectedFile: File | null = null;
  selectedFilePreview: any = null;
  submittingPost = false;
  
  commentInputs: { [key: number]: string } = {};
  
  // Login modal simple
  loginEmail = '';
  loginError = '';

  constructor(
    private postService: ClubPostService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      if (user) {
        this.verifyMembership();
      } else {
        this.isMember = false;
      }
    });
    this.loadPosts();
  }

  verifyMembership() {
    this.postService.checkMembership(this.clubId as any, this.currentUser.email).subscribe(res => {
      this.isMember = res;
    });
  }

  loadPosts() {
    this.postService.getPosts(this.clubId as any).subscribe(posts => {
      this.posts = posts;
      // Load comments for each post
      this.posts.forEach(post => {
        this.postService.getComments(post.id!).subscribe(comments => {
          post.comments = comments;
        });
      });
    });
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      this.newPostMediaType = file.type.startsWith('video') ? 'VIDEO' : 'IMAGE';
      
      const reader = new FileReader();
      reader.onload = () => {
        this.selectedFilePreview = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  quickLogin() {
    if (!this.loginEmail) return;
    this.authService.login(this.loginEmail).subscribe({
      next: () => {
        this.loginError = '';
        this.loginEmail = '';
      },
      error: () => {
        this.loginError = 'Email invalide.';
      }
    });
  }

  submitPost() {
    if (!this.newPostContent || !this.currentUser) return;
    
    this.submittingPost = true;

    if (this.selectedFile) {
      this.postService.uploadFile(this.selectedFile).subscribe({
        next: (url) => {
          this.executeCreatePost(url);
        },
        error: (err) => {
          console.error(err);
          this.submittingPost = false;
        }
      });
    } else {
      this.executeCreatePost('');
    }
  }

  private executeCreatePost(mediaUrl: string) {
    const post: ClubPost = {
      content: this.newPostContent,
      mediaUrl: mediaUrl,
      mediaType: this.newPostMediaType,
      authorEmail: this.currentUser.email,
      authorName: this.currentUser.name
    };

    this.postService.createPost(this.clubId as any, post).subscribe({
      next: (newPost) => {
        newPost.comments = [];
        this.posts.unshift(newPost);
        this.resetPostForm();
      },
      error: (err) => {
        console.error(err);
        this.submittingPost = false;
      }
    });
  }

  resetPostForm() {
    this.newPostContent = '';
    this.newPostMediaUrl = '';
    this.newPostMediaType = 'IMAGE';
    this.selectedFile = null;
    this.selectedFilePreview = null;
    this.submittingPost = false;
  }

  submitComment(post: ClubPost) {
    const content = this.commentInputs[post.id!];
    if (!content || !this.currentUser) return;

    const comment: Comment = {
      content: content,
      authorEmail: this.currentUser.email,
      authorName: this.currentUser.name
    };

    this.postService.addComment(post.id!, comment).subscribe({
      next: (newComment) => {
        if (!post.comments) post.comments = [];
        post.comments.push(newComment);
        this.commentInputs[post.id!] = '';
      }
    });
  }
}
