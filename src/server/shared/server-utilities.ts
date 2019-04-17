import moment from 'moment';
import { EntityManager, getManager, ObjectType } from 'typeorm';

import logger from './logger';

interface Timer {
  label: string;
  timestamp: moment.Moment;
}

const ServerUtilities = {
  startTimer: (label: string, disableLogging?: boolean) => {
    const result: Timer = {
      label,
      timestamp: moment()
    };

    if (!disableLogging) {
      logger.debug(`${label}: Operation started.`);
    }

    return result;
  },
  stopTimer: (timer: Timer, disableLogging?: boolean) => {
    const duration = moment.duration(moment().diff(timer.timestamp));

    if (!disableLogging) {
      logger.debug(`${timer.label}: The operation took ${duration.asMilliseconds().toLocaleString()} ms.`);
    }

    return duration;
  },
  createEntity: <TEntity>(type: ObjectType<TEntity>, obj: any, manager?: EntityManager) => {
    const entityManager = manager ? manager : getManager();
    const result = entityManager.create<TEntity>(type, obj);

    return result;
  }
};

export default ServerUtilities;
