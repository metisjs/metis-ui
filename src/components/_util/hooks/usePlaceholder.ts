import { useLocale } from '../../locale';

export default function usePlaceholder<T>(type: 'select' | 'input', placeholder?: T) {
  const [locale] = useLocale('global');
  return placeholder ?? (type === 'input' ? locale.inputPlaceholder : locale.selectPlaceholder);
}
