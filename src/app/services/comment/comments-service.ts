import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { Comment } from '../../models/comment.model';
import { commentsStore } from '../../state/comment/comments.store';

interface ApiComment {
  id: number | string;
  body: string;
  task_id: number | string;
  user_id: number | string;
  author_name?: string;
  created_at?: string;
  updated_at?: string;
}

@Injectable({
  providedIn: 'root',
})
export class CommentsService {
  private readonly httpClient = inject(HttpClient);
  private readonly commentStore = inject(commentsStore);

  async getComments(taskId: string): Promise<void> {
    this.commentStore.setLoading(true);
    try {
      const rawComments = await firstValueFrom(
        this.httpClient.get<ApiComment[]>(`/comments`, { params: { taskId } })
      );
      const comments: Comment[] = rawComments.map(c => this.mapApiComment(c));
      this.commentStore.setCommentsSuccess(comments, taskId);
    } catch (error: unknown) {
      const err = error as { error?: { message?: string } };
      const errorMessage = err.error?.message || 'Failed to load comments';
      this.commentStore.setCommentsFailure(errorMessage);
    }
  }

  async createComment(taskId: string, content: string): Promise<void> {
    try {
      const rawComment = await firstValueFrom(
        this.httpClient.post<ApiComment>(`/comments`, { taskId, body: content })
      );
      const comment = this.mapApiComment(rawComment);
      this.commentStore.addComment(comment);
    } catch (error: unknown) {
      const err = error as { error?: { message?: string } };
      const errorMessage = err.error?.message || 'Failed to create comment';
      this.commentStore.setCommentsFailure(errorMessage);
    }
  }

  clearComments(): void {
    this.commentStore.clearComments();
  }

  private mapApiComment(c: ApiComment): Comment {
    return {
      id: String(c.id),
      body: c.body,
      taskId: String(c.task_id),
      userId: String(c.user_id),
      authorName: c.author_name,
      createdAt: c.created_at ? new Date(c.created_at) : undefined,
      updatedAt: c.updated_at ? new Date(c.updated_at) : undefined
    };
  }
}