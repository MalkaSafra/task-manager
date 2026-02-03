import { inject, computed, OnInit, Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { projectStore } from '../../state/project/project.store';
import { TeamStore } from '../../state/team/team.store';
import { Tasks as taskServise } from '../../services/task/tasks';
import { MatDialog } from '@angular/material/dialog';
import { Projects as projectService } from '../../services/project/projects-service';
import { Teams as TeamsService } from '../../services/teams/teams';
import { AddProjectDialog } from '../add-project-dialog/add-project-dialog';
import { ConfirmDialog } from '../confirm-dialog/confirm-dialog';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { LoadingSpinner, ErrorAlert } from '../shared';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatTooltipModule,
    LoadingSpinner,
    ErrorAlert
  ],
  templateUrl: './projects.html',
  styleUrl: './projects.css',
})
export class Projects implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private dialog = inject(MatDialog);
  
  projectsStore = inject(projectStore);
  projectService = inject(projectService);
  teamStore = inject(TeamStore);
  teamsService = inject(TeamsService);
  
  teamId: string | null = null;

  // Filtered projects based on teamId
  projects = computed(() => {
    const allProjects = this.projectsStore.allProjects();
    if (this.teamId) {
      return allProjects.filter(p => p.teamId === this.teamId);
    }
    return allProjects;
  });

  // Get current team name for breadcrumb
  currentTeam = computed(() => {
    if (!this.teamId) return null;
    return this.teamStore.allTeams().find(t => t.id === this.teamId);
  });

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.teamId = params['teamId'] || null;
    });

    if (!this.projectsStore.hasProjects()) {
      this.projectService.getProjects();
    }
    if (!this.teamStore.hasTeams()) {
      this.teamsService.getTeams();
    }
  }

  onCreateProject() {
    const dialogRef = this.dialog.open(AddProjectDialog, {
      width: '350px',
      data: { preselectedTeamId: this.teamId }
    });

    dialogRef.afterClosed().subscribe((result: { teamId: string, name: string, description?: string }) => {
      if (result) {
        this.projectService.createProject(result.teamId, result.name, result.description);
      }
    });
  }

  onDeleteProject(projectId: string) {
    const dialogRef = this.dialog.open(ConfirmDialog, {
      width: '350px',
      data: {
        title: 'Confirm Delete',
        message: 'Are you sure you want to delete this project?',
        confirmText: 'Delete',
        cancelText: 'Cancel',
        color: 'warn'
      }
    });
    
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.projectService.deleteProject(projectId);
      }
    });
  }

  onViewTasks(projectId: string) {
    this.router.navigate(['/tasks', projectId]);
  }

  goBack() {
    this.router.navigate(['/teams']);
  }
}