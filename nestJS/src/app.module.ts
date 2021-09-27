import {Module} from '@nestjs/common';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {UserModule} from "./entity/user/user.module";
import {ChatModule} from "./entity/chat/chat.module";
import {ChatHistoryModule} from "./entity/chat-history/chat-history.module";
import {DbConnectionModule} from "./postgres-db/db-connection.module";
import {HttpModule} from "@nestjs/axios";

@Module({
    imports: [DbConnectionModule, UserModule, ChatModule, ChatHistoryModule, HttpModule],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {
}
