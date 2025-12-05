import { IRoute } from "express";
import { db } from "../configs/db";
import { IDestination } from "./destination.model";
import { IUser } from "./user.model";

export interface ITrip {
    id?: string,
    destination_id: string,
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

    async findTripMembers(id: string): Promise<Array<IUser>> {
        const query = `
            SELECT u.*
            FROM join_trip AS jt
            JOIN users AS u ON u.id = jt.user_id
            WHERE jt.trip_id = $1
        `;
        const values = [id];
        const data = await db.query<IUser>(query, values);
        return data.rows
    }

    // async findListDestination(id: string): Promise<Array<IDestination>> {
    //     const query = `
    //         SELECT d.*
    //         FROM trip_destination AS td
    //         JOIN destinations AS d ON d.id = td.destination_id
    //         WHERE td.trip_id = $1
    //     `;
    //     const values = [id];
    //     const data = await db.query<IDestination>(query, values);
    //     return data.rows;
    // }

    async createOne(trip: ITrip): Promise<ITrip | undefined> {
        const query = `
                    INSERT INTO trips (
                        destination_id, title, description, departure, distance, start_date, end_date, difficult,
                        total_budget, spent_amount, status, created_at, updated_at)
                        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
                    RETURNING *;
                `;

        const values = [
            trip.destination_id,
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

    async findListRoutes(id: string): Promise<Array<IRoute>> {
        const query = `
            SELECT r.*
            FROM routes AS r
            JOIN trips AS t ON r.trip_id = t.id
            WHERE r.trip_id = $1
        `;
        const values = [id];
        const data = await db.query(query, values);
        return data.rows;
    }
}

export const tripModel = new TripModel();