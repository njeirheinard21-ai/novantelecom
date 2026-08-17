import { Link as RouterLink, LinkProps } from 'react-router';
import { useTranslation } from 'react-i18next';

export function LocalizedLink(props: LinkProps) {
  const { i18n } = useTranslation();
  let to = props.to;
  if (typeof to === 'string' && to.startsWith('/')) {
    const lang = i18n.language?.split('-')[0] || 'en';
    to = `/${lang}${to === '/' ? '' : to}`;
  }
  return <RouterLink {...props} to={to} />;
}
