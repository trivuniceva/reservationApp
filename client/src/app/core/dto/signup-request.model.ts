export interface SignupRequest{
  email: string;
  password?: string;
  confirmPassword?: string;
  firstName: string;
  lastName: string;
  address: string;
  phone: string;
  userRole: 'GUEST' | 'HOST';

}
