import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { Task } from '../../models/task.model';
import { tasksStore } from '../../state/task/task.store';

interface ApiTask {
  id: number | string;
  title: string;
  description?: string;
  status: string;
  priority: string;
  project_id?: number | string;
  projectId?: string;
  assignee_id?: number | string;
  assignedTo?: string;
  due_date?: string;
  dueDate?: string;
  created_by?: number | string;
  createdBy?: string;
  created_at?: string;
  createdAt?: string;
  updated_at?: string;
  updatedAt?: string;
}

@Injectable({
  providedIn: 'root',
})
export class Tasks {
  private readonly httpClient = inject(HttpClient);
  private readonly taskStore = inject(tasksStore);

  async getTasks(projectId?: string): Promise<void> {
    this.taskStore.setLoading(true);
    try {
      const rawTasks = await firstValueFrom(
        this.httpClient.get<ApiTask[]>(`/tasks`, { params: projectId ? { projectId } : {} })
      );
      const tasks: Task[] = rawTasks.map(t => this.mapApiTask(t));
      this.taskStore.setTasksSuccess(tasks);
    } catch (error: unknown) {
      const err = error as { error?: { message?: string } };
      const errorMessage = err.error?.message || 'Failed to load tasks';
      this.taskStore.setTasksFailure(errorMessage);
    }
  }

  async createTask(task: Partial<Task>): Promise<void> {
    try {
      const apiTask = await firstValueFrom(
        this.httpClient.post<ApiTask>(`/tasks`, task)
      );
      const newTask = this.mapApiTask(apiTask);
      this.taskStore.addTask(newTask);
    } catch (error: unknown) {
      const err = error as { error?: { message?: string } };
      const errorMessage = err.error?.message || 'Failed to create task';
      this.taskStore.setTasksFailure(errorMessage);
    }
  }

  async updateTask(taskId: string, updates: Partial<Task>): Promise<void> {
    try {
      await firstValueFrom(
        this.httpClient.patch<Task>(`/tasks/${taskId}`, updates)
      );
      // Store already updated locally via updateTaskStatus
    } catch (error: unknown) {
      const err = error as { error?: { message?: string } };
      const errorMessage = err.error?.message || 'Failed to update task';
      this.taskStore.setTasksFailure(errorMessage);
      // Refetch to restore correct state on error
      this.getTasks();
    }
  }

  async deleteTask(taskId: string): Promise<void> {
    try {
      await firstValueFrom(
        this.httpClient.delete(`/tasks/${taskId}`)
      );
      this.taskStore.removeTask(taskId);
    } catch (error: unknown) {
      const err = error as { error?: { message?: string } };
      const errorMessage = err.error?.message || 'Failed to delete task';
      this.taskStore.setTasksFailure(errorMessage);
    }
  }

  private mapApiTask(t: ApiTask): Task {
    return {
      id: String(t.id),
      title: t.title,
      description: t.description,
      status: t.status as Task['status'],
      priority: t.priority as Task['priority'],
      projectId: String(t.project_id || t.projectId || ''),
      assignedTo: t.assignee_id || t.assignedTo ? String(t.assignee_id || t.assignedTo) : undefined,
      dueDate: t.due_date || t.dueDate ? new Date(t.due_date || t.dueDate!) : undefined,
      createdBy: t.created_by || t.createdBy ? String(t.created_by || t.createdBy) : undefined,
      createdAt: t.created_at || t.createdAt ? new Date(t.created_at || t.createdAt!) : undefined,
      updatedAt: t.updated_at || t.updatedAt ? new Date(t.updated_at || t.updatedAt!) : undefined
    };
  }
}