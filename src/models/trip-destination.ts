import { db } from "../configs/db";

export interface ITripDestination {
    trip_id: string,
    destination_id: string,
    created_at: Date
}

class TripDestinationModel {
    async find(trip_id: string, destination_id: string) {
        const result = await db.query<ITripDestination>(
            "SELECT * FROM trip_destination WHERE trip_id = $1 AND destination_id = $2",
            [trip_id, destination_id]
        );
        return result.rows[0];
    }

    async add(trip_id: string, destination_id: string) {
        const sql = `
            INSERT INTO trip_destination (trip_id, destination_id)
            VALUES ($1, $2)
            RETURNING *;
        `;
        const result = await db.query(sql, [trip_id, destination_id]);
        return result.rows[0];
    }

    async delete(trip_id: string, destination_id: string) {
        const result = await db.query(
            "DELETE FROM trip_destination WHERE trip_id = $1 AND destination_id = $2",
            [trip_id, destination_id]
        );
        return result.rowCount !== null && result.rowCount > 0;
    }
}

export const tripDestinationModel = new TripDestinationModel();