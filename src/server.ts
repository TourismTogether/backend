import express, { Express, Request, Response } from "express";
import config from "./configs/config";
import route from "./routes/index";
import { initDB } from "./configs/db";
import { errorHandler, notFoundHandler } from "./middlewares/error-handler";
import cors from "cors";
import session from "express-session";

const app: Express = express();
const port = config.port;

app.set('trust proxy', 1) // trust first proxy
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(cors());
app.use(cors({
    origin: "http://localhost:3000",
    credentials: true
}));

initDB();

app.use(function (req, res, next) {
    console.log(req.originalUrl);

    next()
})

route(app);

app.use(errorHandler);
app.use(notFoundHandler);

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});