import { db } from "../configs/db";

export interface IAccount {
    id?: string,
    username: string,
    password?: string,
    email: string
}

class AccountModel {
    async findAll(): Promise<Array<IAccount>> {
        const query = `
            SELECT * FROM accounts
        `
        const data = await db.query<IAccount>(query);
        return data.rows;
    }

    async findPaginated(limit: number, offset: number): Promise<Array<IAccount>> {
        const query = `
            SELECT * FROM accounts
            ORDER BY id DESC
            LIMIT $1 OFFSET $2
        `;
        const data = await db.query<IAccount>(query, [limit, offset]);
        return data.rows;
    }

    async countAll(): Promise<number> {
        const query = `SELECT COUNT(*)::text AS count FROM accounts`;
        const data = await db.query<{ count: string }>(query);
        return Number(data.rows[0]?.count || 0);
    }

    async findById(id: string): Promise<IAccount | undefined> {
        const query = `
            SELECT * FROM accounts WHERE id = $1
        `
        const values = [id];
        const data = await db.query<IAccount>(query, values);
        return data.rows[0];
    }

    async findByEmail(email: string): Promise<IAccount | undefined> {
        const query = `
            SELECT * FROM accounts WHERE LOWER(TRIM(email)) = LOWER(TRIM($1))
        `
        const values = [email];
        const data = await db.query<IAccount>(query, values);
        return data.rows[0];
    }

    async findByUsername(username: string): Promise<IAccount | undefined> {
        const query = `
            SELECT * FROM accounts WHERE TRIM(username) = TRIM($1)
        `
        const values = [username];
        const data = await db.query<IAccount>(query, values);
        return data.rows[0];
    }

    async createOne(account: IAccount): Promise<IAccount | undefined> {
        const query = `
            INSERT INTO accounts (username, password, email)
            VALUES ($1, $2, $3)
            RETURNING *
        `
        const values = [account.username, account.password, account.email];
        const data = await db.query<IAccount>(query, values);
        return data.rows[0];
    }

    async updatedById(id: string, account: Partial<IAccount>) {
        const { id: _id, ...fieldsToUpdate } = account;
        const keys = Object.keys(fieldsToUpdate);
        if (keys.length === 0) return undefined;
        const setClause = keys.map((key, idx) => `${key} = $${idx + 2}`).join(", ");
        const values = Object.values(fieldsToUpdate);
        values.unshift(id);

        const query = `
            UPDATE accounts
            SET ${setClause}
            WHERE id = $1
            RETURNING *;
        `;

        const data = await db.query<IAccount>(query, values);
        return data.rows[0];
    }

    async deleteById(id: string) {
        const result = await db.query(`
            DELETE FROM accounts WHERE id = $1
            `, [id]);
        return result.rowCount == null || result.rowCount > 0;
    }
}

export const accountModel = new AccountModel();