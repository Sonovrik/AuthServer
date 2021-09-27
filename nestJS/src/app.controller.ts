import {Controller, Post, Req, Res} from '@nestjs/common';
import {Request, Response} from "express";
import {AppService} from "./app.service";


@Controller()
export class AppController {

    constructor(private readonly appService: AppService) {

    }

    @Post('/checkAuth')
    async checkAuth(@Req() request: Request, @Res({passthrough: true}) response: Response){
        await this.appService.checkAuth(request);
    }

}
