// src/data/eventData.ts

// 🎯 Define possible event categories, status, and color tags
export type EventType =
  | "Conference"
  | "Career"
  | "Academic"
  | "Orientation"
  | "Social"
  | "Competition";

export type EventStatus = "Open" | "Full" | "Closed";

export type EventColor =
  | "blue"
  | "green"
  | "purple"
  | "orange"
  | "pink"
  | "yellow"
  | "red"
  | "teal";

// 🎓 Main event interface
export interface EventItem {
  id: string;
  name: string;
  type: EventType;
  date: string;          // ISO date format string
  time: string;          // e.g. "09:00 - 17:00"
  location: string;
  capacity: number;
  registered: number;
  status: EventStatus;
  organizer: string;
  description: string;
  color: EventColor;
}

// 📅 Sample dataset
export const sampleEvents: EventItem[] = [
  {
    id: "EVT001",
    name: "Annual Tech Conference 2025",
    type: "Conference",
    date: "2025-10-25",
    time: "09:00 - 17:00",
    location: "Main Auditorium",
    capacity: 500,
    registered: 423,
    status: "Open",
    organizer: "CS Department",
    description:
      "Annual technology conference featuring keynotes, workshops, and networking.",
    color: "blue",
  },
  {
    id: "EVT002",
    name: "Career Fair",
    type: "Career",
    date: "2025-10-28",
    time: "10:00 - 16:00",
    location: "Sports Center",
    capacity: 1000,
    registered: 847,
    status: "Open",
    organizer: "Career Services",
    description:
      "Meet top employers and explore internship and job opportunities.",
    color: "green",
  },
  {
    id: "EVT003",
    name: "Research Symposium",
    type: "Academic",
    date: "2025-10-20",
    time: "13:00 - 18:00",
    location: "Conference Hall B",
    capacity: 200,
    registered: 156,
    status: "Open",
    organizer: "Graduate School",
    description:
      "Showcase of cutting-edge research by faculty and graduate students.",
    color: "purple",
  },
  {
    id: "EVT004",
    name: "Student Orientation",
    type: "Orientation",
    date: "2025-10-16",
    time: "08:00 - 12:00",
    location: "Main Campus",
    capacity: 800,
    registered: 800,
    status: "Full",
    organizer: "Student Affairs",
    description:
      "Welcome new students and introduce campus resources.",
    color: "orange",
  },
  {
    id: "EVT005",
    name: "Alumni Networking Night",
    type: "Social",
    date: "2025-11-05",
    time: "18:00 - 21:00",
    location: "University Club",
    capacity: 300,
    registered: 187,
    status: "Open",
    organizer: "Alumni Relations",
    description:
      "Connect with successful alumni and build professional networks.",
    color: "pink",
  },
  {
    id: "EVT006",
    name: "Startup Pitch Competition",
    type: "Competition",
    date: "2025-11-10",
    time: "14:00 - 18:00",
    location: "Innovation Hub",
    capacity: 150,
    registered: 89,
    status: "Open",
    organizer: "Entrepreneurship Center",
    description:
      "Students pitch their startup ideas to win funding and mentorship.",
    color: "yellow",
  },
];

// 🎨 Utility: status color helper for Tailwind
export const getEventStatusColor = (status: EventStatus): string => {
  switch (status) {
    case "Open":
      return "bg-green-100 text-green-700 border-green-200";
    case "Full":
      return "bg-orange-100 text-orange-700 border-orange-200";
    case "Closed":
      return "bg-gray-100 text-gray-700 border-gray-200";
    default:
      return "bg-gray-100 text-gray-700 border-gray-200";
  }
};
