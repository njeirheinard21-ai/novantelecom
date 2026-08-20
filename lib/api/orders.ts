import { auth } from '../auth';

const API_URL = '/api/orders';

async function getToken() {
  const user = auth.currentUser;
  if (!user) throw new Error('Not authenticated');
  return user.getIdToken();
}

export async function createOrder(data: any) {
  const token = await getToken();
  const res = await fetch('/api/checkout', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(data)
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Failed to create order');
  return json;
}

export async function trackOrder(orderNumber: string, phone: string) {
  const res = await fetch(`${API_URL}/track`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ orderNumber, phone })
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Failed to track order');
  return json;
}

export async function getCustomerOrders() {
  const token = await getToken();
  const res = await fetch(API_URL, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Failed to fetch orders');
  return json;
}

export async function getCustomerOrder(id: string) {
  const token = await getToken();
  const res = await fetch(`${API_URL}/${id}`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Failed to fetch order');
  return json;
}

export async function getAdminOrders(status?: string) {
  const token = await getToken();
  const url = status ? `${API_URL}/admin?status=${status}` : `${API_URL}/admin`;
  const res = await fetch(url, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Failed to fetch admin orders');
  return json;
}

export async function getAdminOrder(id: string) {
  const token = await getToken();
  const res = await fetch(`${API_URL}/admin/${id}`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Failed to fetch admin order');
  return json;
}

export async function updateOrderStatus(id: string, status: string) {
  const token = await getToken();
  const res = await fetch(`${API_URL}/admin/${id}/status`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ status })
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Failed to update order status');
  return json;
}
