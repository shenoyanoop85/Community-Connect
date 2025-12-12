export interface User {
  id: string;
  name: string;
  role: 'Resident' | 'Admin';
  avatar: string;
  email: string;
  phone: string;
  address: string;
  bloodGroup?: string;
  documents?: { name: string; type: string }[];
}

export interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  category: string;
  image: string;
  description: string;
  price: string;
  requirements?: string[];
  benefits?: string[];
  capacity?: number;
  registeredCount?: number;
  attendees?: string[];
}

export interface Announcement {
  id: string;
  title: string;
  date: string;
  time?: string;
  author: string;
  content: string;
  image: string;
  isUnread: boolean;
  isImportant: boolean;
  category: 'Maintenance' | 'Policy' | 'Alert' | 'General';
  attachments?: { name: string; size: string; type: 'pdf' | 'img' }[];
}

export interface Volunteer {
  id: string;
  name: string;
  role: string;
  category: 'Committee' | 'Helper' | 'Safety';
  image: string;
  phone: string;
  email: string;
  isActive: boolean;
}

export interface Hall {
  id: string;
  name: string;
  capacity: number;
  pricePerDay: number;
  image: string;
  description: string;
  amenities: string[];
}

export interface Booking {
  id: string;
  userId: string;
  hallId: string;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  status: 'Pending' | 'Approved' | 'Rejected';
  totalAmount: number;
  purpose: string;
}