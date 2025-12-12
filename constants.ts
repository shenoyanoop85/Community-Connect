import { Event, Announcement, Volunteer, User, Hall, Booking } from './types';

// Default Resident Data
export const RESIDENT_USER: User = {
  id: 'u1',
  name: 'Anoop',
  role: 'Resident',
  avatar: 'https://picsum.photos/seed/user1/200/200',
  email: 'anoop@community.com',
  phone: '+91 98765 43210',
  address: 'Block C, Apt 402',
  bloodGroup: 'O+',
  documents: [
    { name: 'Driving License', type: 'PDF' },
    { name: 'Vaccination Report', type: 'PDF' }
  ]
};

// Mock Admin Data
export const ADMIN_USER: User = {
  id: 'admin1',
  name: 'Rajsri Admin',
  role: 'Admin',
  avatar: 'https://ui-avatars.com/api/?name=Admin+User&background=0f172a&color=fff&size=200',
  email: 'admin@rajsrispark.com',
  phone: '+91 99999 99999',
  address: 'Admin Office, Block A',
  bloodGroup: 'B+',
  documents: []
};

// CURRENT_USER is mutable to simulate login session changes
export const CURRENT_USER: User = { ...RESIDENT_USER };

// Helper to switch roles (Simulates backend login)
export const switchUserRole = (role: 'Resident' | 'Admin') => {
  const target = role === 'Admin' ? ADMIN_USER : RESIDENT_USER;
  // We use Object.assign to mutate the exported object reference 
  // so that imports in other files reflect the change immediately upon re-render
  Object.assign(CURRENT_USER, target);
};

export const EVENTS: Event[] = [
  {
    id: 'e1',
    title: 'Summer Gala Night',
    date: 'Jul 15, 2024',
    time: '6:00 PM - 10:00 PM',
    location: 'Community Center',
    category: 'Social',
    image: 'https://picsum.photos/seed/party/800/600',
    description: 'Join us for an evening of music, dance, and fine dining under the stars. The annual Summer Gala is our biggest event of the year!',
    price: '$25',
    requirements: ['Formal Attire', 'Age 18+'],
    benefits: ['Dinner Buffet', 'Live Band', 'Cocktails'],
    capacity: 100,
    registeredCount: 85,
    attendees: [
        'https://picsum.photos/seed/u2/100/100',
        'https://picsum.photos/seed/u3/100/100',
        'https://picsum.photos/seed/u4/100/100'
    ]
  },
  {
    id: 'e2',
    title: 'Morning Yoga Flow',
    date: 'Oct 25, 2024',
    time: '8:00 AM - 9:00 AM',
    location: 'Community Gym',
    category: 'Wellness',
    image: 'https://picsum.photos/seed/yoga/800/600',
    description: 'Start your day with zen. Suitable for all levels. Please bring your own mat.',
    price: 'Free',
    requirements: ['Yoga Mat', 'Water Bottle'],
    benefits: ['Instructor Led', 'Healthy Snacks'],
    capacity: 20,
    registeredCount: 5,
    attendees: [
        'https://picsum.photos/seed/u5/100/100',
        'https://picsum.photos/seed/u6/100/100'
    ]
  },
  {
    id: 'e3',
    title: 'Rooftop Mixer',
    date: 'Oct 24, 2024',
    time: '7:00 PM',
    location: 'Sky Lounge, Floor 25',
    category: 'Social',
    image: 'https://picsum.photos/seed/rooftop/800/600',
    description: 'Meet your neighbors and enjoy cocktails with a view.',
    price: '$10',
    requirements: ['Resident ID'],
    benefits: ['Free Drinks', 'Music'],
    capacity: 50,
    registeredCount: 50, // Sold Out
    attendees: [
        'https://picsum.photos/seed/u7/100/100',
        'https://picsum.photos/seed/u8/100/100',
        'https://picsum.photos/seed/u9/100/100'
    ]
  },
  {
    id: 'e4',
    title: 'Fall Potluck Dinner',
    date: 'Jan 1, 2026',
    time: '6:00 PM',
    location: 'Common Area, Lobby',
    category: 'Community',
    image: 'https://picsum.photos/seed/food/800/600',
    description: 'Bring a dish to share! We will provide drinks and cutlery.',
    price: 'Free',
    requirements: ['Bring a Dish'],
    benefits: ['Community Bonding'],
    capacity: 200,
    registeredCount: 45,
    attendees: [
        'https://picsum.photos/seed/u10/100/100',
        'https://picsum.photos/seed/u11/100/100'
    ]
  }
];

