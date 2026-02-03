import { Component, inject, computed, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { tasksStore } from '../../state/task/task.store';
import { Tasks as taskService } from '../../services/task/tasks';
import { Projects as projectService } from '../../services/project/projects-service';
import { TaskDialog } from '../task-dialog/task-dialog';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialog } from '../confirm-dialog/confirm-dialog';
import { CommentsDialog } from '../comments-dialog/comments-dialog';
import { projectStore } from '../../state/project/project.store';
import { CdkDragDrop, DragDropModule, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Task, TaskStatus, TaskPriority } from '../../models/task.model';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { CommonModule } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';
import { LoadingSpinner, ErrorAlert } from '../shared';

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [
    DragDropModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    CommonModule,
    MatTooltipModule,
    LoadingSpinner,
    ErrorAlert
  ],
  templateUrl: './tasks.html',
  styleUrl: './tasks.css',
})
export class Tasks implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private dialog = inject(MatDialog);

  projectStore = inject(projectStore);
  tasksStore = inject(tasksStore);
  taskService = inject(taskService);
  projectService = inject(projectService);

  // Expose enum to template
  TaskStatus = TaskStatus;

  projectId = signal<string | null>(null);

  // Filtered tasks by project
  private filteredTasks = computed(() => {
    const allTasks = this.tasksStore.allTasks();
    const pid = this.projectId();
    if (pid) {
      return allTasks.filter(t => t.projectId === pid);
    }
    return allTasks;
  });

  // Tasks by status (filtered)
  todoTasks = computed(() => 
    this.filteredTasks().filter(t => t.status === TaskStatus.TODO)
  );
  inProgressTasks = computed(() => 
    this.filteredTasks().filter(t => t.status === TaskStatus.IN_PROGRESS)
  );
  completedTasks = computed(() => 
    this.filteredTasks().filter(t => t.status === TaskStatus.COMPLETED)
  );
  
  projects = this.projectStore.allProjects;

  // Get current project for breadcrumb
  currentProject = computed(() => {
    const pid = this.projectId();
    if (!pid) return null;
    return this.projectStore.allProjects().find(p => p.id === pid);
  });

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.projectId.set(params['projectId'] || null);
    });

    if (!this.tasksStore.hasTasks()) {
      this.taskService.getTasks();
    }
    if (!this.projectStore.hasProjects()) {
      this.projectService.getProjects();
    }
  }

  onDrop(event: CdkDragDrop<Task[]>, newStatus: TaskStatus) {
    if (event.previousContainer === event.container) {
      // Same column - just reorder (optional)
      return;
    }

    // Get the task that was moved
    const task = event.previousContainer.data[event.previousIndex];
    
    if (task && task.id) {
      // Update locally first for instant feedback
      this.tasksStore.updateTaskStatus(task.id, newStatus);
      
      // Then update on server
      this.taskService.updateTask(task.id, { status: newStatus });
    }
  }

  onCreateTask() {
    const dialogRef = this.dialog.open(TaskDialog, {
      width: '450px',
      data: { preselectedProjectId: this.projectId() }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.taskService.createTask(result);
      }
    });
  }

  onDeleteTask(event: Event, taskId: string) {
    event.stopPropagation();
    
    const dialogRef = this.dialog.open(ConfirmDialog, {
      width: '350px',
      data: {
        title: 'Confirm Delete',
        message: 'Are you sure you want to delete this task?',
        confirmText: 'Delete',
        cancelText: 'Cancel',
        color: 'warn'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.taskService.deleteTask(taskId);
      }
    });
  }

  onEditTask(event: Event, task: Task): void {
    event.stopPropagation();
    
    const dialogRef = this.dialog.open(TaskDialog, {
      width: '450px',
      data: { 
        task: task,
        mode: 'edit'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.id) {
        this.taskService.updateTask(result.id, result);
      }
    });
  }

  getPriorityColor(priority: TaskPriority): string {
    switch (priority) {
      case TaskPriority.HIGH: return 'warn';
      case TaskPriority.MEDIUM: return 'accent';
      case TaskPriority.LOW: return 'primary';
      default: return 'primary';
    }
  }

  getPriorityLabel(priority: TaskPriority): string {
    switch (priority) {
      case TaskPriority.HIGH: return 'High';
      case TaskPriority.MEDIUM: return 'Medium';
      case TaskPriority.LOW: return 'Low';
      default: return 'Medium';
    }
  }

  formatDate(date: Date | undefined): string {
    if (!date) return '';
    return new Date(date).toLocaleDateString();
  }

  onViewComments(event: Event, task: Task): void {
    event.stopPropagation();
    
    this.dialog.open(CommentsDialog, {
      width: '550px',
      data: {
        taskId: task.id,
        taskTitle: task.title
      }
    });
  }

  goBack(): void {
    if (this.currentProject()?.teamId) {
      this.router.navigate(['/projects', this.currentProject()?.teamId]);
    } else {
      this.router.navigate(['/projects']);
    }
  }
}
