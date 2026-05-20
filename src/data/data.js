export const INITIAL_PROPERTIES = [
  {
    id: 1,
    name: 'Msasani Ocean View Flat',
    type: 'Apartment',
    location: 'Msasani, Dar es Salaam',
    price: 850000,
    deposit: 1700000,
    beds: '3',
    baths: '2',
    status: 'available',
    desc: 'Spacious 3-bedroom apartment with ocean view. Walking distance to Shoppers Plaza.',
    amenities: ['Water 24hr', 'Electricity', 'WIFI', 'Parking', 'CCTV', 'Security Guard'],
    phone: '+255 712 111 222',
    photos: [],
    videos: [],
    color: 0,
    dateAdded: '2024-03-01',
  },
  {
    id: 2,
    name: 'Kariakoo Studio Unit',
    type: 'Studio',
    location: 'Kariakoo, Dar es Salaam',
    price: 280000,
    deposit: 560000,
    beds: 'Studio',
    baths: '1',
    status: 'occupied',
    desc: 'Modern studio near the central market. All utilities included.',
    amenities: ['Water 24hr', 'Electricity', 'Furnished'],
    phone: '+255 712 333 444',
    photos: [],
    videos: [],
    color: 1,
    dateAdded: '2024-01-15',
    tenant: { name: 'Amina Salehe', since: '2024-02-01', contact: '+255 765 001 002' },
  },
  {
    id: 3,
    name: 'Mbezi Beach Family House',
    type: 'House',
    location: 'Mbezi Beach, Dar es Salaam',
    price: 1200000,
    deposit: 2400000,
    beds: '4+',
    baths: '3',
    status: 'available',
    desc: 'Large family house 5 minutes from the beach. Gated compound with garden.',
    amenities: ['Water 24hr', 'Electricity', 'Parking', 'Security Guard', 'Generator', 'Garden'],
    phone: '+255 712 555 666',
    photos: [],
    videos: [],
    color: 2,
    dateAdded: '2024-02-20',
  },
  {
    id: 4,
    name: 'Sinza Bedsitter',
    type: 'Bedsitter',
    location: 'Sinza, Dar es Salaam',
    price: 150000,
    deposit: 300000,
    beds: '1',
    baths: '1',
    status: 'pending',
    desc: 'Affordable bedsitter near bus stand, market, and schools.',
    amenities: ['Water 24hr', 'Electricity'],
    phone: '+255 712 777 888',
    photos: [],
    videos: [],
    color: 3,
    dateAdded: '2024-03-10',
  },
];

export const MESSAGES = [
  { id: 1, from: 'Baraka Juma',  avatar: 'BJ', property: 'Msasani Ocean View Flat',   text: 'Hi, is the apartment still available? I would like to schedule a visit.', time: '10:30 AM',  unread: true  },
  { id: 2, from: 'Grace Mwamba', avatar: 'GM', property: 'Mbezi Beach Family House',   text: 'Can the rent be negotiated? We are a family of 5.',                       time: '9:15 AM',   unread: true  },
  { id: 3, from: 'Hassan Ally',  avatar: 'HA', property: 'Sinza Bedsitter',            text: 'What documents do I need to rent the bedsitter?',                        time: 'Yesterday', unread: false },
  { id: 4, from: 'Zuwena Said',  avatar: 'ZS', property: 'Msasani Ocean View Flat',   text: 'Is WIFI already connected or do I set it up myself?',                    time: 'Yesterday', unread: false },
];

export const PAYMENTS = [
  { id: 1, tenant: 'Amina Salehe', property: 'Kariakoo Studio Unit', amount: 280000, month: 'April 2024', status: 'paid',     date: '2024-04-01' },
  { id: 2, tenant: 'Amina Salehe', property: 'Kariakoo Studio Unit', amount: 280000, month: 'March 2024', status: 'paid',     date: '2024-03-01' },
  { id: 3, tenant: 'Amina Salehe', property: 'Kariakoo Studio Unit', amount: 280000, month: 'May 2024',   status: 'upcoming', date: '2024-05-01' },
];

export const AMENITY_OPTIONS = [
  'Water 24hr', 'Electricity', 'WIFI', 'Security Guard', 'Parking',
  'Generator', 'CCTV', 'Furnished', 'Air Condition', 'Near School',
  'Near Hospital', 'Garden', 'Swimming Pool', 'Balcony', 'Pet Friendly', 'Near Bus Stand',
];

export const PROPERTY_TYPES = ['Apartment', 'House', 'Studio', 'Room', 'Villa', 'Bedsitter'];
export const CARD_COLORS    = ['#E6F1FB', '#E1F5EE', '#FAEEDA', '#FBEAF0'];
export const CARD_ICONS     = ['🏢', '🏠', '🏡', '🏗️'];