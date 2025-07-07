import moment from "moment";
import Users from "../modules/user/user.model";
import { OTP_ENUM } from "../modules/user/enums/otp.enums";
const cron = require("node-cron");

cron.schedule("* * * * *", async () => {
  try {
    const fiveMinutesAgo = moment().subtract(5, "minutes").toDate();

    // Update users whose otpStatus is not verified and have expired OTPs
    const result = await Users.updateMany(
      {
        otpStatus: OTP_ENUM.NOT_VERIFIED,
        $or: [
          // Case when createdAt and updatedAt are the same
          {
            $and: [
              { createdAt: { $lte: fiveMinutesAgo } },
              { $expr: { $eq: ["$createdAt", "$updatedAt"] } },
            ],
          },
          // Case when createdAt and updatedAt are different
          {
            $and: [
              { updatedAt: { $lte: fiveMinutesAgo } },
              { $expr: { $ne: ["$createdAt", "$updatedAt"] } },
            ],
          },
        ],
      },
      { $set: { otpStatus: OTP_ENUM.EXPIRED } }
    );

    console.log(`Number of users modified: ${result.modifiedCount}`);
  } catch (error) {
    console.error("Error updating users:", error);
  }
});
