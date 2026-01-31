export type UserRole = 'ADMIN' | 'HOST' | 'GUEST'

export interface User{
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  imageUrl?: string;
}
