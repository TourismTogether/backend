import { db } from "../configs/db";

export interface ICost {
    id?: string,
    route_id: string,
    title: string,
    description: string,
    category: string,
    cost: number,
    created_at: Date,
    updated_at: Date
}

class CostModel {
    async findAll(): Promise<Array<ICost>> {
        const data = await db.query<ICost>("SELECT * FROM costs");
        return data.rows;
    }

    async findById(id: string): Promise<ICost | undefined> {
        const data = await db.query<ICost>("SELECT * FROM costs WHERE id = $1", [id]);
        return data.rows[0];
    }

    async createOne(cost: ICost): Promise<ICost | undefined> {
        const query = `
                    INSERT INTO costs (
                        route_id, title, description, category, cost, created_at, updated_at
                    ) VALUES ($1, $2, $3, $4, $5, $6, $7)
                    RETURNING *;
                `;

        const values = [
            cost.route_id,
            cost.title,
            cost.description,
            cost.category,
            cost.cost,
            cost.created_at,
            cost.updated_at,
        ];

        const data = await db.query<ICost>(query, values);
        return data.rows[0];
    }

    async updateById(id: string, cost: ICost): Promise<ICost | undefined> {
        const { id: costId, ...fieldsToUpdate } = cost;
        const keys = Object.keys(fieldsToUpdate);
        if (keys.length === 0) return undefined;

        const setClause = keys.map((key, idx) => `${key} = $${idx + 2}`).join(", ");
        const values = Object.values(fieldsToUpdate);
        values.unshift(id);

        const query = `
                    UPDATE costs
                    SET ${setClause}
                    WHERE id = $1
                    RETURNING *;
                `;

        const data = await db.query<ICost>(query, values);
        return data.rows[0];
    }

    async deleteById(id: string): Promise<boolean> {
        const result = await db.query(`
            DELETE FROM costs WHERE id = $1
            `, [id]);
        return result.rowCount == null || result.rowCount > 0;
    }
}

export const costModel = new CostModel();
