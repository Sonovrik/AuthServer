import { Injectable } from '@nestjs/common';
import {RefreshTokenEntity} from "./refresh-token.entity";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {UserEntity} from "../user/user.entity";

@Injectable()
export class RefreshTokenService {
    constructor(@InjectRepository(RefreshTokenEntity)
                private refreshDbRepository: Repository<RefreshTokenEntity>) {
    }

    async deleteToken(refreshToken: string){
        let entity  = await this.refreshDbRepository.findOne({token: refreshToken});
        await this.refreshDbRepository.delete(entity);
    }

    async insertNewToken(user: UserEntity, refreshToken: string){
        const tokenEntity = new RefreshTokenEntity();
        tokenEntity.token = refreshToken;
        tokenEntity.user = user;
        await this.refreshDbRepository.save(tokenEntity);
    }

    async getUserFromToken(refreshToken: string): Promise<UserEntity>{
        const tokenEntity = await this.refreshDbRepository.findOne({where: {token: refreshToken}, relations: ["user.refreshToken", "user"]});
        return tokenEntity.user;
    }




}
