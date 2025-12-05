import { Express, Request, Response } from "express";
import userRouter from "./user.route";
import authRouter from "./auth.route";
import routeRouter from "./route.route";
import accountRouter from "./account.route";
import tripRouter from "./trip.route"
import costRouter from "./cost.route"
import regionRouter from "./region.route"
import destinationRouter from "./destination.route"
import postRouter from "./post.route"
import diaryRouter from "./diary.route"
import travellerRouter from "./traveller.route"

function route(app: Express) {
    app.use("/users", userRouter);
    app.use("/auth", authRouter);
    app.use("/routes", routeRouter);
    app.use("/accounts", accountRouter);
    app.use("/trips", tripRouter);
    app.use("/costs", costRouter);
    app.use("/regions", regionRouter);
    app.use("/destinations", destinationRouter);
    app.use("/posts", postRouter);
    app.use("/diaries", diaryRouter);
    app.use("/travellers", travellerRouter);
}

export default route;