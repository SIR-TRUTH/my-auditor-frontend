const API_BASE_URL = 'http://localhost:3000/api';

export async function registerStore(data: Record<string, any>) {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return response.json();
}

export async function loginUser(credentials: Record<string, any>) {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });
  return response.json();
}

export async function uploadReceipt(formData: FormData) {
  const response = await fetch(`${API_BASE_URL}/audit/upload`, {
    method: 'POST',
    body: formData, // Sending multipart/form-data for image/pdf
  });
  return response.json();
}