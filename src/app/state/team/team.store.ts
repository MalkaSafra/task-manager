import { computed } from '@angular/core';
import { signalStore, withComputed, withState, withMethods, patchState } from '@ngrx/signals';
import { Team } from '../../models/team.model';

export interface TeamState {
  teams: Team[];
  loading: boolean;
  error: string | null;
}

const initialTeamState: TeamState = {
  teams: [],
  loading: false,
  error: null,
};

export const TeamStore = signalStore(
  { providedIn: 'root' },
  withState(initialTeamState),
  withComputed(({ teams, loading, error }) => ({
    allTeams: computed(() => teams()),
    teamsLoading: computed(() => loading()),
    teamsError: computed(() => error()),
    hasTeamsError: computed(() => !!error()),
    hasTeams: computed(() => teams().length > 0)
  })),
  withMethods((store) => ({
    setLoading(loading: boolean): void {
      patchState(store, { loading, error: null });
    },

    setTeamsSuccess(teams: Team[]): void {
      patchState(store, { teams, loading: false });
    },

    setTeamsFailure(error: string): void {
      patchState(store, { error, loading: false });
    },

    addTeam(team: Team): void {
      patchState(store, { teams: [...store.teams(), team] });
    },

    removeTeam(teamId: string): void {
      patchState(store, {
        teams: store.teams().filter(t => t.id !== teamId)
      });
    },

    clearError(): void {
      patchState(store, { error: null });
    }
  }))
);