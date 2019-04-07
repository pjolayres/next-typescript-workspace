import moment from 'moment';

import logger from './logger';

interface Timer {
  label: string;
  timestamp: moment.Moment;
}

const Utilities = {
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
  }
};

export default Utilities;
