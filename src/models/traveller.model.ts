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
        return result.rows;
    }

    async findById(userId: string): Promise<ITraveller | undefined> {
        const result = await db.query(
            `SELECT * FROM travellers WHERE user_id = $1`,
            [userId]
        );
        return result.rows[0];
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

        // Handle JSONB fields - convert arrays to JSON strings
        const processedTraveller: any = { ...traveller };
        if (processedTraveller.emergency_contacts && Array.isArray(processedTraveller.emergency_contacts)) {
            processedTraveller.emergency_contacts = JSON.stringify(processedTraveller.emergency_contacts);
        }
        if (processedTraveller.travel_preference && Array.isArray(processedTraveller.travel_preference)) {
            processedTraveller.travel_preference = JSON.stringify(processedTraveller.travel_preference);
        }

        const setClause = keys
            .map((key, idx) => {
                // Cast JSONB fields properly
                if (key === 'emergency_contacts' || key === 'travel_preference') {
                    return `${key} = $${idx + 2}::jsonb`;
                }
                return `${key} = $${idx + 2}`;
            })
            .join(", ");

        const values = Object.values(processedTraveller);
        values.unshift(user_id);

        const query = `
            UPDATE travellers
            SET ${setClause}
            WHERE user_id = $1
            RETURNING *;
        `;

        const result = await db.query(query, values);
        
        // Parse JSONB fields in response
        if (result.rows[0]) {
            const row = result.rows[0];
            return {
                ...row,
                emergency_contacts: typeof row.emergency_contacts === 'string' 
                    ? JSON.parse(row.emergency_contacts) 
                    : row.emergency_contacts || [],
                travel_preference: typeof row.travel_preference === 'string'
                    ? JSON.parse(row.travel_preference)
                    : row.travel_preference || [],
            };
        }
        return undefined;
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

    async findSOSBySupporterId(supporterId: string): Promise<Array<ITraveller & { user_full_name?: string; user_phone?: string; user_avatar_url?: string }>> {
        const query = `
            SELECT 
                t.*,
                u.full_name as user_full_name,
                u.phone as user_phone,
                u.avatar_url as user_avatar_url
            FROM travellers t
            LEFT JOIN users u ON u.id = t.user_id
            WHERE t.is_safe = false 
            AND t.is_shared_location = true
            AND (
                t.emergency_contacts IS NULL 
                OR t.emergency_contacts::text = '[]'
                OR t.emergency_contacts::jsonb @> $1::jsonb
            )
        `;
        const supporterIdJsonb = JSON.stringify([supporterId]);
        const result = await db.query(query, [supporterIdJsonb]);
        
        // Parse JSONB fields
        return result.rows.map((row: any) => ({
            ...row,
            emergency_contacts: typeof row.emergency_contacts === 'string' 
                ? JSON.parse(row.emergency_contacts) 
                : row.emergency_contacts || [],
            travel_preference: typeof row.travel_preference === 'string'
                ? JSON.parse(row.travel_preference)
                : row.travel_preference || [],
        }));
    }

    async findAllSOS(): Promise<Array<ITraveller & { user_full_name?: string; user_phone?: string; user_avatar_url?: string }>> {
        const query = `
            SELECT 
                t.*,
                u.full_name as user_full_name,
                u.phone as user_phone,
                u.avatar_url as user_avatar_url
            FROM travellers t
            LEFT JOIN users u ON u.id = t.user_id
            WHERE t.is_shared_location = true
            ORDER BY 
                CASE WHEN t.is_safe = false THEN 0 ELSE 1 END,
                t.user_id DESC
        `;
        const result = await db.query(query);
        
        // Parse JSONB fields
        return result.rows.map((row: any) => ({
            ...row,
            emergency_contacts: typeof row.emergency_contacts === 'string' 
                ? JSON.parse(row.emergency_contacts) 
                : row.emergency_contacts || [],
            travel_preference: typeof row.travel_preference === 'string'
                ? JSON.parse(row.travel_preference)
                : row.travel_preference || [],
        }));
    }
}

export const travellerModel = new TravellerModel();