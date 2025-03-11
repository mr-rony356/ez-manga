import { BentoCache, bentostore } from 'bentocache'
import { redisDriver, redisBusDriver } from 'bentocache/drivers/redis'

export const cache = new BentoCache({
    default: 'cache',
    prefix: 'ezmanga',
    stores: {
        cache: bentostore()
            .useL2Layer(redisDriver({ connection: { host: '127.0.0.1', port: 6379 } }))
            .useBus(redisBusDriver({ connection: { host: '127.0.0.1', port: 6379 } })),
    },
    ttl: '1h',
    gracePeriod: {
        enabled: false,
    },
})


export default class CacheHandler {
    constructor(options) {
        this.options = options
    }

    async get(key) {
        const namespaces = await cache.namespace('nextjs').get(key)
        if (namespaces && namespaces.length > 0) {
            const data = await cache.namespace('nextjs').namespace(namespaces[0]).get(key)
            return data
        }
        return null
    }

    async set(key, data, ctx) {
        const next_namespace = cache.namespace('nextjs')
        if (ctx.tags && ctx.tags.length > 0) {
            for (let tag of ctx.tags) {
                await next_namespace.namespace(tag).set(key, {
                    value: data,
                    tags: ctx.tags,
                    lastModified: Date.now(),
                })
            }
        }
        await cache.namespace('nextjs').set(key, ctx.tags, {
            ttl: '1d',
            gracePeriod: {
                enabled: false,
            }
        })
    }

    async revalidateTag(tag) {
        const namespace = cache.namespace('nextjs').namespace(tag)
        await namespace.clear()
    }
}