export const ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'a1',
    title: 'Pool Renovation Update',
    date: 'Oct 24, 2023',
    time: '6:00 AM - 10:00 PM',
    author: 'Admin Team',
    content: 'We are excited to announce that the community pool renovation project is entering its final phase. The new tiles have been installed, and the filtration system upgrade is complete. We expect to reopen next Monday.',
    image: 'https://picsum.photos/seed/pool/800/400',
    isUnread: true,
    isImportant: false,
    category: 'Maintenance',
    attachments: [
      { name: 'Summer_Schedule.pdf', size: '2.4 MB', type: 'pdf' },
      { name: 'Renovation_Map.png', size: '4.8 MB', type: 'img' }
    ]
  },
  {
    id: 'a2',
    title: 'Water Supply Maintenance',
    date: 'Yesterday',
    author: 'Maintenance Team',
    content: 'Water will be shut off for repairs on Tuesday from 9am to 5pm. Please plan accordingly.',
    image: 'https://picsum.photos/seed/pipes/800/400',
    isUnread: true,
    isImportant: true,
    category: 'Alert'
  },
  {
    id: 'a3',
    title: 'New Gym Guest Rules',
    date: '3d ago',
    author: 'Policy Committee',
    content: 'Please review the updated policy regarding guest passes effective immediately.',
    image: 'https://picsum.photos/seed/gym/800/400',
    isUnread: false,
    isImportant: false,
    category: 'Policy'
  }
];

export const VOLUNTEERS: Volunteer[] = [
  {
    id: 'v1',
    name: 'Sarah Jenkins',
    role: 'Event Coordinator',
    category: 'Committee',
    image: 'https://picsum.photos/seed/sarah/200/200',
    phone: '555-0101',
    email: 'sarah@example.com',
    isActive: true
  },
  {
    id: 'v2',
    name: 'David Miller',
    role: 'Safety Officer',
    category: 'Safety',
    image: 'https://picsum.photos/seed/david/200/200',
    phone: '555-0102',
    email: 'david@example.com',
    isActive: false
  },
  {
    id: 'v3',
    name: 'Elena Rodriguez',
    role: 'Welcome Committee',
    category: 'Helper',
    image: 'https://picsum.photos/seed/elena/200/200',
    phone: '555-0103',
    email: 'elena@example.com',
    isActive: true
  }
];

export const HALL_DETAILS: Hall = {
  id: 'h1',
  name: 'Rajsri Community Hall',
  capacity: 150,
  pricePerDay: 500,
  image: 'https://picsum.photos/seed/hall/800/600',
  description: 'A modern, spacious hall perfect for community gatherings, workshops, and small events. Features high ceilings, excellent acoustics, and natural lighting.',
  amenities: ['Fast Wifi', 'Cooling', 'Projector', 'Parking', 'Sound System']
};

// Get current year and month for dynamic mock data
const today = new Date();
const y = today.getFullYear();
const m = String(today.getMonth() + 1).padStart(2, '0');

export const BOOKINGS: Booking[] = [
  {
    id: 'b1',
    userId: 'u2',
    hallId: 'h1',
    startDate: `${y}-${m}-05`,
    endDate: `${y}-${m}-05`,
    status: 'Approved',
    totalAmount: 500,
    purpose: 'Birthday Party'
  },
  {
    id: 'b2',
    userId: 'u3',
    hallId: 'h1',
    startDate: `${y}-${m}-12`,
    endDate: `${y}-${m}-14`, // 3 days
    status: 'Approved',
    totalAmount: 1500,
    purpose: 'Wedding Reception'
  },
  {
    id: 'b3',
    userId: 'u1', // Current User
    hallId: 'h1',
    startDate: `${y}-${m}-20`,
    endDate: `${y}-${m}-20`,
    status: 'Pending',
    totalAmount: 500,
    purpose: 'Family Get-together'
  }
];