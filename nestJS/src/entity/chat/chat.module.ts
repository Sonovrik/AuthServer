import {Module} from "@nestjs/common";
import {ChatController} from "./chat.controller";
import {ChatService} from "./chat.service";
import {TypeOrmModule} from "@nestjs/typeorm";
import {ChatEntity} from "./chat.entity";

@Module({
    imports: [TypeOrmModule.forFeature([ChatEntity])],
    controllers: [ChatController],
    providers: [ChatService]
})

export class ChatModule {
}