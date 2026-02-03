import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { TeamStore } from '../../state/team/team.store';
import { Team, TeamMember } from '../../models/team.model';

interface ApiTeamMember {
  id: number | string;
  name: string;
  email: string;
}

interface ApiTeam {
  id: number | string;
  name: string;
  members?: ApiTeamMember[];
  created_at?: string;
}

@Injectable({
  providedIn: 'root',
})
export class Teams {
  private readonly httpClient = inject(HttpClient);
  private readonly teamStore = inject(TeamStore);

  async getTeams(): Promise<void> {
    this.teamStore.setLoading(true);
    try {
      const rawTeams = await firstValueFrom(
        this.httpClient.get<ApiTeam[]>(`/teams`)
      );
      const teams: Team[] = rawTeams.map(t => this.mapApiTeam(t));
      this.teamStore.setTeamsSuccess(teams);
    } catch (error: unknown) {
      const err = error as { error?: { message?: string } };
      const errorMessage = err.error?.message || 'Failed to load teams';
      this.teamStore.setTeamsFailure(errorMessage);
    }
  }

  async createTeam(name: string): Promise<void> {
    try {
      const rawTeam = await firstValueFrom(
        this.httpClient.post<ApiTeam>(`/teams`, { name })
      );
      const team = this.mapApiTeam(rawTeam);
      this.teamStore.addTeam(team);
    } catch (error: unknown) {
      const err = error as { error?: { message?: string } };
      const errorMessage = err.error?.message || 'Failed to create team';
      this.teamStore.setTeamsFailure(errorMessage);
    }
  }

  async addMemberToTeam(teamId: string, userId: string): Promise<void> {
    try {
      await firstValueFrom(
        this.httpClient.post(`/teams/${teamId}/members`, { userId })
      );
      // Refresh teams to get updated member list
      await this.getTeams();
    } catch (error: unknown) {
      const err = error as { error?: { message?: string } };
      const errorMessage = err.error?.message || 'Failed to add member to team';
      this.teamStore.setTeamsFailure(errorMessage);
    }
  }

  async deleteTeam(teamId: string): Promise<void> {
    try {
      await firstValueFrom(
        this.httpClient.delete(`/teams/${teamId}`)
      );
      this.teamStore.removeTeam(teamId);
    } catch (error: unknown) {
      const err = error as { error?: { message?: string } };
      const errorMessage = err.error?.message || 'Failed to delete team';
      this.teamStore.setTeamsFailure(errorMessage);
    }
  }

  private mapApiTeam(apiTeam: ApiTeam): Team {
    const members: TeamMember[] | undefined = apiTeam.members?.map(m => ({
      id: String(m.id),
      name: m.name,
      email: m.email
    }));
    
    return {
      id: String(apiTeam.id),
      name: apiTeam.name,
      members
    };
  }
}