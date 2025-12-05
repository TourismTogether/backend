import { db } from "../configs/db";

export interface IAdmin {
    user_id: string,
    key: string,
}

class AdminModel {
    async findAll(): Promise<Array<IAdmin>> {
        const sql = `SELECT * FROM admins`;
        const { rows } = await db.query(sql);
        return rows;
    }

    async findById(userId: string): Promise<IAdmin | undefined> {
        const sql = `SELECT * FROM admins WHERE user_id = $1`;
        const { rows } = await db.query(sql, [userId]);
        return rows[0];
    }

    async createOne(admin: IAdmin): Promise<IAdmin> {
        const sql = `
            INSERT INTO admins(user_id, key)
            VALUES ($1, $2)
            RETURNING *
        `;
        const { rows } = await db.query(sql, [
            admin.user_id,
            admin.key
        ]);
        return rows[0];
    }

    async updateById(userId: string, data: Partial<IAdmin>): Promise<IAdmin> {
        const sql = `
            UPDATE admins
            SET key = COALESCE($2, key)
            WHERE user_id = $1
            RETURNING *
        `;
        const { rows } = await db.query(sql, [
            userId,
            data.key ?? null
        ]);
        return rows[0];
    }

    async delete(userId: string): Promise<boolean> {
        const result = await db.query(`
            DELETE FROM admins WHERE user_id = $1
            `, [userId]);
        return result.rowCount == null || result.rowCount > 0;
    }
}

export const adminModel = new AdminModel();