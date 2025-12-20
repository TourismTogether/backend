import { db } from "../configs/db";

export interface IDiary {
    id?: string;

    trip_id: string | null;
    user_id: string | null;

    title: string;
    description: string;

    is_public: boolean;
    allow_comment?: boolean;

    video_url: string | null;
    img_url: string[] | null;

    tags?: string | null;
    template?: string | null;

    feeling_des?: string | null;
    weather_des?: string | null;

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
                trip_id,
                user_id,
                title,
                description,
                is_public,
                video_url,
                img_url,
                allow_comment,
                tags,
                template,
                feeling_des,
                weather_des,
                created_at,
                updated_at
            )
            VALUES (
                $1, $2, $3, $4, $5, $6, $7::jsonb,
                $8, $9, $10, $11, $12,
                $13, $14
            )
            RETURNING *
            `;
        const values = [
            diary.trip_id,
            diary.user_id,
            diary.title,
            diary.description,
            diary.is_public,
            diary.video_url,
            JSON.stringify(diary.img_url),
            diary.allow_comment,
            diary.tags,
            diary.template,
            diary.feeling_des,
            diary.weather_des,
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

        const values: any[] = [id]; // $1 will be the id in WHERE clause

        const setParts = keys.map((key, idx) => {
            const placeholder = `$${idx + 2}`;
            if (key === "img_url") {
                const val = (fieldsToUpdate as any)[key];
                values.push(JSON.stringify(val));
                return `${key} = ${placeholder}::jsonb`;
            }
            values.push((fieldsToUpdate as any)[key]);
            return `${key} = ${placeholder}`;
        });

        const setClause = setParts.join(", ");
        const sql = `UPDATE diaries SET ${setClause} WHERE id = $1 RETURNING *`;

        const result = await db.query(sql, values);
        return result.rows[0];
    }

    async deleteById(id: string): Promise<boolean> {
        const sql = `DELETE FROM diaries WHERE id = $1`;
        const result = await db.query(sql, [id]);
        return result.rowCount == null || result.rowCount > 0;;
    }
}

export const diaryModel = new DiaryModel();
