import { computed } from '@angular/core';
import { signalStore, withComputed, withState, withMethods, patchState } from '@ngrx/signals';
import Cookies from 'js-cookie';
import { User, AuthResponse } from '../../models/user.model';

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

const savedToken = Cookies.get('token') || null;

const initialAuthState: AuthState = {
  user: null,
  token: savedToken, 
  isAuthenticated: !!savedToken,
  loading: false,
  error: null
};

export const AuthStore = signalStore(
  { providedIn: 'root' },
  withState(initialAuthState),
  withComputed(({ user, token, isAuthenticated, loading, error }) => ({
    // Computed values (במקום selectors)
    currentUser: computed(() => user()),
    authToken: computed(() => token()),
    isAuth: computed(() => isAuthenticated()),
    authLoading: computed(() => loading()),
    authError: computed(() => error()),
    hasAuthError: computed(() => !!error())
  })),
  withMethods((store) => ({
    // מתודות פנימיות לעדכון ה-state (רק ה-service יכול לקרוא להן)
    setLoading(loading: boolean): void {
      patchState(store, { loading, error: null });
    },

    setLoginSuccess(response: AuthResponse): void {
      patchState(store, {
        user: response.user,
        token: response.token,
        isAuthenticated: true,
        loading: false,
        error: null
      });
    },

    setLoginFailure(error: string): void {
      patchState(store, {
        loading: false,
        error,
        user: null,
        token: null,
        isAuthenticated: false
      });
    },

    clearAuth(): void {
      patchState(store, {
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false,
        error: null
      });
    },

    clearError(): void {
      patchState(store, { error: null });
    },

    setUser(user: User): void {
      patchState(store, {
        user,
        isAuthenticated: true,
        loading: false,
        error: null
      });
    }
  }))
);