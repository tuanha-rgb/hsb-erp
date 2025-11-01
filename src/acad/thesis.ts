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
  },
  // ===== (5) New =====
  {
    id: "TH2024002",
    title: "Predictive Maintenance for Campus Facilities Using IoT Sensors",
    titleVietnamese:
      "Bảo trì dự đoán cho cơ sở vật chất trong khuôn viên bằng cảm biến IoT",
    student: {
      id: "ST005",
      name: "Do Thi Ha",
      studentId: "2021012345",
      email: "ha.do@student.hsb.edu.vn",
      phone: "+84 912 556 789",
      program: "Information Systems",
      year: 4
    },
    supervisor: sampleSupervisors[0],
    category: "thesis",
    level: "bachelor",
    status: "submitted",
    submissionDate: "2024-11-01",
    defenseDate: "2024-11-25",
    approvalDate: null,
    abstract:
      "Designs an IoT-based predictive maintenance pipeline combining sensor networks with anomaly detection to reduce downtime in campus facilities.",
    keywords: ["IoT", "Predictive Maintenance", "Anomaly Detection", "Facilities"],
    department: "Faculty of Business Administration",
    fieldOfStudy: "Business Analytics",
    academicYear: "2023-2024",
    reviews: [],
    documents: {
      proposal: "proposal_TH2024002.pdf",
      fullThesis: "thesis_TH2024002.pdf",
      plagiarismReport: "plagiarism_TH2024002.pdf"
    },
    plagiarismScore: 7,
    finalGrade: null,
    defense: {
      committee: ["Dr. Nguyen Van Minh", "Dr. Tran Van Hoang", "Prof. Tran Van Duc"],
      location: "Room 402, Building A",
      date: "2024-11-25",
      time: "10:00"
    },
    associatedItems: { publications: [], grants: [], funding: [], patents: [] }
  },

  // ===== (6) New =====
  {
    id: "DIS2024003",
    title: "Behavioral Economics of Phishing Susceptibility in Higher Education",
    titleVietnamese:
      "Kinh tế học hành vi về mức độ dễ bị lừa đảo qua email trong giáo dục đại học",
    student: {
      id: "ST006",
      name: "Pham Bao Long",
      studentId: "2020007788",
      email: "long.pham@student.hsb.edu.vn",
      phone: "+84 936 111 222",
      program: "Cybersecurity Management",
      year: 2
    },
    supervisor: sampleSupervisors[1],
    category: "dissertation",
    level: "master",
    status: "under_review",
    submissionDate: "2024-09-28",
    defenseDate: "2024-12-02",
    approvalDate: null,
    abstract:
      "Quantifies how framing effects, time pressure, and prior training alter phishing click-through rates among university stakeholders.",
    keywords: ["Phishing", "Behavioral Economics", "Cybersecurity", "Experiment"],
    department: "Faculty of Economics",
    fieldOfStudy: "Behavioral Economics",
    academicYear: "2023-2024",
    reviews: [
      {
        id: "R006",
        reviewerName: "Dr. Nguyen Thi Phuong",
        reviewerEmail: "nguyen.phuong@hsb.edu.vn",
        status: "in_progress",
        rating: null,
        comments: "",
        submittedDate: null
      }
    ],
    documents: {
      proposal: "proposal_DIS2024003.pdf",
      fullThesis: "dissertation_DIS2024003.pdf"
    },
    plagiarismScore: 6,
    finalGrade: null,
    defense: {
      committee: ["Prof. Tran Thi Lan", "Dr. Le Van Hoang", "Dr. Pham Van Khanh"],
      location: "Room 601, Building B",
      date: "2024-12-02",
      time: "09:00"
    },
    associatedItems: {
      publications: [
        {
          id: "PUB005",
          title: "Framing Effects in Phishing Emails: Evidence from a University Field Study",
          journalName: "Computers & Security",
          publicationDate: "2024-10-10",
          status: "in_review",
          impactFactor: 4.3
        }
      ],
      grants: [],
      funding: [],
      patents: []
    }
  },

  // ===== (7) New =====
  {
    id: "FP2024002",
    title: "Designing an ESG Dashboard for University Governance",
    titleVietnamese:
      "Thiết kế bảng điều khiển ESG cho quản trị đại học",
    student: {
      id: "ST007",
      name: "Nguyen Thu Trang",
      studentId: "2021003344",
      email: "trang.nguyen@student.hsb.edu.vn",
      phone: "+84 912 334 556",
      program: "Management",
      year: 4
    },
    supervisor: sampleSupervisors[0],
    category: "final_project",
    level: "bachelor",
    status: "approved",
    submissionDate: "2024-08-22",
    defenseDate: "2024-09-18",
    approvalDate: "2024-09-25",
    abstract:
      "Implements an interactive ESG dashboard mapping SDG-aligned indicators to university operations with drill-down analytics.",
    keywords: ["ESG", "SDG", "Dashboard", "Governance"],
    department: "Faculty of Business Administration",
    fieldOfStudy: "Operations & Governance",
    academicYear: "2023-2024",
    reviews: [
      {
        id: "R007",
        reviewerName: "Dr. Dinh Van I",
        reviewerEmail: "dinh.i@hsb.edu.vn",
        status: "completed",
        rating: 9.2,
        comments: "Excellent data model and UI/UX rationale.",
        submittedDate: "2024-09-20"
      }
    ],
    documents: {
      proposal: "proposal_FP2024002.pdf",
      fullThesis: "finalproject_FP2024002.pdf",
      presentation: "presentation_FP2024002.pptx"
    },
    plagiarismScore: 5,
    finalGrade: "A",
    defense: {
      committee: ["Dr. Nguyen Van Minh", "Dr. Dinh Van I", "Dr. Le Van C"],
      location: "Room 305, Building C",
      date: "2024-09-18",
      time: "08:30"
    },
    associatedItems: { publications: [], grants: [], funding: [], patents: [] }
  },

  // ===== (8) New =====
  {
    id: "DIS2024004",
    title: "Ransomware Economic Impact Modeling for Vietnamese SMEs",
    titleVietnamese:
      "Mô hình hóa tác động kinh tế của ransomware đối với doanh nghiệp vừa và nhỏ tại Việt Nam",
    student: {
      id: "ST008",
      name: "Le Quang Minh",
      studentId: "2019023456",
      email: "minh.le@student.hsb.edu.vn",
      phone: "+84 934 888 111",
      program: "Economics",
      year: 2
    },
    supervisor: sampleSupervisors[1],
    category: "dissertation",
    level: "master",
    status: "submitted",
    submissionDate: "2024-10-12",
    defenseDate: "2024-11-30",
    approvalDate: null,
    abstract:
      "Builds a stochastic model quantifying direct costs, downtime, and reputation loss from ransomware incidents across sectors.",
    keywords: ["Ransomware", "Economics", "SME", "Risk Modeling"],
    department: "Faculty of Economics",
    fieldOfStudy: "Applied Economics",
    academicYear: "2023-2024",
    reviews: [],
    documents: {
      proposal: "proposal_DIS2024004.pdf",
      fullThesis: "dissertation_DIS2024004.pdf"
    },
    plagiarismScore: 9,
    finalGrade: null,
    defense: null,
    associatedItems: { publications: [], grants: [], funding: [], patents: [] }
  },

  // ===== (9) New =====
  {
    id: "TH2024003",
    title: "A/B Testing Strategies for LMS Feature Adoption",
    titleVietnamese:
      "Chiến lược A/B testing cho việc chấp nhận tính năng LMS",
    student: {
      id: "ST009",
      name: "Pham Tuan Kiet",
      studentId: "2021019911",
      email: "kiet.pham@student.hsb.edu.vn",
      phone: "+84 915 223 445",
      program: "Business Analytics",
      year: 4
    },
    supervisor: sampleSupervisors[2],
    category: "thesis",
    level: "bachelor",
    status: "under_review",
    submissionDate: "2024-10-18",
    defenseDate: "2024-11-22",
    approvalDate: null,
    abstract:
      "Compares multi-armed bandit and classical A/B testing for increasing adoption of new LMS features among undergraduates.",
    keywords: ["A/B Testing", "Bandits", "EdTech", "Adoption"],
    department: "Faculty of Marketing & Communication",
    fieldOfStudy: "Digital Analytics",
    academicYear: "2023-2024",
    reviews: [],
    documents: {
      proposal: "proposal_TH2024003.pdf",
      fullThesis: "thesis_TH2024003.pdf",
      plagiarismReport: "plagiarism_TH2024003.pdf"
    },
    plagiarismScore: 10,
    finalGrade: null,
    defense: {
      committee: ["Dr. Le Van Hoang", "Dr. Nguyen Thi Phuong", "Prof. Tran Van Duc"],
      location: "Room 210, Building B",
      date: "2024-11-22",
      time: "13:30"
    },
    associatedItems: { publications: [], grants: [], funding: [], patents: [] }
  },

  // ===== (10) New =====
  {
    id: "FP2024003",
    title: "Marketing Attribution Modeling in Omnichannel Campaigns",
    titleVietnamese:
      "Mô hình phân bổ hiệu quả marketing trong chiến dịch đa kênh",
    student: {
      id: "ST010",
      name: "Vu Phuong Linh",
      studentId: "2021007777",
      email: "linh.vu@student.hsb.edu.vn",
      phone: "+84 931 555 777",
      program: "Marketing",
      year: 4
    },
    supervisor: sampleSupervisors[2],
    category: "final_project",
    level: "bachelor",
    status: "approved",
    submissionDate: "2024-08-30",
    defenseDate: "2024-09-28",
    approvalDate: "2024-10-02",
    abstract:
      "Evaluates last-click, time-decay, and Shapley-value attribution models using real campaign logs from a retail partner.",
    keywords: ["Attribution", "Omnichannel", "Causal Inference", "Shapley"],
    department: "Faculty of Marketing & Communication",
    fieldOfStudy: "Marketing Analytics",
    academicYear: "2023-2024",
    reviews: [
      {
        id: "R010",
        reviewerName: "Dr. Nguyen Thi Phuong",
        reviewerEmail: "nguyen.phuong@hsb.edu.vn",
        status: "completed",
        rating: 8.7,
        comments: "Good methodological rigor and thoughtful validation.",
        submittedDate: "2024-09-29"
      }
    ],
    documents: {
      proposal: "proposal_FP2024003.pdf",
      fullThesis: "finalproject_FP2024003.pdf",
      presentation: "presentation_FP2024003.pptx"
    },
    plagiarismScore: 6,
    finalGrade: "A-",
    defense: {
      committee: ["Dr. Le Van Hoang", "Dr. Nguyen Thi Phuong", "Dr. Pham Van Khanh"],
      location: "Room 108, Building A",
      date: "2024-09-28",
      time: "15:00"
    },
    associatedItems: { publications: [], grants: [], funding: [], patents: [] }
  },

  // ===== (11) New =====
  {
    id: "DIS2024005",
    title: "Credit Scoring with Explainable AI in Emerging Markets",
    titleVietnamese:
      "Chấm điểm tín dụng với AI có khả năng giải thích tại thị trường mới nổi",
    student: {
      id: "ST011",
      name: "Truong Hai Dang",
      studentId: "2019006543",
      email: "dang.truong@student.hsb.edu.vn",
      phone: "+84 936 555 222",
      program: "Finance & Banking",
      year: 2
    },
    supervisor: sampleSupervisors[1],
    category: "dissertation",
    level: "master",
    status: "under_review",
    submissionDate: "2024-10-10",
    defenseDate: "2024-12-05",
    approvalDate: null,
    abstract:
      "Benchmarks gradient boosting and deep models for credit scoring and provides SHAP-based interpretability for regulatory compliance.",
    keywords: ["Credit Scoring", "XAI", "RegTech", "SHAP"],
    department: "Faculty of Economics",
    fieldOfStudy: "Finance",
    academicYear: "2023-2024",
    reviews: [],
    documents: {
      proposal: "proposal_DIS2024005.pdf",
      fullThesis: "dissertation_DIS2024005.pdf"
    },
    plagiarismScore: 8,
    finalGrade: null,
    defense: null,
    associatedItems: { publications: [], grants: [], funding: [], patents: [] }
  },

  // ===== (12) New =====
  {
    id: "TH2024004",
    title: "Evaluating Proctoring Policies and Student Privacy",
    titleVietnamese:
      "Đánh giá chính sách giám sát thi và quyền riêng tư của sinh viên",
    student: {
      id: "ST012",
      name: "Nguyen Gia Bao",
      studentId: "2021012222",
      email: "bao.nguyen@student.hsb.edu.vn",
      phone: "+84 915 111 222",
      program: "Public Policy",
      year: 4
    },
    supervisor: sampleSupervisors[0],
    category: "thesis",
    level: "bachelor",
    status: "submitted",
    submissionDate: "2024-10-22",
    defenseDate: "2024-11-26",
    approvalDate: null,
    abstract:
      "Assesses the trade-offs between academic integrity and privacy across remote proctoring approaches within Vietnamese universities.",
    keywords: ["Proctoring", "Privacy", "Policy", "Ethics"],
    department: "Faculty of Business Administration",
    fieldOfStudy: "Policy & Governance",
    academicYear: "2023-2024",
    reviews: [],
    documents: {
      proposal: "proposal_TH2024004.pdf",
      fullThesis: "thesis_TH2024004.pdf",
      plagiarismReport: "plagiarism_TH2024004.pdf"
    },
    plagiarismScore: 11,
    finalGrade: null,
    defense: {
      committee: ["Dr. Nguyen Van Minh", "Prof. Tran Thi Lan", "Dr. Le Van Hoang"],
      location: "Room 209, Building B",
      date: "2024-11-26",
      time: "14:30"
    },
    associatedItems: { publications: [], grants: [], funding: [], patents: [] }
  },

  // ===== (13) New =====
  {
    id: "FP2024004",
    title: "Learning Analytics for Early Dropout Prediction",
    titleVietnamese:
      "Phân tích học tập để dự đoán bỏ học sớm",
    student: {
      id: "ST013",
      name: "Hoang Thu Uyen",
      studentId: "2021018888",
      email: "uyen.hoang@student.hsb.edu.vn",
      phone: "+84 918 333 444",
      program: "Data Science",
      year: 4
    },
    supervisor: sampleSupervisors[2],
    category: "final_project",
    level: "bachelor",
    status: "approved",
    submissionDate: "2024-09-05",
    defenseDate: "2024-10-01",
    approvalDate: "2024-10-07",
    abstract:
      "Builds a predictive pipeline with temporal features from LMS logs to identify at-risk students and recommend timely interventions.",
    keywords: ["Learning Analytics", "Dropout", "Feature Engineering", "LMS"],
    department: "Faculty of Marketing & Communication",
    fieldOfStudy: "Data Analytics",
    academicYear: "2023-2024",
    reviews: [],
    documents: {
      proposal: "proposal_FP2024004.pdf",
      fullThesis: "finalproject_FP2024004.pdf",
      presentation: "presentation_FP2024004.pptx"
    },
    plagiarismScore: 7,
    finalGrade: "A",
    defense: {
      committee: ["Dr. Le Van Hoang", "Dr. Nguyen Thi Phuong", "Dr. Pham Van Khanh"],
      location: "Room 310, Building A",
      date: "2024-10-01",
      time: "09:30"
    },
    associatedItems: { publications: [], grants: [], funding: [], patents: [] }
  },

  // ===== (14) New =====
  {
    id: "DIS2024006",
    title: "Macroeconomic Nowcasting with Mixed-Frequency Data",
    titleVietnamese:
      "Dự báo hiện tại kinh tế vĩ mô với dữ liệu tần suất hỗn hợp",
    student: {
      id: "ST014",
      name: "Tran Nhu Quynh",
      studentId: "2019009999",
      email: "quynh.tran@student.hsb.edu.vn",
      phone: "+84 933 222 999",
      program: "Econometrics",
      year: 2
    },
    supervisor: sampleSupervisors[1],
    category: "dissertation",
    level: "master",
    status: "under_review",
    submissionDate: "2024-10-09",
    defenseDate: "2024-12-06",
    approvalDate: null,
    abstract:
      "Implements MIDAS regressions to nowcast GDP with high-frequency indicators under data revisions and publication lags.",
    keywords: ["Nowcasting", "MIDAS", "GDP", "Mixed Frequency"],
    department: "Faculty of Economics",
    fieldOfStudy: "Econometrics",
    academicYear: "2023-2024",
    reviews: [],
    documents: {
      proposal: "proposal_DIS2024006.pdf",
      fullThesis: "dissertation_DIS2024006.pdf"
    },
    plagiarismScore: 6,
    finalGrade: null,
    defense: null,
    associatedItems: { publications: [], grants: [], funding: [], patents: [] }
  },

  // ===== (15) New =====
  {
    id: "TH2024005",
    title: "Human-AI Collaboration in Academic Writing Support",
    titleVietnamese:
      "Hợp tác Người-AI trong hỗ trợ viết học thuật",
    student: {
      id: "ST015",
      name: "Nguyen Thanh Tung",
      studentId: "2021015566",
      email: "tung.nguyen@student.hsb.edu.vn",
      phone: "+84 917 555 666",
      program: "Management Technology",
      year: 4
    },
    supervisor: sampleSupervisors[0],
    category: "thesis",
    level: "bachelor",
    status: "submitted",
    submissionDate: "2024-11-02",
    defenseDate: "2024-11-27",
    approvalDate: null,
    abstract:
      "Studies how prompt design and rubric alignment affect the quality and originality of AI-assisted academic writing outputs.",
    keywords: ["Human-AI", "Prompting", "Rubric", "Academic Integrity"],
    department: "Faculty of Business Administration",
    fieldOfStudy: "Technology & Education",
    academicYear: "2023-2024",
    reviews: [],
    documents: {
      proposal: "proposal_TH2024005.pdf",
      fullThesis: "thesis_TH2024005.pdf",
      plagiarismReport: "plagiarism_TH2024005.pdf"
    },
    plagiarismScore: 9,
    finalGrade: null,
    defense: {
      committee: ["Dr. Nguyen Van Minh", "Prof. Tran Thi Lan", "Dr. Le Van Hoang"],
      location: "Room 512, Building A",
      date: "2024-11-27",
      time: "10:00"
    },
    associatedItems: { publications: [], grants: [], funding: [], patents: [] }
  },

  // ===== (16) New =====
  {
    id: "FP2024005",
    title: "Customer Churn Modeling for University Continuing Programs",
    titleVietnamese:
      "Mô hình hoá rời bỏ của khách hàng cho các chương trình đào tạo liên tục",
    student: {
      id: "ST016",
      name: "Bui Minh Chau",
      studentId: "2021006633",
      email: "chau.bui@student.hsb.edu.vn",
      phone: "+84 938 111 444",
      program: "Business Analytics",
      year: 4
    },
    supervisor: sampleSupervisors[2],
    category: "final_project",
    level: "bachelor",
    status: "approved",
    submissionDate: "2024-09-01",
    defenseDate: "2024-09-29",
    approvalDate: "2024-10-03",
    abstract:
      "Builds churn models using survival analysis and gradient boosting to improve retention campaigns for continuing education.",
    keywords: ["Churn", "Survival Analysis", "Retention", "Boosting"],
    department: "Faculty of Marketing & Communication",
    fieldOfStudy: "Customer Analytics",
    academicYear: "2023-2024",
    reviews: [],
    documents: {
      proposal: "proposal_FP2024005.pdf",
      fullThesis: "finalproject_FP2024005.pdf",
      presentation: "presentation_FP2024005.pptx"
    },
    plagiarismScore: 8,
    finalGrade: "A-",
    defense: {
      committee: ["Dr. Le Van Hoang", "Dr. Nguyen Thi Phuong", "Dr. Pham Van Khanh"],
      location: "Room 105, Building A",
      date: "2024-09-29",
      time: "10:30"
    },
    associatedItems: { publications: [], grants: [], funding: [], patents: [] }
  },

  // ===== (17) New =====
  {
    id: "DIS2024007",
    title: "Bayesian Hierarchical Models for Air Quality in Hanoi",
    titleVietnamese:
      "Mô hình phân cấp Bayes cho chất lượng không khí tại Hà Nội",
    student: {
      id: "ST017",
      name: "Pham Thu Giang",
      studentId: "2019007771",
      email: "giang.pham@student.hsb.edu.vn",
      phone: "+84 934 999 000",
      program: "Sustainable Development",
      year: 2
    },
    supervisor: sampleSupervisors[1],
    category: "dissertation",
    level: "master",
    status: "under_review",
    submissionDate: "2024-10-08",
    defenseDate: "2024-12-07",
    approvalDate: null,
    abstract:
      "Uses Bayesian spatial-temporal modeling to quantify the effects of traffic, weather, and policy on PM2.5 dynamics.",
    keywords: ["Bayesian", "Air Quality", "PM2.5", "Spatio-temporal"],
    department: "Faculty of Economics",
    fieldOfStudy: "Environmental Economics",
    academicYear: "2023-2024",
    reviews: [],
    documents: {
      proposal: "proposal_DIS2024007.pdf",
      fullThesis: "dissertation_DIS2024007.pdf"
    },
    plagiarismScore: 7,
    finalGrade: null,
    defense: null,
    associatedItems: { publications: [], grants: [], funding: [], patents: [] }
  },

  // ===== (18) New =====
  {
    id: "TH2024006",
    title: "Gamification for Student Engagement in Introductory Courses",
    titleVietnamese:
      "Trò chơi hoá để tăng gắn kết sinh viên trong học phần nhập môn",
    student: {
      id: "ST018",
      name: "Tran Tuan Anh",
      studentId: "2021010101",
      email: "anh.tran@student.hsb.edu.vn",
      phone: "+84 933 123 888",
      program: "Education Technology",
      year: 4
    },
    supervisor: sampleSupervisors[0],
    category: "thesis",
    level: "bachelor",
    status: "approved",
    submissionDate: "2024-08-26",
    defenseDate: "2024-09-23",
    approvalDate: "2024-09-27",
    abstract:
      "Evaluates point systems, badges, and narrative quests on engagement metrics and assessment outcomes in large classes.",
    keywords: ["Gamification", "Engagement", "Assessment", "Education"],
    department: "Faculty of Business Administration",
    fieldOfStudy: "Instructional Design",
    academicYear: "2023-2024",
    reviews: [],
    documents: {
      proposal: "proposal_TH2024006.pdf",
      fullThesis: "thesis_TH2024006.pdf",
      plagiarismReport: "plagiarism_TH2024006.pdf"
    },
    plagiarismScore: 6,
    finalGrade: "A",
    defense: {
      committee: ["Dr. Nguyen Van Minh", "Dr. Dinh Van I", "Dr. Le Van C"],
      location: "Room 311, Building A",
      date: "2024-09-23",
      time: "14:00"
    },
    associatedItems: { publications: [], grants: [], funding: [], patents: [] }
  },

  // ===== (19) New =====
  {
    id: "FP2024006",
    title: "Microservice Architecture for HSB ERP Notifications",
    titleVietnamese:
      "Kiến trúc vi dịch vụ cho thông báo ERP HSB",
    student: {
      id: "ST019",
      name: "Le Van Truong",
      studentId: "2021013333",
      email: "truong.le@student.hsb.edu.vn",
      phone: "+84 932 555 999",
      program: "Software Engineering",
      year: 4
    },
    supervisor: sampleSupervisors[2],
    category: "final_project",
    level: "bachelor",
    status: "approved",
    submissionDate: "2024-09-08",
    defenseDate: "2024-10-06",
    approvalDate: "2024-10-12",
    abstract:
      "Implements a scalable, event-driven notification service (Kafka + Redis) for ERP alerts with fine-grained preferences.",
    keywords: ["Microservices", "Event-Driven", "Kafka", "ERP"],
    department: "Faculty of Marketing & Communication",
    fieldOfStudy: "Software Architecture",
    academicYear: "2023-2024",
    reviews: [],
    documents: {
      proposal: "proposal_FP2024006.pdf",
      fullThesis: "finalproject_FP2024006.pdf",
      presentation: "presentation_FP2024006.pptx"
    },
    plagiarismScore: 5,
    finalGrade: "A",
    defense: {
      committee: ["Dr. Le Van Hoang", "Dr. Nguyen Thi Phuong", "Prof. Tran Van Duc"],
      location: "Room 214, Building B",
      date: "2024-10-06",
      time: "08:30"
    },
    associatedItems: { publications: [], grants: [], funding: [], patents: [] }
  },

  // ===== (20) New =====
  {
    id: "DIS2024008",
    title: "Fairness in Scholarship Allocation: A Data-Driven Approach",
    titleVietnamese:
      "Công bằng trong phân bổ học bổng: Cách tiếp cận dựa trên dữ liệu",
    student: {
      id: "ST020",
      name: "Nguyen Thi Thu",
      studentId: "2019004567",
      email: "thu.nguyen@student.hsb.edu.vn",
      phone: "+84 937 000 555",
      program: "Public Policy",
      year: 2
    },
    supervisor: sampleSupervisors[1],
    category: "dissertation",
    level: "master",
    status: "submitted",
    submissionDate: "2024-10-14",
    defenseDate: "2024-12-10",
    approvalDate: null,
    abstract:
      "Proposes fairness-aware optimization for scholarship allocation balancing merit, need, and diversity constraints.",
    keywords: ["Fairness", "Optimization", "Scholarship", "Policy"],
    department: "Faculty of Economics",
    fieldOfStudy: "Public Policy Analytics",
    academicYear: "2023-2024",
    reviews: [],
    documents: {
      proposal: "proposal_DIS2024008.pdf",
      fullThesis: "dissertation_DIS2024008.pdf"
    },
    plagiarismScore: 8,
    finalGrade: null,
    defense: null,
    associatedItems: { publications: [], grants: [], funding: [], patents: [] }
  },

  // ===== (21) New =====
  {
    id: "TH2024007",
    title: "Blockchain Credentials for Cross-Institution Credit Transfer",
    titleVietnamese:
      "Chứng chỉ chuỗi khối cho chuyển đổi tín chỉ liên trường",
    student: {
      id: "ST021",
      name: "Pham Le Khanh",
      studentId: "2021014555",
      email: "khanh.pham@student.hsb.edu.vn",
      phone: "+84 912 001 223",
      program: "Information Systems",
      year: 4
    },
    supervisor: sampleSupervisors[0],
    category: "thesis",
    level: "bachelor",
    status: "under_review",
    submissionDate: "2024-10-20",
    defenseDate: "2024-11-29",
    approvalDate: null,
    abstract:
      "Designs verifiable credentials for transcripts and module outcomes to streamline ECTS equivalence across partners.",
    keywords: ["Blockchain", "Credentials", "ECTS", "Interoperability"],
    department: "Faculty of Business Administration",
    fieldOfStudy: "IS & Governance",
    academicYear: "2023-2024",
    reviews: [],
    documents: {
      proposal: "proposal_TH2024007.pdf",
      fullThesis: "thesis_TH2024007.pdf",
      plagiarismReport: "plagiarism_TH2024007.pdf"
    },
    plagiarismScore: 10,
    finalGrade: null,
    defense: {
      committee: ["Dr. Nguyen Van Minh", "Prof. Tran Thi Lan", "Dr. Le Van Hoang"],
      location: "Room 206, Building A",
      date: "2024-11-29",
      time: "09:00"
    },
    associatedItems: { publications: [], grants: [], funding: [], patents: [] }
  },

  // ===== (22) New =====
  {
    id: "FP2024007",
    title: "Interactive Risk Map for Critical Infrastructure in Vietnam",
    titleVietnamese:
      "Bản đồ rủi ro tương tác cho hạ tầng thiết yếu tại Việt Nam",
    student: {
      id: "ST022",
      name: "Doan Hai Yen",
      studentId: "2021018999",
      email: "yen.doan@student.hsb.edu.vn",
      phone: "+84 939 100 222",
      program: "Nontraditional Security",
      year: 4
    },
    supervisor: sampleSupervisors[2],
    category: "final_project",
    level: "bachelor",
    status: "approved",
    submissionDate: "2024-09-03",
    defenseDate: "2024-09-30",
    approvalDate: "2024-10-05",
    abstract:
      "Builds a web GIS with layers for energy, water, and transport assets; includes scenario-based hazard overlays.",
    keywords: ["Critical Infrastructure", "GIS", "Risk Mapping", "Scenario"],
    department: "Faculty of Marketing & Communication",
    fieldOfStudy: "Geospatial Analytics",
    academicYear: "2023-2024",
    reviews: [],
    documents: {
      proposal: "proposal_FP2024007.pdf",
      fullThesis: "finalproject_FP2024007.pdf",
      presentation: "presentation_FP2024007.pptx"
    },
    plagiarismScore: 7,
    finalGrade: "A",
    defense: {
      committee: ["Dr. Le Van Hoang", "Dr. Nguyen Thi Phuong", "Dr. Pham Van Khanh"],
      location: "Room 114, Building C",
      date: "2024-09-30",
      time: "13:00"
    },
    associatedItems: { publications: [], grants: [], funding: [], patents: [] }
  },

  // ===== (23) New =====
  {
    id: "DIS2024009",
    title: "Causal Inference for EdTech Policy using Difference-in-Differences",
    titleVietnamese:
      "Suy luận nhân quả cho chính sách EdTech bằng phương pháp khác biệt-trong-khác biệt",
    student: {
      id: "ST023",
      name: "Nguyen Hoai Nam",
      studentId: "2019003333",
      email: "nam.nguyen@student.hsb.edu.vn",
      phone: "+84 935 666 333",
      program: "Economics",
      year: 2
    },
    supervisor: sampleSupervisors[1],
    category: "dissertation",
    level: "master",
    status: "under_review",
    submissionDate: "2024-10-06",
    defenseDate: "2024-12-08",
    approvalDate: null,
    abstract:
      "Estimates the causal impact of LMS mandates on pass rates using staggered adoption and robustness checks.",
    keywords: ["Causal Inference", "DiD", "EdTech", "Policy"],
    department: "Faculty of Economics",
    fieldOfStudy: "Applied Econometrics",
    academicYear: "2023-2024",
    reviews: [],
    documents: {
      proposal: "proposal_DIS2024009.pdf",
      fullThesis: "dissertation_DIS2024009.pdf"
    },
    plagiarismScore: 6,
    finalGrade: null,
    defense: null,
    associatedItems: { publications: [], grants: [], funding: [], patents: [] }
  },

  // ===== (24) New =====
  {
    id: "TH2024008",
    title: "Cyber Hygiene Interventions and Incident Reporting Behavior",
    titleVietnamese:
      "Can thiệp vệ sinh an ninh mạng và hành vi báo cáo sự cố",
    student: {
      id: "ST024",
      name: "Pham Thi Thao",
      studentId: "2021017777",
      email: "thao.pham@student.hsb.edu.vn",
      phone: "+84 931 777 222",
      program: "Security Management",
      year: 4
    },
    supervisor: sampleSupervisors[0],
    category: "thesis",
    level: "bachelor",
    status: "submitted",
    submissionDate: "2024-11-01",
    defenseDate: "2024-11-28",
    approvalDate: null,
    abstract:
      "Measures the effect of micro-learning nudges on timely incident reporting across student and staff cohorts.",
    keywords: ["Cyber Hygiene", "Nudges", "Incident Reporting", "Field Study"],
    department: "Faculty of Business Administration",
    fieldOfStudy: "Cybersecurity Policy",
    academicYear: "2023-2024",
    reviews: [],
    documents: {
      proposal: "proposal_TH2024008.pdf",
      fullThesis: "thesis_TH2024008.pdf",
      plagiarismReport: "plagiarism_TH2024008.pdf"
    },
    plagiarismScore: 8,
    finalGrade: null,
    defense: {
      committee: ["Dr. Nguyen Van Minh", "Dr. Pham Van Khanh", "Prof. Tran Thi Lan"],
      location: "Room 407, Building A",
      date: "2024-11-28",
      time: "15:30"
    },
    associatedItems: { publications: [], grants: [], funding: [], patents: [] }
  }
];

