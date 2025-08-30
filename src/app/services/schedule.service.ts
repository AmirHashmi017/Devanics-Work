// Importing base class
import { HttpService } from '@/app/services/base.service';
import { IResponseInterface } from '@/app/interfaces/api-response.interface';
import { IToken } from '@/app/interfaces/authInterfaces/token.interface';
import { IProject } from '../interfaces/schedule/project.schedule.interface';
import { IWBSType } from '../interfaces/schedule/createSchedule.interface';

class ScheduleService extends HttpService {
  private readonly prefix: string = 'api/schedule';

  httpGenerateSchedule = (
    data: any
  ): Promise<IResponseInterface<{ token: IToken; createProject: IProject }>> =>
    this.post(`${this.prefix}/create`, data);

  httpGetAllScheduleProjects = (): Promise<
    IResponseInterface<{ scheduleProjects: IProject[] }>
  > => this.get(`${this.prefix}/schedule-projects`);

  httpGetScheduleProjectDivs = (
    projectId: string
  ): Promise<IResponseInterface<{ projectDivs: IWBSType[] }>> =>
    this.get(`${this.prefix}/project-divs/${projectId}`);

  httpGetScheduleProjectDetail = (
    projectId: string
  ): Promise<IResponseInterface<{ scheduleProjectDetail: IProject }>> =>
    this.get(`${this.prefix}/schedule-project/${projectId}`);

  httpAddProjectDiv = ({
    projectId,
    data,
  }: any): Promise<IResponseInterface<{ scheduleProjectDiv: IWBSType }>> =>
    this.post(`${this.prefix}/project-new-div/${projectId}`, data);

  httpDeleteProjectDiv = (
    divId: string
  ): Promise<IResponseInterface<{ deletedProjectDiv: IWBSType }>> =>
    this.post(`${this.prefix}/project-delete-div/${divId}`);

  httpUpdateProjectDiv = ({
    divId,
    data,
  }: any): Promise<IResponseInterface<{ updatedProjectDiv: IWBSType }>> =>
    this.post(`${this.prefix}/project-update-div/${divId}`, data);

  httpAddProjectDivActivity = ({
    projectId,
    divId,
    data,
  }: any): Promise<IResponseInterface<{ newProjectAcitivity: IWBSType }>> =>
    this.post(
      `${this.prefix}/add-project-div-activity/${projectId}/${divId}`,
      data
    );

  httpDeleteProjectDivActivity = ({
    activityId,
  }: any): Promise<IResponseInterface<{ deletedProjectAcitivity: IWBSType }>> =>
    this.post(`${this.prefix}/delete-project-div-activity/${activityId}`);

  httpUpdateProjectDivActivity = ({
    activityId,
    data,
  }: any): Promise<IResponseInterface<{ updateProjectAcitivity: IWBSType }>> =>
    this.post(`${this.prefix}/update-project-div-activity/${activityId}`, data);
}
export const scheduleService = new ScheduleService();
