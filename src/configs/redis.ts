import { createClient, RedisClientType } from "redis";

let client: RedisClientType | undefined;

export async function connectRedis(): Promise<RedisClientType> {
    if (client) return client;

    client = createClient({
        url: 'redis://localhost:6379'
    });

    client.on('error', (err) => {
        console.error('Error connect Redis:', err);
    });

    try {
        await client.connect();
        console.log('Redis connected');
    } catch (error) {
        console.error('Can not connect to Redis:', error);
    }

    return client;
}