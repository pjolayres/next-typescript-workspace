import { Query, Args, Resolver, FieldResolver, Root, Ctx, Mutation, Arg } from 'type-graphql';

import EventRegistrationsRepository from '../../../repositories/event-registrations-repository';
import EventItemsRepository from '../../../repositories/event-items-repository';
import EventRegistration from '../../../entities/event-registration';
import FetchListArgs from '../types/fetch-list-args';
import Utilities from '../../../../shared/utilities';
import { Context } from '../../../../types';
import EventItem from '../../../entities/event-item';
import EventRegistrationInput from '../types/event-registration-input';

@Resolver(_of => EventRegistration)
export default class EventRegistrationsResolver {
  eventRegistrationsRepository = new EventRegistrationsRepository();

  @Query(_returns => [EventRegistration])
  async eventRegistrations(@Args() args: FetchListArgs) {
    const options = Utilities.parsePaginatedFetchListOptions<EventRegistration>(args);

    const items = await this.eventRegistrationsRepository.getItems(options);

    return items;
  }

  @FieldResolver()
  async EventItem(@Root() eventRegistration: EventRegistration, @Ctx() context: Context) {
    const dataLoader = context.dataLoaderFactory.getDataLoader<EventItem, string>(EventItem, 'EventItemId', async (eventItemIds: string[]) => {
      const eventItemsRepostory = new EventItemsRepository();
      const items = await eventItemsRepostory.getItemsByIds(eventItemIds);
      const sortedItems = eventItemIds.map(key => items.find(item => key === item.EventItemId));

      return sortedItems;
    });

    const result = await dataLoader.load(eventRegistration.EventItemId);

    return result;
  }

  @Mutation(_returns => EventRegistration)
  async addEventRegistration(@Arg('eventRegistration') eventRegistrationInput: EventRegistrationInput): Promise<EventRegistration> {
    const eventRegistrationsRepository = new EventRegistrationsRepository();
    const result = await eventRegistrationsRepository.add(eventRegistrationInput);

    return result;
  }

  @Mutation(_returns => EventRegistration)
  async updateEventRegistration(@Arg('eventRegistration') eventRegistrationInput: EventRegistrationInput): Promise<EventRegistration> {
    const eventRegistrationsRepository = new EventRegistrationsRepository();
    const result = await eventRegistrationsRepository.update(eventRegistrationInput);

    return result;
  }

  @Mutation(_returns => Boolean)
  async deleteEventRegistration(@Arg('id') id: string): Promise<boolean> {
    const eventRegistrationsRepository = new EventRegistrationsRepository();
    await eventRegistrationsRepository.deleteById(id);

    return true;
  }
}
