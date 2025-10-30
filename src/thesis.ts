// src/types/thesis.ts

// --- Core Types ---
export type ThesisStatus =
  | "draft"
  | "submitted"
  | "under_review"
  | "revision_required"
  | "approved"
  | "rejected"
  | "published";

export type ThesisCategory = "thesis" | "dissertation" | "final_project";
export type ThesisLevel = "bachelor" | "master" | "phd";

export interface Publication {
  id: string;
  title: string;
  journalName: string;
  publicationDate: string;
  doi?: string;
  status: "published" | "accepted" | "submitted" | "in_review";
  impactFactor?: number;
  citations?: number;
}

export interface Grant {
  id: string;
  grantName: string;
  fundingAgency: string;
  amount: number;
  currency: string;
  startDate: string;
  endDate: string;
  status: "active" | "completed" | "pending" | "rejected";
  principalInvestigator: string;
}

export interface Funding {
  id: string;
  sourceName: string;
  fundingType: "research" | "scholarship" | "travel" | "equipment" | "other";
  amount: number;
  currency: string;
  receivedDate: string;
  purpose: string;
  status: "received" | "pending" | "declined";
}

export interface Patent {
  id: string;
  patentTitle: string;
  patentNumber?: string;
  applicationDate: string;
  grantDate?: string;
  status: "granted" | "pending" | "rejected" | "expired";
  inventors: string[];
  country: string;
  patentOffice: string;
}

export interface AssociatedItems {
  publications: Publication[];
  grants: Grant[];
  funding: Funding[];
  patents: Patent[];
}

export type ReviewStatus = "pending" | "in_progress" | "completed";

export interface Supervisor {
  id: string;
  name: string;
  email: string;
  department: string;
  expertise: string[];
}

export interface Student {
  id: string;
  name: string;
  studentId: string;
  email: string;
  phone: string;
  program: string;
  year: number;
}

export interface Review {
  id: string;
  reviewerName: string;
  reviewerEmail: string;
  status: ReviewStatus;
  rating: number | null;
  comments: string;
  submittedDate: string | null;
}

export interface Thesis {
  id: string;
  title: string;
  titleVietnamese: string;
  student: Student;
  supervisor: Supervisor;
  coSupervisor?: Supervisor;
  category: ThesisCategory;
  level: ThesisLevel;
  status: ThesisStatus;
  submissionDate: string;
  defenseDate: string | null;
  approvalDate: string | null;
  abstract: string;
  keywords: string[];
  department: string;
  fieldOfStudy: string;
  academicYear: string;
  reviews: Review[];
  documents: {
    proposal?: string;
    fullThesis?: string;
    presentation?: string;
    plagiarismReport?: string;
  };
  plagiarismScore: number | null;
  finalGrade: string | null;
  defense: {
    committee: string[];
    location: string;
    date: string;
    time: string;
  } | null;
  associatedItems: AssociatedItems;
}

// --- Sample Data ---
export const sampleSupervisors: Supervisor[] = [
  {
    id: "1",
    name: "Dr. Nguyen Van Minh",
    email: "nguyen.minh@hsb.edu.vn",
    department: "Faculty of Business Administration",
    expertise: ["Strategic Management", "Business Analytics", "Innovation"]
  },
  {
    id: "2",
    name: "Prof. Tran Thi Lan",
    email: "tran.lan@hsb.edu.vn",
    department: "Faculty of Economics",
    expertise: ["Macroeconomics", "Development Economics", "International Trade"]
  },
  {
    id: "3",
    name: "Dr. Le Van Hoang",
    email: "le.hoang@hsb.edu.vn",
    department: "Faculty of Marketing & Communication",
    expertise: ["Digital Marketing", "Consumer Behavior", "Brand Management"]
  }
];

