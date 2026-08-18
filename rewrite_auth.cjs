const fs = require('fs');

const loginCode = `import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router';
import { loginWithEmail, loginWithGoogle } from '../../lib/auth';
import { Container } from '../../components/ui/Container';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  
  const from = location.state?.from?.pathname || '/';

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await loginWithEmail(email, password);
      navigate(from, { replace: true });
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleGoogle = async () => {
    try {
      await loginWithGoogle();
      navigate(from, { replace: true });
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <Container className="py-24 max-w-md mx-auto">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-semibold tracking-tight mb-2">Sign in to your account.</h1>
        <p className="text-fg-muted">Enter your details to proceed.</p>
      </div>

      {error && <div className="bg-red-50 text-red-500 p-4 rounded-2xl mb-6 text-sm">{error}</div>}
      
      <div className="bg-canvas border border-border/50 rounded-[2rem] p-8 shadow-sm">
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-2 text-fg-muted">Apple ID (Email)</label>
            <input 
              id="email" 
              type="email" 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              className="w-full rounded-xl border border-border/50 bg-canvas-secondary p-3 outline-none focus:ring-2 focus:ring-accent transition-shadow" 
              required 
            />
          </div>
          <div>
            <div className="flex justify-between items-center mb-2">
              <label htmlFor="password" className="block text-sm font-medium text-fg-muted">Password</label>
              <Link to="/reset-password" className="text-sm text-accent hover:underline">
                Forgot password?
              </Link>
            </div>
            <input 
              id="password" 
              type="password" 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              className="w-full rounded-xl border border-border/50 bg-canvas-secondary p-3 outline-none focus:ring-2 focus:ring-accent transition-shadow" 
              required 
            />
          </div>
          <button type="submit" className="w-full bg-accent text-white rounded-full py-3 font-medium hover:bg-accent/90 transition-colors">
            Sign In
          </button>
        </form>
        
        <div className="mt-8 flex items-center justify-between">
          <hr className="w-full border-border/50" />
          <span className="px-3 text-xs text-fg-muted font-medium uppercase tracking-wider">Or</span>
          <hr className="w-full border-border/50" />
        </div>

        <div className="mt-8">
          <button 
            type="button" 
            onClick={handleGoogle} 
            className="w-full border border-border/50 rounded-full py-3 font-medium hover:bg-canvas-secondary transition-colors"
          >
            Continue with Google
          </button>
        </div>
      </div>
      
      <div className="mt-8 text-center text-sm text-fg-muted">
        Don't have an Apple ID? <Link to="/register" className="text-accent hover:underline">Create yours now.</Link>
      </div>
    </Container>
  );
}
`;

const registerCode = `import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { registerWithEmail, sendVerification } from '../../lib/auth';
import { userRepository } from '../../data';
import { Container } from '../../components/ui/Container';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const userCredential = await registerWithEmail(email, password);
      await userRepository.createProfile(userCredential.user.uid, email);
      await sendVerification(userCredential.user);
      navigate('/');
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <Container className="py-24 max-w-md mx-auto">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-semibold tracking-tight mb-2">Create your Apple ID.</h1>
        <p className="text-fg-muted">One Apple ID is all you need to access all Apple services.</p>
      </div>

      {error && <div className="bg-red-50 text-red-500 p-4 rounded-2xl mb-6 text-sm">{error}</div>}
      
      <div className="bg-canvas border border-border/50 rounded-[2rem] p-8 shadow-sm">
        <form onSubmit={handleRegister} className="space-y-5">
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-2 text-fg-muted">Email</label>
            <input 
              id="email" 
              type="email" 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              className="w-full rounded-xl border border-border/50 bg-canvas-secondary p-3 outline-none focus:ring-2 focus:ring-accent transition-shadow" 
              required 
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-2 text-fg-muted">Password</label>
            <input 
              id="password" 
              type="password" 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              className="w-full rounded-xl border border-border/50 bg-canvas-secondary p-3 outline-none focus:ring-2 focus:ring-accent transition-shadow" 
              required 
            />
          </div>
          <button type="submit" className="w-full bg-accent text-white rounded-full py-3 font-medium hover:bg-accent/90 transition-colors mt-2">
            Continue
          </button>
        </form>
      </div>
      
      <div className="mt-8 text-center text-sm text-fg-muted">
        Already have an Apple ID? <Link to="/login" className="text-accent hover:underline">Sign in.</Link>
      </div>
    </Container>
  );
}
`;

fs.writeFileSync('src/pages/auth/Login.tsx', loginCode);
fs.writeFileSync('src/pages/auth/Register.tsx', registerCode);
