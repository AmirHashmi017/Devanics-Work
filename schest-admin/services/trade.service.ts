import { IResponseInterface } from '../interfaces/api-response.interface';
import { ITrade } from '../interfaces/trade.interface';
import { HttpService } from './base.service';

class TradeService extends HttpService {
  private readonly prefix: string = 'api/trade';

  httpGetAllTrades = (): Promise<IResponseInterface<{ trades: ITrade[] }>> =>
    this.get(`${this.prefix}/all`);
}

export const tradeService = new TradeService();
