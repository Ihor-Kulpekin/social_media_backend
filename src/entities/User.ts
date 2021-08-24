import {Entity as TOEntity, Column, Index, BeforeInsert} from 'typeorm';
import {IsEmail, Length} from 'class-validator';

import BaseEntity from "./Entity";
import {hashPassword} from "../utils/hashPassword";
import { Exclude } from 'class-transformer';

@TOEntity('user')
export default class User extends BaseEntity {
    constructor(user: Partial<User>) {
        super();
        Object.assign(this, user)
    }

    @Index()
    @IsEmail()
    @Column({unique: true})
    email: string = '';

    @Index()
    @Length(3, 255, {message: 'name must be at least 3 chracters long.'})
    @Column()
    name: string = '';

    @Exclude()
    @Column()
    @Length(6, 255, {message: 'Password must be at least 6 chracters long.'})
    password: string = '';

    @Index()
    @Length(3, 255, {message: 'Lastname must be at least 3 chracters long.'})
    @Column()
    lastName: string = '';

    @BeforeInsert()
    async hashPassword() {
        this.password = await hashPassword(this.password, 10);
    }
}
