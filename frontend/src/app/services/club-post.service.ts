import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ClubPost {
  id?: number;
  content: string;
  mediaUrl: string;
  mediaType: 'IMAGE' | 'VIDEO';
  authorEmail: string;
  authorName: string;
  createdAt?: string;
  comments?: any[];
}

export interface Comment {
  id?: number;
  content: string;
  authorEmail: string;
  authorName: string;
  createdAt?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ClubPostService {
  private apiUrl = 'http://localhost:8085/api';

  constructor(private http: HttpClient) {}

  getPosts(clubId: number): Observable<ClubPost[]> {
    return this.http.get<ClubPost[]>(`${this.apiUrl}/clubs/${clubId}/posts`);
  }

  createPost(clubId: number, post: ClubPost): Observable<ClubPost> {
    return this.http.post<ClubPost>(`${this.apiUrl}/clubs/${clubId}/posts`, post);
  }

  getComments(postId: number): Observable<Comment[]> {
    return this.http.get<Comment[]>(`${this.apiUrl}/posts/${postId}/comments`);
  }

  addComment(postId: number, comment: Comment): Observable<Comment> {
    return this.http.post<Comment>(`${this.apiUrl}/posts/${postId}/comments`, comment);
  }

  uploadFile(file: File): Observable<string> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(`${this.apiUrl}/upload`, formData, { responseType: 'text' });
  }

  checkMembership(clubId: number, email: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/club-memberships/check?clubId=${clubId}&email=${email}`);
  }
}
