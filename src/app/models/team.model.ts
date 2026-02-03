export interface TeamMember {
  id: string;
  name: string;
  email: string;
}

export interface Team {
  id?: string;
  name: string;
  description?: string;
  leader?: string;
  members?: TeamMember[];
  memberCount?: number;
  createdAt?: Date;
  updatedAt?: Date;
}