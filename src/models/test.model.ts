import { db } from "../configs/db";


export interface ITest {
    id: number,
    message: string
}

class TestModel {
    async getAllData(): Promise<Array<ITest>> {
        const data = await db.query<ITest>("SELECT * FROM test");
        return data.rows;
    }

    async createOne(message: string): Promise<ITest> {
        const data = await db.query<ITest>(
            "INSERT INTO test (message) VALUES ($1) RETURNING *",
            [message]
        );
        return data.rows[0]!;
    }
}

export const testModel = new TestModel();
