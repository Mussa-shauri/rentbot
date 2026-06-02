const BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const toFrontend = (doc) => ({
  id:        doc._id,
  name:      doc.propertyName    || '',
  type:      doc.propertyType    || '',
  status:    doc.status          || 'available',
  location:  doc.address         || '',
  price:     doc.monthlyRent     || 0,
  deposit:   doc.securityDeposit || 0,
  beds:      doc.bedrooms === 0 ? 'Studio' : String(doc.bedrooms || 1),
  baths:     String(doc.bathrooms || 1),
  desc:      doc.description     || '',
  phone:     doc.contactPhone    || '',
  amenities: doc.amenities       || [],
  videos:    doc.videoLinks      || [],
  photos:    (doc.images || []).map(url => ({ src: url, name: 'photo' })),
  color:     0,
  dateAdded: doc.createdAt ? doc.createdAt.split('T')[0] : '',
});

export const apiCreateProperty = async (form) => {
  const formData = new FormData();

  // Text fields
  formData.append('propertyName',    form.name       || '');
  formData.append('propertyType',    form.type       || 'Apartment');
  formData.append('status',          form.status     || 'available');
  formData.append('address',         form.location   || '');
  formData.append('monthlyRent',     Number(form.price)   || 0);
  formData.append('securityDeposit', Number(form.deposit) || 0);
  formData.append('bedrooms',        form.beds === 'Studio' ? 0 : Number(form.beds) || 1);
  formData.append('bathrooms',       Number(form.baths) || 1);
  formData.append('description',     form.desc   || '');
  formData.append('contactPhone',    form.phone  || '');
  formData.append('amenities',       JSON.stringify(form.amenities || []));
  formData.append('videoLinks',      JSON.stringify(form.videos    || []));

  // Image files
  if (form.photos && form.photos.length > 0) {
    for (const photo of form.photos) {
      const res  = await fetch(photo.src);
      const blob = await res.blob();
      const file = new File([blob], photo.name || 'photo.jpg', { type: blob.type });
      formData.append('images', file);
    }
  }

  const response = await fetch(`${BASE}/properties`, {
    method: 'POST',
    body: formData,
    // No Content-Type header — browser sets it automatically with boundary for FormData
  });

  if (!response.ok) throw new Error(`HTTP error ${response.status}`);

  const data = await response.json();
  return toFrontend(data);
};