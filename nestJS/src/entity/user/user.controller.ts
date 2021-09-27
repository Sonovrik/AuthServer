import {
    BadRequestException,
    ClassSerializerInterceptor,
    Controller, ForbiddenException,
    Get,
    HttpException,
    HttpStatus,
    Post,
    Query, Req,
    UploadedFile,
    UseInterceptors
} from "@nestjs/common";
import {FileInterceptor} from "@nestjs/platform-express";
import {UserService} from "./user.service";
import {UserEntity} from "./user.entity";
import {Request} from "express";

@Controller()
export class UserController {
    constructor(private readonly userService: UserService) {
    }

    @Get('/addUser')
    addExample(@Query('login') login: string): void {
        this.userService.addUser(login || 'test').then();
    }

    @Post('/uploadAvatar')
    @UseInterceptors(FileInterceptor("file"))
    upload(@Query('id') id: number, @UploadedFile() file): void {
        this.userService.uploadUserAvatar(file, id).then();
    }

    @UseInterceptors(ClassSerializerInterceptor)
    @Get('/getInfo')
    async getUserInfo(@Query('login') login: string) : Promise<UserEntity>
    {
        const user = await this.userService.findOne(login);
        if (user == undefined)
            throw new HttpException('User not found', HttpStatus.NOT_FOUND)
        return user;
    }

    @Post('/addFriend')
    async addFriend(@Req() request: Request){
        const userEmail1 = request?.body?.userEmail1;
        const userEmail2 = request?.body?.userEmail2;
        if (!(userEmail1 && userEmail2))
            throw new BadRequestException();

        const user1 = await this.userService.findUserByEmail(userEmail1);
        const user2 = await this.userService.findUserByEmail(userEmail1);
        if (!(user1 && user2))
            throw new BadRequestException();

        if (await this.userService.checkUserInFriendList(user1, user2)
            || await this.userService.checkUserInFriendRequestList(user1, user2))
            throw new ForbiddenException('User already has in friends or request list');

        await this.userService.sendNewFriendRequest(user1, user2);
    }

    @Get('/userReq')
    async userReq()
    {
        const test = await this.userService.findOne('login13');
        return await this.userService.getFriendsRequestList(test);
    }
}