import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
const app = express();
app.use(cookieParser());

app.use(
  cors({
    origin: process.env.ORIGIN,
    credentials: true,
  })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));

import userRouter from "./routes/userRoutes.js";
import videoRouter from "./routes/videoRoutes.js"
import SubscriptionRouter  from "./routes/subscriptionRoutes.js";
import tweetRouter  from "./routes/tweetRoutes.js";
import commentRouter  from "./routes/commentRoutes.js";
import LikeRouter from "./routes/likeRoutes.js"
import PlaylistRouter from "./routes/playlistRoutes.js"
import dashboardRouter from "./routes/dashboardRotes.js"

app.use("/api/v1/users", userRouter);
app.use("/api/v1/videos",videoRouter)
app.use("/api/v1/subscription",SubscriptionRouter)
app.use("/api/v1/tweet",tweetRouter)
app.use("/api/v1/comment",commentRouter)
app.use("/api/v1/like",LikeRouter)
app.use("/api/v1/playlist",PlaylistRouter)
app.use("/api/v1/dashboard",dashboardRouter)

export { app };
