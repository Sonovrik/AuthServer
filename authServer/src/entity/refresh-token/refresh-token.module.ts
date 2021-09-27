import {Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";
import {RefreshTokenEntity} from "./refresh-token.entity";
import { RefreshTokenService } from './refresh-token.service';

@Module({
    imports: [TypeOrmModule.forFeature([RefreshTokenEntity])],
    providers: [RefreshTokenService],
    exports: [RefreshTokenService]
})

export class RefreshTokenModule {
}