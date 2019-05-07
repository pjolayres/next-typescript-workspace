import { InputType, Field, GraphQLISODateTime, Float, ID, Int } from 'type-graphql';
import { DeepPartial } from 'typeorm';

import EventItem from '../../../entities/event-item';

import EventRegistrationInput from './event-registration-input';

@InputType()
export default class EventItemInput implements DeepPartial<EventItem> {
  @Field(_type => ID, { nullable: true })
  EventItemId!: string;

  @Field(_type => GraphQLISODateTime)
  StartDate!: Date;

  @Field(_type => GraphQLISODateTime, { nullable: true })
  EndDate?: Date;

  @Field()
  Title!: string;

  @Field({ nullable: true })
  Summary?: string;

  @Field({ nullable: true })
  Body?: string;

  @Field({ nullable: true })
  Address?: string;

  @Field(_type => Float, { nullable: true })
  Latitude?: number;

  @Field(_type => Float, { nullable: true })
  Longitude?: number;

  @Field(_type => [EventRegistrationInput], { nullable: true })
  EventRegistrations?: EventRegistrationInput[];

  @Field({ nullable: true })
  Remarks?: string;

  @Field(_type => GraphQLISODateTime, { nullable: true })
  DateCreated!: Date;

  @Field(_type => GraphQLISODateTime, { nullable: true })
  DateModified!: Date;

  @Field(_type => Int, { nullable: true })
  Timestamp!: string;
}
