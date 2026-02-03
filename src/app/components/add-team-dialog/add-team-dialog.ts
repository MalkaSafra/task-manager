import { Component } from '@angular/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-add-team-dialog',
  standalone: true, 
  imports: [MatDialogModule, FormsModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  templateUrl: './add-team-dialog.html',
})
export class AddTeamDialogComponent {
  teamName: string = ''; 

  constructor(private dialogRef: MatDialogRef<AddTeamDialogComponent>) {}

  onCancel(): void {
    this.dialogRef.close(); 
  }
}