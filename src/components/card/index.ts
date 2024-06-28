import InternalCard from './Card';
import Meta from './Meta';

export type { CardProps } from './Card';
export type { CardMetaProps } from './Meta';

type InternalCardType = typeof InternalCard;

export interface CardInterface extends InternalCardType {
  Meta: typeof Meta;
}

const Card = InternalCard as CardInterface;

Card.Meta = Meta;

if (process.env.NODE_ENV !== 'production') {
  Card.displayName = 'Card';
}

export default Card;
