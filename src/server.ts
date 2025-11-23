import express, { Express, Request, Response } from "express";
import config from "./configs/config";
import route from "./routes/index";
import { initDB } from "./configs/db";


const app: Express = express();
const port = config.port;

app.use(express.json());

initDB();

route(app);

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});