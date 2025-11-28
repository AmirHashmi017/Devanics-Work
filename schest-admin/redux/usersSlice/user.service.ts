// Importing base class

import { IResponseInterface } from 'src/interfaces/api-response.interface';
import { HttpService } from 'src/services/base.service';

class UserService extends HttpService {
  private readonly userPrefix: string = 'api/user';

  httpGetAdminCompanyStats = (role: string): Promise<IResponseInterface<any>> =>
    this.get(`${this.userPrefix}/admin/stats/${role}`);
}

export const userService = new UserService();
