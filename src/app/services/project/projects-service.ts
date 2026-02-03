import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { Project } from '../../models/project.model';
import { projectStore } from '../../state/project/project.store';

interface ApiProject {
  id: number | string;
  name: string;
  description?: string;
  team_id?: number | string;
  teamId?: string;
  created_at?: string;
  createdAt?: string;
  updated_at?: string;
  updatedAt?: string;
}

@Injectable({
  providedIn: 'root',
})
export class Projects {
  private readonly httpClient = inject(HttpClient);
  private readonly projectStore = inject(projectStore);

  async getProjects(): Promise<void> {
    this.projectStore.setLoading(true);
    try {
      const rawProjects = await firstValueFrom(
        this.httpClient.get<ApiProject[]>(`/projects`)
      );
      const projects: Project[] = rawProjects.map(p => this.mapApiProject(p));
      this.projectStore.setProjectsSuccess(projects);
    } catch (error: unknown) {
      const err = error as { error?: { message?: string } };
      const errorMessage = err.error?.message || 'Failed to load projects';
      this.projectStore.setProjectsFailure(errorMessage);
    }
  }

  async createProject(teamId: string, name: string, description?: string): Promise<void> {
    try {
      const rawProject = await firstValueFrom(
        this.httpClient.post<ApiProject>(`/projects`, { teamId, name, description })
      );
      const project = this.mapApiProject(rawProject);
      this.projectStore.addProject(project);
    } catch (error: unknown) {
      const err = error as { error?: { message?: string } };
      const errorMessage = err.error?.message || 'Failed to create project';
      this.projectStore.setProjectsFailure(errorMessage);
    }
  }

  async deleteProject(projectId: string): Promise<void> {
    try {
      await firstValueFrom(
        this.httpClient.delete(`/projects/${projectId}`)
      );
      this.projectStore.removeProject(projectId);
    } catch (error: unknown) {
      const err = error as { error?: { message?: string } };
      const errorMessage = err.error?.message || 'Failed to delete project';
      this.projectStore.setProjectsFailure(errorMessage);
    }
  }

  private mapApiProject(p: ApiProject): Project {
    return {
      id: String(p.id),
      name: p.name || '',
      description: p.description,
      teamId: String(p.team_id || p.teamId || ''),
      createdAt: p.created_at || p.createdAt ? new Date(p.created_at || p.createdAt!) : undefined,
      updatedAt: p.updated_at || p.updatedAt ? new Date(p.updated_at || p.updatedAt!) : undefined
    };
  }
}