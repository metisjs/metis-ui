import * as MetisIcons from '@metisjs/icons';
import groupBy from 'lodash/groupBy';

export default groupBy(Object.keys(MetisIcons), (item) =>
  item.endsWith('Outline') ? 'Outline' : 'Solid',
);
