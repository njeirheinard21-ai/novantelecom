const fs = require('fs');

const code = `import { useState } from 'react';
import { Link } from 'react-router';
import { resetPassword } from '../../lib/auth';
import { Container } from '../../components/ui/Container';

export default function ResetPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  
  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await resetPassword(email);
      setMessage('Password reset email sent. Check your inbox.');
      setError('');
    } catch (err: any) {
      setError(err.message);
      setMessage('');
    }
  };

  return (
    <Container className="py-24 max-w-md mx-auto">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-semibold tracking-tight mb-2">Reset Password</h1>
        <p className="text-fg-muted">Enter your Apple ID to reset your password.</p>
      </div>

      {error && <div className="bg-red-50 text-red-500 p-4 rounded-2xl mb-6 text-sm">{error}</div>}
      {message && <div className="bg-emerald-50 text-emerald-600 p-4 rounded-2xl mb-6 text-sm">{message}</div>}
      
      <div className="bg-canvas border border-border/50 rounded-[2rem] p-8 shadow-sm">
        <form onSubmit={handleReset} className="space-y-5">
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-2 text-fg-muted">Apple ID</label>
            <input 
              id="email" 
              type="email" 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              className="w-full rounded-xl border border-border/50 bg-canvas-secondary p-3 outline-none focus:ring-2 focus:ring-accent transition-shadow" 
              required 
            />
          </div>
          <button type="submit" className="w-full bg-accent text-white rounded-full py-3 font-medium hover:bg-accent/90 transition-colors mt-2">
            Send Reset Link
          </button>
        </form>
      </div>
      
      <div className="mt-8 text-center text-sm text-fg-muted">
        <Link to="/login" className="text-accent hover:underline">Return to Sign In</Link>
      </div>
    </Container>
  );
}
`;

fs.writeFileSync('src/pages/auth/ResetPassword.tsx', code);
