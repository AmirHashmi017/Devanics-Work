// Importing base class
import { HttpService } from './base.service';
import { IMeeting } from '../interfaces/meeting.type';
import { IResponseInterface } from 'src/interfaces/api-response.interface';

export type CreateMeetingType = Omit<
  IMeeting,
  '_id' | 'createdAt' | 'updatedAt' | 'associatedCompany'
>;
class MeetingService extends HttpService {
  private readonly prefix: string = 'api/meeting';

  httpCreateMeeting = (
    data: CreateMeetingType
  ): Promise<IResponseInterface<{ meeting: IMeeting }>> =>
    this.post(`${this.prefix}/create`, data);

  httpGetMeetings = (): Promise<IResponseInterface<{ meetings: IMeeting[] }>> =>
    this.get(`${this.prefix}/all`);

  httpGetMeetingByRoomName = (
    roomName = ''
  ): Promise<IResponseInterface<{ meeting: IMeeting }>> =>
    this.get(`${this.prefix}/roomName/${roomName}`);
}
export const meetingService = new MeetingService();
