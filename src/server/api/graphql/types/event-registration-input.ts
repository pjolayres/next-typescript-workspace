import { InputType, Field } from 'type-graphql';
import { DeepPartial } from 'typeorm';

import EventRegistration from '../../../entities/event-registration';

@InputType()
export default class EventRegistrationInput implements DeepPartial<EventRegistration> {
  @Field()
  EventItemId!: string;

  @Field()
  EmailAddress!: string;

  @Field({ nullable: true })
  PhoneNumber?: string;

  @Field({ nullable: true })
  Remarks?: string;
}
