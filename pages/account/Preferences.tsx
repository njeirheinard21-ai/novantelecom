import { useTranslation } from 'react-i18next';

import { useState, useEffect } from 'react';
import { useAuthStore } from '../../store/authStore';
import { Check } from 'lucide-react';
import { db } from '../../lib/firebase';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';

export default function Preferences() {
  const { t } = useTranslation(['account', 'common']);

  const user = useAuthStore(state => state.user);
  
  const [marketing, setMarketing] = useState(true);
  const [orderUpdates, setOrderUpdates] = useState(true);
  const [language, setLanguage] = useState('en');
  
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPrefs = async () => {
      if (!user) return;
      try {
        const docSnap = await getDoc(doc(db, 'users', user.uid));
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data.preferences) {
            setMarketing(data.preferences.marketing ?? true);
            setOrderUpdates(data.preferences.orderUpdates ?? true);
            setLanguage(data.preferences.language ?? 'en');
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPrefs();
  }, [user]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    try {
      await updateDoc(doc(db, 'users', user.uid), {
        preferences: {
          marketing,
          orderUpdates,
          language
        }
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="animate-pulse h-64 bg-canvas border border-border/50 rounded-[2rem]"></div>;

  return (
    <div className="space-y-8 max-w-2xl">
      <h2 className="text-2xl font-semibold tracking-tight">{t('preferences', { ns: 'account' })}</h2>

      <div className="bg-canvas border border-border/50 rounded-[2rem] p-6 sm:p-10 shadow-sm">
        <form onSubmit={handleSave} className="space-y-8">
          
          {saved && (
            <div className="p-4 bg-green-50 text-green-600 rounded-xl text-sm flex items-center">
              <Check className="w-4 h-4 mr-2" /> Preferences saved successfully.
            </div>
          )}

          <div>
            <h3 className="text-lg font-semibold mb-4">Language & Region</h3>
            <div data-for="language" className="block text-sm font-medium mb-2 text-fg-muted">{t('preferred_language', { ns: 'account' })}</div>
            <select 
              id="language"
              value={language}
              onChange={e => setLanguage(e.target.value)}
              className="w-full md:w-1/2 rounded-xl border border-border/50 bg-canvas-secondary p-3 outline-none focus:ring-2 focus:ring-accent transition-shadow appearance-none"
            >
              <option value="en">English</option>
              <option value="fr">Français</option>
            </select>
          </div>

          <hr className="border-border/50" />

          <div>
            <h3 className="text-lg font-semibold mb-4">{t('communications', { ns: 'account' })}</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={orderUpdates}
                  onChange={e => setOrderUpdates(e.target.checked)}
                  className="mt-1 w-4 h-4 text-accent border-border rounded focus:ring-accent"
                />
                <div>
                  <p className="font-medium">{t('order_updates', { ns: 'account' })}</p>
                  <p className="text-sm text-fg-muted">{t('receive_email_notifications', { ns: 'account' })}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={marketing}
                  onChange={e => setMarketing(e.target.checked)}
                  className="mt-1 w-4 h-4 text-accent border-border rounded focus:ring-accent"
                />
                <div>
                  <p className="font-medium">Announcements & Offers</p>
                  <p className="text-sm text-fg-muted">Receive exclusive offers, product announcements, and Apple Store news.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4">
            <button 
              type="submit" 
              className="rounded-full bg-accent text-white px-8 py-3 text-sm font-medium hover:bg-accent/90 transition-colors"
            >
              Save Preferences
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
