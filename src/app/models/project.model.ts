export interface Project {
  id?: string;
  name: string;
  description?: string;
  teamId: string;
  owner?: string;
  createdAt?: Date;
  updatedAt?: Date;
}