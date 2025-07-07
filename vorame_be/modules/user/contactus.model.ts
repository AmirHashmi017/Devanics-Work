import mongoose, { Schema } from 'mongoose';
import IContactUs from './interfaces/contactus.interface';

let contactUsSchema = new Schema<IContactUs>(
    {
        firstName: {
            type: String,
        },
        lastName: {
            type: String,
        },
        subject: {
            type: String,
            required: true,
        },
        message: {
            type: String,
            required: true,
        },
        user: { type: Schema.Types.ObjectId, ref: "users" }
    },
    { timestamps: true }
);

const ContactUs = mongoose.model<IContactUs>('contactus', contactUsSchema);

export default ContactUs;
