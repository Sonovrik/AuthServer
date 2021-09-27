import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';
import * as cookieParser from 'cookie-parser';

const bootstrap = async () => {
    try {
        const app = await NestFactory.create(AppModule);
        app.use(cookieParser());
        await app.listen(process.env.NESTJS_CONTAINER_PORT, () => {
            console.log(`Backend server started at port ${process.env.NESTJS_CONTAINER_PORT}`);
        });
    } catch (error) {
        console.log(error);
    }
};

bootstrap()
    .then(() => console.log('⠀⠀⠀⠀⠀(\\__/)⠀⠀⠀⠀⠀\n' +
        '⠀⠀⠀⠀⠀(•ㅅ•)⠀⠀my gf telling the waitress\n' +
        '⠀＿ノ⠀ヽ⠀ノ⠀＼＿⠀⠀my food is wrong\n' +
        '/⠀️⠀Y⠀⌒Ｙ⌒⠀Ｙ⠀️⠀️ヽ\n' +
        '(⠀️⠀️⠀️(三ヽ人⠀⠀/⠀⠀⠀|\n' +
        '|⠀️⠀️⠀️ﾉ⠀¯¯\\⠀￣￣ヽノ\n' +
        'ヽ＿＿＿⠀⠀＞､＿_／\n' +
        '⠀⠀⠀｜⠀(⠀王⠀)〈⠀⠀ (\\__/) \n' +
        '⠀⠀⠀/⠀⠀ﾐ`——彡⠀\\   (•ㅅ•)  me'));