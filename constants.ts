
import { Event, Announcement, Volunteer, User, Hall, Booking } from './types';

// Default Resident Data (Logged In User)
// Added 'Elderly Care' as an active role to demonstrate the "Your Roles" section in Volunteers page
export const RESIDENT_USER: User = {
  id: 'u1',
  name: 'Anoop',
  role: 'Resident',
  avatar: 'https://picsum.photos/seed/user1/200/200',
  email: 'anoop@community.com',
  phone: '+91 98765 43210',
  address: 'C-402',
  block: 'C',
  apartment: '402',
  bloodGroup: 'O+',
  documents: [
    { name: 'Driving License', type: 'PDF' },
    { name: 'Vaccination Report', type: 'PDF' }
  ],
  directory: {
      title: 'Active Resident',
      categories: ['Elderly Care'],
      primaryCategory: 'Elderly Care',
      isEnabled: true
  }
};

// Mock Admin Data
export const ADMIN_USER: User = {
  id: 'admin1',
  name: 'Rajsri Admin',
  role: 'Admin',
  avatar: 'https://ui-avatars.com/api/?name=Admin+User&background=0f172a&color=fff&size=200',
  email: 'admin@rajsrispark.com',
  phone: '+91 99999 99999',
  address: 'A-001',
  block: 'A',
  apartment: '001',
  bloodGroup: 'B+',
  documents: [],
  directory: {
      title: 'System Admin',
      categories: ['Admin', 'Security'],
      primaryCategory: 'Admin',
      isEnabled: true
  }
};

// CURRENT_USER is mutable to simulate login session changes
export const CURRENT_USER: User = { ...RESIDENT_USER };

// Helper to switch roles (Simulates backend login)
export const switchUserRole = (role: 'Resident' | 'Admin') => {
  const target = role === 'Admin' ? ADMIN_USER : RESIDENT_USER;
  Object.assign(CURRENT_USER, target);
};

// --- DATA STORE (Mutable for Demo CRUD) ---

export let GLOBAL_CATEGORIES = ['Association Member', 'Committee', 'Event Coordinator', 'Safety', 'Security', 'Elderly Care', 'Helper', 'Maintenance'];

export const addCategoryToGlobal = (cat: string) => { 
    if (!GLOBAL_CATEGORIES.includes(cat)) GLOBAL_CATEGORIES.push(cat); 
};

export const removeCategoryFromGlobal = (cat: string) => { 
    GLOBAL_CATEGORIES = GLOBAL_CATEGORIES.filter(c => c !== cat); 
};

export let EVENTS: Event[] = [
  {
    id: 'e1',
    title: 'Summer Gala Night',
    date: 'Jul 15, 2024',
    time: '6:00 PM - 10:00 PM',
    location: 'Community Center',
    address: 'Rajsri Community Hall, Block A, 123 Green Street',
    organizer: 'Community Committee',
    category: 'Social',
    image: 'https://picsum.photos/seed/party/800/600',
    description: 'Join us for an evening of music, dance, and fine dining under the stars. The annual Summer Gala is our biggest event of the year!',
    price: '$25',
    requirements: ['Formal Attire', 'Age 18+'],
    benefits: ['Dinner Buffet', 'Live Band', 'Cocktails'],
    capacity: 100,
    registeredCount: 85,
    attendees: [],
    targetAudience: 'All Residents'
  },
  {
    id: 'e2',
    title: 'Morning Yoga Flow',
    date: 'Oct 25, 2024',
    time: '8:00 AM - 9:00 AM',
    location: 'Community Gym',
    address: 'Block B Rooftop Area',
    organizer: 'Wellness Club',
    category: 'Wellness',
    image: 'https://picsum.photos/seed/yoga/800/600',
    description: 'Start your day with zen. Suitable for all levels. Please bring your own mat.',
    price: 'Free',
    requirements: ['Yoga Mat', 'Water Bottle'],
    benefits: ['Instructor Led', 'Healthy Snacks'],
    capacity: 20,
    registeredCount: 5,
    attendees: [],
    targetAudience: 'All Residents'
  }
];

export let ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'a1',
    title: 'Pool Renovation Update',
    date: 'Oct 24, 2023',
    time: '6:00 AM - 10:00 PM',
    author: 'Admin Team',
    content: `We are excited to announce that the community pool renovation project is entering its final phase.

Starting next Monday, the pool will reopen with extended summer hours. Residents can enjoy the facilities from [highlight]6:00 AM to 10:00 PM[/highlight] daily. We are also introducing morning aqua-aerobics classes every Tuesday and Thursday, free for all registered residents.

[quote]"The new heated section will be available starting November 1st, perfect for evening swims."[/quote]

Please review the attached schedule for specific maintenance blocks where the pool might be temporarily unavailable for cleaning.`,
    image: 'https://picsum.photos/seed/pool/800/400',
    isUnread: true,
    isImportant: false,
    category: 'Maintenance',
    targetAudience: 'All Residents',
    attachments: [
        { name: 'Maintenance Schedule.pdf', size: '2.4 MB', type: 'pdf' },
        { name: 'Pool Guidelines.png', size: '1.1 MB', type: 'img' }
    ]
  },
  {
    id: 'a2',
    title: 'Water Supply Maintenance',
    date: 'Yesterday',
    author: 'Maintenance Team',
    content: 'Water will be shut off for repairs on Tuesday from [highlight]9am to 5pm[/highlight]. Please plan accordingly.',
    image: 'https://picsum.photos/seed/pipes/800/400',
    isUnread: true,
    isImportant: true,
    category: 'Alert',
    targetAudience: 'Block A'
  }
];

