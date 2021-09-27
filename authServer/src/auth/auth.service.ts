import {Injectable} from '@nestjs/common';
import {JwtService} from "@nestjs/jwt";
import {UserService} from "../entity/user/user.service";
import {HttpService} from "@nestjs/axios"


@Injectable()
export class AuthService {
    constructor(
        private jwtService: JwtService,
        private readonly userService: UserService,
        private readonly httpService: HttpService
    ) {}


    async getIntraToken(code): Promise<string> {
        const url = process.env.INTRA_URI;
        const bodyFormData = {
            'grant_type': 'authorization_code',
            'client_id': process.env.CLIENT_ID,
            'client_secret': process.env.CLIENT_SECRET,
            'code': code,
            'redirect_uri': process.env.REDIRECT_URI
        };
        const resp = await this.httpService.post(url, bodyFormData).toPromise();
        return resp.data.access_token;
    }

    async getIntraUser(token: string): Promise<any>{
        const response = await this.httpService.get(process.env.HOME_PAGE_URI, {headers: {'Authorization': `Bearer ${token}`}}).toPromise();
        return {email: response.data.email, login: response.data.login};
    }


    createAccessToken(email: string) : string{
        const payload = {email: email};
        const accessToken = this.jwtService.sign(payload, {
            secret: process.env.JWT_ACCESS_TOKEN_SECRET,
            expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRATION_TIME
        })
        return accessToken;
    }

    createRefreshToken(email: string) : string{
        const payload = {email: email};
        const refreshToken = this.jwtService.sign(payload, {
            secret: process.env.JWT_REFRESH_TOKEN_SECRET,
            expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRATION_TIME
        })
        return refreshToken;
    }

    async createBodyWithNewTokens(email: string): Promise<any>{
        const accessToken = await this.createAccessToken(email);
        const refreshToken = await this.createRefreshToken(email);
        const body = {
            email: email,
            accessToken: accessToken,
            refreshToken: refreshToken
        };
        return body
    }

    async validateToken(token: string, IsRefreshToken: boolean): Promise<boolean> {
        try {
            let secret;
            if (!IsRefreshToken)
               secret = process.env.JWT_ACCESS_TOKEN_SECRET;
            else
               secret = process.env.JWT_REFRESH_TOKEN_SECRET;
            await this.jwtService.verify(token, {secret: secret});
        }
        catch (error){
            console.log(error);
            return false;
        }
        return true;
    }

}
