import {Module} from '@nestjs/common';
import {TypeOrmModule} from "@nestjs/typeorm";
import {DbConfigService} from "./db-config.service";

@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            useClass: DbConfigService
        })]
})
export class DbConnectionModule {
}