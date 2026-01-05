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
        // Parse JSONB fields in response
        return data.rows.map((row: any) => ({
            ...row,
            images: typeof row.images === 'string' 
                ? JSON.parse(row.images) 
                : row.images || [],
        })) as IDestination[];
    }

    async findById(id: string): Promise<IDestination | undefined> {
        const data = await db.query<IDestination>("SELECT * FROM destinations WHERE id = $1", [id]);
        if (data.rows[0]) {
            const row = data.rows[0] as any;
            return {
                ...row,
                images: typeof row.images === 'string' 
                    ? JSON.parse(row.images) 
                    : row.images || [],
            } as IDestination;
        }
        return undefined;
    }

    async createOne(destination: IDestination): Promise<IDestination | undefined> {
        const query = `
            INSERT INTO destinations (
                region_id, name, country, description,
                latitude, longitude, category, best_season,
                rating, images, created_at, updated_at
            ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10::jsonb,$11,$12)
            RETURNING *;
        `;

        const values = [
            destination.region_id,
            destination.name,
            destination.country,
            destination.description || "",
            destination.latitude,
            destination.longitude,
            destination.category || "",
            destination.best_season || "",
            destination.rating || 0,
            JSON.stringify(destination.images || []),
            destination.created_at,
            destination.updated_at,
        ];

        const data = await db.query<IDestination>(query, values);
        
        // Parse JSONB fields in response
        if (data.rows[0]) {
            const row = data.rows[0] as any;
            return {
                ...row,
                images: typeof row.images === 'string' 
                    ? JSON.parse(row.images) 
                    : row.images || [],
            } as IDestination;
        }
        return undefined;
    }

    async updateById(id: string, destination: IDestination): Promise<IDestination | undefined> {

        const { id: destId, ...fieldsToUpdate } = destination;

        const keys = Object.keys(fieldsToUpdate);
        if (keys.length === 0) return undefined;

        // Handle JSONB fields - convert arrays to JSON strings
        const processedDestination: any = { ...fieldsToUpdate };
        if (processedDestination.images && Array.isArray(processedDestination.images)) {
            processedDestination.images = JSON.stringify(processedDestination.images);
        }

        const setClause = keys
            .map((key, idx) => {
                // Cast JSONB fields properly
                if (key === 'images') {
                    return `${key} = $${idx + 2}::jsonb`;
                }
                return `${key} = $${idx + 2}`;
            })
            .join(", ");

        const values = Object.values(processedDestination);
        values.unshift(id);

        const query = `
            UPDATE destinations
            SET ${setClause}
            WHERE id = $1
            RETURNING *;
        `;

        const data = await db.query<IDestination>(query, values);
        
        // Parse JSONB fields in response
        if (data.rows[0]) {
            const row = data.rows[0] as any;
            return {
                ...row,
                images: typeof row.images === 'string' 
                    ? JSON.parse(row.images) 
                    : row.images || [],
            } as IDestination;
        }
        return undefined;
    }

    async deleteById(id: string): Promise<boolean> {
        const result = await db.query("DELETE FROM destinations WHERE id = $1", [id]);
        return result.rowCount == null || result.rowCount > 0;
    }
}

export const destinationModel = new DestinationModel();