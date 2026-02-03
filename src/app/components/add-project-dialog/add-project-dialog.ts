import { Component, inject, OnInit } from '@angular/core';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { TeamStore } from '../../state/team/team.store';

export interface AddProjectDialogData {
  preselectedTeamId?: string;
}

@Component({
  selector: 'app-add-project-dialog',
  standalone: true,
  imports: [
    MatDialogModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule
  ],
  templateUrl: './add-project-dialog.html',
  styleUrl: './add-project-dialog.css',
})
export class AddProjectDialog implements OnInit {
  teamStore = inject(TeamStore);
  private data: AddProjectDialogData = inject(MAT_DIALOG_DATA, { optional: true }) || {};
  
  teamId: string = '';
  name: string = '';
  description: string = '';

  constructor(private dialogRef: MatDialogRef<AddProjectDialog>) {}

  ngOnInit(): void {
    if (this.data?.preselectedTeamId) {
      this.teamId = this.data.preselectedTeamId;
    }
  }

  get teams() {
    return this.teamStore.allTeams();
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  getResult() {
    return {
      teamId: this.teamId,
      name: this.name,
      ...(this.description && { description: this.description })
    };
  }
}
