import { Event, Announcement, Volunteer, User, Hall } from './types';

export const CURRENT_USER: User = {
  id: 'u1',
  name: 'Anoop',
  role: 'Resident',
  avatar: 'https://picsum.photos/seed/user1/200/200',
  email: 'anoop@community.com',
  phone: '+1 (555) 123-4567',
  address: 'Skyline Apts, Unit 402'
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
    price: '$25'
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
    price: 'Free'
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
    price: '$10'
  },
  {
    id: 'e4',
    title: 'Fall Potluck Dinner',
    date: 'Nov 1, 2024',
    time: '6:00 PM',
    location: 'Common Area, Lobby',
    category: 'Community',
    image: 'https://picsum.photos/seed/food/800/600',
    description: 'Bring a dish to share! We will provide drinks and cutlery.',
    price: 'Free'
  }
];

export const ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'a1',
    title: 'Pool Renovation Update',
    date: 'Oct 24, 2023',
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
  name: 'Grand Community Hall',
  capacity: 150,
  pricePerHour: 50,
  image: 'https://picsum.photos/seed/hall/800/600',
  description: 'A modern, spacious hall perfect for community gatherings, workshops, and small events. Features high ceilings, excellent acoustics, and natural lighting.',
  amenities: ['Fast Wifi', 'Cooling', 'Projector', 'Parking', 'Sound System']
};
