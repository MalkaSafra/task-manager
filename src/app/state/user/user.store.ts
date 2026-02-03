import { computed } from '@angular/core';
import { signalStore, withComputed, withState, withMethods, patchState } from '@ngrx/signals';
import { Team } from '../../models/team.model';
import { User } from '../../models/user.model';
export interface userState{
    users: User[];
    loading: boolean;
    error: string | null;
}
const initialUserState: userState={
    users: [],
    loading: false,
    error: null,
};

export const UserStore = signalStore(
    {providedIn: 'root'},
    withState(initialUserState),  
    withComputed(({users,loading,error})=>({
        allUsers: computed(()=>users()),
        usersLoading: computed(()=>loading()),  
        usersError: computed(()=>error()),
        hasUsersError: computed(()=>!!error()),
        hasUsers: computed(()=>users().length > 0)  
    })),
    withMethods((store)=>({
        setLoading(loading: boolean): void {
            patchState(store, { loading, error: null });
          },

          setUsersSuccess(users: User[]): void {  
            patchState(store, { users, loading: false });
          },

          setUsersFailure(error: string): void {
            patchState(store, { error, loading: false });
          }
    })) );