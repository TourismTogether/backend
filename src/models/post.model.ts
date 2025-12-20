import { db } from "../configs/db";

export interface IPost {
  id?: string;
  user_id: string;
  title: string;
  content: string;
  tags: string;
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
    const data = await db.query<IPost>("SELECT * FROM posts WHERE id = $1", [
      id,
    ]);
    return data.rows[0];
  }

  async createOne(post: IPost): Promise<IPost | undefined> {
    const query = `
            INSERT INTO posts (
                user_id, title, content, tags,
                total_likes, total_views, created_at, updated_at
            ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
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
    ];

    const data = await db.query<IPost>(query, values);
    return data.rows[0];
  }

  async updateById(id: string, post: IPost): Promise<IPost | undefined> {
    const { id: postId, ...fieldsToUpdate } = post;

    const keys = Object.keys(fieldsToUpdate);
    if (keys.length === 0) return undefined;

    const setClause = keys.map((key, idx) => `${key} = $${idx + 2}`).join(", ");
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
}

export const postModel = new PostModel();
