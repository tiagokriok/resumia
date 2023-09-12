import { createClient } from 'redis'

const { redisUrl } = useRuntimeConfig()

export const redis = createClient({
  url: redisUrl,
})

redis.on('error', (err) => console.error(err))

redis.on('ready', () => console.log('Redis is ready!'))

redis.on('close', () => console.log('Redis is closed!'))

redis.on('reconnecting', () => console.log('Redis is reconnecting!'))

redis.on('end', () => console.log('Redis is end!'))

redis.on('connect', () => console.log('Redis is connected!'))
