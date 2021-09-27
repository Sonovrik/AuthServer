import {Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn} from "typeorm";

@Entity({schema: 'public', name: 'user'})
export class UserEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({unique: true, nullable: false, length: 20, name: 'intra_login'})
    intraLogin: string;

    @Column({unique: true, nullable: false, length: 20})
    email: string

    @Column({unique: true, nullable: true, length: 20})
    login: string;

    @Column({nullable: true, name: 'path_to_avatar'})
    pathToAvatar: string;

    @ManyToMany(type => UserEntity)
    @JoinTable()
    friends: UserEntity[]

    @ManyToMany(type => UserEntity)
    @JoinTable()
    friendRequests: UserEntity[]




}
