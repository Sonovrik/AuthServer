import {CACHE_MANAGER, Inject, Injectable} from '@nestjs/common';
import {Cache} from "cache-manager";

@Injectable()
export class CacheManagerService {
    constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

    /**
     * @Description: Set the value in the redis cache
     */
    public async set(key: string, value: any, seconds?: number): Promise<any> {
        value = JSON.stringify(value);
        if (!seconds) {
            await this.cacheManager.set(key, value, {ttl: 0});
        } else {
            await this.cacheManager.set(key, value, {ttl: seconds});
        }
    }


    /**
     * @Description: Set to get the value in the redis cache
     * @param key {String}
     */
    public async get(key: string): Promise<any> {
        let data = await this.cacheManager.get(key);
        if (data) {
            return JSON.parse(<string>data);
        } else {
            return null;
        }
    }

    /**
     * @Description: Delete redis cache data according to key
     * @param key {String}
     * @return:
     */
    public async del(key: string): Promise<any> {
        await this.cacheManager.del(key);
    }

    /**
     * @Description: Clear the redis cache
     * @return:
     */
    public async reset(): Promise<any> {
        await this.cacheManager.reset();
    }

}
