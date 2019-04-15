import { EntityManager } from 'typeorm';
import faker from 'faker';
import moment from 'moment';

import DatabaseMetadata from '../../entities/database-metadata';
import logger from '../../shared/logger';
import EventItem from '../../entities/event-item';
import EventRegistration from '../../entities/event-registration';

const seeder1 = async (entityManager: EntityManager, databaseMetadata: DatabaseMetadata) => {
  if (databaseMetadata.Version >= 1) {
    return databaseMetadata;
  }

  logger.info('Seeding database [1].');

  const earliestStartDate = moment().add(1, 'week');
  const latestStartDate = moment().add(1, 'week').add(1, 'year');

  const events = [];
  for (let i = 0; i < 20; i++) {
    const data = faker.helpers.contextualCard();

    const event = new EventItem();
    event.StartDate = faker.date.between(earliestStartDate.toDate(), latestStartDate.toDate());

    const hasEndDate = Math.random() >= 0.5;
    if (hasEndDate) {
      const eventDuration = Math.floor(30 * Math.random()) + 1;
      event.EndDate = faker.date.between(
        event.StartDate,
        moment(event.StartDate)
          .add(eventDuration, 'days')
          .toDate()
      );
    }

    event.Title = faker.lorem.sentence();
    event.Summary = faker.lorem.sentences();
    event.Body = faker.lorem.paragraphs();
    event.Address = faker.address.streetAddress() + ', ' + faker.address.city() + ', ' + faker.address.state() + ', ' + faker.address.country();
    event.Latitude = parseFloat(data.address.geo.lat);
    event.Longitude = parseFloat(data.address.geo.lng);

    const hasRegistrations = Math.random() >= 0.25;
    if (hasRegistrations) {
      const registrationsCount = Math.floor(9 * Math.random()) + 1;
      event.EventRegistrations = [];

      for (let registrationIndex = 0; registrationIndex < registrationsCount; registrationIndex++) {
        const userData = faker.helpers.contextualCard();

        const eventRegistration = new EventRegistration();
        eventRegistration.EmailAddress = userData.email;
        eventRegistration.PhoneNumber = userData.phone;
        eventRegistration.EventItem = event;

        event.EventRegistrations.push(eventRegistration);
      }
    }
    events.push(event);
  }

  for (const event of events) {
    await entityManager.save(event);
  }


  databaseMetadata.Version = 1;

  return databaseMetadata;
};

export default seeder1;
