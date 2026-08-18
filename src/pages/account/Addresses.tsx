import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';
import { useAuthStore } from '../../store/authStore';
import { db } from '../../lib/firebase';
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { MapPin, Plus, Trash2, Edit2, X } from 'lucide-react';

export default function Addresses() {
  const { t } = useTranslation(['checkout', 'common']);
  const user = useAuthStore(state => state.user);
  const [addresses, setAddresses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    fullName: '', phone: '', street: '', city: 'Douala', postalCode: '', country: 'Cameroon', isDefault: false
  });

  const cities = ['Douala', 'Yaoundé', 'Bafoussam', 'Bamenda', 'Limbe', 'Garoua', 'Maroua'];

  const fetchAddresses = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const snap = await getDocs(collection(db, 'users', user.uid, 'addresses'));
      const adds = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setAddresses(adds);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    try {
      if (formData.isDefault) {
        // Remove default from others
        const currentDefaults = addresses.filter(a => a.isDefault);
        for (const a of currentDefaults) {
          if (a.id !== editingId) {
            await updateDoc(doc(db, 'users', user.uid, 'addresses', a.id), { isDefault: false });
          }
        }
      }

      if (editingId) {
        await updateDoc(doc(db, 'users', user.uid, 'addresses', editingId), formData);
      } else {
        await addDoc(collection(db, 'users', user.uid, 'addresses'), formData);
      }
      
      setShowForm(false);
      setEditingId(null);
      setFormData({ fullName: '', phone: '', street: '', city: 'Douala', postalCode: '', country: 'Cameroon', isDefault: false });
      fetchAddresses();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!user || !confirm('Are you sure you want to delete this address?')) return;
    try {
      await deleteDoc(doc(db, 'users', user.uid, 'addresses', id));
      fetchAddresses();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (address: any) => {
    setFormData({
      fullName: address.fullName,
      phone: address.phone,
      street: address.street,
      city: address.city,
      postalCode: address.postalCode || '',
      country: address.country || 'Cameroon',
      isDefault: address.isDefault || false
    });
    setEditingId(address.id);
    setShowForm(true);
  };

  return (
    <div className="space-y-8 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-2xl font-semibold tracking-tight">Saved Addresses</h2>
        {!showForm && (
          <button 
            onClick={() => setShowForm(true)}
            className="inline-flex items-center justify-center rounded-full bg-canvas-secondary border border-border/50 px-6 py-2.5 text-sm font-medium hover:bg-border/50 transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" /> Add Address
          </button>
        )}
      </div>

      {showForm && (
        <div className="bg-canvas border border-border/50 rounded-[2rem] p-6 sm:p-8 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold">{editingId ? 'Edit Address' : 'New Address'}</h3>
            <button onClick={() => { setShowForm(false); setEditingId(null); }} className="p-2 hover:bg-canvas-secondary rounded-full text-fg-muted">
              <X className="w-5 h-5" />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="block text-sm font-medium mb-2 text-fg-muted">{t('full_name', { ns: 'checkout' })}</div>
                <input required type="text" value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} className="w-full rounded-xl border border-border/50 bg-canvas-secondary p-3 outline-none focus:ring-2 focus:ring-accent" />
              </div>
              <div>
                <div className="block text-sm font-medium mb-2 text-fg-muted">{t('phone', { ns: 'checkout' })}</div>
                <input required type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full rounded-xl border border-border/50 bg-canvas-secondary p-3 outline-none focus:ring-2 focus:ring-accent" />
              </div>
              <div className="md:col-span-2">
                <div className="block text-sm font-medium mb-2 text-fg-muted">{t('street_address', { ns: 'checkout' })}</div>
                <input required type="text" value={formData.street} onChange={e => setFormData({...formData, street: e.target.value})} className="w-full rounded-xl border border-border/50 bg-canvas-secondary p-3 outline-none focus:ring-2 focus:ring-accent" />
              </div>
              <div>
                <div className="block text-sm font-medium mb-2 text-fg-muted">{t('city', { ns: 'checkout' })}</div>
                <select value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} className="w-full rounded-xl border border-border/50 bg-canvas-secondary p-3 outline-none focus:ring-2 focus:ring-accent appearance-none">
                  {cities.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <div className="block text-sm font-medium mb-2 text-fg-muted">Postal Code (Optional)</div>
                <input type="text" value={formData.postalCode} onChange={e => setFormData({...formData, postalCode: e.target.value})} className="w-full rounded-xl border border-border/50 bg-canvas-secondary p-3 outline-none focus:ring-2 focus:ring-accent" />
              </div>
            </div>
            <div className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" checked={formData.isDefault} onChange={e => setFormData({...formData, isDefault: e.target.checked})} className="w-4 h-4 text-accent border-border rounded focus:ring-accent" />
              <span className="text-sm font-medium">Set as default address</span>
            </div>
            <div className="pt-4 flex gap-4">
              <button type="submit" className="rounded-full bg-accent text-white px-8 py-3 text-sm font-medium hover:bg-accent/90 transition-colors">
                Save Address
              </button>
              <button type="button" onClick={() => { setShowForm(false); setEditingId(null); }} className="rounded-full bg-transparent border border-border/50 text-fg px-8 py-3 text-sm font-medium hover:bg-canvas-secondary transition-colors">{t('cancel', { ns: 'common' })}</button>
            </div>
          </form>
        </div>
      )}

      {loading && !showForm ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2].map(i => <div key={i} className="h-48 bg-canvas border border-border/50 rounded-2xl animate-pulse"></div>)}
        </div>
      ) : !showForm && addresses.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-border/50 rounded-[2rem] bg-canvas">
          <MapPin className="w-12 h-12 text-border mx-auto mb-4" />
          <p className="text-fg-muted font-medium mb-2">You haven't saved an address yet.</p>
          <button onClick={() => setShowForm(true)} className="mt-4 inline-flex items-center justify-center rounded-full bg-accent text-white px-6 py-2.5 text-sm font-medium hover:bg-accent/90 transition-colors">
            Add Address
          </button>
        </div>
      ) : !showForm && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {addresses.map(address => (
            <div key={address.id} className="relative bg-canvas border border-border/50 rounded-2xl p-6 shadow-sm flex flex-col hover:border-border transition-colors">
              {address.isDefault && (
                <span className="absolute top-6 right-6 px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-canvas-secondary text-fg-muted">
                  Default
                </span>
              )}
              <h3 className="font-semibold text-lg mb-4 pr-16">{address.fullName}</h3>
              <div className="text-sm text-fg-muted space-y-1 mb-6 flex-1">
                <p>{address.street}</p>
                <p>{address.city}{address.postalCode ? `, ${address.postalCode}` : ''}</p>
                <p>{address.country}</p>
                <p className="pt-2">{address.phone}</p>
              </div>
              <div className="flex gap-4 border-t border-border/50 pt-4">
                <button onClick={() => handleEdit(address)} className="text-sm font-medium text-fg hover:text-accent flex items-center">
                  <Edit2 className="w-4 h-4 mr-1.5" />{t('edit', { ns: 'common' })}</button>
                <button onClick={() => handleDelete(address.id)} className="text-sm font-medium text-red-500 hover:text-red-600 flex items-center">
                  <Trash2 className="w-4 h-4 mr-1.5" />{t('delete', { ns: 'common' })}</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
