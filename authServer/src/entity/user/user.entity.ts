import {Entity, OneToMany, PrimaryGeneratedColumn, Column} from "typeorm";
import {RefreshTokenEntity} from "../refresh-token/refresh-token.entity";

@Entity({schema: 'public', name: 'user'})
export class UserEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({unique: true, nullable: false})
    email: string;

    @OneToMany(type => RefreshTokenEntity, refreshToken => refreshToken.user)
    refreshToken: RefreshTokenEntity[];
}