import mongoose, { Schema } from "mongoose";
import { IEvent, IEventReservation } from "./event.interface";

const EventSchema = new Schema<IEvent>(
  {
    eventName: { type: String, required: true },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    description: { type: String, required: true },
  },
  { timestamps: true }
);

const EventReservationSchema = new Schema<IEventReservation>(
  {
    firstName: { type: String, default: "" },
    lastName: { type: String, default: "" },
    userName: { type: String, default: "" },
    email: { type: String, default: "" },
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "event",
      required: true,
    },
    reservedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
  },
  { timestamps: true }
);

const Event = mongoose.model<IEvent>("event", EventSchema);
const EventReservation = mongoose.model<IEventReservation>(
  "eventreservation",
  EventReservationSchema
);

export { Event, EventReservation };
