import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  Timestamp,
  onSnapshot,
  QuerySnapshot,
  DocumentData
} from 'firebase/firestore';
import { db } from './firebase.config';

export interface Member {
  id: string;
  studentId: string;
  name: string;
  role: 'Advisor'|'President' | 'Vice President' | 'Secretary' | 'Treasurer' | 'Member';
  joinDate: string;
  email: string;
  phone: string;
  department: string;
  year: number;
  termStart?: string;
  termEnd?: string;
  responsibilities?: string;
}

export interface Activity {
  id: string;
  name: string;
  date: string;
  location: string;
  participants: number;
  description: string;
  quarter: 'Q1' | 'Q2' | 'Q3' | 'Q4';
  year: number;
  budget?: string;
  outcome?: string;
}

export interface Proposal {
  id: string;
  title: string;
  submittedBy: string;
  submittedDate: string;
  type: 'Activity' | 'Budget' | 'Policy' | 'Other';
  description: string;
  requestedBudget?: string;
  status: 'Pending' | 'Approved' | 'Rejected' | 'Under Review';
  reviewedBy?: string;
  reviewDate?: string;
  comments?: string;
}

export interface Sponsorship {
  id: string;
  sponsorName: string;
  sponsorType: 'Individual' | 'Corporate' | 'Government' | 'NGO';
  contactPerson?: string;
  email?: string;
  phone?: string;
  amount: string;
  contributionDate: string;
  purpose: string;
  status: 'Active' | 'Completed' | 'Pending';
  notes?: string;
}

export interface Organization {
  id: string;
  name: string;
  type: 'Party' | 'Union' | 'Club';
  foundedDate: string;
  advisor: string;
  description: string;
  members: Member[];
  activities: Activity[];
  proposals: Proposal[];
  sponsorships: Sponsorship[];
  totalMembers: number;
  activitiesCount: number;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

const COLLECTION_NAME = 'studentClubs';

// Get organizations collection reference
export const getOrganizationsRef = () => collection(db, COLLECTION_NAME);

// Get all organizations
export const getAllOrganizations = async (): Promise<Organization[]> => {
  try {
    const querySnapshot = await getDocs(getOrganizationsRef());
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Organization[];
  } catch (error) {
    console.error('Error getting organizations:', error);
    throw error;
  }
};

// Get single organization
export const getOrganization = async (id: string): Promise<Organization | null> => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data()
      } as Organization;
    }
    return null;
  } catch (error) {
    console.error('Error getting organization:', error);
    throw error;
  }
};

// Add new organization
export const addOrganization = async (org: Omit<Organization, 'id'>): Promise<string> => {
  try {
    const docRef = await addDoc(getOrganizationsRef(), {
      ...org,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding organization:', error);
    throw error;
  }
};

// Update organization
export const updateOrganization = async (id: string, data: Partial<Organization>): Promise<void> => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(docRef, {
      ...data,
      updatedAt: Timestamp.now()
    });
  } catch (error) {
    console.error('Error updating organization:', error);
    throw error;
  }
};

// Delete organization
export const deleteOrganization = async (id: string): Promise<void> => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Error deleting organization:', error);
    throw error;
  }
};

// Subscribe to organizations real-time updates
export const subscribeToOrganizations = (
  callback: (organizations: Organization[]) => void,
  onError?: (error: Error) => void
) => {
  return onSnapshot(
    getOrganizationsRef(),
    (snapshot: QuerySnapshot<DocumentData>) => {
      const organizations = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Organization[];
      callback(organizations);
    },
    (error) => {
      console.error('Error in organizations subscription:', error);
      if (onError) onError(error as Error);
    }
  );
};
