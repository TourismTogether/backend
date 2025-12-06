import express, { Express, Request, Response } from "express";
import config from "./configs/config";
import route from "./routes/index";
import { initDB } from "./configs/db";
import { errorHandler, notFoundHandler } from "./middlewares/error-handler";
import cors from "cors";


const app: Express = express();
const port = config.port;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

initDB();

route(app);

app.use(errorHandler);
app.use(notFoundHandler);

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});