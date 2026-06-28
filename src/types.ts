export interface Service {
  id: string;
  name: string;
  category: "Engineering" | "Design" | "Growth" | "AI & Automation" | "Cyber & Cloud";
  description: string;
  priceEstimate: string;
  features: string[];
}

export interface Project {
  id: string;
  title: string;
  category: "Web Development" | "E-commerce" | "AI Automation" | "Branding" | "Growth Marketing";
  clientName: string;
  description: string;
  stats: { label: string; value: string };
  image: string;
  tags: string[];
}

export interface TeamMember {
  name: string;
  role: string;
  bio: string;
  image: string;
}

export interface CaseStudy {
  id: string;
  title: string;
  client: string;
  challenge: string;
  solution: string;
  results: string[];
  metric: string;
  metricLabel: string;
  category: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  content: string;
  rating: number;
  image: string;
}

export interface BlogPost {
  id: string;
  title: string;
  category: string;
  excerpt: string;
  content: string;
  date: string;
  readTime: string;
  author: string;
  tags: string[];
  status?: "Draft" | "Published";
}

export interface Job {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  salary: string;
  description: string;
  requirements: string[];
}

export interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  value: number;
  service: string;
  status: "New" | "Contacted" | "Qualified" | "Proposal Sent" | "Closed Won" | "Closed Lost";
  date: string;
  notes: string;
}

export interface Booking {
  id: string;
  clientName: string;
  email: string;
  date: string;
  time: string;
  service: string;
  notes: string;
  platform: string;
  joinUrl: string;
}

export interface Proposal {
  id: string;
  title: string;
  clientName: string;
  amount: number;
  status: "Draft" | "Sent" | "Accepted" | "Expired";
  date: string;
  content: string;
}

export interface Invoice {
  id: string;
  clientName: string;
  amount: number;
  status: "Draft" | "Sent" | "Paid" | "Overdue";
  date: string;
  dueDate: string;
  description: string;
  paymentMethod: string;
}

export interface Contract {
  id: string;
  title: string;
  clientName: string;
  status: "Draft" | "Sent" | "Signed" | "Void";
  date: string;
  signature?: string;
  signedAt?: string;
  content: string;
}

export interface SupportTicket {
  id: string;
  subject: string;
  clientName: string;
  priority: "Low" | "Medium" | "High";
  status: "Open" | "In Progress" | "Resolved";
  date: string;
}

export interface EmployeeTask {
  id: string;
  title: string;
  assignee: string;
  priority: "Low" | "Medium" | "High";
  status: "Pending" | "In Progress" | "Completed";
  dueDate: string;
  project: string;
}

export interface OnboardingChecklistItem {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  completedAt?: string;
}

export interface OnboardingPOC {
  name: string;
  role: string;
  email: string;
  bio: string;
  image: string;
}

export interface ClientOnboarding {
  id: string;
  clientId: string;
  clientName: string;
  clientEmail: string;
  companyName: string;
  projectName: string;
  status: "In Progress" | "Completed" | "Suspended";
  startedAt: string;
  pointOfContact: OnboardingPOC;
  welcomeEmailSent: boolean;
  welcomeEmailContent: string;
  checklist: OnboardingChecklistItem[];
  contractId: string;
}
