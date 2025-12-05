import { db } from "../configs/db";
import { ITrip } from "./trip.model";

export interface IUser {
    id?: string,
    account_id?: string,
    full_name: string,
    avatar_url: string,
    phone: string,
    created_at?: Date,
    updated_at?: Date
}

class UserModel {
    async findAll(): Promise<Array<IUser>> {
        const data = await db.query<IUser>("SELECT * FROM users");
        return data.rows;
    }

    async findById(id: string): Promise<IUser | undefined> {
        const data = await db.query<IUser>("SELECT * FROM users WHERE id = $1", [id]);
        return data.rows[0];
    }

    async findByPhone(phone: string): Promise<IUser | undefined> {
        const data = await db.query<IUser>("SELECT * FROM users WHERE phone = $1", [phone]);
        return data.rows[0];
    }

    async findByAccountId(account_id: string): Promise<IUser | undefined> {
        const data = await db.query<IUser>("SELECT * FROM users WHERE account_id = $1", [account_id]);
        return data.rows[0];
    }

    async createOne(user: IUser): Promise<IUser | undefined> {
        const query = `INSERT INTO
                users (account_id ,full_name, avatar_url, phone, created_at, updated_at)
            VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`;
        const values = [user.account_id, user.full_name, user.avatar_url, user.phone, user.created_at, user.updated_at];
        const data = await db.query<IUser>(query, values);
        return data.rows[0];
    }

    async updateById(id: string, user: IUser): Promise<IUser | undefined> {
        const { id: _id, ...fieldsToUpdate } = user;
        const keys = Object.keys(fieldsToUpdate);
        if (keys.length === 0) return undefined;
        const setClause = keys.map((key, idx) => `${key} = $${idx + 2}`).join(", ");
        const values = Object.values(fieldsToUpdate);
        values.unshift(id);

        const query = `
                    UPDATE users
                    SET ${setClause}
                    WHERE id = $1
                    RETURNING *;
                `;

        const data = await db.query<IUser>(query, values);
        return data.rows[0];
    }

    async deleteById(id: string): Promise<boolean> {
        const result = await db.query(`
            DELETE FROM users WHERE id = $1
            `, [id]);
        return result.rowCount == null || result.rowCount > 0;
    }

    async findListTrip(id: string): Promise<Array<ITrip>> {
        const query = `
            SELECT t.*
            FROM join_trip AS jt
            JOIN trips AS t ON t.id = jt.trip_id
            WHERE jt.user_id = $1
        `;
        const values = [id];
        const data = await db.query<ITrip>(query, values);
        return data.rows;
    }
}

export const userModel = new UserModel();