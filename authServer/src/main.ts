import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
    try {
        const app = await NestFactory.create(AppModule);
        app.use(cookieParser());
        await app.listen(process.env.AUTH_SERVER_CONTAINER_PORT, () => {
            console.log(`Authserver started at port ${process.env.AUTH_SERVER_CONTAINER_PORT}`);
        });
    }
    catch (error){
        console.log(error);
    }
}

bootstrap()
    .then(() => console.log('⊂_ヽ\n' +
        '　 ＼＼ ＿\n' +
        '　　 ＼(　•_•) F\n' +
        '　　　 <　⌒ヽ U\n' +
        '　　　/ 　 へ＼ C\n' +
        '　　 /　　/　＼＼ K\n' +
        '　　 ﾚ　ノ　　 ヽ_つ \n' +
        '　　/　/ Y\n' +
        '　 /　/| O\n' +
        '　(　(ヽ U\n' +
        '　|　|、＼\n' +
        '　| 丿 ＼ ⌒)\n' +
        '　| |　　) /\n' +
        '`ノ )　　Lﾉ\n' +
        '(_／'));
