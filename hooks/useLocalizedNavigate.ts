import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';

export function useLocalizedNavigate() {
  const navigate = useNavigate();
  const { i18n } = useTranslation();

  return (to: string | number, options?: any) => {
    if (typeof to === 'string' && to.startsWith('/')) {
      const lang = i18n.language?.split('-')[0] || 'en';
      to = `/${lang}${to === '/' ? '' : to}`;
      navigate(to, options);
    } else if (typeof to === 'number') {
      navigate(to as any);
    } else {
      navigate(to, options);
    }
  };
}
