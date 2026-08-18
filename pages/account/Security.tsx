import { useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import { auth, resetPassword } from '../../lib/auth';
import { updatePassword } from 'firebase/auth';

export default function Security() {
  const user = useAuthStore(state => state.user);
  
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await updatePassword(user, newPassword);
      setSuccess("Password updated successfully.");
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      if (err.code === 'auth/requires-recent-login') {
        setError("This operation is sensitive and requires recent authentication. Please log out and log back in.");
      } else {
        setError(err.message || 'Failed to update password');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-2xl">
      <h2 className="text-2xl font-semibold tracking-tight">Security</h2>

      {/* Change Password */}
      <div className="bg-canvas border border-border/50 rounded-[2rem] p-6 sm:p-10 shadow-sm">
        <h3 className="text-xl font-semibold mb-6">Change Password</h3>
        
        <form onSubmit={handleUpdatePassword} className="space-y-6">
          {error && <div className="p-4 bg-red-50 text-red-500 rounded-xl text-sm">{error}</div>}
          {success && <div className="p-4 bg-green-50 text-green-600 rounded-xl text-sm">{success}</div>}

          <div>
            <label htmlFor="newPassword" className="block text-sm font-medium mb-2 text-fg-muted">New Password</label>
            <input 
              id="newPassword"
              type="password" 
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              className="w-full rounded-xl border border-border/50 bg-canvas-secondary p-3 outline-none focus:ring-2 focus:ring-accent transition-shadow" 
              required
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium mb-2 text-fg-muted">Confirm New Password</label>
            <input 
              id="confirmPassword"
              type="password" 
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              className="w-full rounded-xl border border-border/50 bg-canvas-secondary p-3 outline-none focus:ring-2 focus:ring-accent transition-shadow" 
              required
            />
          </div>

          <div className="pt-2">
            <button 
              type="submit" 
              disabled={loading || !newPassword || !confirmPassword}
              className="rounded-full bg-accent text-white px-8 py-3 text-sm font-medium hover:bg-accent/90 transition-colors disabled:opacity-50"
            >
              {loading ? 'Updating...' : 'Update Password'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
