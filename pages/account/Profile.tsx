import { useState, useEffect } from 'react';
import { useAuthStore } from '../../store/authStore';
import { userRepository } from '../../data';

export default function Profile() {
  const user = useAuthStore(state => state.user);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (user?.uid) {
        try {
          const prof = await userRepository.getProfile(user.uid);
          if (prof) {
            setFirstName(prof.firstName || '');
            setLastName(prof.lastName || '');
            setPhone((prof as any).phone || '');
          }
        } catch (err) {
          console.error(err);
        }
      }
    };
    fetchProfile();
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setLoading(true);
    setError(null);
    setSuccess(false);
    
    try {
      await userRepository.updateProfile(user.uid, {
        firstName,
        lastName,
        phone
      } as any);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-2xl">
      <h2 className="text-2xl font-semibold tracking-tight">Profile</h2>

      <div className="bg-canvas border border-border/50 rounded-[2rem] p-6 sm:p-10 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {error && <div className="p-4 bg-red-50 text-red-500 rounded-xl text-sm">{error}</div>}
          {success && <div className="p-4 bg-green-50 text-green-600 rounded-xl text-sm">Profile updated successfully.</div>}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium mb-2 text-fg-muted">First Name</label>
              <input 
                id="firstName"
                type="text" 
                value={firstName}
                onChange={e => setFirstName(e.target.value)}
                className="w-full rounded-xl border border-border/50 bg-canvas-secondary p-3 outline-none focus:ring-2 focus:ring-accent transition-shadow" 
              />
            </div>
            <div>
              <label htmlFor="lastName" className="block text-sm font-medium mb-2 text-fg-muted">Last Name</label>
              <input 
                id="lastName"
                type="text" 
                value={lastName}
                onChange={e => setLastName(e.target.value)}
                className="w-full rounded-xl border border-border/50 bg-canvas-secondary p-3 outline-none focus:ring-2 focus:ring-accent transition-shadow" 
              />
            </div>
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-2 text-fg-muted">Email Address</label>
            <input 
              id="email"
              type="email" 
              value={user?.email || ''}
              disabled
              className="w-full rounded-xl border border-border/50 bg-canvas-secondary/50 p-3 text-fg-muted cursor-not-allowed" 
            />
            <p className="text-xs text-fg-muted mt-2">Email address cannot be changed directly.</p>
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium mb-2 text-fg-muted">Phone Number</label>
            <input 
              id="phone"
              type="tel" 
              value={phone}
              onChange={e => setPhone(e.target.value)}
              className="w-full rounded-xl border border-border/50 bg-canvas-secondary p-3 outline-none focus:ring-2 focus:ring-accent transition-shadow" 
            />
          </div>

          <div className="pt-4">
            <button 
              type="submit" 
              disabled={loading}
              className="rounded-full bg-accent text-white px-8 py-3 text-sm font-medium hover:bg-accent/90 transition-colors disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
