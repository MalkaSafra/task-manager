import { Component, inject, OnInit, computed } from '@angular/core';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { CommonModule } from '@angular/common';

import { TeamStore } from '../../state/team/team.store';
import { projectStore } from '../../state/project/project.store';
import { tasksStore } from '../../state/task/task.store';
import { AuthStore } from '../../state/auth/auth.store';

import { Teams as TeamsService } from '../../services/teams/teams';
import { Projects as ProjectsService } from '../../services/project/projects-service';
import { Tasks as TasksService } from '../../services/task/tasks';

import { Task, TaskStatus, TaskPriority } from '../../models/task.model';
import { LoadingSpinner, ErrorAlert } from '../shared';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressBarModule,
    MatChipsModule,
    MatDividerModule,
    LoadingSpinner,
    ErrorAlert
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit {
  private router = inject(Router);
  
  // Stores
  authStore = inject(AuthStore);
  teamStore = inject(TeamStore);
  projectStore = inject(projectStore);
  tasksStore = inject(tasksStore);

  // Services
  private teamsService = inject(TeamsService);
  private projectsService = inject(ProjectsService);
  private tasksService = inject(TasksService);

  // Computed values for statistics
  totalTeams = computed(() => this.teamStore.allTeams().length);
  totalProjects = computed(() => this.projectStore.allProjects().length);
  totalTasks = computed(() => this.tasksStore.allTasks().length);

  todoCount = computed(() => this.tasksStore.todoTasks().length);
  inProgressCount = computed(() => this.tasksStore.inProgressTasks().length);
  completedCount = computed(() => this.tasksStore.completedTasks().length);

  // Progress percentage
  progressPercentage = computed(() => {
    const total = this.totalTasks();
    if (total === 0) return 0;
    return Math.round((this.completedCount() / total) * 100);
  });

  // Tasks due today
  tasksDueToday = computed(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return this.tasksStore.allTasks().filter(task => {
      if (!task.dueDate) return false;
      const dueDate = new Date(task.dueDate);
      dueDate.setHours(0, 0, 0, 0);
      return dueDate >= today && dueDate < tomorrow && task.status !== TaskStatus.COMPLETED;
    });
  });

  // High priority tasks
  highPriorityTasks = computed(() => {
    return this.tasksStore.allTasks().filter(
      task => task.priority === TaskPriority.HIGH && task.status !== TaskStatus.COMPLETED
    ).slice(0, 5);
  });

  // Recent tasks (last 5)
  recentTasks = computed(() => {
    return [...this.tasksStore.allTasks()]
      .sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateB - dateA;
      })
      .slice(0, 5);
  });

  // Overdue tasks
  overdueTasks = computed(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return this.tasksStore.allTasks().filter(task => {
      if (!task.dueDate || task.status === TaskStatus.COMPLETED) return false;
      const dueDate = new Date(task.dueDate);
      dueDate.setHours(0, 0, 0, 0);
      return dueDate < today;
    });
  });

  // Combined loading state
  isLoading = computed(() => 
    this.teamStore.teamsLoading() || 
    this.projectStore.projectsLoading() || 
    this.tasksStore.tasksLoading()
  );

  // Combined error state
  hasError = computed(() => 
    this.teamStore.hasTeamsError() || 
    this.projectStore.hasProjectsError() || 
    this.tasksStore.hasTasksError()
  );

  getErrorMessage(): string {
    return this.teamStore.teamsError() || 
           this.projectStore.projectsError() || 
           this.tasksStore.tasksError() || 
           'Failed to load data';
  }

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    if (!this.teamStore.hasTeams()) {
      this.teamsService.getTeams();
    }
    if (!this.projectStore.hasProjects()) {
      this.projectsService.getProjects();
    }
    if (!this.tasksStore.hasTasks()) {
      this.tasksService.getTasks();
    }
  }

  get userName(): string {
    return this.authStore.currentUser()?.name || 'User';
  }

  getGreeting(): string {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  }

  getStatusIcon(status: TaskStatus): string {
    switch (status) {
      case TaskStatus.TODO: return 'radio_button_unchecked';
      case TaskStatus.IN_PROGRESS: return 'pending';
      case TaskStatus.COMPLETED: return 'check_circle';
      default: return 'circle';
    }
  }

  getStatusColor(status: TaskStatus): string {
    switch (status) {
      case TaskStatus.TODO: return '#9e9e9e';
      case TaskStatus.IN_PROGRESS: return '#2196f3';
      case TaskStatus.COMPLETED: return '#4caf50';
      default: return '#9e9e9e';
    }
  }

  getPriorityColor(priority: TaskPriority): string {
    switch (priority) {
      case TaskPriority.HIGH: return 'warn';
      case TaskPriority.MEDIUM: return 'accent';
      case TaskPriority.LOW: return 'primary';
      default: return 'primary';
    }
  }

  formatDate(date: Date | undefined): string {
    if (!date) return '';
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }
}
