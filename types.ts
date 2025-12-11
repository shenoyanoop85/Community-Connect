export interface User {
  id: string;
  name: string;
  role: 'Resident' | 'Admin';
  avatar: string;
  email: string;
  phone: string;
  address: string;
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
}

export interface Announcement {
  id: string;
  title: string;
  date: string;
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
  pricePerHour: number;
  image: string;
  description: string;
  amenities: string[];
}
