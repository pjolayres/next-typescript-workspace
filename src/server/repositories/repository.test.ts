import { Connection, EntityManager } from 'typeorm';

import databaseInitializer from '../config/database-initializer';
import EventItem from '../entities/event-item';
import EventRegistration from '../entities/event-registration';
import { SearchableEntityProperties } from '../../types';
import { ValidationError, ValidationErrorCodes, MiscellaneousErrorCodes } from '../../shared/errors';

import Repository from './repository';

let sampleMultipleEventItems: EventItem[];
let sampleEventItemWithRegistrations: EventItem;
let sampleTwinEventItem1: EventItem;
let sampleTwinEventItem2: EventItem;

const initializeSampleData = () => {
  sampleTwinEventItem1 = new EventItem();
  sampleTwinEventItem1.Title = 'Title 1';
  sampleTwinEventItem1.StartDate = new Date(2019, 1, 1);
  sampleTwinEventItem1.EndDate = new Date(2019, 1, 2);
  sampleTwinEventItem1.Summary = 'Summary 1';
  sampleTwinEventItem1.Body = 'Lorem ipsum dolor sit amet 1';
  sampleTwinEventItem1.Address = 'Address 1';
  sampleTwinEventItem1.Latitude = 12.3456;
  sampleTwinEventItem1.Longitude = 65.4321;

  sampleTwinEventItem2 = new EventItem();
  sampleTwinEventItem2.Title = 'Title 1';
  sampleTwinEventItem2.StartDate = new Date(2019, 1, 1);
  sampleTwinEventItem2.EndDate = new Date(2019, 1, 2);
  sampleTwinEventItem2.Summary = 'Summary 1';
  sampleTwinEventItem2.Body = 'Lorem ipsum dolor sit amet 1';
  sampleTwinEventItem2.Address = 'Address 1';
  sampleTwinEventItem2.Latitude = 12.3456;
  sampleTwinEventItem2.Longitude = 65.4321;

  const eventItem1 = new EventItem();
  eventItem1.Title = 'Title 1';
  eventItem1.StartDate = new Date(2019, 1, 1);
  eventItem1.EndDate = new Date(2019, 1, 2);
  eventItem1.Summary = 'Summary 1';
  eventItem1.Body = 'Lorem ipsum dolor sit amet 1';
  eventItem1.Address = 'Address 1';
  eventItem1.Latitude = 12.3456;
  eventItem1.Longitude = 65.4321;

  const eventItem2 = new EventItem();
  eventItem2.Title = 'Title Temp 2';
  eventItem2.StartDate = new Date(2019, 1, 3);
  eventItem2.EndDate = new Date(2019, 1, 4);
  eventItem2.Summary = 'Summary 2';
  eventItem2.Body = 'Lorem ipsum dolor sit amet 2';
  eventItem2.Address = 'Address 2';
  eventItem2.Latitude = 22.3456;
  eventItem2.Longitude = 66.4321;

  const eventItem3 = new EventItem();
  eventItem3.Title = 'Name 3';
  eventItem3.StartDate = new Date(2019, 1, 5);
  eventItem3.EndDate = new Date(2019, 1, 6);
  eventItem3.Summary = 'Summary Temp 3';
  eventItem3.Body = 'Lorem ipsum dolor sit amet 3';
  eventItem3.Address = 'Address 3';
  eventItem3.Latitude = 22.3456;
  eventItem3.Longitude = 66.4321;

  sampleMultipleEventItems = [eventItem1, eventItem2, eventItem3];

  sampleEventItemWithRegistrations = new EventItem();
  sampleEventItemWithRegistrations.Title = 'Title 4';
  sampleEventItemWithRegistrations.StartDate = new Date(2019, 1, 1);
  sampleEventItemWithRegistrations.EndDate = new Date(2019, 1, 2);
  sampleEventItemWithRegistrations.Summary = 'Summary 4';
  sampleEventItemWithRegistrations.Body = 'Lorem ipsum dolor sit amet 4';
  sampleEventItemWithRegistrations.Address = 'Address 4';
  sampleEventItemWithRegistrations.Latitude = 12.3456;
  sampleEventItemWithRegistrations.Longitude = 65.4321;

  const eventRegistration1 = new EventRegistration();
  eventRegistration1.EmailAddress = 'email1@example.com';
  eventRegistration1.PhoneNumber = '+971501111111';

  const eventRegistration2 = new EventRegistration();
  eventRegistration2.EmailAddress = 'email2@example.com';
  eventRegistration2.PhoneNumber = '+971502222222';

  sampleEventItemWithRegistrations.EventRegistrations = [eventRegistration1, eventRegistration2];
};

