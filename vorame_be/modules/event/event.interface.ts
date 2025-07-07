import { Document, ObjectId } from "mongoose";

interface IEvent extends Document {
  eventName: string;
  date: Date;
  time: string;
  description: string;
}

interface IEventReservation extends Document {
  event: ObjectId;
  firstName:string;
  lastName:string;
  userName:string;
  email:string;
  reservedBy: ObjectId;
}

export { IEvent, IEventReservation }