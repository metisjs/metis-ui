import * as MetisIcons from '@metisjs/icons';
import groupBy from 'lodash/groupBy';

const all = Object.keys(MetisIcons)
  .map((n) => n.replace(/(Outline|Solid)$/, ''))
  .filter((n, i, arr) => arr.indexOf(n) === i);

export default groupBy(Object.keys(MetisIcons), (item) =>
  item.endsWith('Outline') ? 'Outline' : 'Solid',
);
