import { useTranslation } from 'react-i18next';
import { useLocalizedNavigate as useNavigate } from '../../hooks/useLocalizedNavigate';
import { LocalizedLink as Link } from '../../components/ui/LocalizedLink';
import { useState } from 'react';
import { registerWithEmail } from '../../lib/auth';
import { userRepository } from '../../data';
import { AuthLayout } from './AuthLayout';
import { ArrowRight } from 'lucide-react';

export default function Register() {
  const { t } = useTranslation(['auth']);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const userCredential = await registerWithEmail(email, password);
      // Create user profile
      await userRepository.createProfile(userCredential.user.uid, email);
      await userRepository.updateProfile(userCredential.user.uid, {
        firstName,
        lastName,
      } as any);
      
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Failed to create account.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout 
      title="Create your account" 
      subtitle="One account is all you need to access Novan Telecom services."
      image="https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?q=80&w=2000&auto=format&fit=crop"
    >
      {error && (
        <div className="bg-red-50 text-red-500 p-4 rounded-xl mb-6 text-sm font-medium border border-red-100">
          {error}
        </div>
      )}
      
      <form onSubmit={handleRegister} className="space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium mb-2 text-fg-muted">{t('first_name', { ns: 'auth' })}</label>
            <input 
              id="firstName" 
              type="text" 
              value={firstName} 
              onChange={e => setFirstName(e.target.value)} 
              className="w-full rounded-xl border border-border/50 bg-canvas-secondary p-3.5 outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-all"
              required 
            />
          </div>
          <div>
            <label htmlFor="lastName" className="block text-sm font-medium mb-2 text-fg-muted">{t('last_name', { ns: 'auth' })}</label>
            <input 
              id="lastName" 
              type="text" 
              value={lastName} 
              onChange={e => setLastName(e.target.value)} 
              className="w-full rounded-xl border border-border/50 bg-canvas-secondary p-3.5 outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-all"
              required 
            />
          </div>
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-2 text-fg-muted">{t('email', { ns: 'auth' })}</label>
          <input 
            id="email" 
            type="email" 
            value={email} 
            onChange={e => setEmail(e.target.value)} 
            className="w-full rounded-xl border border-border/50 bg-canvas-secondary p-3.5 outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-all"
            required 
            placeholder="name@example.com"
          />
        </div>
        
        <div>
          <label htmlFor="password" className="block text-sm font-medium mb-2 text-fg-muted">{t('password', { ns: 'auth' })}</label>
          <input 
            id="password" 
            type="password" 
            value={password} 
            onChange={e => setPassword(e.target.value)} 
            className="w-full rounded-xl border border-border/50 bg-canvas-secondary p-3.5 outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-all"
            required 
            placeholder="••••••••"
            minLength={6}
          />
          <p className="text-xs text-fg-muted mt-2">{t('password_min_chars', { ns: 'auth' })}</p>
        </div>
        
        <button 
          type="submit" 
          disabled={loading}
          className="w-full bg-accent text-white rounded-xl py-3.5 font-medium hover:bg-accent/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-70 mt-6"
        >
          {loading ? 'Creating...' : 'Continue'}
          {!loading && <ArrowRight className="w-4 h-4" />}
        </button>
      </form>
      
      <div className="mt-10 text-center text-sm text-fg-muted">
        Already have an account?{' '}
        <Link to="/login" className="text-accent font-medium hover:underline">
          Sign in.
        </Link>
      </div>
    </AuthLayout>
  );
}
