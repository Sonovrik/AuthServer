import {Injectable, UnauthorizedException} from '@nestjs/common';
import {Request} from "express";
import {HttpService} from "@nestjs/axios";

@Injectable()
export class AppService {
    constructor(private readonly httpService: HttpService) {
    }


    async checkAuth(request: Request){
        try{
            await this.httpService.post('http://localhost:1812/checkAuth', request.headers).toPromise();
        }
        catch (error){
            throw new UnauthorizedException('Unauthorized Exception');
        }
    }

}

