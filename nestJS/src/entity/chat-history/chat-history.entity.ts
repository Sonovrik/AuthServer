import {
    Column,
    CreateDateColumn,
    Entity,
    OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
    JoinColumn,
    ManyToOne
} from "typeorm";
import {UserEntity} from "../user/user.entity";
import {ChatEntity} from "../chat/chat.entity";

@Entity({schema: 'public', name: 'chat_history'})
export class ChatHistoryEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({nullable: false})
    message: string

    @OneToOne(type => UserEntity)
    @JoinColumn()
    user: UserEntity

    @CreateDateColumn()
    @UpdateDateColumn()
    data: Date

    @ManyToOne(type => ChatEntity, history => history.chat)
    history: ChatEntity
}