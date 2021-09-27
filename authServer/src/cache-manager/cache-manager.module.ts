import * as redisStore from 'cache-manager-redis-store';
import {CacheModule, Module} from '@nestjs/common';
import {CacheManagerService} from "./cache-manager.service";

@Module({
    imports: [CacheModule.register(
        {
            store: redisStore,
            host: 'redis',
            port: 6379,
        }
    )],
    providers: [CacheManagerService],
    exports: [CacheManagerService]
})
export class CacheManagerModule {
}

