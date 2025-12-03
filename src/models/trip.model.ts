import { db } from "../configs/db";

export interface ITrip {
    id?: string,
    title: string,
    description: string,
    departure: string,
    distance: number,
    start_date: Date,
    end_date: Date,
    difficult: number,
    total_budget: number,
    spent_amount: number,
    status: string,
    created_at: Date,
    updated_at: Date
}

class TripModel {
    async findAll(): Promise<Array<ITrip>> {
        const data = await db.query<ITrip>("SELECT * FROM trips");
        return data.rows;
    }

    async findById(id: string): Promise<ITrip | undefined> {
        const data = await db.query<ITrip>("SELECT * FROM trips WHERE id = $1", [id]);
        return data.rows[0];
    }

    async createOne(trip: ITrip): Promise<ITrip | undefined> {
        const query = `
                    INSERT INTO trips (
                        title, description, departure, distance, start_date, end_date, difficult,
                        total_budget, spent_amount, status, created_at, updated_at)
                        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
                    RETURNING *;
                `;

        const values = [
            trip.title,
            trip.description,
            trip.departure,
            trip.distance,
            trip.start_date,
            trip.end_date,
            trip.difficult,
            trip.total_budget,
            trip.spent_amount,
            trip.status,
            trip.created_at,
            trip.updated_at
        ];

        const data = await db.query<ITrip>(query, values);
        return data.rows[0];
    }

    async updateById(id: string, trip: ITrip): Promise<ITrip | undefined> {
        const { id: tripId, ...fieldsToUpdate } = trip;
        const keys = Object.keys(fieldsToUpdate);
        if (keys.length === 0) return undefined;

        const setClause = keys.map((key, idx) => `${key} = $${idx + 2}`).join(", ");
        const values = Object.values(fieldsToUpdate);
        values.unshift(id);

        const query = `
                    UPDATE trips
                    SET ${setClause}
                    WHERE id = $1
                    RETURNING *;
                `;

        const data = await db.query<ITrip>(query, values);
        return data.rows[0];
    }

    async deleteById(id: string): Promise<boolean> {
        const result = await db.query(`
            DELETE FROM trips WHERE id = $1
            `, [id]);
        return result.rowCount == null || result.rowCount > 0;
    }
}

export const tripModel = new TripModel();