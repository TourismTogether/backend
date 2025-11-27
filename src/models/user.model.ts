import { db } from "../configs/db";

export interface IUser {
    id: string,
    username: string,
    full_name: string,
    email: string,
    avatar_url: string,
    password: string,
    phone: string,
    bio: string,
    is_shared_location: boolean,
    latitude: number,
    longitude: number,
    emergency_contacts: string,
    travel_preference: string,
    created_at: Date,
    updated_at: Date
}

class UserModel {
    async findAll(): Promise<Array<IUser>> {
        const data = await db.query<IUser>("SELECT * FROM users");
        return data.rows;
    }

    async findById(id: string): Promise<IUser | undefined> {
        const data = await db.query<IUser>("SELECT * FROM users WHERE id = $1", [id]);
        return data.rows[0];
    }

    async findByEmail(email: string): Promise<IUser | undefined> {
        const data = await db.query<IUser>("SELECT * FROM users WHERE email = $1", [email]);
        return data.rows[0];
    }

    async findByPhone(phone: string): Promise<IUser | undefined> {
        const data = await db.query<IUser>("SELECT * FROM users WHERE phone = $1", [phone]);
        return data.rows[0];
    }

    async createOne(user: IUser): Promise<IUser | undefined> {
        const data = await db.query<IUser>(
            `INSERT INTO
                users (username, full_name, email, avatar_url, password, phone, bio, is_shared_location,
                latitude, longitude, emergency_contacts, travel_preference, created_at, updated_at)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) RETURNING *`,
            [user.username, user.full_name, user.email, user.avatar_url, user.password, user.phone, user.bio, user.is_shared_location,
            user.latitude, user.longitude, user.emergency_contacts, user.travel_preference, user.created_at, user.updated_at]
        );
        return data.rows[0];
    }
}

export const userModel = new UserModel();