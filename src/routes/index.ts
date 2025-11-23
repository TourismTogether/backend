import { Express, Request, Response } from "express";
import { testModel, ITest } from "../models/test.model";

function route(app: Express) {

    app.get("/", function (req: Request, res: Response) {
        res.json({ message: "hello!!!" });
    });

    app.get("/test", async function (req: Request, res: Response) {
        const data = await testModel.getAllData();
        res.json({ data });
    })

    app.post("/test", async function (req: Request, res: Response) {
        const data: ITest = req.body;
        const result: ITest = await testModel.createOne(data.message);
        res.json(result);
    })
}

export default route;