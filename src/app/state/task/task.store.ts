import { computed } from '@angular/core';
import { signalStore, withComputed, withState, withMethods, patchState } from '@ngrx/signals';
import { Task, TaskStatus } from '../../models/task.model';

export interface TasksState {
  tasks: Task[];
  loading: boolean;
  error: string | null;
}

const initialTasksState: TasksState = {
  tasks: [],
  loading: false,
  error: null,
};

export const tasksStore = signalStore(
  { providedIn: 'root' },
  withState(initialTasksState),
  withComputed(({ tasks, loading, error }) => ({
    allTasks: computed(() => tasks()),
    tasksLoading: computed(() => loading()),
    tasksError: computed(() => error()),
    hasTasksError: computed(() => !!error()),
    hasTasks: computed(() => tasks().length > 0),
    todoTasks: computed(() => tasks().filter(t => t.status === TaskStatus.TODO)),
    inProgressTasks: computed(() => tasks().filter(t => t.status === TaskStatus.IN_PROGRESS)),
    completedTasks: computed(() => tasks().filter(t => t.status === TaskStatus.COMPLETED))
  })),
  withMethods((store) => ({
    setLoading(loading: boolean): void {
      patchState(store, { loading, error: null });
    },

    setTasksSuccess(tasks: Task[]): void {
      patchState(store, { tasks, loading: false });
    },

    setTasksFailure(error: string): void {
      patchState(store, { error, loading: false });
    },

    addTask(task: Task): void {
      patchState(store, { tasks: [...store.tasks(), task] });
    },

    removeTask(taskId: string): void {
      patchState(store, {
        tasks: store.tasks().filter(t => t.id !== taskId)
      });
    },

    updateTaskStatus(taskId: string, newStatus: TaskStatus): void {
      const updatedTasks = store.tasks().map(task =>
        task.id === taskId ? { ...task, status: newStatus } : task
      );
      patchState(store, { tasks: updatedTasks });
    },

    clearError(): void {
      patchState(store, { error: null });
    }
  }))
);