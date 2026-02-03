import { computed } from '@angular/core';
import { signalStore, withComputed, withState, withMethods, patchState } from '@ngrx/signals';
import { Project } from '../../models/project.model';
import { Task } from '../../models/task.model';
export interface ProjectState{
    projects: Project[];
    loading: boolean;
    error: string | null;
}
const initialProjectState: ProjectState={
    projects:[],
    loading: false,
    error: null,
};

export const projectStore = signalStore(
    {providedIn: 'root'},
    withState(initialProjectState),  
    withComputed(({projects,loading,error})=>({
        allProjects: computed(()=>projects()),
        projectsLoading: computed(()=>loading()),  
        projectsError: computed(()=>error()),
        hasProjectsError: computed(()=>!!error()),
        hasProjects: computed(()=>projects().length > 0)  
    })),
    withMethods((store)=>({
        setLoading(loading: boolean): void {
            patchState(store, { loading, error: null });
          },

          setProjectsSuccess(projects: Project[]): void {  
            patchState(store, { projects, loading: false });
          },

          setProjectsFailure(error: string): void {
            patchState(store, { error, loading: false });
          },

          addProject(project: Project): void {
            patchState(store, { projects: [...store.projects(), project] });
          },

          removeProject(projectId: string): void {
            patchState(store, { 
              projects: store.projects().filter(p => p.id !== projectId) 
            });
          }
    })) );