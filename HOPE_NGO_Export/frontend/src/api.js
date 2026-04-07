const API_URL = 'http://localhost:3000/api';

export const fetchNgos = async () => (await fetch(`${API_URL}/ngos`)).json();
export const registerNgo = async (data) => {
  const res = await fetch(`${API_URL}/ngos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
};

export const fetchVolunteers = async () => (await fetch(`${API_URL}/volunteers`)).json();
export const registerVolunteer = async (data) => {
  const res = await fetch(`${API_URL}/volunteers`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
};

export const fetchDonations = async () => (await fetch(`${API_URL}/donations`)).json();
export const makeDonation = async (data) => {
  const res = await fetch(`${API_URL}/donations`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
};

export const fetchEvents = async () => (await fetch(`${API_URL}/events`)).json();
export const createEvent = async (data) => {
  const res = await fetch(`${API_URL}/events`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
};
