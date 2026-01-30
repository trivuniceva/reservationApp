export type UserRole = 'ADMIN' | 'REGULAR_USER'

export interface User{
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  imageUrl?: string;
}
