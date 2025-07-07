import "reflect-metadata";

import express from "express";
import "dotenv/config";
import cors from "cors";
import "./config/database.config";
import bodyParser from "body-parser";
import morgan from "morgan";
import path from "path";
import { config } from "./config/config";

// routes imports
import { authRoutes } from "./modules/auth/auth.routes";
import { dashboardRoutes } from "./modules/dashboard/dashboard.routes";
import { bookClubRoutes } from "./modules/bookClub/bookClub.routes";
import { clipRoutes } from "./modules/clips/clips.routes";
import { blogRoutes } from "./modules/blog/blog.routes";
import { printRoutes } from "./modules/bluePrint/bluePrint.routes";
import { whistleRoutes } from "./modules/whistle/whistle.routes";
import { libraryRoutes } from "./modules/library/library.routes";
import { loungeRoutes } from "./modules/lounge/lounge.routes";
import boardroomRoutes from "./modules/boardroom/boardroom.routes";
import { tapeRoutes } from "./modules/tape/tape.routes";
import { practiceRoutes } from "./modules/practice/practice.routes";
import { faqRoutes } from "./modules/faq/faq.routes";
import { userRoutes } from "./modules/user/user.routes";
import { planRoutes } from "./modules/plan/plan.routes";
import paymentRoutes from "./modules/payment/payment.route";
import promoCodeRoutes from "./modules/promo-code/promo-code.routes";
import { careerRoutes } from "./modules/career/career.routes";
import { stripeWebhook } from "./modules/webhook/stripe.webhook";
import { supportRoutes } from "./modules/support/support.routes";
import { eventRoutes } from "./modules/event/event.routes";
import { habitBreakerRoutes } from "./modules/habitBreaker/habitBreaker.routes";
import { tranquilityRoutes } from "./modules/tranquility/tranquility.routes";
import { personalChatRoutes } from "./modules/personalChat/personalChat.routes";

import { Server } from "socket.io";
import { join } from "node:path";
import { OAuth2Client } from "google-auth-library";



// import "./jobs/otpExpiration";

import mailService from "./helper/SESMail";
// import { EMails } from "./contants/EMail";

const app = express();

const whitelist = [
  "http://localhost:3000",
  "http://localhost:3001",
  "http://localhost:3002",
  "http://localhost:4000",
  "http://localhost:5000",
  "https://admin.vorame.com",
  "https://checkout.stripe.com",
  "*.stripe.com",
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};




app.use(cors(corsOptions));
app.use(morgan("dev"));
// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, "public")));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.sendFile(join(__dirname, "../index.html"));
});
app.post("/testEmail", async (req, res) => {
  await mailService.sendMail({
    to: "chazher2020@gmail.com",
    subject: "Test Email",
    // html: EMails["INVOICE_PAYMENT_CONFIRMATION"]({
    //   invoiceID: "123",
    //   paidAmount: 100,
    //   paymentMethod: "Card",
    //   transactionDate: moment().format("YYYY-MM-DD HH:mm:ss"),
    //   username: "Fahad",
    // }),
  });
  res.send("DONE");
});


// Route to verify Google Sign-In token
app.post("/google-signin", async (req, res) => {
  const { token } = req.body;

  try {
    // Verify the token using the Google OAuth2Client
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
    });

    const payload = ticket.getPayload();

    // Extract user information
    const { sub, email, name, picture } = payload;

    // You can now use this information to create or update the user in your database
    res.status(200).json({
      message: "Sign-in successful",
      user: {
        googleId: sub,
        email,
        name,
        picture,
      },
    });
  } catch (error) {
    res.status(400).json({ message: "Invalid Google token", error: error.message });
  }
});

/** Routes */
app.post(
  "/api/webhook",
  express.json({ type: "application/json" }),
  stripeWebhook
);
app.use("/api/auth", authRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/book-club", bookClubRoutes);
app.use("/api/clip", clipRoutes);
app.use("/api/blog", blogRoutes);
app.use("/api/print", printRoutes);
app.use("/api/whistle", whistleRoutes);
app.use("/api/library", libraryRoutes);
app.use("/api/lounge", loungeRoutes);
app.use("/api/boardroom", boardroomRoutes);
app.use("/api/tape", tapeRoutes);
app.use("/api/practice", practiceRoutes);
app.use("/api/faq", faqRoutes);
app.use("/api/user", userRoutes);
app.use("/api/plan", planRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/promo-code", promoCodeRoutes);
app.use("/api/career", careerRoutes);
app.use("/api/support-ticket", supportRoutes);
app.use("/api/event", eventRoutes);
app.use("/api/habitBreaker",habitBreakerRoutes)
app.use("/api/tranquility",tranquilityRoutes)
app.use("/api/personalChat",personalChatRoutes)


const server = app.listen(config.PORT, () => {
  console.log(`Server is running on`, config.PORT);
});

export const io = new Server(server);

io.on("connection", (socket) => {
  console.log(socket.id);
});