export let BOOKINGS: Booking[] = [
  {
    id: 'b1',
    userId: 'u2',
    hallId: 'h1',
    startDate: '2024-10-05',
    endDate: '2024-10-05',
    status: 'Approved',
    totalAmount: 500,
    purpose: 'Birthday Party'
  },
  {
    id: 'b3',
    userId: 'u1',
    hallId: 'h1',
    startDate: '2024-10-20',
    endDate: '2024-10-20',
    status: 'Pending',
    totalAmount: 500,
    purpose: 'Family Get-together'
  }
];

// Mock Users Database for Admin Search
// Includes Residents, Committee Members, Helpers etc.
export let ALL_USERS: User[] = [
    RESIDENT_USER,
    { ...RESIDENT_USER, id: 'u2', name: 'Sarah Smith', address: 'A-101', block: 'A', apartment: '101', phone: '+91 98000 00001', 
        directory: { title: 'President', categories: ['Association Member', 'Event Coordinator'], primaryCategory: 'Association Member', isEnabled: true } 
    },
    { ...RESIDENT_USER, id: 'u3', name: 'John Doe', address: 'B-205', block: 'B', apartment: '205', phone: '+91 98000 00002',
        directory: { title: 'Head of Safety', categories: ['Security', 'Safety'], primaryCategory: 'Security', isEnabled: true }
    },
    { ...RESIDENT_USER, id: 'u4', name: 'Mike Ross', address: 'A-304', block: 'A', apartment: '304', phone: '+91 98000 00003',
        directory: { title: 'Yoga Instructor', categories: ['Helper', 'Wellness'], primaryCategory: 'Helper', isEnabled: true }
    },
    { ...RESIDENT_USER, id: 'u5', name: 'Emma Watson', address: 'C-105', block: 'C', apartment: '105', phone: '+91 98000 00004',
        directory: { title: 'Nurse', categories: ['Elderly Care', 'Helper'], primaryCategory: 'Elderly Care', isEnabled: true }
    },
    // Example of a user with a pending request
    // Updated to match the user's scenario: 4 Categories
    { ...RESIDENT_USER, id: 'u6', name: 'New Applicant', address: 'D-404', block: 'D', apartment: '404', phone: '+91 98000 00005',
        directoryRequest: {
            categories: ['Event Coordinator', 'Maintenance', 'Safety', 'Committee'],
            status: 'Pending',
            date: '2024-10-26'
        }
    }
];

export let HALL_DETAILS: Hall = {
  id: 'h1',
  name: 'Rajsri Community Hall',
  capacity: 150,
  pricePerDay: 500,
  image: 'https://picsum.photos/seed/hall/800/600',
  description: 'A modern, spacious hall perfect for community gatherings.',
  amenities: ['Fast Wifi', 'Cooling', 'Projector', 'Parking'],
  address: 'C-Bock, Rajsri Apartment',
  rating: 4.8,
  reviews: 120
};

// Deprecated: VOLUNTEERS (Merged into ALL_USERS via directory field)
export let VOLUNTEERS: Volunteer[] = []; 

// --- CRUD Actions ---

export const addEvent = (event: Event) => { EVENTS = [event, ...EVENTS]; };
export const updateEvent = (updatedEvent: Event) => {
  EVENTS = EVENTS.map(e => e.id === updatedEvent.id ? updatedEvent : e);
};
export const deleteEvent = (id: string) => { EVENTS = EVENTS.filter(e => e.id !== id); };

export const addAnnouncement = (ann: Announcement) => { ANNOUNCEMENTS = [ann, ...ANNOUNCEMENTS]; };
export const updateAnnouncement = (updatedAnn: Announcement) => {
  ANNOUNCEMENTS = ANNOUNCEMENTS.map(a => a.id === updatedAnn.id ? updatedAnn : a);
};
export const deleteAnnouncement = (id: string) => { ANNOUNCEMENTS = ANNOUNCEMENTS.filter(a => a.id !== id); };

// User Directory & Role CRUD
export const updateUserProfile = (userId: string, updates: Partial<User>) => {
    ALL_USERS = ALL_USERS.map(u => {
        if (u.id === userId) {
            return { ...u, ...updates };
        }
        return u;
    });
};
// Keeping legacy name for compatibility if needed, but routing to new one
export const updateUserDirectory = (userId: string, directoryData: any) => {
    updateUserProfile(userId, { directory: directoryData });
};

export const updateBookingStatus = (id: string, status: 'Approved' | 'Rejected') => {
    BOOKINGS = BOOKINGS.map(b => b.id === id ? { ...b, status } : b);
};

export const updateBookingDates = (id: string, startDate: string, endDate: string) => {
    BOOKINGS = BOOKINGS.map(b => {
        if (b.id === id) {
            // Recalculate Total
            const start = new Date(startDate);
            const end = new Date(endDate);
            const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
            const newTotal = days * HALL_DETAILS.pricePerDay;
            
            return { ...b, startDate, endDate, totalAmount: newTotal };
        }
        return b;
    });
};

export const updateHallDetails = (details: Hall) => {
    HALL_DETAILS = { ...details };
};
