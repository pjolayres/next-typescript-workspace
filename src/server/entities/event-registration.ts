import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, VersionColumn, ManyToOne, JoinColumn } from 'typeorm';
import { ObjectType, Field, GraphQLISODateTime, ID, Int } from 'type-graphql';
import { IsUUID, IsEmail, Matches, MaxLength, IsDate, IsOptional, Min } from 'class-validator';

import EventItem from './event-item';

@Entity('EventRegistrations')
@ObjectType()
export default class EventRegistration {
  @PrimaryGeneratedColumn('uuid')
  @Field(_type => ID)
  @IsUUID('4')
  EventRegistrationId!: string;

  @Column()
  @Field()
  @IsUUID('4')
  EventItemId!: string;

  @ManyToOne(_type => EventItem, item => item.EventRegistrations)
  @JoinColumn({ name: 'EventItemId' })
  @Field(_type => EventItem)
  EventItem!: EventItem;

  @Column('nvarchar', { length: 2000 })
  @Field()
  @IsEmail()
  @MaxLength(2000)
  EmailAddress!: string;

  @Column('nvarchar', { length: 2000, nullable: true })
  @Field({ nullable: true })
  @Matches(/^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/)
  @IsOptional()
  PhoneNumber?: string;

  @Column('nvarchar', { length: 2000, nullable: true })
  @Field({ nullable: true })
  @MaxLength(2000)
  @IsOptional()
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
  @Min(1)
  Timestamp!: number;
}
