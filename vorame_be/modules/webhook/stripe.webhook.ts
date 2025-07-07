import { Request, Response } from "express";
import Users from "../../modules/user/user.model";
import Stripe from "stripe";
import PurchaseHistory from "../../modules/purchase-history/purchase-history.model";
import mongoose from "mongoose";

type WebHookReqBody<T = {}> = {
    id: string;
    object: 'event';
    type: Stripe.Event.Type;
    data: T;
};

type Metadata = {
    planId: string;
    userId: string;
}
export async function stripeWebhook(req: Request, res: Response) {
    const event =
        req.body as WebHookReqBody<Stripe.CheckoutSessionCompletedEvent.Data>;

    switch (event.type) {
        case 'payment_intent.succeeded': {
            const metadata = event.data.object.metadata as Metadata;
            const eventData = event.data.object as unknown as Stripe.PaymentIntent;
            const user = await Users.findById(metadata.userId);
            console.log('eventData:1', eventData);
            console.log('user:1', user);

            if (user) {
                user.stripePaymentIntentId = eventData.id;
                user.stripeCustomerId = eventData.customer as string;
                const history = await PurchaseHistory.create({
                    planId: metadata.planId,
                    startDate: new Date(eventData.created * 1000),
                    endDate: null,
                    paymentIntentId: eventData.id,
                    status: "active",
                    user: user._id
                })
                user.subscription = history._id.toString();
                await user.save();
            }
        }
            break;
        case "customer.subscription.updated": {
            const metadata = event.data.object.metadata as Metadata;
            const eventData = event.data.object as unknown as Stripe.Subscription;

            const user = await Users.findById(metadata.userId);
            console.log('eventData:2', eventData);
            console.log('user:2', user);
            if (user && eventData.status === 'active') {
                user.stripeSubscriptionId = eventData.id;
                user.stripeCustomerId = eventData.customer as string;

                const history = await PurchaseHistory.create({
                    planId: metadata.planId,
                    startDate: new Date(eventData.current_period_start * 1000),
                    endDate: new Date(eventData.current_period_end * 1000),
                    subscriptionId: eventData.id,
                    user: user._id,
                    status: "active"
                });
                user.subscription = history._id.toString();
                await user.save();

            } else if (eventData.status === 'canceled') {
                const history = await PurchaseHistory.findById(user.subscription);
                history.status = "cancelled";
                history.expirationAt = new Date();
                await history.save();
            }

        }
            break;

        case "customer.subscription.deleted": {
            const metadata = event.data.object.metadata as Metadata;
            const eventData = event.data.object as unknown as Stripe.Subscription;
            const user = await Users.findById(metadata.userId);
            console.log('eventData:3', eventData);
            console.log('user:3', user);
            if (user && user.subscription) {
                const history = await PurchaseHistory.findById(user.subscription);
                history.status = "cancelled";
                history.expirationAt = new Date();
                await history.save();
            }
        }
            break;

        case 'invoice.payment_failed': {
            const metadata = event.data.object.metadata as Metadata;
            const eventData = event.data.object as unknown as Stripe.Invoice;
            const user = await Users.findById(metadata.userId);
            console.log('eventData:4', eventData);
            console.log('user:4', user);
            if (user && user.subscription) {
                const history = await PurchaseHistory.findById(user.subscription);
                history.status = "expired";
                await history.save();
            }
        }
            break;

        default:
            break;
    }

    res.json({ received: true });

}