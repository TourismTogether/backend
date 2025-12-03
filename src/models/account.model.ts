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
            SELECT * FROM accounts WHERE email = $1
        `
        const values = [email];
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