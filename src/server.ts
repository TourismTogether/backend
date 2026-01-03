import express, { Express, Request, Response } from "express";
import config from "./configs/config";
import route from "./routes/index";
import { initDB } from "./configs/db";
import { errorHandler, notFoundHandler } from "./middlewares/error-handler";
import cors from "cors";
import session from "express-session";

const app: Express = express();
const port = config.port;

// CORS phải đặt trước session để xử lý preflight requests
app.use(cors({
    origin: ["http://localhost:3000", "http://192.168.56.1:3000"],
    credentials: true
}));

app.set('trust proxy', 1) // trust first proxy
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    cookie: { 
        secure: false,
        httpOnly: true,
        sameSite: 'lax',
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

initDB();

route(app);

app.use(errorHandler);
app.use(notFoundHandler);

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});