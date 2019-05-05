import { ObjectType, Field } from 'type-graphql';

import EventRegistration from '../../../entities/event-registration';

@ObjectType()
export default class EventRegistrationInput implements Partial<EventRegistration> {
  @Field()
  EventItemId!: string;

  @Field()
  EmailAddress!: string;

  @Field({ nullable: true })
  PhoneNumber?: string;

  @Field({ nullable: true })
  Remarks?: string;
}
