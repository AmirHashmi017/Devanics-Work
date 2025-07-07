import { objectId } from "../../utils";
import { EHttpStatus } from "../../enums/httpStatus.enum";
import { ResponseMessage } from "../../enums/resMessage.enum";
import { Event, EventReservation } from "./event.model";
import { CustomError } from "../../errors/custom.error";
import moment from "moment";
import { PipelineStage } from "mongoose";

class EventService {
  constructor() {}

  // handler to check event id exist or not
  checkEventHandler = async (id: string) => {
    const event = await Event.findById(id);

    if (!event) {
      throw new CustomError(EHttpStatus.NOT_FOUND, ResponseMessage.INVALID_ID);
    }
    return event;
  };

  // create event
  async createEvent({ params, body }) {
    const { id } = params;
    let event;
    event = await Event.findOne({ title: body.eventName });

    if (event) {
      return {
        message: ResponseMessage.EVENT_ALREADY_EXIST,
        statusCode: EHttpStatus.BAD_REQUEST,
        data: null,
      };
    }
    event = await Event.create({ postedBy: id, ...body });
    return {
      message: ResponseMessage.EVENT_CREATED,
      statusCode: EHttpStatus.CREATED,
      data: event,
      //       data: {
      //   ...event.toObject(),
      //   createdAtLocal: moment(event.createdAt).tz("Asia/Karachi").format(),
      // },
    };
  }

  //   add event reservation
  async addEventReservation({ payload, params }) {
    const { id } = params;
    const { _id: userId } = payload;

    const event: any = await this.checkEventHandler(id);

    console.log(event, "eventevent");

    let reservation;
    reservation = await EventReservation.findOne({
      reservedBy: userId,
      event: id,
    });

    if (reservation) {
      return {
        message: ResponseMessage.RESERVATION_ALREADY_EXIST,
        statusCode: EHttpStatus.BAD_REQUEST,
        data: null,
      };
    }

    if (moment(event.date).startOf("day").isBefore(moment().startOf("day"))) {
      throw new CustomError(
        EHttpStatus.BAD_REQUEST,
        "The event has expired and can no longer be reserved."
      );
    }

    reservation = await EventReservation.create({
      reservedBy: userId,
      event: objectId(id),
    });
    return {
      message: ResponseMessage.EVENT_CREATED,
      statusCode: EHttpStatus.CREATED,
      data: reservation,
    };
  }

  //  event list
  async eventList({ payload, query }) {
    const { _id } = payload;
    const { status } = query;

    const today = new Date();
    // Base aggregation pipeline
    const pipeline: PipelineStage[] = [
      {
        $lookup: {
          from: "eventreservations",
          localField: "_id",
          foreignField: "event",
          as: "reservations",
        },
      },
      {
        $addFields: {
          isReserved: {
            $in: [objectId(_id), "$reservations.reservedBy"],
          },
          reservations: {
            $size: "$reservations",
          },
        },
      },
      {
        $sort: {
          _id: -1,
        },
      },
    ];

    // Add filtering logic based on the status
    if (status === "previous") {
      pipeline.unshift({
        $match: {
          date: { $lt: today },
        },
      });
    } else if (status === "upcoming") {
      pipeline.unshift({
        $match: {
          date: { $gt: today },
        },
      });
    }

    const events = await Event.aggregate(pipeline);

    return {
      statusCode: EHttpStatus.OK,
      data: { events },
    };
  }

  //  single event
  async singleEvent({ params }) {
    const { id } = params;

    const reservations = await EventReservation.find({
      event: id,
    }).countDocuments();
    const event = await Event.findById(id);

    if (!event) {
      return {
        message: ResponseMessage.EVENT_NOT_FOUND,
        statusCode: EHttpStatus.NOT_FOUND,
      };
    }

    return {
      statusCode: EHttpStatus.OK,
      data: { ...event.toObject(), reservations },
    };
  }

  //  event reservations
  async eventReservations({ params }) {
    const { id } = params;
    await this.checkEventHandler(id);
    const reservations = await EventReservation.find({ event: id })
      .populate("event")
      .populate("reservedBy");

    return {
      statusCode: EHttpStatus.OK,
      data: { reservations },
    };
  }

  // user event reservations
  async userReservations({ payload }) {
    const { _id } = payload;
    const reservations = await EventReservation.find({ reservedBy: _id })
      .populate("event")
      .populate("reservedBy");

    return {
      statusCode: EHttpStatus.OK,
      data: { reservations },
    };
  }

  //  event single reservation
  async eventReservation({ params }) {
    const { id } = params;

    const reservation = await EventReservation.findById(id).populate("event");

    if (!reservation) {
      return {
        message: ResponseMessage.EVENT_NOT_FOUND,
        statusCode: EHttpStatus.NOT_FOUND,
      };
    }

    return {
      statusCode: EHttpStatus.OK,
      data: reservation,
    };
  }

  //  update event
  async updateEvent({ params, body }) {
    const { id } = params;
    await this.checkEventHandler(id);
    const event = await Event.findByIdAndUpdate(
      { _id: id },
      {
        $set: body,
      }
    );

    if (!event) {
      return {
        message: ResponseMessage.EVENT_NOT_FOUND,
        statusCode: EHttpStatus.NOT_FOUND,
      };
    }

    if (!event) {
      return {
        message: ResponseMessage.EVENT_NOT_UPDATED,
        statusCode: EHttpStatus.BAD_REQUEST,
      };
    }

    return {
      message: ResponseMessage.EVENT_UPDATED,
      statusCode: EHttpStatus.OK,
      data: event,
    };
  }

  // Update event status
  async updateStatus({ params, body }) {
    const { id } = params;
    await this.checkEventHandler(id);
    const event = await Event.findByIdAndUpdate({ _id: id }, { body });

    if (!event) {
      return {
        message: ResponseMessage.EVENT_STATUS_NOT_UPDATED,
        statusCode: EHttpStatus.BAD_REQUEST,
      };
    }

    return {
      message: ResponseMessage.EVENT_STATUS_UPDATED,
      statusCode: EHttpStatus.OK,
    };
  }

  //  delete event
  async deleteEvent({ params }) {
    const { id } = params;
    await this.checkEventHandler(id);
    await Event.findByIdAndDelete(id);
    const removeEventReservations = await EventReservation.deleteMany({
      event: id,
    });

    return {
      message: ResponseMessage.EVENT_DELETED,
      statusCode: EHttpStatus.OK,
      data: removeEventReservations,
    };
  }
}

export default new EventService();
