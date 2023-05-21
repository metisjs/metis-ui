import * as MetaIcons from '@metaoa/icons';
import groupBy from 'lodash/groupBy';

const all = Object.keys(MetaIcons)
  .map((n) => n.replace(/(Outline|Solid)$/, ''))
  .filter((n, i, arr) => arr.indexOf(n) === i);

export default groupBy(Object.keys(MetaIcons), (item) =>
  item.endsWith('Outline') ? 'Outline' : 'Solid',
);
