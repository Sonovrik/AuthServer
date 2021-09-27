import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {UserEntity} from "../user/user.entity";

@Entity({schema: 'public', name: 'refresh_token'})
export class RefreshTokenEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({nullable: false, unique: true})
    token: string;

    @ManyToOne(type => UserEntity, user => user.refreshToken)
    user: UserEntity;
}
