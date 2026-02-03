import { computed } from '@angular/core';
import { signalStore, withComputed, withState, withMethods, patchState } from '@ngrx/signals';
import { Comment } from '../../models/comment.model';

export interface CommentsState {
  comments: Comment[];
  currentTaskId: string | null;
  loading: boolean;
  error: string | null;
}

const initialCommentsState: CommentsState = {
  comments: [],
  currentTaskId: null,
  loading: false,
  error: null,
};

export const commentsStore = signalStore(
  { providedIn: 'root' },
  withState(initialCommentsState),
  withComputed(({ comments, loading, error, currentTaskId }) => ({
    allComments: computed(() => comments()),
    commentsLoading: computed(() => loading()),
    commentsError: computed(() => error()),
    hasCommentsError: computed(() => !!error()),
    hasComments: computed(() => comments().length > 0),
    taskId: computed(() => currentTaskId())
  })),
  withMethods((store) => ({
    setLoading(loading: boolean): void {
      patchState(store, { loading, error: null });
    },

    setCommentsSuccess(comments: Comment[], taskId: string): void {
      patchState(store, { comments, currentTaskId: taskId, loading: false });
    },

    setCommentsFailure(error: string): void {
      patchState(store, { error, loading: false });
    },

    addComment(comment: Comment): void {
      patchState(store, { comments: [...store.comments(), comment] });
    },

    clearComments(): void {
      patchState(store, { comments: [], currentTaskId: null });
    }
  }))
);