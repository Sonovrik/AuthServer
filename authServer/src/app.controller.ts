import {Controller, Get, Query} from '@nestjs/common';
import {AppService} from './app.service';
import {CacheManagerService} from "./cache-manager/cache-manager.service";

@Controller()
export class AppController {
    constructor(private readonly appService: AppService,
                private readonly redis: CacheManagerService) {
    }

    @Get()
    getHello(): string {
        return this.appService.getHello();
    }

    @Get("/testAdd")
    async testAdd(@Query('key') key: string) {
        await this.redis.set(key, 'test');
    }

    @Get("/testAddTime")
    async testAddWithTime(@Query('key') key: string) {
        await this.redis.set(key, 'time', 1000);
    }

    @Get("/testGet")
    async testGet(@Query('key') key: string) {
        const data = await this.redis.get(key);
        console.log(data);
    }

}
