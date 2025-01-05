import { User } from '@shared/user/models/user.model';

export class AuthLoginResult {
  user!: User;
  token!: string;
  refreshToken!: string;
}
