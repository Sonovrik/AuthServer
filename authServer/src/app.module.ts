import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import {UserModule} from "./entity/user/user.module";
import {DbConnectionModule} from "./postgres-db/db-connection.module";
import {CacheManagerModule} from "./cache-manager/cache-manager.module";

@Module({
  imports: [DbConnectionModule, UserModule, AuthModule, CacheManagerModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
