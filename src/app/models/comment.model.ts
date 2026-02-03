export interface Comment {
  id?: string;
  body: string;
  taskId: string;
  userId: string;
  authorName?: string;
  createdAt?: Date;
  updatedAt?: Date;
}