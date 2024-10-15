import type { CountdownProps } from './Countdown';
import Countdown from './Countdown';
import Group from './Group';
import type { StatisticProps } from './Statistic';
import Statistic from './Statistic';

export type { CountdownProps, StatisticProps };

type CompoundedComponent = {
  Countdown: typeof Countdown;
  Group: typeof Group;
};

export type CompoundedStatistic = typeof Statistic & CompoundedComponent;

(Statistic as CompoundedStatistic).Countdown = Countdown;
(Statistic as CompoundedStatistic).Group = Group;

export default Statistic as CompoundedStatistic;
