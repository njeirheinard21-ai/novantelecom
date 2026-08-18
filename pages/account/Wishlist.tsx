import { useTranslation } from 'react-i18next';
import { LocalizedLink as Link } from '../../components/ui/LocalizedLink';
import { Heart } from 'lucide-react';

export default function Wishlist() {
  const { t } = useTranslation(['common']);
  return (
    <div className="space-y-8 max-w-4xl">
      <h2 className="text-2xl font-semibold tracking-tight">{t('wishlist', { ns: 'common' })}</h2>

      <div className="text-center py-20 border border-dashed border-border/50 rounded-[2rem] bg-canvas">
        <Heart className="w-12 h-12 text-border mx-auto mb-4" />
        <p className="text-fg-muted font-medium mb-2">{t('wishlist_empty', { ns: 'account' })}</p>
        <p className="text-sm text-fg-muted mb-8">{t('save_items_love', { ns: 'account' })}</p>
        <Link to="/" className="inline-flex items-center justify-center rounded-full bg-accent text-white px-8 py-3 text-sm font-medium hover:bg-accent/90 transition-colors">
          Explore Products
        </Link>
      </div>
    </div>
  );
}
