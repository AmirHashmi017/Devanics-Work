import { getUserData, objectId } from "../../utils";
import { EHttpStatus } from "../../enums/httpStatus.enum";
import { ResponseMessage } from "../../enums/resMessage.enum";
import { SupportTicket, SupportTicketChat } from "./support.model";
import { CustomError } from "../../errors/custom.error";

class SupportService {
  constructor() { }

  // handler to check support ticket id exist or not
  checkSupportTicketHandler = async (id: string) => {
    const supportTicket = await SupportTicket.findById(id);

    if (!supportTicket) {
      throw new CustomError(
        EHttpStatus.NOT_FOUND,
        ResponseMessage.SUPPORT_TICKET_ID_INVALID
      );
    }
    return supportTicket;
  };

  // ticket authorization
  ticketAuthorizationHandler = async (userId: string, ticketId: string): Promise<any> => {
    const ticketData = await this.checkSupportTicketHandler(ticketId);
    const { userRole = '' } = await getUserData(userId);
    if (userRole !== 'admin' && ticketData.postedBy.toString() !== userId) {
      throw new CustomError(
        EHttpStatus.NOT_FOUND,
        ResponseMessage.SUPPORT_NOT_FOUND,
      );
    }
    return ticketData;
  }

  // create ticket
  async createTicket({ payload, body }) {
    const { _id } = payload

    const ticket = await SupportTicket.create({ postedBy: _id, ...body });
    return {
      message: ResponseMessage.SUPPORT_CREATED,
      statusCode: EHttpStatus.CREATED,
      data: ticket
    };
  }

  //  ticket list
  async ticketList({ payload, query }) {
    const { status = '1', startDate, endDate } = query;
    const { _id } = payload
    const userData = await getUserData(_id);
    const startD = startDate ? new Date(startDate) : new Date(0);
    const endD = endDate ? new Date(endDate) : new Date();
    const { userRole } = userData || {};
    const tickets = await SupportTicket.find({ ...(userRole !== 'admin' && { postedBy: _id }), status: +status, createdAt: { $gte: startD, $lte: endD } }).populate('postedBy');

    return {
      statusCode: EHttpStatus.OK,
      data: { tickets },
    };
  }

  //  ticket details
  async ticketDetails({ payload, params }) {
    const { id } = params;
    const { _id: userId } = payload;
    await this.ticketAuthorizationHandler(userId, id);
    const ticket = await SupportTicket.findById(id).populate('postedBy');

    if (!ticket) {
      return {
        message: ResponseMessage.SUPPORT_NOT_FOUND,
        statusCode: EHttpStatus.NOT_FOUND,
      };
    }

    return {
      statusCode: EHttpStatus.OK,
      data: ticket,
    };
  }

  //  ticket chat
  async ticketChat({ payload, params }) {
    const { id } = params;
    const { _id: userId } = payload;
    const ticketData = await this.ticketAuthorizationHandler(userId, id);

    console.log(ticketData, 'tic...chat...')

    const messages = await SupportTicketChat.find({ ticket: objectId(id) }).populate('ticket').populate('postedBy');

    return {
      statusCode: EHttpStatus.OK,
      data: { ticketStatus: ticketData.toObject().status, messages },
    };
  }

  // add ticket message
  async addTicketMessage({ payload, body, params }) {
    const { _id: userId } = payload;
    const { id } = params;
    await this.ticketAuthorizationHandler(userId, id);
    const ticketMessage = await SupportTicketChat.create({ ticket: id, postedBy: userId, ...body });
    return {
      message: ResponseMessage.SUPPORT_CREATED,
      statusCode: EHttpStatus.CREATED,
      data: ticketMessage
    };
  }

  async getTicketMessage({ payload, params }) {
    const { id } = params;
    const { _id: userId } = payload;
    await this.ticketAuthorizationHandler(userId, id);
    const ticket = await SupportTicketChat.findById(id);
    return {
      message: ResponseMessage.SUPPORT_CREATED,
      statusCode: EHttpStatus.CREATED,
      data: ticket
    };
  }

  // update ticket status
  async updateStatus({ payload, params }) {
    const { id } = params;
    const { _id: userId } = payload;
    const ticketData = await this.ticketAuthorizationHandler(userId, id);
    let supportTicket;

    supportTicket = await SupportTicket.findByIdAndUpdate({ _id: id }, {
      $set: {
        status: ticketData.toObject().status ? 0 : 1
      }
    });

    return {
      message: ResponseMessage.SUPPORT_STATUS_UPDATED,
      statusCode: EHttpStatus.OK,
      data: supportTicket
    };
  }

  //  delete ticket
  async deleteSupportTicket({ payload, params }) {
    const { id } = params;
    const { _id: userId } = payload;
    await this.ticketAuthorizationHandler(userId, id);
    const ticket = await SupportTicket.findByIdAndDelete({ _id: id });

    if (!ticket) {
      return {
        message: ResponseMessage.SUPPORT_NOT_FOUND,
        statusCode: EHttpStatus.NOT_FOUND,
        data: null
      };
    }

    return {
      message: ResponseMessage.SUPPORT_DELETED,
      statusCode: EHttpStatus.OK,
      data: ticket
    };
  }
}

export default new SupportService();
