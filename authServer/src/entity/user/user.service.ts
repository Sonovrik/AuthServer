import { Injectable } from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {UserEntity} from "./user.entity";
import {RefreshTokenService} from "../refresh-token/refresh-token.service";

@Injectable()
export class UserService {
    constructor(@InjectRepository(UserEntity)
                private usersDbRepository: Repository<UserEntity>,
                private refreshTokenService: RefreshTokenService) {
    }

    async createNewUser(email: string): Promise<UserEntity>{
        const userEntity = new UserEntity();
        userEntity.email = email;
        await this.usersDbRepository.save(userEntity);
        return userEntity;
    }

    async insertNewTokenToUser(userEntity: UserEntity, refreshToken: string){
        await this.refreshTokenService.insertNewToken(userEntity, refreshToken);
    }

    async deleteTokenFromUser(refreshToken: string){
        await this.refreshTokenService.deleteToken(refreshToken);
    }

    async replaceTokenFromUser(userEntity: UserEntity, oldToken: string, newToken: string){
        await this.deleteTokenFromUser(oldToken);
        await this.insertNewTokenToUser(userEntity, newToken);
    }

    async getUserByEmail(email: string){
        const user = await this.usersDbRepository.findOne({email: email});
        return user || null;
    }

    async getUserByRefreshToken(refreshToken: string): Promise<UserEntity>{
        const user = await this.refreshTokenService.getUserFromToken(refreshToken);
        return user || null;
    }







}
