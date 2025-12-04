import { db } from "../configs/db";

export interface IDestination {
    id?: string,
    region_id: string,
    name: string,
    country: string,
    description: string,
    latitude: number,
    longitude: number,
    category: string,
    best_season: string,
    rating: number,
    images: Array<string>,
    created_at: Date,
    updated_at: Date
}

class DestinationModel {
    async findAll(): Promise<Array<IDestination>> {
        const data = await db.query<IDestination>("SELECT * FROM destinations");
        return data.rows;
    }

    async findById(id: string): Promise<IDestination | undefined> {
        const data = await db.query<IDestination>("SELECT * FROM destinations WHERE id = $1", [id]);
        return data.rows[0];
    }

    async createOne(destination: IDestination): Promise<IDestination | undefined> {
        const query = `
            INSERT INTO destinations (
                region_id, name, country, description,
                latitude, longitude, category, best_season,
                rating, images, created_at, updated_at
            ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
            RETURNING *;
        `;

        const values = [
            destination.region_id,
            destination.name,
            destination.country,
            destination.description,
            destination.latitude,
            destination.longitude,
            destination.category,
            destination.best_season,
            destination.rating,
            destination.images,
            destination.created_at,
            destination.updated_at,
        ];

        const data = await db.query<IDestination>(query, values);
        return data.rows[0];
    }

    async updateById(id: string, destination: IDestination): Promise<IDestination | undefined> {

        const { id: destId, ...fieldsToUpdate } = destination;

        const keys = Object.keys(fieldsToUpdate);
        if (keys.length === 0) return undefined;

        const setClause = keys.map((key, idx) => `${key} = $${idx + 2}`).join(", ");
        const values = Object.values(fieldsToUpdate);
        values.unshift(id);

        const query = `
            UPDATE destinations
            SET ${setClause}
            WHERE id = $1
            RETURNING *;
        `;

        const data = await db.query<IDestination>(query, values);
        return data.rows[0];
    }

    async deleteById(id: string): Promise<boolean> {
        const result = await db.query("DELETE FROM destinations WHERE id = $1", [id]);
        return result.rowCount == null || result.rowCount > 0;
    }
}

export const destinationModel = new DestinationModel();