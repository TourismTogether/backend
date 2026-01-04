import express, { Express, Request, Response } from "express";
import config from "./configs/config";
import route from "./routes/index";
import { initDB } from "./configs/db";
import { errorHandler, notFoundHandler } from "./middlewares/error-handler";
import cors from "cors";
import session from "express-session";

const app: Express = express();
const port = config.port;

app.set("trust proxy", 1); // trust first proxy
app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(cors());
const allowedOrigins = [
  "http://localhost:3000",
  "https://tourism-together.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);

      if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

initDB();

app.use(function (req, res, next) {
  console.log(req.originalUrl);

  next();
});

route(app);

app.use(errorHandler);
app.use(notFoundHandler);

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
