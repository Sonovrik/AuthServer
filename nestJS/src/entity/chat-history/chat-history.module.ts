import {Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";
import {ChatHistoryEntity} from "./chat-history.entity";
import {ChatHistoryController} from "./chat-history.controller";
import {ChatHistoryService} from "./chat-history.service";

@Module({
    imports: [TypeOrmModule.forFeature([ChatHistoryEntity])],
    controllers: [ChatHistoryController],
    providers: [ChatHistoryService]
})

export class ChatHistoryModule {
}