import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { UserStore } from '../state/user/user.store';
import { User } from '../models/user.model';

interface ApiUser {
  id: number | string;
  name: string;
  email: string;
  role?: string;
  created_at?: string;
}

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private readonly httpClient = inject(HttpClient);
  private readonly userStore = inject(UserStore);

  async getUsers(): Promise<void> {
    this.userStore.setLoading(true);
    try {
      const rawUsers = await firstValueFrom(
        this.httpClient.get<ApiUser[]>(`/users`)
      );
      const users: User[] = rawUsers.map(u => ({
        id: String(u.id),
        name: u.name,
        email: u.email,
        role: u.role
      }));
      this.userStore.setUsersSuccess(users);
    } catch (error: unknown) {
      const err = error as { error?: { message?: string } };
      const errorMessage = err.error?.message || 'Failed to load users';
      this.userStore.setUsersFailure(errorMessage);
    }
  }
}