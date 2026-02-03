import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { AuthStore } from '../../state/auth/auth.store';
import { AuthService } from '../../services/auth/auth-service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule
  ],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class Header {
  authStore = inject(AuthStore);
  authService = inject(AuthService);

  get userName(): string {
    return this.authStore.currentUser()?.name || 'User';
  }

  onLogout(): void {
    this.authService.logout();
  }
}
