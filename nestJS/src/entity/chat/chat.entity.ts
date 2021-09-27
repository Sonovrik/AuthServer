import {Column, Entity, ManyToMany, PrimaryGeneratedColumn, JoinTable, OneToMany} from "typeorm";
import {UserEntity} from "../user/user.entity";
import {ChatHistoryEntity} from "../chat-history/chat-history.entity";

@Entity({schema: 'public', name: 'chat'})
export class ChatEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column({name: 'chat_name', nullable: false})
    chatName: string

    @Column({name: 'password', nullable: true})
    password: string

    @ManyToMany(type => UserEntity)
    @JoinTable()
    members: UserEntity[]

    @ManyToMany(type => UserEntity)
    @JoinTable()
    owners: UserEntity[]

    @OneToMany(type => ChatHistoryEntity, chat => chat.history)
    chat: ChatHistoryEntity[]
}