const BASE = 'http://localhost:3000/api';

const getToken = () => localStorage.getItem('rentbot_token');

const authHeaders = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${getToken()}`,
});

const jsonHeaders = () => ({
  'Content-Type': 'application/json',
});

// ── Auth ──────────────────────────────────────────────────────────────────
export const apiRegister = async (name, email, phone, password) => {
  const res = await fetch(`${BASE}/auth/register`, {
    method: 'POST',
    headers: jsonHeaders(),
    body: JSON.stringify({ name, email, phone, password }),
  });
  return res.json();
};

export const apiLogin = async (email, password) => {
  const res = await fetch(`${BASE}/auth/login`, {
    method: 'POST',
    headers: jsonHeaders(),
    body: JSON.stringify({ email, password }),
  });
  return res.json();
};

// ── Properties ────────────────────────────────────────────────────────────
const toBackend = (form) => ({
  propertyName:    form.name       || '',
  propertyType:    form.type       || 'Apartment',
  status:          form.status     || 'available',
  address:         form.location   || '',
  monthlyRent:     Number(form.price)   || 0,
  securityDeposit: Number(form.deposit) || 0,
  bedrooms:        form.beds === 'Studio' ? 0 : Number(form.beds) || 1,
  bathrooms:       Number(form.baths)   || 1,
  description:     form.desc       || '',
  contactPhone:    form.phone      || '',
  amenities:       form.amenities  || [],
  videoLinks:      form.videos     || [],
});

export const toFrontend = (doc) => ({
  id:        doc._id,
  name:      doc.propertyName   || '',
  type:      doc.propertyType   || '',
  status:    doc.status         || 'available',
  location:  doc.address        || '',
  price:     doc.monthlyRent    || 0,
  deposit:   doc.securityDeposit || 0,
  beds:      doc.bedrooms === 0 ? 'Studio' : String(doc.bedrooms || 1),
  baths:     String(doc.bathrooms || 1),
  desc:      doc.description    || '',
  phone:     doc.contactPhone   || '',
  amenities: doc.amenities      || [],
  videos:    doc.videoLinks     || [],
  photos:    [],
  color:     0,
  dateAdded: doc.createdAt ? doc.createdAt.split('T')[0] : '',
});

// No auth header — properties are public
export const apiGetProperties = async () => {
  const res = await fetch(`${BASE}/properties`, {
    headers: jsonHeaders(),
  });
  if (!res.ok) throw new Error(`HTTP error ${res.status}`);
  const data = await res.json();
  return Array.isArray(data) ? data.map(toFrontend) : [];
};

export const apiCreateProperty = async (form) => {
  const res = await fetch(`${BASE}/properties`, {
    method: 'POST',
    headers: jsonHeaders(),
    body: JSON.stringify(toBackend(form)),
  });
  if (!res.ok) throw new Error(`HTTP error ${res.status}`);
  const data = await res.json();
  return toFrontend(data);
};

export const apiDeleteProperty = async (id) => {
  const res = await fetch(`${BASE}/properties/${id}`, {
    method: 'DELETE',
    headers: jsonHeaders(),
  });
  if (!res.ok) throw new Error(`HTTP error ${res.status}`);
};

export const apiUpdateProperty = async (id, form) => {
  const res = await fetch(`${BASE}/properties/${id}`, {
    method: 'PUT',
    headers: jsonHeaders(),
    body: JSON.stringify(toBackend(form)),
  });
  if (!res.ok) throw new Error(`HTTP error ${res.status}`);
  const data = await res.json();
  return toFrontend(data);
};