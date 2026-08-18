import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import { auth } from '../../lib/auth';

export default function Staff() {
  const { t } = useTranslation(['admin', 'auth', 'common']);
  const [staff, setStaff] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('staff');

  const fetchStaff = async () => {
    try {
      const token = await auth.currentUser?.getIdToken();
      const res = await fetch('/api/admin/staff', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      setStaff(json);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = await auth.currentUser?.getIdToken();
      const res = await fetch('/api/admin/staff', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, role })
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      setEmail('');
      fetchStaff();
    } catch (e: any) {
      alert(e.message);
    }
  };

  const handleRevoke = async (uid: string) => {
    if (!confirm('Are you sure you want to revoke this user\'s access?')) return;
    try {
      const token = await auth.currentUser?.getIdToken();
      const res = await fetch(`/api/admin/staff/${uid}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      fetchStaff();
    } catch (e: any) {
      alert(e.message);
    }
  };

  if (loading) return <div>{t('loading', { ns: 'common' })}</div>;

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Staff Management</h1>
      
      {error && <div className="text-red-500 bg-red-50 p-4 rounded">{error}</div>}

      <div className="bg-canvas p-6 rounded-[2rem] border border-border/50 shadow-sm">
        <h2 className="text-lg font-semibold mb-4">Assign Role</h2>
        <form onSubmit={handleInvite} className="flex gap-4 items-end">
          <div className="flex-1">
            <div data-for="userEmail" className="block text-sm font-medium text-gray-700 mb-1">User Email</div>
            <input 
              type="email" 
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full rounded-xl border-border/50 border p-2"
              placeholder="user@example.com"
            />
          </div>
          <div className="w-48">
            <div data-for="userRole" className="block text-sm font-medium text-gray-700 mb-1">{t('role', { ns: 'admin' })}</div>
            <select 
              value={role}
              onChange={e => setRole(e.target.value)}
              className="w-full rounded-xl border-border/50 border p-2"
            >
              <option value="staff">Staff</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <button type="submit" className="bg-accent text-white px-6 py-2 rounded-xl font-medium hover:bg-accent/90 h-[42px]">
            Assign
          </button>
        </form>
      </div>

      <div className="bg-canvas rounded-[2rem] border border-border/50 shadow-sm overflow-hidden">
        {staff.length === 0 ? (
          <div className="p-8 text-center text-fg-muted">No staff members found.</div>
        ) : (
          <table className="w-full text-left">
            <thead className="bg-canvas-secondary border-b">
              <tr>
                <th className="p-4 text-sm font-medium text-fg-muted">{t('email', { ns: 'auth' })}</th>
                <th className="p-4 text-sm font-medium text-fg-muted">{t('role', { ns: 'admin' })}</th>
                <th className="p-4 text-sm font-medium text-fg-muted">Actions</th>
              </tr>
            </thead>
            <tbody>
              {staff.map(user => (
                <tr key={user.uid} className="border-b last:border-0 hover:bg-canvas-secondary">
                  <td className="p-4 text-sm">{user.email}</td>
                  <td className="p-4 text-sm capitalize">
                    <span className="px-2 py-1 bg-canvas-secondary rounded-full text-xs font-semibold">{user.role}</span>
                  </td>
                  <td className="p-4 text-sm">
                    {user.role !== 'super_admin' && (
                      <button onClick={() => handleRevoke(user.uid)} className="text-red-500 hover:underline">Revoke</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
