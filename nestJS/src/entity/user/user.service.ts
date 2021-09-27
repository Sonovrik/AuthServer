import {Injectable, UploadedFile} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {getConnection, Repository} from "typeorm";
import {UserEntity} from "./user.entity";
import {createWriteStream} from "fs";
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
    constructor(@InjectRepository(UserEntity)
                private usersDbRepository: Repository<UserEntity>,) {
    }

    /**
     * Метод для обновления аватарки пользователя
     */
    async uploadUserAvatar(@UploadedFile() file, id: any): Promise<void> {
        const path = "/var/lib/usersAvatars/" + id + "_avatar.jpg"; //Путь до аватарки в docker_container
        this.usersDbRepository.update(id, {pathToAvatar: path}).then(); //Обновление пути в базе данных, если пользователя с таким id не будет, то просто ничего не произойдет
        let userExists = await this.usersDbRepository.findOne(id); //Поиск по id в DB
        if (typeof userExists !== "undefined") {
            let fileStream = createWriteStream(path);
            fileStream.write(file.buffer);
            fileStream.end();
        }
    }

    /**
     * Поиск пользователя по login
     */
    findOne(login: string): Promise<UserEntity> {
        return this.usersDbRepository.findOne({intraLogin: login});
    }

    /**
     * Поиск пользователя по email
     */
    async findUserByEmail(email: string): Promise<UserEntity>{
        const user = await this.usersDbRepository.findOne({email: email});
        return user || null;
    }

    /**
     * Удаление пользователя по ID
     * */
    async remove(id: string): Promise<void> {
        await this.usersDbRepository.delete(id);
    }

    /**
     * Верфикация пользователя
     * */
    async verifyUser(login: string): Promise<UserEntity> {
        return await this.findOne(login) ?? await this.addUser(login);
    }

    /**
     * Добавление нового пользователя
     * */
    async addUser(intraLogin, login = null, pathToAvatar = null): Promise<UserEntity> {
        let user = new UserEntity();
        user.login = login;
        user.intraLogin = intraLogin;
        user.pathToAvatar = pathToAvatar;
        return this.usersDbRepository.save(user);
    }

    async sendNewFriendRequest(masterUser: UserEntity, newFriend: UserEntity) {
        await getConnection()
            .createQueryBuilder()
            .relation(UserEntity, 'friendRequests')
            .of(masterUser)
            .add(newFriend);
    }

    async getFriendsRequestList(masterUser: UserEntity): Promise<UserEntity[]> {
        return await getConnection()
            .createQueryBuilder()
            .relation(UserEntity, 'friendRequests')
            .of(masterUser)
            .loadMany();
    }

    async getFriendsList(masterUser: UserEntity): Promise<UserEntity[]> {
        return await getConnection()
            .createQueryBuilder()
            .relation(UserEntity, 'friends')
            .of(masterUser)
            .loadMany();
    }

    async checkUserInFriendList(masterUser: UserEntity, userForCheck: UserEntity): Promise<boolean> {
        const userList = await this.getFriendsList(masterUser);
        return userList.includes(userForCheck);
    }

    async checkUserInFriendRequestList(masterUser: UserEntity, userForCheck: UserEntity): Promise<boolean> {
        const userList = await this.getFriendsRequestList(masterUser);
        return userList.includes(userForCheck);
    }
}
