import {Injectable, UnauthorizedException} from "@nestjs/common";
import {JwtFromRequestFunction, Strategy} from "passport-jwt";
import {PassportStrategy} from "@nestjs/passport"
import {Request} from "express";
import {UserService} from "../entity/user/user.service";

export const cookieExtractor: JwtFromRequestFunction = (req: Request) => {
    if (req && req.cookies) {
        return req.cookies[process.env.ACCESS_TOKEN_COOKIE_NAME];
    }
    return null;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy){
    constructor(private readonly userService: UserService) {
        super({
            jwtFromRequest: cookieExtractor,
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_ACCESS_TOKEN_SECRET
        });
    }

    // we can check BAN here
    async validate({ email }): Promise<any> {
        const user = this.userService.getUserByEmail(String(email));

        if (!user){
            console.log('validation error');
            throw new UnauthorizedException();
        }
        return user;
    }
}