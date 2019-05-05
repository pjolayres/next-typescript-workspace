import { ObjectType, Field, GraphQLISODateTime, Float } from 'type-graphql';

import EventItem from '../../../entities/event-item';

@ObjectType()
export default class EventItemInput implements Partial<EventItem> {
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

  @Field({ nullable: true })
  Remarks?: string;
}
