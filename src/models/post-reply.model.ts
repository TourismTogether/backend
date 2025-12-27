import { db } from "../configs/db";

export interface IPostReply {
    id: string,
    user_id: string,
    post_id: string,
    content: string,
    created_at: Date,
    updated_at: Date
}

class PostReplyModel {
    async findByPostId(post_id: string): Promise<IPostReply[]> {
        const sql = `
            SELECT *
            FROM post_replies
            WHERE post_id = $1
            ORDER BY created_at DESC
        `;
        const result = await db.query(sql, [post_id]);
        return result.rows;
    }

    async findById(id: string): Promise<IPostReply | null> {
        const sql = `
            SELECT *
            FROM post_replies
            WHERE id = $1
        `;
        const result = await db.query(sql, [id]);
        return result.rows[0] || null;
    }

    async create(reply: IPostReply) {
        const sql = `
            INSERT INTO post_replies (user_id, post_id, content, created_at, updated_at)
            VALUES ($1, $2, $3, NOW(), NOW())
            RETURNING *
        `;
        const result = await db.query(sql, [
            reply.user_id,
            reply.post_id,
            reply.content
        ]);
        return result.rows[0];
    }

    async update(id: string, payload: Partial<IPostReply>) {
        const sql = `
            UPDATE post_replies
            SET content = $1, updated_at = NOW()
            WHERE id = $2
            RETURNING *
        `;
        const result = await db.query(sql, [payload.content, id]);
        return result.rows[0];
    }

    async delete(id: string) {
        const sql = `
            DELETE FROM post_replies
            WHERE id = $1
        `;
        await db.query(sql, [id]);
        return true;
    }
}

export const postReplyModel = new PostReplyModel();