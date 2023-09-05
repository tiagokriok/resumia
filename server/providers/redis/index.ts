import { createClient } from 'redis'

export const redis = createClient({
  url: process.env.REDIS_URL,
})

redis.on('error', (err) => console.error(err))

redis.on('ready', () => console.log('Redis is ready!'))

redis.on('close', () => console.log('Redis is closed!'))

redis.on('reconnecting', () => console.log('Redis is reconnecting!'))

redis.on('end', () => console.log('Redis is end!'))

redis.on('connect', () => console.log('Redis is connected!'))
