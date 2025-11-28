// Importing base class
import { HttpService } from './base.service';

// Importing interfaces
import { IResponseInterface } from 'src/interfaces/api-response.interface';

class SubcriptionService extends HttpService {
  private readonly subcriptionPrefix: string = 'api/subcription';

  httpGetAdminSubcription = (
    page: number,
    limit: number = 9,
    queryRoles?: String
  ): Promise<IResponseInterface<any>> =>
    this.get(`${this.subcriptionPrefix}/getSubcriptionHistories`);
}
export const subcriptionService = new SubcriptionService();
