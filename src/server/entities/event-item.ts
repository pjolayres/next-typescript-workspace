import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, VersionColumn, OneToMany } from 'typeorm';
import { ObjectType, Field, GraphQLISODateTime, Float, ID, Int } from 'type-graphql';
import { IsUUID, MaxLength, Min, Max, IsDate, IsNumberString } from 'class-validator';

import EventRegistration from './event-registration';

@Entity('EventItems')
@ObjectType()
export default class EventItem {
  @PrimaryGeneratedColumn('uuid')
  @Field(_type => ID)
  @IsUUID('4')
  EventItemId!: string;

  @Column()
  @Field(_type => GraphQLISODateTime)
  @IsDate()
  StartDate!: Date;

  @Column({ nullable: true })
  @Field(_type => GraphQLISODateTime, { nullable: true })
  @IsDate()
  EndDate?: Date;

  @Column('nvarchar', { length: 2000 })
  @Field()
  @MaxLength(2000)
  Title!: string;

  @Column('nvarchar', { length: 2000, nullable: true })
  @Field({ nullable: true })
  @MaxLength(2000)
  Summary?: string;

  @Column('text', { nullable: true })
  @Field({ nullable: true })
  Body?: string;

  @Column('nvarchar', { length: 2000, nullable: true })
  @Field({ nullable: true })
  @MaxLength(2000)
  Address?: string;

  @Column('double', { nullable: true })
  @Field(_type => Float, { nullable: true })
  @Min(-90.0)
  @Max(90.0)
  Latitude?: number;

  @Column('double', { nullable: true })
  @Field(_type => Float, { nullable: true })
  @Min(-180.0)
  @Max(180.0)
  Longitude?: number;

  @OneToMany(_type => EventRegistration, item => item.EventItem, { cascade: true })
  @Field(_type => [EventRegistration])
  EventRegistrations?: EventRegistration[];

  @Column('nvarchar', { length: 2000, nullable: true })
  @Field({ nullable: true })
  @MaxLength(2000)
  Remarks?: string;

  @CreateDateColumn()
  @Field(_type => GraphQLISODateTime)
  @IsDate()
  DateCreated!: Date;

  @UpdateDateColumn()
  @Field(_type => GraphQLISODateTime)
  @IsDate()
  DateModified!: Date;

  @VersionColumn()
  @Field(_type => Int)
  @IsNumberString()
  Timestamp!: string;
}
