import { IResponseInterface } from '../interfaces/api-response.interface';
import {
  IBookingDemo,
  IBookingDemoForm,
} from '../interfaces/booking-demo.interface';
import { HttpService } from './base.service';

class BookingDemoService extends HttpService {
  private readonly prefix = 'api/booking-demo';

  httpCreateBookingDemo = (
    data: IBookingDemoForm
  ): Promise<IResponseInterface<IBookingDemo>> =>
    this.post(`${this.prefix}/create`, data);

  httpGetAllBookingsByDate = (
    date: string
  ): Promise<IResponseInterface<IBookingDemo[]>> =>
    this.get(`${this.prefix}/all/${date}`);

  httpGetBookingDemo = (
    id: string
  ): Promise<IResponseInterface<IBookingDemo>> =>
    this.get(`${this.prefix}/${id}`);
}

export default new BookingDemoService();
