import { db } from "../configs/db";

export interface ISupporter {
    user_id: string,
    is_available: boolean
}


class SupporterModel {
    async findAll(): Promise<Array<ISupporter>> {
        const result = await db.query(`SELECT * FROM supporters`);
        return result.rows;
    }

    async findById(userId: string): Promise<ISupporter | undefined> {
        const result = await db.query(
            `SELECT * FROM supporters WHERE user_id = $1`,
            [userId]
        );
        return result.rows[0];
    }

    async createOne(s: ISupporter): Promise<ISupporter | undefined> {
        const query = `
            INSERT INTO supporters (user_id, is_available)
            VALUES ($1, $2)
            RETURNING *;
        `;

        const values = [s.user_id, s.is_available];
        const result = await db.query(query, values);
        return result.rows[0];
    }

    async updateById(user_id: string, supporter: Partial<ISupporter>): Promise<ISupporter | undefined> {
        const keys = Object.keys(supporter);
        if (keys.length === 0) return undefined;

        const setClause = keys
            .map((key, idx) => `${key} = $${idx + 2}`)
            .join(", ");

        const values = Object.values(supporter);
        values.unshift(user_id);

        const query = `
            UPDATE supporters
            SET ${setClause}
            WHERE user_id = $1
            RETURNING *;
        `;

        const result = await db.query(query, values);
        return result.rows[0];
    }

    async delete(userId: string): Promise<boolean> {
        const result = await db.query(
            `DELETE FROM supporters WHERE user_id = $1`,
            [userId]
        );
        return result.rowCount !== null && result.rowCount > 0;
    }
}

export const supporterModel = new SupporterModel();