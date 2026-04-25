import { db } from "../configs/db";

export interface IAdmin {
  user_id: string;
  key: string;
}

class AdminModel {
  async findAll(): Promise<IAdmin[]> {
    const result = await db.query<IAdmin>("SELECT * FROM admins");
    return result.rows;
  }

  async findById(userId: string): Promise<IAdmin | undefined> {
    const result = await db.query<IAdmin>(
      "SELECT * FROM admins WHERE user_id = $1",
      [userId]
    );
    return result.rows[0];
  }

  async createOne(admin: IAdmin): Promise<IAdmin | undefined> {
    const result = await db.query<IAdmin>(
      `INSERT INTO admins (user_id, key)
       VALUES ($1, $2)
       RETURNING *`,
      [admin.user_id, admin.key]
    );
    return result.rows[0];
  }

  async updateById(
    userId: string,
    admin: Partial<IAdmin>
  ): Promise<IAdmin | undefined> {
    const keys = Object.keys(admin);
    if (keys.length === 0) return undefined;

    const setClause = keys.map((key, idx) => `${key} = $${idx + 2}`).join(", ");
    const values = Object.values(admin);
    values.unshift(userId);

    const result = await db.query<IAdmin>(
      `UPDATE admins
       SET ${setClause}
       WHERE user_id = $1
       RETURNING *`,
      values
    );

    return result.rows[0];
  }

  async deleteById(userId: string): Promise<boolean> {
    const result = await db.query("DELETE FROM admins WHERE user_id = $1", [
      userId,
    ]);
    return result.rowCount !== null && result.rowCount > 0;
  }
}

export const adminModel = new AdminModel();
