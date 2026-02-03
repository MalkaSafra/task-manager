import { Component, inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { CommonModule } from '@angular/common';
import { commentsStore } from '../../state/comment/comments.store';
import { CommentsService } from '../../services/comment/comments-service';

export interface CommentsDialogData {
  taskId: string;
  taskTitle: string;
}

@Component({
  selector: 'app-comments-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatDividerModule
  ],
  templateUrl: './comments-dialog.html',
  styleUrl: './comments-dialog.css'
})
export class CommentsDialog implements OnInit {
  private dialogRef = inject(MatDialogRef<CommentsDialog>);
  private data = inject<CommentsDialogData>(MAT_DIALOG_DATA);
  private commentsService = inject(CommentsService);
  commentsStore = inject(commentsStore);

  newComment: string = '';

  get taskTitle(): string {
    return this.data.taskTitle;
  }

  get taskId(): string {
    return this.data.taskId;
  }

  get comments() {
    return this.commentsStore.allComments();
  }

  get isLoading() {
    return this.commentsStore.commentsLoading();
  }

  ngOnInit(): void {
    this.commentsService.getComments(this.taskId);
  }

  async onAddComment(): Promise<void> {
    if (!this.newComment.trim()) return;

    await this.commentsService.createComment(this.taskId, this.newComment.trim());
    this.newComment = '';
  }

  onClose(): void {
    this.commentsService.clearComments();
    this.dialogRef.close();
  }

  formatDate(date: Date | undefined): string {
    if (!date) return '';
    return new Date(date).toLocaleString();
  }
}
