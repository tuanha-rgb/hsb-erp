export type ProjectType = "Applied Research" | "Basic Research";
export type ProjectStatus = "Active" | "Completed" | "Pending";

export interface ResearchProject {
  id: string;
  title: string;
  pi: string;
  coInvestigators: string[];
  type: ProjectType;
  status: ProjectStatus;
  level: 'International' | 'National' | 'Ministry' | 'VNU' | 'HSB';
  startDate: string;  // ISO
  endDate: string;    // ISO
  funding: string;    // keep as formatted string (e.g., "$250,000")
  fundingSource: string;
  progress: number;   // 0-100
  publications: number;
  department: string;
  description: string;
}

export type PublicationType = "Journal Article" | "Conference Paper" | "Book Chapter" | "Book" | "Review Article";
export type PublicationStatus = "Published" | "Under Review";
export type Quartile = "Q1" | "Q2" | "Q3" | "Q4" | "N/A";

export interface Publication {
  id: string;
  title: string;
  authors: string[];
  type: PublicationType;
  journal: string;
  publisher?: string | null;
  year: number;
  citations: number;
  impactFactor: number | null;
  status: PublicationStatus;
  doi: string | null;
  project: string | null; // project id or null
  quartile: Quartile;
  discipline: string;
}

export type PatentStatus = "Granted" | "Pending" | "Under Examination" | "International Filing" | "International";
export type PatentType = "Invention Patent" | "Utility Model";

export interface Patent {
  id: string;
  title: string;
  inventors: string[];
  applicationNumber: string;
  applicationDate: string; // ISO
  status: PatentStatus;
  grantDate: string | null; // ISO or null
  patentNumber: string | null;
  type: PatentType;
  faculty: string;
  discipline: string;
  abstract: string;
  country: string;
  ipOffice: string;
}
