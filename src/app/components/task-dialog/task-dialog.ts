import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { projectStore } from '../../state/project/project.store';
import { Task, TaskStatus, TaskPriority } from '../../models/task.model';

export interface TaskDialogData {
  preselectedProjectId?: string;
  task?: Task;  // If provided, we're editing
  mode?: 'create' | 'edit';
}

@Component({
  selector: 'app-task-dialog',
  standalone: true,
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    FormsModule
  ],
  templateUrl: './task-dialog.html',
  styleUrls: ['./task-dialog.css']
})
export class TaskDialog implements OnInit {
  private dialogRef = inject(MatDialogRef<TaskDialog>);
  private projectStoreInstance = inject(projectStore);
  data: TaskDialogData = inject(MAT_DIALOG_DATA, { optional: true }) || {};

  projectId: string = '';
  title: string = '';
  description: string = '';
  status: TaskStatus = TaskStatus.TODO;
  priority: TaskPriority = TaskPriority.MEDIUM;
  dueDate: Date | null = null;

  isEditMode = false;

  statuses = [
    { value: TaskStatus.TODO, label: 'To Do' },
    { value: TaskStatus.IN_PROGRESS, label: 'In Progress' },
    { value: TaskStatus.COMPLETED, label: 'Completed' }
  ];

  priorities = [
    { value: TaskPriority.LOW, label: 'Low' },
    { value: TaskPriority.MEDIUM, label: 'Medium' },
    { value: TaskPriority.HIGH, label: 'High' }
  ];

  ngOnInit(): void {
    this.isEditMode = this.data?.mode === 'edit' && !!this.data?.task;

    if (this.isEditMode && this.data.task) {
      // Populate form with existing task data
      const task = this.data.task as any;
      // Handle both camelCase and snake_case from API
      this.projectId = task.projectId || task.project_id || '';
      this.title = task.title || '';
      this.description = task.description || '';
      this.status = task.status || TaskStatus.TODO;
      this.priority = task.priority || TaskPriority.MEDIUM;
      this.dueDate = task.dueDate || task.due_date ? new Date(task.dueDate || task.due_date) : null;
    } else if (this.data?.preselectedProjectId) {
      this.projectId = this.data.preselectedProjectId;
    }
  }

  get projects() {
    return this.projectStoreInstance.allProjects();
  }

  get dialogTitle(): string {
    return this.isEditMode ? 'Edit Task' : 'Add Task';
  }

  get submitButtonText(): string {
    return this.isEditMode ? 'Save' : 'Add';
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  getResult() {
    const result: any = {
      projectId: this.projectId,
      title: this.title,
      status: this.status,
      priority: this.priority
    };

    if (this.isEditMode && this.data.task?.id) {
      result.id = this.data.task.id;
    }

    if (this.description?.trim()) {
      result.description = this.description.trim();
    }

    if (this.dueDate) {
      result.dueDate = this.dueDate;
    }

    return result;
  }
}