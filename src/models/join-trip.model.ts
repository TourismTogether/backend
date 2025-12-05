import { db } from "../configs/db";

export interface IJoinTrip {
    user_id: string,
    trip_id: string,
    created_at: Date
}

class JoinTripModel {
    async findAll(): Promise<IJoinTrip[]> {
        const result = await db.query<IJoinTrip>("SELECT * FROM join_trip");
        return result.rows;
    }

    async findByTrip(tripId: string): Promise<IJoinTrip[]> {
        const result = await db.query<IJoinTrip>(
            "SELECT * FROM join_trip WHERE trip_id = $1",
            [tripId]
        );
        return result.rows;
    }

    async findByUser(userId: string): Promise<IJoinTrip[]> {
        const result = await db.query<IJoinTrip>(
            "SELECT * FROM join_trip WHERE user_id = $1",
            [userId]
        );
        return result.rows;
    }

    async find(userId: string, tripId: string): Promise<IJoinTrip | undefined> {
        const result = await db.query<IJoinTrip>(
            "SELECT * FROM join_trip WHERE user_id = $1 AND trip_id = $2",
            [userId, tripId]
        );
        return result.rows[0];
    }

    async create(data: IJoinTrip): Promise<IJoinTrip | undefined> {
        const query = `
            INSERT INTO join_trip (user_id, trip_id, created_at)
            VALUES ($1, $2, $3)
            RETURNING *
        `;
        const values = [data.user_id, data.trip_id, data.created_at];
        const result = await db.query<IJoinTrip>(query, values);
        return result.rows[0];
    }

    async delete(user_id: string, trip_id: string): Promise<boolean> {
        const result = await db.query(
            "DELETE FROM join_trip WHERE user_id = $1 AND trip_id = $2",
            [user_id, trip_id]
        );
        return result.rowCount !== null && result.rowCount > 0;
    }
}

export const joinTripModel = new JoinTripModel();