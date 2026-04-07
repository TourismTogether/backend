import { Request, Response, NextFunction } from "express";
import { connectRedis } from "../configs/redis";

export const cacheMiddleware = (ttl: number = 300) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        if (req.method !== 'GET') {
            return next();
        }

        const client = await connectRedis();
        const key = `cache:${req.originalUrl}`;

        try {
            const cachedData = await client.get(key);
            if (cachedData) {
                console.log('Cache hit for:', key);
                return res.json(JSON.parse(cachedData));
            }
        } catch (error) {
            console.error('Error checking cache:', error);
        }

        // Override res.json to cache the response
        const originalJson = res.json;
        res.json = function (data: any) {
            try {
                client.setEx(key, ttl, JSON.stringify(data));
                console.log('Cache set for:', key);
            } catch (error) {
                console.error('Error setting cache:', error);
            }
            return originalJson.call(this, data);
        };

        next();
    };
};