export const sampleTheses: Thesis[] = [
  {
    id: "TH2024001",
    title: "The Impact of Digital Transformation on SME Performance in Vietnam",
    titleVietnamese:
      "Tác động của chuyển đổi số đến hiệu quả hoạt động của doanh nghiệp vừa và nhỏ tại Việt Nam",
    student: {
      id: "ST001",
      name: "Nguyen Minh Quan",
      studentId: "2021001234",
      email: "quan.nguyen@student.hsb.edu.vn",
      phone: "+84 912 345 678",
      program: "Business Administration",
      year: 4
    },
    supervisor: sampleSupervisors[0],
    category: "thesis",
    level: "bachelor",
    status: "under_review",
    submissionDate: "2024-10-15",
    defenseDate: "2024-11-20",
    approvalDate: null,
    abstract:
      "This thesis examines the relationship between digital transformation initiatives and performance outcomes in Vietnamese SMEs. Using a mixed-methods approach combining surveys and case studies, the research identifies key success factors and challenges in digital adoption.",
    keywords: [
      "Digital Transformation",
      "SMEs",
      "Performance",
      "Vietnam",
      "Technology Adoption"
    ],
    department: "Faculty of Business Administration",
    fieldOfStudy: "Strategic Management",
    academicYear: "2023-2024",
    reviews: [
      {
        id: "R001",
        reviewerName: "Dr. Pham Van Khanh",
        reviewerEmail: "pham.khanh@hsb.edu.vn",
        status: "completed",
        rating: 8.5,
        comments:
          "Well-structured research with solid methodology. Some minor improvements needed in literature review.",
        submittedDate: "2024-10-25"
      },
      {
        id: "R002",
        reviewerName: "Prof. Hoang Thi Mai",
        reviewerEmail: "hoang.mai@hsb.edu.vn",
        status: "in_progress",
        rating: null,
        comments: "",
        submittedDate: null
      }
    ],
    documents: {
      proposal: "proposal_TH2024001.pdf",
      fullThesis: "thesis_TH2024001.pdf",
      plagiarismReport: "plagiarism_TH2024001.pdf"
    },
    plagiarismScore: 12,
    finalGrade: null,
    defense: {
      committee: [
        "Dr. Nguyen Van Minh",
        "Dr. Pham Van Khanh",
        "Prof. Hoang Thi Mai"
      ],
      location: "Room 501, Building A",
      date: "2024-11-20",
      time: "14:00"
    },
    associatedItems: {
      publications: [
        {
          id: "PUB001",
          title:
            "Digital Adoption Patterns in Vietnamese SMEs: A Preliminary Study",
          journalName: "Journal of Business Research",
          publicationDate: "2024-09-15",
          doi: "10.1016/j.jbusres.2024.123456",
          status: "published",
          impactFactor: 2.8,
          citations: 3
        }
      ],
      grants: [],
      funding: [
        {
          id: "FND001",
          sourceName: "HSB Research Support Fund",
          fundingType: "research",
          amount: 5_000_000,
          currency: "VND",
          receivedDate: "2024-03-01",
          purpose: "Data collection and survey distribution",
          status: "received"
        }
      ],
      patents: []
    }
  },
  {
    id: "DIS2024001",
    title: "Machine Learning Applications in Financial Risk Management",
    titleVietnamese: "Ứng dụng học máy trong quản lý rủi ro tài chính",
    student: {
      id: "ST002",
      name: "Tran Thi Bich Ngoc",
      studentId: "2020005678",
      email: "ngoc.tran@student.hsb.edu.vn",
      phone: "+84 913 456 789",
      program: "Finance & Banking",
      year: 2
    },
    supervisor: sampleSupervisors[1],
    category: "dissertation",
    level: "master",
    status: "submitted",
    submissionDate: "2024-10-28",
    defenseDate: null,
    approvalDate: null,
    abstract:
      "This dissertation explores the application of machine learning algorithms in predicting and managing financial risks. The research focuses on credit risk assessment using supervised learning techniques and proposes a novel ensemble model for improved prediction accuracy.",
    keywords: [
      "Machine Learning",
      "Financial Risk",
      "Credit Risk",
      "Predictive Analytics",
      "Banking"
    ],
    department: "Faculty of Economics",
    fieldOfStudy: "Finance & Banking",
    academicYear: "2023-2024",
    reviews: [],
    documents: {
      proposal: "proposal_DIS2024001.pdf",
      fullThesis: "dissertation_DIS2024001.pdf"
    },
    plagiarismScore: null,
    finalGrade: null,
    defense: null,
    associatedItems: {
      publications: [
        {
          id: "PUB002",
          title:
            "Ensemble Learning for Credit Risk Assessment: A Vietnamese Banking Case Study",
          journalName: "Expert Systems with Applications",
          publicationDate: "2024-08-20",
          doi: "10.1016/j.eswa.2024.234567",
          status: "published",
          impactFactor: 6.5,
          citations: 8
        },
        {
          id: "PUB003",
          title:
            "Machine Learning in Vietnamese Banking: Current State and Future Directions",
          journalName: "International Journal of Banking & Finance",
          publicationDate: "2024-11-30",
          status: "accepted",
          impactFactor: 1.9,
          citations: 0
        }
      ],
      grants: [
        {
          id: "GRT001",
          grantName: "AI Research Excellence Grant",
          fundingAgency: "Ministry of Science and Technology",
          amount: 50_000_000,
          currency: "VND",
          startDate: "2024-01-01",
          endDate: "2024-12-31",
          status: "active",
          principalInvestigator: "Prof. Tran Thi Lan"
        }
      ],
      funding: [
        {
          id: "FND002",
          sourceName: "Vietnam National Foundation for Science",
          fundingType: "research",
          amount: 30_000_000,
          currency: "VND",
          receivedDate: "2024-02-15",
          purpose: "Computing resources and data acquisition",
          status: "received"
        }
      ],
      patents: [
        {
          id: "PAT001",
          patentTitle:
            "Intelligent Credit Risk Assessment System Using Ensemble Machine Learning",
          patentNumber: "VN1234567",
          applicationDate: "2024-09-01",
          status: "pending",
          inventors: ["Tran Thi Bich Ngoc", "Prof. Tran Thi Lan"],
          country: "Vietnam",
          patentOffice:
            "National Office of Intellectual Property of Vietnam"
        }
      ]
    }
  },
  {
    id: "FP2024001",
    title: "Social Media Marketing Strategies for Generation Z Consumers",
    titleVietnamese:
      "Chiến lược marketing truyền thông xã hội hướng tới người tiêu dùng thế hệ Z",
    student: {
      id: "ST003",
      name: "Le Van Thanh",
      studentId: "2021009012",
      email: "thanh.le@student.hsb.edu.vn",
      phone: "+84 914 567 890",
      program: "Marketing",
      year: 4
    },
    supervisor: sampleSupervisors[2],
    category: "final_project",
    level: "bachelor",
    status: "approved",
    submissionDate: "2024-09-10",
    defenseDate: "2024-10-15",
    approvalDate: "2024-10-20",
    abstract:
      "This final project investigates effective social media marketing strategies targeting Generation Z consumers in Vietnam. Through surveys and social media analysis, the research identifies key engagement drivers and content preferences.",
    keywords: [
      "Social Media Marketing",
      "Generation Z",
      "Consumer Behavior",
      "Digital Strategy",
      "Vietnam"
    ],
    department: "Faculty of Marketing & Communication",
    fieldOfStudy: "Marketing",
    academicYear: "2023-2024",
    reviews: [
      {
        id: "R003",
        reviewerName: "Dr. Le Van Hoang",
        reviewerEmail: "le.hoang@hsb.edu.vn",
        status: "completed",
        rating: 9.0,
        comments:
          "Excellent research with practical implications. Well-executed methodology and clear findings.",
        submittedDate: "2024-09-25"
      },
      {
        id: "R004",
        reviewerName: "Dr. Nguyen Thi Phuong",
        reviewerEmail: "nguyen.phuong@hsb.edu.vn",
        status: "completed",
        rating: 8.5,
        comments:
          "Strong project with good insights. Minor improvements suggested in conclusion section.",
        submittedDate: "2024-09-28"
      }
    ],
    documents: {
      proposal: "proposal_FP2024001.pdf",
      fullThesis: "finalproject_FP2024001.pdf",
      presentation: "presentation_FP2024001.pptx",
      plagiarismReport: "plagiarism_FP2024001.pdf"
    },
    plagiarismScore: 8,
    finalGrade: "A",
    defense: {
      committee: [
        "Dr. Le Van Hoang",
        "Dr. Nguyen Thi Phuong",
        "Prof. Tran Van Duc"
      ],
      location: "Room 302, Building B",
      date: "2024-10-15",
      time: "09:00"
    },
    associatedItems: { publications: [], grants: [], funding: [], patents: [] }
  },
  {
    id: "DIS2024002",
    title:
      "Sustainable Supply Chain Management in Vietnamese Manufacturing",
    titleVietnamese:
      "Quản lý chuỗi cung ứng bền vững trong sản xuất tại Việt Nam",
    student: {
      id: "ST004",
      name: "Pham Minh Duc",
      studentId: "2019012345",
      email: "duc.pham@student.hsb.edu.vn",
      phone: "+84 915 678 901",
      program: "Operations Management",
      year: 2
    },
    supervisor: sampleSupervisors[0],
    category: "dissertation",
    level: "master",
    status: "revision_required",
    submissionDate: "2024-10-05",
    defenseDate: null,
    approvalDate: null,
    abstract:
      "This dissertation examines sustainable supply chain practices in Vietnamese manufacturing firms. The study analyzes the adoption barriers and benefits of green supply chain management through case studies and quantitative analysis.",
    keywords: [
      "Supply Chain",
      "Sustainability",
      "Manufacturing",
      "Green Management",
      "Vietnam"
    ],
    department: "Faculty of Business Administration",
    fieldOfStudy: "Operations Management",
    academicYear: "2023-2024",
    reviews: [
      {
        id: "R005",
        reviewerName: "Dr. Tran Van Hoang",
        reviewerEmail: "tran.hoang@hsb.edu.vn",
        status: "completed",
        rating: 7.0,
        comments:
          "Good topic but methodology needs strengthening. Please revise research design and expand data analysis section.",
        submittedDate: "2024-10-18"
      }
    ],
    documents: {
      proposal: "proposal_DIS2024002.pdf",
      fullThesis: "dissertation_DIS2024002_v1.pdf"
    },
    plagiarismScore: 15,
    finalGrade: null,
    defense: null,
    associatedItems: {
      publications: [
        {
          id: "PUB004",
          title:
            "Green Supply Chain Practices in Vietnamese Manufacturing: A Survey Study",
          journalName: "Journal of Cleaner Production",
          publicationDate: "2024-12-15",
          status: "in_review",
          impactFactor: 9.3
        }
      ],
      grants: [],
      funding: [
        {
          id: "FND003",
          sourceName: "Environmental Research Fund",
          fundingType: "research",
          amount: 15_000_000,
          currency: "VND",
          receivedDate: "2024-04-10",
          purpose: "Field research and case study data collection",
          status: "received"
        }
      ],
      patents: []
    }
  }
];
