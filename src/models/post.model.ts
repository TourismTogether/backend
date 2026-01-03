import { db } from "../configs/db";

export interface IPost {
    id?: string;
    user_id: string;
    title: string;
    content: string;
    tags: string;
    image?: string;
    total_likes: number;
    total_views: number;
    created_at: Date;
    updated_at: Date;
}

class PostModel {
    async findAll(): Promise<Array<IPost>> {
        const data = await db.query<IPost>("SELECT * FROM posts");
        return data.rows;
    }

    async findById(id: string): Promise<IPost | undefined> {
        const data = await db.query<IPost>(
            "SELECT * FROM posts WHERE id = $1",
            [id]
        );
        return data.rows[0];
    }

    async createOne(post: IPost): Promise<IPost | undefined> {
        const query = `
            INSERT INTO posts (
                user_id, title, content, tags,
                total_likes, total_views, created_at, updated_at, image
            ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
            RETURNING *;
        `;

        const values = [
            post.user_id,
            post.title,
            post.content,
            post.tags,
            post.total_likes,
            post.total_views,
            post.created_at,
            post.updated_at,
            post.image,
        ];

        const data = await db.query<IPost>(query, values);
        return data.rows[0];
    }

    async updateById(id: string, post: IPost): Promise<IPost | undefined> {
        const { id: postId, ...fieldsToUpdate } = post;

        const keys = Object.keys(fieldsToUpdate);
        if (keys.length === 0) return undefined;

        const setClause = keys
            .map((key, idx) => `${key} = $${idx + 2}`)
            .join(", ");
        const values = Object.values(fieldsToUpdate);
        values.unshift(id);

        const query = `
            UPDATE posts
            SET ${setClause}
            WHERE id = $1
            RETURNING *;
        `;

        const data = await db.query<IPost>(query, values);
        return data.rows[0];
    }

    async deleteById(id: string): Promise<boolean> {
        const result = await db.query("DELETE FROM posts WHERE id = $1", [id]);
        return result.rowCount == null || result.rowCount > 0;
    }
    
    async toggleLike(
        postId: string,
        userId: string
    ): Promise<{ liked: boolean }> {
        const checkQuery = `SELECT * FROM post_likes WHERE post_id = $1 AND user_id = $2`;
        const checkResult = await db.query(checkQuery, [postId, userId]);

        if (checkResult.rows.length > 0) {
            await db.query(
                `DELETE FROM post_likes WHERE post_id = $1 AND user_id = $2`,
                [postId, userId]
            );
            await db.query(
                `UPDATE posts SET total_likes = total_likes - 1 WHERE id = $1`,
                [postId]
            );
            return { liked: false };
        } else {
            await db.query(
                `INSERT INTO post_likes (post_id, user_id) VALUES ($1, $2)`,
                [postId, userId]
            );
            await db.query(
                `UPDATE posts SET total_likes = total_likes + 1 WHERE id = $1`,
                [postId]
            );
            return { liked: true };
        }
    }
}

export const postModel = new PostModel();
