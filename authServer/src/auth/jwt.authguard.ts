import {ExecutionContext, Injectable, Logger, UnauthorizedException} from "@nestjs/common";
import {AuthGuard} from "@nestjs/passport";
import {AuthService} from "./auth.service";
import {UserService} from "../entity/user/user.service";
import {ExtractJwt} from "passport-jwt";
import {cookieExtractor} from "./jwt.strategy";
import {Request, Response} from "express";


const CookieOptions = {httpOnly: true, secure: true};

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    private logger = new Logger(JwtAuthGuard.name);

    constructor(
        private readonly authService: AuthService,
        private readonly userService: UserService
    ) {
        super();
    }

    async activate(context: ExecutionContext): Promise<boolean> {
        return super.canActivate(context) as Promise<boolean>;
    }

    handleRequest(err, user) {
        if (err || !user) {
            throw new UnauthorizedException();
        }

        return user;
    }

    async canActivate(context: ExecutionContext): Promise<boolean>{
        const request: Request = context.switchToHttp().getRequest();
        let response: Response = context.switchToHttp().getResponse();
        try{
            const accessToken: string = await ExtractJwt.fromExtractors([cookieExtractor])(request);
            if (!accessToken){
                throw new UnauthorizedException('Access token is not set');
            }

            const isValidAccessToken: boolean = await this.authService.validateToken(accessToken, false);
            if (isValidAccessToken){
                return this.activate(context);
            }

            const refreshToken: string = request.cookies[process.env.REFRESH_TOKEN_COOKIE_NAME];
            if (!refreshToken)
                throw new UnauthorizedException('Refresh token is not set');
            const isValidRefreshToken: boolean = await this.authService.validateToken(refreshToken, true);
            await console.log('here');
            if (!isValidRefreshToken)
                throw new UnauthorizedException('Refresh token is not valid');

            const user = await this.userService.getUserByRefreshToken(refreshToken);
            if (!user)
                throw new UnauthorizedException('Refresh token is old');

            const newAccessToken = this.authService.createAccessToken(user.email);
            const newRefreshToken = this.authService.createRefreshToken(user.email);

            await this.userService.replaceTokenFromUser(user, refreshToken, newRefreshToken);

            request.cookies[process.env.ACCESS_TOKEN_COOKIE_NAME] = newAccessToken;
            request.cookies[process.env.REFRESH_TOKEN_COOKIE_NAME] = newRefreshToken;

            response.cookie(
                process.env.ACCESS_TOKEN_COOKIE_NAME,
                newAccessToken,
                CookieOptions);

            response.cookie(
                process.env.REFRESH_TOKEN_COOKIE_NAME,
                newRefreshToken,
                CookieOptions);

            return this.activate(context);
        }
        catch (error){
            response.clearCookie(
                process.env.ACCESS_TOKEN_COOKIE_NAME,
                CookieOptions
            )

            response.clearCookie(
                process.env.REFRESH_TOKEN_COOKIE_NAME,
                CookieOptions
            )
            throw new UnauthorizedException('Unauthorized Exception');
        }
    }


}

