import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router';
import { loginWithEmail, loginWithGoogle } from '../../lib/auth';
import { AuthLayout } from './AuthLayout';
import { Apple, ArrowRight } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  
  const from = location.state?.from?.pathname || '/';

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await loginWithEmail(email, password);
      navigate(from, { replace: true });
    } catch (err: any) {
      setError(err.message || 'Failed to sign in.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    try {
      await loginWithGoogle();
      navigate(from, { replace: true });
    } catch (err: any) {
      setError(err.message || 'Google sign in failed.');
    }
  };

  return (
    <AuthLayout 
      title="Sign in to your account" 
      subtitle="Enter your details to proceed and access your Apple experience."
      image="https://images.unsplash.com/photo-1491933382434-500287f9b54b?q=80&w=2000&auto=format&fit=crop"
    >
      {error && (
        <div className="bg-red-50 text-red-500 p-4 rounded-xl mb-6 text-sm font-medium border border-red-100">
          {error}
        </div>
      )}
      
      <form onSubmit={handleLogin} className="space-y-5">
        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-2 text-fg-muted">Apple ID (Email)</label>
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
          <div className="flex justify-between items-center mb-2">
            <label htmlFor="password" className="block text-sm font-medium text-fg-muted">Password</label>
            <Link to="/reset-password" className="text-sm text-accent font-medium hover:underline">
              Forgot password?
            </Link>
          </div>
          <input 
            id="password" 
            type="password" 
            value={password} 
            onChange={e => setPassword(e.target.value)} 
            className="w-full rounded-xl border border-border/50 bg-canvas-secondary p-3.5 outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-all"
            required 
            placeholder="••••••••"
          />
        </div>
        
        <button 
          type="submit" 
          disabled={loading}
          className="w-full bg-accent text-white rounded-xl py-3.5 font-medium hover:bg-accent/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-70 mt-4"
        >
          {loading ? 'Signing in...' : 'Sign In'}
          {!loading && <ArrowRight className="w-4 h-4" />}
        </button>
      </form>
      
      <div className="mt-8 flex items-center justify-between">
        <hr className="w-full border-border/50" />
        <span className="px-4 text-xs text-fg-muted font-medium uppercase tracking-wider bg-canvas">Continue with</span>
        <hr className="w-full border-border/50" />
      </div>
      
      <div className="mt-8">
        <button 
          type="button" 
          onClick={handleGoogle} 
          className="w-full border border-border/50 bg-canvas rounded-xl py-3.5 font-medium hover:bg-canvas-secondary transition-colors flex items-center justify-center gap-3"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
          </svg>
          Google
        </button>
      </div>
      
      <div className="mt-10 text-center text-sm text-fg-muted">
        Don't have an Apple ID?{' '}
        <Link to="/register" className="text-accent font-medium hover:underline">
          Create yours now.
        </Link>
      </div>
    </AuthLayout>
  );
}
