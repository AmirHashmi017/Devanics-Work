// auth.service.ts

// Importing base class
import { ILogInInterface } from 'src/interfaces/authInterfaces/login.interface';
import { HttpService } from './base.service';

// Importing interfaces
import { IResponseInterface } from 'src/interfaces/api-response.interface';
import { IUser } from 'src/interfaces/authInterfaces/user.interface';

class AuthService extends HttpService {
  private readonly prefix: string = 'api/auth';

  loginHandler = (
    data: ILogInInterface
  ): Promise<
    IResponseInterface<{ token: string; user: IUser; message: string }>
  > => this.post(`${this.prefix}/login`, data);
}
export const authService = new AuthService();
