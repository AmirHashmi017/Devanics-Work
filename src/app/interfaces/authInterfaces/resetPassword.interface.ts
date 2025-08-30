export interface IResetPasswordInterface {
  password: string;
  confirmPassword?: string;
  userId?: string | string[];
}
