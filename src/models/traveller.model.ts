import { db } from "../configs/db";
import { IDiary } from "./diary.model";
import { IPost } from "./post.model";

export interface ITraveller {
    user_id?: string,
    bio: string,
    is_shared_location: boolean,
    latitude: number,
    longitude: number,
    travel_preference?: Array<string>,
    emergency_contacts?: Array<string>,
    is_safe?: boolean
}

class TravellerModel {
    async findAll(): Promise<Array<ITraveller>> {
        const result = await db.query(`SELECT * FROM travellers`);
        // Parse jsonb fields to arrays
        return result.rows.map((row: any) => ({
            ...row,
            emergency_contacts: this.parseJsonbField(row.emergency_contacts),
            travel_preference: this.parseJsonbField(row.travel_preference),
        }));
    }

    private parseJsonbField(field: any): Array<string> | undefined {
        if (!field) return undefined;
        if (Array.isArray(field)) return field;
        if (typeof field === 'string') {
            try {
                const parsed = JSON.parse(field);
                return Array.isArray(parsed) ? parsed : undefined;
            } catch {
                return undefined;
            }
        }
        return undefined;
    }

    async findById(userId: string): Promise<ITraveller | undefined> {
        const result = await db.query(
            `SELECT * FROM travellers WHERE user_id = $1`,
            [userId]
        );
        if (!result.rows[0]) return undefined;
        const row = result.rows[0];
        // Parse jsonb fields to arrays
        return {
            ...row,
            emergency_contacts: this.parseJsonbField(row.emergency_contacts),
            travel_preference: this.parseJsonbField(row.travel_preference),
        };
    }

    async createOne(traveller: ITraveller): Promise<ITraveller | undefined> {
        const query = `
      INSERT INTO travellers 
      (user_id, bio, is_shared_location, latitude, longitude, travel_preference, emergency_contacts, is_safe)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
      RETURNING *;
    `;

        const values = [
            traveller.user_id,
            traveller.bio,
            traveller.is_shared_location,
            traveller.latitude,
            traveller.longitude,
            traveller.travel_preference,
            traveller.emergency_contacts,
            traveller.is_safe,
        ];

        const result = await db.query(query, values);
        return result.rows[0];
    }

    async updateById(user_id: string, traveller: Partial<ITraveller>): Promise<ITraveller | undefined> {
        const keys = Object.keys(traveller);
        if (keys.length === 0) return undefined;

        // Xử lý special case cho jsonb fields
        const setClause = keys
            .map((key, idx) => {
                // Nếu là emergency_contacts hoặc travel_preference, cast sang jsonb
                if (key === 'emergency_contacts' || key === 'travel_preference') {
                    return `${key} = $${idx + 2}::jsonb`;
                }
                return `${key} = $${idx + 2}`;
            })
            .join(", ");

        const values = Object.values(traveller).map((val, idx) => {
            const key = keys[idx];
            // Convert array to JSON string for jsonb fields
            if ((key === 'emergency_contacts' || key === 'travel_preference') && Array.isArray(val)) {
                return JSON.stringify(val);
            }
            return val;
        });
        values.unshift(user_id);

        const query = `
            UPDATE travellers
            SET ${setClause}
            WHERE user_id = $1
            RETURNING *;
        `;

        const result = await db.query(query, values);
        return result.rows[0];
    }

    async deleteById(userId: string): Promise<boolean> {
        const result = await db.query(
            `DELETE FROM travellers WHERE user_id = $1`,
            [userId]
        );
        return result.rowCount !== null && result.rowCount > 0;
    }

    async getListDiaries(user_id: string): Promise<Array<IDiary>> {
        const query = `
            SELECT
            FROM travellers AS t
            JOIN diaries AS d ON d.user_id = t.user_id
            WHERE t.user_id = $1
        `;
        const values = [user_id];
        const data = await db.query<IDiary>(query, values);
        return data.rows
    }

    async getListPosts(user_id: string): Promise<Array<IPost>> {
        const query = `
            SELECT p.*
            FROM travellers AS t
            JOIN posts AS p ON p.user_id = t.user_id
            WHERE t.user_id = $1
        `;
        const values = [user_id];
        const data = await db.query<IPost>(query, values);
        return data.rows;
    }
}

export const travellerModel = new TravellerModel();