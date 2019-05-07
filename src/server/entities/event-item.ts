import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, VersionColumn, OneToMany } from 'typeorm';
import { ObjectType, Field, GraphQLISODateTime, Float, ID, Int } from 'type-graphql';

import EventRegistration from './event-registration';

@Entity('EventItems')
@ObjectType()
export default class EventItem {
  @PrimaryGeneratedColumn('uuid')
  @Field(_type => ID)
  EventItemId!: string;

  @Column()
  @Field(_type => GraphQLISODateTime)
  StartDate!: Date;

  @Column({ nullable: true })
  @Field(_type => GraphQLISODateTime, { nullable: true })
  EndDate?: Date;

  @Column('nvarchar', { length: 2000 })
  @Field()
  Title!: string;

  @Column('nvarchar', { length: 2000, nullable: true })
  @Field({ nullable: true })
  Summary?: string;

  @Column('text', { nullable: true })
  @Field({ nullable: true })
  Body?: string;

  @Column('nvarchar', { length: 2000, nullable: true })
  @Field({ nullable: true })
  Address?: string;

  @Column('double', { nullable: true })
  @Field(_type => Float, { nullable: true })
  Latitude?: number;

  @Column('double', { nullable: true })
  @Field(_type => Float, { nullable: true })
  Longitude?: number;

  @OneToMany(_type => EventRegistration, item => item.EventItem, { cascade: true })
  @Field(_type => [EventRegistration])
  EventRegistrations?: EventRegistration[];

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
