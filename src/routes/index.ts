import { Express, Request, Response } from "express";
import userRouter from "./user.route";
import authRouter from "./auth.route";
import routeRouter from "./route.route";
import accountRouter from "./account.route";
import tripRouter from "./trip.route"

function route(app: Express) {
    app.use("/users", userRouter);
    app.use("/auth", authRouter);
    app.use("/routes", routeRouter);
    app.use("/accounts", accountRouter);
    app.use("/trips", tripRouter);
}

export default route;