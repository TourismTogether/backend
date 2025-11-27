import { Express, Request, Response } from "express";
import userRouter from "./user.route";
import authRouter from "./auth.route";
import routeRouter from "./route.route";

function route(app: Express) {
    app.use("/users", userRouter);
    app.use("/auth", authRouter);
    app.use("/routes", routeRouter);
}

export default route;