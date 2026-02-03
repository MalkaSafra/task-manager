import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TeamStore } from '../../state/team/team.store';
import { inject } from '@angular/core';
import { Teams as TeamsService } from '../../services/teams/teams';
import { MatDialog } from '@angular/material/dialog';
import { AddTeamDialogComponent } from '../add-team-dialog/add-team-dialog';
import { ConfirmDialog } from '../confirm-dialog/confirm-dialog';
import { SelectionDialog } from '../selection-dialog/selection-dialog';
import { UserStore } from '../../state/user/user.store';
import { UsersService } from '../../services/users';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { LoadingSpinner, ErrorAlert } from '../shared';

@Component({
  selector: 'app-teams',
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
  templateUrl: './teams.html',
  styleUrl: './teams.css',
})
export class Teams {
  readonly teamService = inject(TeamsService);
  private readonly userService = inject(UsersService);
  private readonly dialog = inject(MatDialog);
  private readonly router = inject(Router);
  
  teamStore = inject(TeamStore);
  userStore = inject(UserStore);
  teams = this.teamStore.allTeams;

  constructor() {
    if (!this.teamStore.hasTeams()) {
      this.teamService.getTeams();
    }
    if (!this.userStore.hasUsers()) {
      this.userService.getUsers();
    }
  }

  onCreateTeam() {
    const dialogRef = this.dialog.open(AddTeamDialogComponent, {
      width: '350px',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.teamService.createTeam(result);
      }
    });
  }

  onDeleteTeam(teamId: string) {
  const dialogRef = this.dialog.open(ConfirmDialog, {
    width: '350px',
    data: {
      title: 'Confirm Delete',
      message: 'Are you sure you want to delete this team?',
      confirmText: 'Delete',
      cancelText: 'Cancel',
      color: 'warn'
    }
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result) {
      this.teamService.deleteTeam(teamId);
    }
  });
}

addMemberToTeam(teamId: string) {

  const userOptions = this.userStore.allUsers().map(user => ({
    id: user.id,
    label: user.name
  }));

  // 2. נפתח את הפופאפ הגנרי
  this.dialog.open(SelectionDialog, {
    width: '350px',
    data: {
      title: 'Add New Member',
      options: userOptions,
      placeholder: 'Search for a user',
      confirmText: 'Add to Team'
    }
  }).afterClosed().subscribe(selectedUserId => {
    // 3. אם התקבל ID, נבצע את הפעולה ב-Store
    if (selectedUserId) {
      this.teamService.addMemberToTeam( teamId,  selectedUserId );
    }
  });
}

onViewProjects(teamId: string) {
  this.router.navigate(['/projects', teamId]);
}
}