import { auth } from '../auth';

const API_URL = '/api/payments';

async function getToken() {
  const user = auth.currentUser;
  if (!user) throw new Error('Not authenticated');
  return user.getIdToken();
}

export async function initializePayment(data: { orderId: string, method: string, phone?: string }) {
  const token = await getToken();
  const res = await fetch(`${API_URL}/initialize`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(data)
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Failed to initialize payment');
  return json;
}
