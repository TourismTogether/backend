import express, { Express, Request, Response } from "express";
import config from "./configs/config";
import route from "./routes/index";
import { initDB } from "./configs/db";
import { errorHandler, notFoundHandler } from "./middlewares/error-handler";


const app: Express = express();
const port = config.port;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

initDB();

route(app);

app.use(errorHandler);
app.use(notFoundHandler);

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});