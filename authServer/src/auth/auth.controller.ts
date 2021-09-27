import {
    BadRequestException,
    Controller,
    ForbiddenException,
    Post,
    Req,
    Res,
    UseGuards
} from '@nestjs/common';
import {AuthService} from "./auth.service";
import {Request, Response} from "express";
import {UserService} from "../entity/user/user.service";
import {Auth2fService} from "./auth2f.service";
import {JwtAuthGuard} from "./jwt.authguard";
import {CacheManagerService} from "../cache-manager/cache-manager.service";
import {Console} from "inspector";

@Controller()
export class AuthController {

    constructor(private readonly authService: AuthService,
                private readonly userService: UserService,
                private readonly auth2fService: Auth2fService,
                private readonly cacheManagerService: CacheManagerService) {
    }


    /**
     * @Description: Endpoint get intra access token, user info and send 2f code to user's email
     */
    @Post('/checkIntraCode')
    async getIntraUserInfo(@Req() request: Request,
                           @Res({passthrough: true}) response: Response){
        const code = request?.body?.intraCode
        console.log(code);
        if (!code)
            throw new BadRequestException('No intra code');
        try{
            const intraToken = await this.authService.getIntraToken(code);
            const user = await this.authService.getIntraUser(intraToken);

            this.auth2fService.send2F(user.email).then((code) => {
                this.cacheManagerService.set(user.email, code, 180);
            });
            response.json(user);
        }
        catch (error){
            throw new ForbiddenException('Incorrect intra data');
        }
    }

    /**
     * @Description: Compare code in Redis and user's code. If OK, then delete entry in Redis and create new DB data if doesn't exist or only replace old refresh token to new refresh token.
     */
    @Post('/checkEmailCode')
    async checkCode(@Req() request: Request, @Res({passthrough: true}) response: Response) {
        const email = request?.body?.email;
        const code = request?.body?.emailCode;
        if (!(email && code))
            throw new BadRequestException('Body error');

        const codeInRedis = await this.cacheManagerService.get(email);
        if (!codeInRedis || code != codeInRedis)
            throw new ForbiddenException('Incorrect code');


        await this.cacheManagerService.del(email);

        const respBody = await this.authService.createBodyWithNewTokens(email);

        let user;
        if (!(user = await this.userService.getUserByEmail(respBody.email))) {
            const newUser = await this.userService.createNewUser(respBody.email);
            await this.userService.insertNewTokenToUser(newUser, respBody.refreshToken);
        } else
            await this.userService.insertNewTokenToUser(user, respBody.refreshToken);

        response.cookie(process.env.ACCESS_TOKEN_COOKIE_NAME, respBody.accessToken, {httpOnly: true, secure: true});
        response.cookie(process.env.REFRESH_TOKEN_COOKIE_NAME, respBody.refreshToken, {httpOnly: true, secure: true});
    }


    /**
     * @Description: Endpoint check access token, and also get new tokens if it is possible.
     */
    @UseGuards(JwtAuthGuard)
    @Post('/checkAuth')
    async check() {
        return true;
    }

    @Post('/redis')
    async red(){
        await this.cacheManagerService.set('test', 1234);
    }

}
