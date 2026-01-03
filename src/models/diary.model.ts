import { db } from "../configs/db";

export interface IDiary {
    id?: string;

    user_id: string;
    trip_id?: string | null;

    title: string;
    description?: string | null;

    // JSONB
    content_sections?: any[] | null;
    metadata?: any[] | null;

    // Images
    main_image_url?: string | null;
    image_urls?: string[] | null;

    // Flags
    is_public?: boolean;
    is_draft?: boolean;

    created_at?: Date;
    updated_at?: Date;
}

class DiaryModel {
    async findAll(): Promise<Array<IDiary>> {
        const sql = `SELECT * FROM diaries`;
        const result = await db.query(sql);
        return result.rows;
    }

    async findById(id: string): Promise<IDiary | undefined> {
        const sql = `SELECT * FROM diaries WHERE id = $1`;
        const result = await db.query(sql, [id]);
        return result.rows[0];
    }

    async findByTrip(trip_id: string): Promise<Array<IDiary>> {
        const sql = `SELECT * FROM diaries WHERE trip_id = $1`;
        const result = await db.query(sql, [trip_id]);
        return result.rows;
    }

    async createOne(diary: IDiary): Promise<IDiary | undefined> {
        const sql = `
            INSERT INTO diaries (
            user_id,
            trip_id,
            title,
            description,
            content_sections,
            metadata,
            main_image_url,
            image_urls,
            is_public,
            is_draft,
            created_at,
            updated_at
        )
        VALUES (
            $1, $2, $3, $4,
            $5::jsonb,
            $6::jsonb,
            $7,
            $8::jsonb,
            $9, $10, $11, $12
        )
        RETURNING *;
            `;
        const values = [
            diary.user_id,
            diary.trip_id ?? null,
            diary.title,
            diary.description ?? null,
            JSON.stringify(diary.content_sections ?? []),
            JSON.stringify(diary.metadata ?? []),
            diary.main_image_url ?? null,
            JSON.stringify(diary.image_urls ?? []),
            diary.is_public ?? false,
            diary.is_draft ?? false,
            diary.created_at,
            diary.updated_at,
        ];
        const result = await db.query(sql, values);
        return result.rows[0];
    }

    async updateById(id: string, diary: Partial<IDiary>): Promise<IDiary | undefined> {
        const { id: diaryId, ...fieldsToUpdate } = diary;
        const keys = Object.keys(fieldsToUpdate);
        if (keys.length === 0) return undefined;

        const jsonbFields = ["content_sections", "metadata", "image_urls"];
        const values: any[] = [id]; // $1 will be the id in WHERE clause

        const setParts = keys.map((key, idx) => {
            const placeholder = `$${idx + 2}`;
            if (jsonbFields.includes(key)) {
                const val = (fieldsToUpdate as any)[key];
                values.push(JSON.stringify(val));
                return `${key} = ${placeholder}::jsonb`;
            }
            values.push((fieldsToUpdate as any)[key]);
            return `${key} = ${placeholder}`;
        });

        setParts.push(`updated_at = NOW()`);
        const setClause = setParts.join(", ");
        const sql = `UPDATE diaries SET ${setClause} WHERE id = $1 RETURNING *`;

        const result = await db.query(sql, values);
        return result.rows[0];
    }

    async deleteById(id: string): Promise<boolean> {
        const sql = `DELETE FROM diaries WHERE id = $1`;
        const result = await db.query(sql, [id]);
        return result.rowCount == null || result.rowCount > 0;
    }

    async deleteByTripId(trip_id: string): Promise<boolean> {
        const sql = `DELETE FROM diaries WHERE trip_id = $1`;
        const result = await db.query(sql, [trip_id]);
        return result.rowCount == null || result.rowCount > 0;
    }
}

export const diaryModel = new DiaryModel();