beforeAll(() => {
  jest.setTimeout(30 * 1000); // 30-second timeout
});

describe('Repository', () => {
  let connection!: Connection;
  let entityManager!: EntityManager;

  beforeEach(async () => {
    connection = await databaseInitializer();
    entityManager = connection.createEntityManager();
    initializeSampleData();
  });

  afterEach(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  test('Database entities are initially empty when test is run.', async () => {
    const eventItemsRepository = new Repository<EventItem, string>(EventItem, entityManager);
    const eventRegistrationsRepository = new Repository<EventRegistration, string>(EventRegistration, entityManager);

    const eventItems = await eventItemsRepository.getPaginatedItems();

    expect(eventItems.totalItems).toBe(0);
    expect(eventItems.items.length).toBe(0);

    const eventRegistration = await eventRegistrationsRepository.getPaginatedItems();

    expect(eventRegistration.totalItems).toBe(0);
    expect(eventRegistration.items.length).toBe(0);
  });

  test('In-memory database is cleared after each test', async () => {
    const eventItemsRepository = new Repository<EventItem, string>(EventItem, entityManager);

    const eventItems = await eventItemsRepository.getPaginatedItems();

    expect(eventItems.totalItems).toBe(0);
    expect(eventItems.items.length).toBe(0);
  });

  test('add() with cascade', async () => {
    const eventItemsRepository = new Repository<EventItem, string>(EventItem, entityManager);
    const eventRegistrationsRepository = new Repository<EventRegistration, string>(EventRegistration, entityManager);

    await eventItemsRepository.add(sampleEventItemWithRegistrations);

    const eventItems = await eventItemsRepository.getPaginatedItems();

    expect(eventItems.totalItems).toBe(1);
    expect(eventItems.items.length).toBe(1);
    expect(eventItems.items[0].EventItemId.length).toBeGreaterThan(0);
    expect(eventItems.items[0].Title).toBe(sampleEventItemWithRegistrations.Title);

    const eventRegistrations = await eventRegistrationsRepository.getPaginatedItems();

    expect(eventRegistrations.totalItems).toBe(2);
    expect(eventRegistrations.items.length).toBe(2);
    expect(eventRegistrations.items[0].EventRegistrationId.length).toBeGreaterThan(0);
    expect(eventRegistrations.items[0].EmailAddress).toBe(sampleEventItemWithRegistrations.EventRegistrations![0].EmailAddress);
    expect(eventRegistrations.items[0].EventItemId).toBe(eventItems.items[0].EventItemId);
    expect(eventRegistrations.items[1].EventRegistrationId.length).toBeGreaterThan(0);
    expect(eventRegistrations.items[1].EmailAddress).toBe(sampleEventItemWithRegistrations.EventRegistrations![1].EmailAddress);
    expect(eventRegistrations.items[1].EventItemId).toBe(eventItems.items[0].EventItemId);
  });

  test('add() existing item in database should throw error', async () => {
    const eventItemsRepository = new Repository<EventItem, string>(EventItem, entityManager);

    const savedItem = await eventItemsRepository.add(sampleMultipleEventItems[0]);

    let error: Error | null = null;
    try {
      await eventItemsRepository.add(savedItem);
    } catch (ex) {
      error = ex;
    }

    expect(error).not.toBeNull();

    const validationError = error as ValidationError;

    expect(validationError).not.toBeNull();
    expect(validationError.errorCode).toBe(ValidationErrorCodes.InsertExistingItemError);
  });

  test('update()', async () => {
    const eventItemsRepository = new Repository<EventItem, string>(EventItem, entityManager);

    const savedItem = await eventItemsRepository.add(sampleMultipleEventItems[0]);

    expect(savedItem.Title).toBe(sampleMultipleEventItems[0].Title);

    const id = savedItem.EventItemId;
    const newTitle = 'Updated Title';
    savedItem.Title = newTitle;

    await eventItemsRepository.update(savedItem);

    const updatedItem = await eventItemsRepository.getById(id);

    expect(updatedItem).toBeDefined();
    expect(updatedItem!.EventItemId).toBe(id);
    expect(updatedItem!.Title).toBe(newTitle);
  });

  test('update() with DateCreated override', async () => {
    const eventItemsRepository = new Repository<EventItem, string>(EventItem, entityManager);

    const savedItem = await eventItemsRepository.add(sampleMultipleEventItems[0]);

    expect(savedItem.Title).toBe(sampleMultipleEventItems[0].Title);

    const id = savedItem.EventItemId;

    const newTitle = 'Updated Title';
    savedItem.Title = newTitle;

    const savedDateCreated = savedItem.DateCreated;
    savedItem.DateCreated = new Date('2019-01-02');

    await eventItemsRepository.update(savedItem);

    const updatedItem = await eventItemsRepository.getById(id);

    expect(updatedItem).toBeDefined();
    expect(updatedItem!.EventItemId).toBe(id);
    expect(updatedItem!.Title).toBe(newTitle);
    expect(updatedItem!.DateCreated.toISOString()).toBe(savedDateCreated.toISOString());
  });

  test('update() with optimistic concurrency error', async () => {
    const eventItemsRepository = new Repository<EventItem, string>(EventItem, entityManager);

    // Save initial item
    const savedItem = await eventItemsRepository.add(sampleTwinEventItem1);

    expect(savedItem.Title).toBe(sampleTwinEventItem1.Title);

    // Get another copy of saved item
    const savedItemCopy = await eventItemsRepository.getById(savedItem.EventItemId);

    expect(savedItemCopy!.EventItemId).toBe(savedItem.EventItemId);

    // Update item concurrently
    const newTitle1 = 'Updated Title 1';
    savedItemCopy!.EventItemId = savedItem.EventItemId;
    savedItemCopy!.Title = newTitle1;
    savedItemCopy!.Timestamp = savedItem.Timestamp;

    const concurrentlyUpdatedItem = await eventItemsRepository.update(savedItemCopy!);

    expect(concurrentlyUpdatedItem!.EventItemId).toBe(savedItem.EventItemId);
    expect(concurrentlyUpdatedItem!.Title).toBe(newTitle1);
    expect(concurrentlyUpdatedItem!.Timestamp).not.toBe(savedItem.Timestamp);

    // Update item with outdated timestamp
    const newTitle2 = 'Updated Title 2';
    savedItem.Title = newTitle2;

    let error: ValidationError | undefined | null = null;
    try {
      await eventItemsRepository.update(savedItem);
    } catch (ex) {
      error = ex as ValidationError;
    }

    expect(error).toBeDefined();
    expect(error!.errorCode).toBe(MiscellaneousErrorCodes.UpdateOutdatedRecord);
  });

  test('delete()', async () => {
    const eventItemsRepository = new Repository<EventItem, string>(EventItem, entityManager);

    const savedItem = await eventItemsRepository.add(sampleMultipleEventItems[0]);
    const loadedItem = await eventItemsRepository.getById(savedItem.EventItemId);

    expect(loadedItem).toBeDefined();

    await eventItemsRepository.delete(loadedItem!);

    const eventItems = await eventItemsRepository.getPaginatedItems();

    expect(eventItems.totalItems).toBe(0);
    expect(eventItems.items.length).toBe(0);
  });

  test('deleteById()', async () => {
    const eventItemsRepository = new Repository<EventItem, string>(EventItem, entityManager);

    const savedItem = await eventItemsRepository.add(sampleMultipleEventItems[0]);
    const loadedItem = await eventItemsRepository.getById(savedItem.EventItemId);

    expect(loadedItem).toBeDefined();

    await eventItemsRepository.deleteById(loadedItem!.EventItemId!);

    const eventItems = await eventItemsRepository.getPaginatedItems();

    expect(eventItems.totalItems).toBe(0);
    expect(eventItems.items.length).toBe(0);
  });

  test('getById()', async () => {
    const eventItemsRepository = new Repository<EventItem, string>(EventItem, entityManager);

    const savedItem = await eventItemsRepository.add(sampleMultipleEventItems[0]);
    const eventItem = await eventItemsRepository.getById(savedItem.EventItemId);

    expect(eventItem).toBeDefined();
    expect(eventItem!.EventItemId.length).toBeGreaterThan(0);
    expect(eventItem!.EventItemId).toBe(savedItem.EventItemId);
  });

  test('getPaginatedItems()', async () => {
    const eventItemsRepository = new Repository<EventItem, string>(EventItem, entityManager);

    await eventItemsRepository.add(sampleMultipleEventItems[0]);
    await eventItemsRepository.add(sampleMultipleEventItems[1]);
    await eventItemsRepository.add(sampleMultipleEventItems[2]);

    const queryResults = await eventItemsRepository.getPaginatedItems();

    expect(queryResults.totalItems).toBe(3);
    expect(queryResults.items.length).toBe(3);
    expect(queryResults.items[0].EventItemId.length).toBeGreaterThan(0);
    expect(queryResults.items[0].Title).toBe(sampleMultipleEventItems[0].Title);
    expect(queryResults.items[1].EventItemId.length).toBeGreaterThan(0);
    expect(queryResults.items[1].Title).toBe(sampleMultipleEventItems[1].Title);
    expect(queryResults.items[2].EventItemId.length).toBeGreaterThan(0);
    expect(queryResults.items[2].Title).toBe(sampleMultipleEventItems[2].Title);
  });

  test('getPaginatedItems({ skip: 1, take: 1 })', async () => {
    const eventItemsRepository = new Repository<EventItem, string>(EventItem, entityManager);

    await eventItemsRepository.add(sampleMultipleEventItems[0]);
    await eventItemsRepository.add(sampleMultipleEventItems[1]);
    await eventItemsRepository.add(sampleMultipleEventItems[2]);

    const queryResults = await eventItemsRepository.getPaginatedItems({ skip: 1, take: 1 });

    expect(queryResults.skip).toBe(1);
    expect(queryResults.take).toBe(1);
    expect(queryResults.totalItems).toBe(3);
    expect(queryResults.items.length).toBe(1);
    expect(queryResults.items[0].Title).toBe(sampleMultipleEventItems[1].Title);
  });

  test('getPaginatedItems({ skip: 1, take: 2 })', async () => {
    const eventItemsRepository = new Repository<EventItem, string>(EventItem, entityManager);

    await eventItemsRepository.add(sampleMultipleEventItems[0]);
    await eventItemsRepository.add(sampleMultipleEventItems[1]);
    await eventItemsRepository.add(sampleMultipleEventItems[2]);

    const queryResults = await eventItemsRepository.getPaginatedItems({ skip: 1, take: 2 });

    expect(queryResults.skip).toBe(1);
    expect(queryResults.take).toBe(2);
    expect(queryResults.totalItems).toBe(3);
    expect(queryResults.items.length).toBe(2);
    expect(queryResults.items[0].Title).toBe(sampleMultipleEventItems[1].Title);
    expect(queryResults.items[1].Title).toBe(sampleMultipleEventItems[2].Title);
  });

  test('getPaginatedItems({ skip: 1, take: 2, order: { StartDate: "ASC" } })', async () => {
    const eventItemsRepository = new Repository<EventItem, string>(EventItem, entityManager);

    await eventItemsRepository.add(sampleMultipleEventItems[0]);
    await eventItemsRepository.add(sampleMultipleEventItems[1]);
    await eventItemsRepository.add(sampleMultipleEventItems[2]);

    const queryResults = await eventItemsRepository.getPaginatedItems({ skip: 1, take: 2, order: { StartDate: 'ASC' } });

    expect(queryResults.skip).toBe(1);
    expect(queryResults.take).toBe(2);
    expect(queryResults.totalItems).toBe(3);
    expect(queryResults.items.length).toBe(2);
    expect(queryResults.items[0].Title).toBe(sampleMultipleEventItems[1].Title);
    expect(queryResults.items[1].Title).toBe(sampleMultipleEventItems[2].Title);
  });

  test('getPaginatedItems({ skip: 1, take: 2, order: { StartDate: "DESC" } })', async () => {
    const eventItemsRepository = new Repository<EventItem, string>(EventItem, entityManager);

    await eventItemsRepository.add(sampleMultipleEventItems[0]);
    await eventItemsRepository.add(sampleMultipleEventItems[1]);
    await eventItemsRepository.add(sampleMultipleEventItems[2]);

    const queryResults = await eventItemsRepository.getPaginatedItems({ skip: 1, take: 2, order: { StartDate: 'DESC' } });

    expect(queryResults.skip).toBe(1);
    expect(queryResults.take).toBe(2);
    expect(queryResults.totalItems).toBe(3);
    expect(queryResults.items.length).toBe(2);
    expect(queryResults.items[0].Title).toBe(sampleMultipleEventItems[1].Title);
    expect(queryResults.items[1].Title).toBe(sampleMultipleEventItems[0].Title);
  });

  test('getPaginatedItems() with single searchText and single searchField', async () => {
    const eventItemsRepository = new Repository<EventItem, string>(EventItem, entityManager);

    await eventItemsRepository.add(sampleMultipleEventItems[0]);
    await eventItemsRepository.add(sampleMultipleEventItems[1]);
    await eventItemsRepository.add(sampleMultipleEventItems[2]);

    const queryResults = await eventItemsRepository.getPaginatedItems({ searchText: 'Title', searchFields: ['Title'] });

    expect(queryResults.totalItems).toBe(2);
    expect(queryResults.items.length).toBe(2);
    expect(queryResults.items[0].Title).toBe(sampleMultipleEventItems[0].Title);
    expect(queryResults.items[1].Title).toBe(sampleMultipleEventItems[1].Title);
  });

  test('getPaginatedItems() with single searchText and multiple searchFields', async () => {
    const eventItemsRepository = new Repository<EventItem, string>(EventItem, entityManager);

    await eventItemsRepository.add(sampleMultipleEventItems[0]);
    await eventItemsRepository.add(sampleMultipleEventItems[1]);
    await eventItemsRepository.add(sampleMultipleEventItems[2]);

    const searchFields = ['Title', 'Summary'] as Array<keyof SearchableEntityProperties<EventItem>>;
    const queryResults = await eventItemsRepository.getPaginatedItems({ searchText: 'Temp', searchFields });

    expect(queryResults.totalItems).toBe(2);
    expect(queryResults.items.length).toBe(2);
    expect(queryResults.items[0].Title).toBe(sampleMultipleEventItems[1].Title);
    expect(queryResults.items[1].Title).toBe(sampleMultipleEventItems[2].Title);
  });

  test('getPaginatedItems() with multiple searchText and multiple searchFields', async () => {
    const eventItemsRepository = new Repository<EventItem, string>(EventItem, entityManager);

    await eventItemsRepository.add(sampleMultipleEventItems[0]);
    await eventItemsRepository.add(sampleMultipleEventItems[1]);
    await eventItemsRepository.add(sampleMultipleEventItems[2]);

    const searchFields = ['Title', 'Summary'] as Array<keyof SearchableEntityProperties<EventItem>>;
    const queryResults = await eventItemsRepository.getPaginatedItems({ searchText: 'Title Temp', searchFields });

    expect(queryResults.totalItems).toBe(3);
    expect(queryResults.items.length).toBe(3);
    expect(queryResults.items[0].Title).toBe(sampleMultipleEventItems[0].Title);
  });

  test('getPaginatedItems({ skip: 1, take: 1, order: { StartDate: "ASC" }}) with multiple searchText and multiple searchFields', async () => {
    const eventItemsRepository = new Repository<EventItem, string>(EventItem, entityManager);

    await eventItemsRepository.add(sampleMultipleEventItems[0]);
    await eventItemsRepository.add(sampleMultipleEventItems[1]);
    await eventItemsRepository.add(sampleMultipleEventItems[2]);

    const searchFields = ['Title', 'Summary'] as Array<keyof SearchableEntityProperties<EventItem>>;
    const queryResults = await eventItemsRepository.getPaginatedItems({
      skip: 2,
      take: 1,
      order: {
        StartDate: 'DESC'
      },
      searchText: 'Title Temp',
      searchFields
    });

    expect(queryResults.totalItems).toBe(3);
    expect(queryResults.items.length).toBe(1);
    expect(queryResults.items[0].Title).toBe(sampleMultipleEventItems[0].Title);
  });
});
