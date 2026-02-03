import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import Cookies from 'js-cookie';
import { AuthResponse, User } from '../../models/user.model';
import { AuthStore } from '../../state/auth/auth.store';
import { TeamStore } from '../../state/team/team.store';
import { projectStore } from '../../state/project/project.store';
import { tasksStore } from '../../state/task/task.store';
import { commentsStore } from '../../state/comment/comments.store';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly httpClient = inject(HttpClient);
  private readonly authStore = inject(AuthStore);
  private readonly teamStore = inject(TeamStore);
  private readonly projectStoreInstance = inject(projectStore);
  private readonly tasksStoreInstance = inject(tasksStore);
  private readonly commentsStoreInstance = inject(commentsStore);
  private readonly router = inject(Router);

  async login(email: string, password: string): Promise<void> {
    this.authStore.setLoading(true);
    try {
      const response = await firstValueFrom(
        this.httpClient.post<AuthResponse>(`/auth/login`, {
          email,
          password
        })
      );

      // שומרים את הטוקן ב-cookies
      Cookies.set('token', response.token, { 
        expires: 14,
        path: '/',
        secure: window.location.protocol === 'https:',      
        sameSite: 'strict' 
      });

      this.authStore.setLoginSuccess(response);

      this.router.navigate(['/dashboard']);

    } catch (error: any) {
      const errorMessage = error.error?.message || 'התחברות נכשלה';
      this.authStore.setLoginFailure(errorMessage);
    }
  }

  async register(userData: User): Promise<void> {
    this.authStore.setLoading(true);

    try {
      const response = await firstValueFrom(
        this.httpClient.post<AuthResponse>(`/auth/register`, userData)
      );

      Cookies.set('token', response.token, { 
        expires: 14,
        path: '/',
        secure: window.location.protocol === 'https:',
        sameSite: 'strict'
      });

      this.authStore.setLoginSuccess(response);

      this.router.navigate(['/dashboard']);

    } catch (error: any) {
      const errorMessage = error.error?.message || 'הרשמה נכשלה';
      this.authStore.setLoginFailure(errorMessage);
    }
  }

  logout(): void {
    // Clear token from cookies (try multiple paths to ensure removal)
    Cookies.remove('token');
    Cookies.remove('token', { path: '/' });

    // Clear all stores
    this.authStore.clearAuth();
    this.teamStore.setTeamsSuccess([]);
    this.projectStoreInstance.setProjectsSuccess([]);
    this.tasksStoreInstance.setTasksSuccess([]);
    this.commentsStoreInstance.clearComments();

    // Navigate to login and replace history so user can't go back
    this.router.navigate(['/login'], { replaceUrl: true });
  }

  clearError(): void {
    this.authStore.clearError();
  }

  async loadUserFromToken(): Promise<void> {
    const token = Cookies.get('token');

    if (!token) {
      return;
    }

    this.authStore.setLoading(true);

    try {
      this.authStore.setLoading(false);

    } catch (error) {
      Cookies.remove('token');
      this.authStore.clearAuth();
    }
  }
}






