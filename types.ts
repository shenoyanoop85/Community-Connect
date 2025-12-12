
export interface DirectoryProfile {
  title: string;
  categories: string[];
  primaryCategory: string;
  isEnabled: boolean;
}

export interface User {
  id: string;
  name: string;
  role: 'Resident' | 'Admin';
  avatar: string;
  email: string;
  phone: string;
  address: string; // Formatted "Block-Apt" e.g. "A-101"
  block?: string;
  apartment?: string;
  bloodGroup?: string;
  documents?: { name: string; type: string }[];
  directory?: DirectoryProfile; // New field for Directory Management
  directoryRequest?: { // New field for Pending Applications
      categories: string[];
      status: 'Pending' | 'Rejected';
      date: string;
  };
}

export interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  address?: string; 
  organizer?: string; 
  category: string;
  image: string;
  description: string;
  price: string;
  requirements?: string[];
  benefits?: string[];
  capacity?: number;
  registeredCount?: number;
  attendees?: string[];
  targetAudience?: string;
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
  targetAudience?: string;
}

export interface Volunteer {
  id: string;
  name: string;
  role: string;
  category: string; 
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
  address: string;
  rating: number;
  reviews: number;
}

export interface Booking {
  id: string;
  userId: string;
  hallId: string;
  startDate: string; 
  endDate: string; 
  status: 'Pending' | 'Approved' | 'Rejected';
  totalAmount: number;
  purpose: string;
}
