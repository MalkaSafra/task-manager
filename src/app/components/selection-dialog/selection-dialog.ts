import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';

export interface SelectionOption {
  id: string | number;
  label: string;
}

export interface SelectionDialogData {
  title: string;
  options: SelectionOption[];
  placeholder?: string;
  confirmText?: string;
  cancelText?: string;
}

@Component({
  selector: 'app-selection-dialog',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    MatDialogModule, 
    MatFormFieldModule, 
    MatSelectModule, 
    MatButtonModule
  ],
  templateUrl: './selection-dialog.html',
  styleUrls: ['./selection-dialog.css']
})
export class SelectionDialog {
  public data: SelectionDialogData = inject(MAT_DIALOG_DATA);
  private dialogRef = inject(MatDialogRef<SelectionDialog>);

  selectedId: string | number = '';

  onConfirm(): void {
    if (this.selectedId) {
      this.dialogRef.close(this.selectedId);
    }
  }
}