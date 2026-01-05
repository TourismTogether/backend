import { db } from "../configs/db";

export interface IRegion {
    id?: string,
    address: string,
    created_at: Date,
    updated_at: Date
}

class RegionModel {

    async findAll(): Promise<Array<IRegion>> {
        const data = await db.query<IRegion>("SELECT * FROM regions");
        return data.rows;
    }

    async findById(id: string): Promise<IRegion | undefined> {
        const data = await db.query<IRegion>("SELECT * FROM regions WHERE id = $1", [id]);
        return data.rows[0];
    }

    async createOne(region: IRegion): Promise<IRegion | undefined> {
        const query = `
            INSERT INTO regions (address, created_at, updated_at)
            VALUES ($1, $2, $3)
            RETURNING *;
        `;

        const values = [
            region.address,
            region.created_at,
            region.updated_at
        ];

        const data = await db.query<IRegion>(query, values);
        return data.rows[0];
    }

    async updateById(id: string, region: IRegion): Promise<IRegion | undefined> {

        const { id: regionId, ...fieldsToUpdate } = region;

        const keys = Object.keys(fieldsToUpdate);
        if (keys.length === 0) return undefined;

        const setClause = keys.map((key, idx) => `${key} = $${idx + 2}`).join(", ");
        const values = Object.values(fieldsToUpdate);
        values.unshift(id);

        const query = `
            UPDATE regions
            SET ${setClause}
            WHERE id = $1
            RETURNING *;
        `;

        const data = await db.query<IRegion>(query, values);
        return data.rows[0];
    }

    async countDestinationsByRegionId(id: string): Promise<number> {
        const result = await db.query<{ count: string }>(
            "SELECT COUNT(*) as count FROM destinations WHERE region_id = $1",
            [id]
        );
        return parseInt(result.rows[0]?.count || "0", 10);
    }

    async deleteById(id: string): Promise<boolean> {
        const result = await db.query("DELETE FROM regions WHERE id = $1", [id]);
        return result.rowCount == null || result.rowCount > 0;
    }
}

export const regionModel = new RegionModel();
