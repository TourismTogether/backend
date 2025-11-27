import { db } from "../configs/db";

export interface IRoute {
    id: string,
    trip_id: string,
    title: string,
    description: string,
    start_location: string,
    end_location: string,
    created_at: Date,
    updated_at: Date
}

class RouteModel {
    async findAll(): Promise<Array<IRoute>> {
        const data = await db.query<IRoute>("SELECT * FROM routes");
        return data.rows;
    }

    async findById(id: string): Promise<IRoute | undefined> {
        const data = await db.query<IRoute>("SELECT * FROM routes WHERE id = $1", [id]);
        return data.rows[0];
    }

    async createOne(route: IRoute): Promise<IRoute | undefined> {
        const query = `
            INSERT INTO routes (
                trip_id, title, description, start_location, end_location, created_at, updated_at
            ) VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING *;
        `;

        const values = [
            route.trip_id,
            route.title,
            route.description,
            route.start_location,
            route.end_location,
            route.created_at,
            route.updated_at
        ];

        const data = await db.query<IRoute>(query, values);
        return data.rows[0];
    }

    async updateById(id: string, route: Partial<IRoute>): Promise<IRoute | undefined> {
        const { id: routeId, ...fieldsToUpdate } = route;
        const keys = Object.keys(fieldsToUpdate);
        if (keys.length === 0) return undefined;

        const setClause = keys.map((key, idx) => `${key} = $${idx + 2}`).join(", ");
        const values = Object.values(fieldsToUpdate);
        values.unshift(id);

        const query = `
            UPDATE routes
            SET ${setClause}
            WHERE id = $1
            RETURNING *;
        `;

        const data = await db.query<IRoute>(query, values);
        return data.rows[0];
    }

    async deleteById(id: string): Promise<boolean> {
        const result = await db.query(`
            DELETE FROM routes WHERE id = $1
            `, [id]);
        return result.rowCount == null || result.rowCount > 0;
    }
}

export const routeModel = new RouteModel();