import {Entity,PrimaryGeneratedColumn, BaseEntity, CreateDateColumn, UpdateDateColumn} from 'typeorm';

import {classToPlain, Exclude} from 'class-transformer';

@Entity({database: 'social_media'})
export default abstract class Entity1 extends BaseEntity {
    @Exclude()
    @PrimaryGeneratedColumn()
    _id!: string;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;

    toJSON() {
        return classToPlain(this);
    }
}
