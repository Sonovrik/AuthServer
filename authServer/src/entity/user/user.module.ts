import {Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";
import {UserEntity} from "./user.entity";
import { UserService } from './user.service';
import {RefreshTokenModule} from "../refresh-token/refresh-token.module";

@Module({
    imports: [TypeOrmModule.forFeature([UserEntity]), RefreshTokenModule],
    providers: [UserService],
    exports: [UserService]

})

export class UserModule {
}