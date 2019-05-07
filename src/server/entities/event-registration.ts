import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, VersionColumn, ManyToOne, JoinColumn } from 'typeorm';
import { ObjectType, Field, GraphQLISODateTime, ID, Int } from 'type-graphql';

import EventItem from './event-item';

@Entity('EventRegistrations')
@ObjectType()
export default class EventRegistration {
  @PrimaryGeneratedColumn('uuid')
  @Field(_type => ID)
  EventRegistrationId!: string;

  @Column()
  @Field()
  EventItemId!: string;

  @ManyToOne(_type => EventItem, item => item.EventRegistrations)
  @JoinColumn({ name: 'EventItemId' })
  @Field(_type => EventItem)
  EventItem!: EventItem;

  @Column('nvarchar', { length: 2000 })
  @Field()
  EmailAddress!: string;

  @Column('nvarchar', { length: 2000, nullable: true })
  @Field({ nullable: true })
  PhoneNumber?: string;

  @Column('nvarchar', { length: 2000, nullable: true })
  @Field({ nullable: true })
  Remarks?: string;

  @CreateDateColumn()
  @Field(_type => GraphQLISODateTime)
  DateCreated!: Date;

  @UpdateDateColumn()
  @Field(_type => GraphQLISODateTime)
  DateModified!: Date;

  @VersionColumn()
  @Field(_type => Int)
  Timestamp!: string;
}
