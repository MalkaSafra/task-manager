import { Routes } from '@angular/router';
import { Login } from './components/login/login';
import { Register } from './components/register/register';
import { Dashboard } from './components/dashboard/dashboard';
import { Teams } from './components/teams/teams';
import { Projects } from './components/projects/projects';
import { Tasks } from './components/tasks/tasks';
import { authGuard } from './guards/auth.guard';
import { guestGuard } from './guards/guest.guard';


export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'login', component: Login, canActivate: [guestGuard] },
  { path: 'register', component: Register, canActivate: [guestGuard] },
  { path: 'dashboard', component: Dashboard, canActivate: [authGuard] },
  { path: 'teams', component: Teams, canActivate: [authGuard] },
  { path: 'projects', component: Projects, canActivate: [authGuard] },
  { path: 'projects/:teamId', component: Projects, canActivate: [authGuard] },
  { path: 'tasks', component: Tasks, canActivate: [authGuard] },
  { path: 'tasks/:projectId', component: Tasks, canActivate: [authGuard] },
  { path: '**', redirectTo: '/dashboard' }
];