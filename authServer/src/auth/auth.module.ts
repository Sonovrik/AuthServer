import {Module} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import {JwtModule} from "@nestjs/jwt";
import {JwtStrategy} from "./jwt.strategy";
import {UserModule} from "../entity/user/user.module";
import {Auth2fService} from "./auth2f.service";
import {HttpModule} from "@nestjs/axios"
import {CacheManagerModule} from "../cache-manager/cache-manager.module";

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_ACCESS_TOKEN_SECRET,
      signOptions: { expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRATION_TIME }
    }),
      UserModule,
      HttpModule,
      CacheManagerModule
  ],
  providers: [AuthService, JwtStrategy, Auth2fService],
  controllers: [AuthController]
})
export class AuthModule {}
