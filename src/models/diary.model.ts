import { db } from "../configs/db";

export interface IDiary {
    id?: string,
    trip_id: string,
    user_id: string,
    title: string,
    content: string,
    is_public: boolean,
    video_url: string,
    img_url: string,
    created_at: Date,
    updated_at: Date
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
                trip_id, user_id, title, content, is_public, video_url, img_url, created_at, updated_at
            )
            VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
            RETURNING *
        `;
        const values = [
            diary.trip_id,
            diary.user_id,
            diary.title,
            diary.content,
            diary.is_public,
            diary.video_url,
            diary.img_url,
            diary.created_at,
            diary.updated_at
        ];
        const result = await db.query(sql, values);
        return result.rows[0];
    }

    async updateById(id: string, diary: Partial<IDiary>): Promise<IDiary | undefined> {
        const { id: diaryId, ...fieldsToUpdate } = diary;
        const keys = Object.keys(fieldsToUpdate);
        if (keys.length === 0) return undefined;

        const setClause = keys.map((key, idx) => `${key} = $${idx + 2}`).join(", ");
        const values = Object.values(fieldsToUpdate);
        values.unshift(id);

        const result = await db.query(setClause, values);
        return result.rows[0];
    }

    async deleteById(id: string): Promise<boolean> {
        const sql = `DELETE FROM diaries WHERE id = $1`;
        const result = await db.query(sql, [id]);
        return result.rowCount == null || result.rowCount > 0;;
    }
}

export const diaryModel = new DiaryModel();
