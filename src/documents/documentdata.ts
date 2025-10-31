// documentData.ts - Sample document data for HSB ERP Document Management System

export type DocumentSource = 
  | "VNU_HANOI" 
  | "MOE" // Ministry of Education
  | "MPS" // Ministry of Public Security
  | "MOH" // Ministry of Health
  | "MOET" // Ministry of Education and Training
  | "MOST" // Ministry of Science and Technology
  | "MOF" // Ministry of Finance
  | "MOLISA" // Ministry of Labour, Invalids and Social Affairs
  | "INTERNAL"
  | "OTHER";

export type DocumentType = 
  | "CIRCULAR" // Thông tư
  | "DIRECTIVE" // Chỉ thị
  | "DECISION" // Quyết định
  | "DISPATCH" // Công văn
  | "GUIDELINE" // Hướng dẫn
  | "REGULATION" // Quy định
  | "REPORT" // Báo cáo
  | "REQUEST" // Đề nghị
  | "NOTIFICATION" // Thông báo
  | "RESOLUTION" // Nghị quyết
  | "INSTRUCTION"; // Chỉ đạo

export type DocumentStatus = 
  | "DRAFT" // Dự thảo
  | "PENDING_REVIEW" // Chờ xem xét
  | "PENDING_SIGNATURE" // Chờ ký
  | "SIGNED" // Đã ký
  | "ISSUED" // Đã ban hành
  | "ARCHIVED" // Đã lưu trữ
  | "REJECTED" // Từ chối
  | "EXPIRED"; // Hết hiệu lực

export type PriorityLevel = "LOW" | "MEDIUM" | "HIGH" | "URGENT";

export interface Signatory {
  id: string;
  name: string;
  position: string; // Chức vụ
  department?: string; // Phòng ban
  email?: string;
  phone?: string;
  signedAt?: string;
  status: "PENDING" | "SIGNED" | "REJECTED";
  signature?: string; // Digital signature or image
  comments?: string; // Ý kiến
}

export interface Document {
  id: string;
  documentNumber: string; // Số văn bản
  title: string; // Trích yếu
  type: DocumentType;
  source: DocumentSource;
  sourceOrganization: string; // Cơ quan ban hành
  issuedDate: string; // Ngày ban hành
  receivedDate?: string; // Ngày nhận
  effectiveDate?: string; // Ngày hiệu lực
  expiryDate?: string; // Ngày hết hiệu lực
  status: DocumentStatus;
  priority: PriorityLevel;
  summary: string; // Tóm tắt nội dung
  content?: string; // Nội dung chi tiết
  attachments: Attachment[]; // File đính kèm
  signatories: Signatory[]; // Người ký
  relatedDocuments: string[]; // Văn bản liên quan
  tags: string[];
  category?: string; // Lĩnh vực
  recipientDepartments?: string[]; // Phòng ban nhận
  confidentialityLevel?: "PUBLIC" | "INTERNAL" | "CONFIDENTIAL" | "SECRET"; // Độ mật
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  notes?: string;
  viewCount?: number; // Số lượt xem
  downloadCount?: number; // Số lượt tải
}

export interface Attachment {
  id: string;
  fileName: string;
  fileSize: number; // in bytes
  fileType: string; // pdf, docx, xlsx, etc.
  uploadedAt: string;
  uploadedBy: string;
  url?: string;
}

// Sample Documents Data
export const sampleDocuments: Document[] = [
  {
    id: "DOC001",
    documentNumber: "123/ĐHQGHN-KHCNMT",
    title: "Về việc triển khai chương trình đào tạo mới năm học 2024-2025",
    type: "DISPATCH",
    source: "VNU_HANOI",
    sourceOrganization: "Đại học Quốc gia Hà Nội",
    issuedDate: "2024-09-15",
    receivedDate: "2024-09-16",
    effectiveDate: "2024-10-01",
    status: "PENDING_SIGNATURE",
    priority: "HIGH",
    category: "Đào tạo",
    recipientDepartments: ["Phòng Đào tạo", "Các Khoa", "Phòng Khảo thí"],
    confidentialityLevel: "INTERNAL",
    summary: "Triển khai chương trình đào tạo theo chuẩn đầu ra mới, cập nhật nội dung và phương pháp giảng dạy phù hợp với yêu cầu của thị trường lao động và chuẩn quốc tế",
    content: "Căn cứ Quyết định số 123/QĐ-ĐHQGHN ngày 01/09/2024 của Giám đốc ĐHQG Hà Nội về việc phê duyệt chương trình đào tạo mới...",
    attachments: [
      {
        id: "ATT001",
        fileName: "chuong-trinh-dao-tao-2024.pdf",
        fileSize: 2458624,
        fileType: "pdf",
        uploadedAt: "2024-09-15T08:30:00",
        uploadedBy: "Nguyễn Thị Lan"
      },
      {
        id: "ATT002",
        fileName: "de-an-chi-tiet.docx",
        fileSize: 1024000,
        fileType: "docx",
        uploadedAt: "2024-09-15T09:00:00",
        uploadedBy: "Nguyễn Thị Lan"
      },
      {
        id: "ATT003",
        fileName: "bang-phan-bo-chuong-trinh.xlsx",
        fileSize: 512000,
        fileType: "xlsx",
        uploadedAt: "2024-09-15T09:30:00",
        uploadedBy: "Nguyễn Thị Lan"
      }
    ],
    signatories: [
      {
        id: "SIG001",
        name: "PGS.TS Nguyễn Văn Anh",
        position: "Hiệu trưởng",
        department: "Ban Giám hiệu",
        email: "nva@hus.edu.vn",
        phone: "024.38584615",
        status: "PENDING"
      },
      {
        id: "SIG002",
        name: "TS. Trần Thị Bình",
        position: "Trưởng phòng Đào tạo",
        department: "Phòng Đào tạo",
        email: "ttb@hus.edu.vn",
        phone: "024.38584620",
        status: "SIGNED",
        signedAt: "2024-09-20T14:30:00",
        comments: "Đã xem xét và đồng ý"
      }
    ],
    relatedDocuments: ["DOC002", "DOC010"],
    tags: ["Đào tạo", "Chương trình học", "Năm học 2024-2025", "Chuẩn đầu ra"],
    createdBy: "Nguyễn Thị Lan",
    createdAt: "2024-09-15T08:00:00",
    updatedAt: "2024-09-20T14:30:00",
    notes: "Cần hoàn thành ký duyệt trước ngày 25/09/2024. Đã gửi nhắc nhở đến Hiệu trưởng.",
    viewCount: 45,
    downloadCount: 12
  },
  {
    id: "DOC002",
    documentNumber: "08/2024/TT-BGDĐT",
    title: "Thông tư về việc ban hành quy chế tuyển sinh đại học hệ chính quy",
    type: "CIRCULAR",
    source: "MOET",
    sourceOrganization: "Bộ Giáo dục và Đào tạo",
    issuedDate: "2024-03-20",
    receivedDate: "2024-03-22",
    effectiveDate: "2024-04-01",
    expiryDate: "2025-12-31",
    status: "ISSUED",
    priority: "URGENT",
    category: "Tuyển sinh",
    recipientDepartments: ["Phòng Đào tạo", "Phòng Khảo thí", "Ban Tuyển sinh"],
    confidentialityLevel: "PUBLIC",
    summary: "Quy định về điều kiện, hồ sơ, thời gian và phương thức tuyển sinh đại học năm 2024. Áp dụng cho tất cả các cơ sở giáo dục đại học trên toàn quốc.",
    content: "Căn cứ Luật Giáo dục đại học ngày 18 tháng 6 năm 2012; Căn cứ Nghị định số 99/2019/NĐ-CP...",
    attachments: [
      {
        id: "ATT004",
        fileName: "thong-tu-08-2024-tt-bgddt.pdf",
        fileSize: 3145728,
        fileType: "pdf",
        uploadedAt: "2024-03-22T09:00:00",
        uploadedBy: "Phạm Văn Cường"
      },
      {
        id: "ATT005",
        fileName: "huong-dan-thuc-hien.pdf",
        fileSize: 1572864,
        fileType: "pdf",
        uploadedAt: "2024-03-22T09:15:00",
        uploadedBy: "Phạm Văn Cường"
      }
    ],
    signatories: [
      {
        id: "SIG003",
        name: "Nguyễn Kim Sơn",
        position: "Bộ trưởng Bộ GD&ĐT",
        department: "Bộ Giáo dục và Đào tạo",
        status: "SIGNED",
        signedAt: "2024-03-20T16:00:00"
      }
    ],
    relatedDocuments: ["DOC001", "DOC003", "DOC011"],
    tags: ["Tuyển sinh", "Quy chế", "BGDĐT", "Đại học", "Chính quy"],
    createdBy: "Phạm Văn Cường",
    createdAt: "2024-03-22T09:00:00",
    updatedAt: "2024-03-22T09:00:00",
    viewCount: 235,
    downloadCount: 89
  },
  {
    id: "DOC003",
    documentNumber: "456/BC-HSB",
    title: "Báo cáo kết quả tuyển sinh đại học năm 2024",
    type: "REPORT",
    source: "INTERNAL",
    sourceOrganization: "Trường ĐH Khoa học Xã hội và Nhân văn",
    issuedDate: "2024-09-01",
    status: "SIGNED",
    priority: "MEDIUM",
    category: "Báo cáo - Thống kê",
    recipientDepartments: ["Ban Giám hiệu", "Phòng Đào tạo", "ĐHQG Hà Nội"],
    confidentialityLevel: "INTERNAL",
    summary: "Tổng hợp kết quả tuyển sinh đại học năm 2024, phân tích số liệu chi tiết theo ngành, theo phương thức tuyển sinh và đề xuất giải pháp cải thiện cho năm sau",
    content: "Kính gửi: Ban Giám hiệu và ĐHQG Hà Nội. Căn cứ kế hoạch tuyển sinh năm 2024...",
    attachments: [
      {
        id: "ATT006",
        fileName: "bao-cao-tuyen-sinh-2024.pdf",
        fileSize: 5242880,
        fileType: "pdf",
        uploadedAt: "2024-09-01T10:00:00",
        uploadedBy: "Lê Thị Mai"
      },
      {
        id: "ATT007",
        fileName: "bien-ban-hop.docx",
        fileSize: 819200,
        fileType: "docx",
        uploadedAt: "2024-09-01T10:30:00",
        uploadedBy: "Lê Thị Mai"
      },
      {
        id: "ATT008",
        fileName: "du-lieu-thong-ke.xlsx",
        fileSize: 2097152,
        fileType: "xlsx",
        uploadedAt: "2024-09-01T11:00:00",
        uploadedBy: "Lê Thị Mai"
      },
      {
        id: "ATT009",
        fileName: "bieu-do-phan-tich.pptx",
        fileSize: 4194304,
        fileType: "pptx",
        uploadedAt: "2024-09-01T11:30:00",
        uploadedBy: "Lê Thị Mai"
      }
    ],
    signatories: [
      {
        id: "SIG004",
        name: "PGS.TS Lê Văn Chiến",
        position: "Hiệu trưởng",
        department: "Ban Giám hiệu",
        email: "lvc@hus.edu.vn",
        status: "SIGNED",
        signedAt: "2024-09-05T16:20:00",
        comments: "Báo cáo chi tiết và đầy đủ. Đồng ý các đề xuất."
      },
      {
        id: "SIG005",
        name: "ThS. Hoàng Văn Dũng",
        position: "Trưởng ban Tuyển sinh",
        department: "Ban Tuyển sinh",
        email: "hvd@hus.edu.vn",
        status: "SIGNED",
        signedAt: "2024-09-03T14:00:00"
      }
    ],
    relatedDocuments: ["DOC002", "DOC011"],
    tags: ["Báo cáo", "Tuyển sinh", "Thống kê", "Năm 2024", "Phân tích"],
    createdBy: "Lê Thị Mai",
    createdAt: "2024-09-01T10:00:00",
    updatedAt: "2024-09-05T16:20:00",
    viewCount: 78,
    downloadCount: 23
  },
  {
    id: "DOC004",
    documentNumber: "12/2024/QĐ-CA",
    title: "Quyết định về việc tăng cường an ninh, an toàn trong các cơ sở giáo dục",
    type: "DECISION",
    source: "MPS",
    sourceOrganization: "Bộ Công an",
    issuedDate: "2024-08-10",
    receivedDate: "2024-08-12",
    effectiveDate: "2024-09-01",
    status: "ISSUED",
    priority: "HIGH",
    category: "An ninh - An toàn",
    recipientDepartments: ["Phòng Hành chính", "Bảo vệ", "Các Khoa"],
    confidentialityLevel: "CONFIDENTIAL",
    summary: "Quy định các biện pháp tăng cường công tác bảo đảm an ninh trật tự, an toàn tại các trường đại học. Bao gồm hệ thống giám sát, kiểm soát ra vào và ứng phó khẩn cấp.",
    content: "Căn cứ Luật Công an nhân dân ngày 19 tháng 11 năm 2018; Căn cứ Nghị định số...",
    attachments: [
      {
        id: "ATT010",
        fileName: "quyet-dinh-12-2024-qd-ca.pdf",
        fileSize: 1835008,
        fileType: "pdf",
        uploadedAt: "2024-08-12T11:00:00",
        uploadedBy: "Vũ Văn Thành"
      },
      {
        id: "ATT011",
        fileName: "phu-luc-huong-dan.pdf",
        fileSize: 1048576,
        fileType: "pdf",
        uploadedAt: "2024-08-12T11:15:00",
        uploadedBy: "Vũ Văn Thành"
      }
    ],
    signatories: [
      {
        id: "SIG006",
        name: "Thiếu tướng Nguyễn Duy Ngọc",
        position: "Thứ trưởng Bộ Công an",
        department: "Bộ Công an",
        status: "SIGNED",
        signedAt: "2024-08-10T15:30:00"
      }
    ],
    relatedDocuments: ["DOC013"],
    tags: ["An ninh", "An toàn", "Bộ Công an", "Bảo vệ", "Giám sát"],
    createdBy: "Vũ Văn Thành",
    createdAt: "2024-08-12T11:00:00",
    updatedAt: "2024-08-12T11:00:00",
    viewCount: 156,
    downloadCount: 45
  },
  {
    id: "DOC005",
    documentNumber: "789/ĐHQGHN-ĐHKHXHNV",
    title: "Đề nghị phê duyệt kế hoạch đầu tư nâng cấp cơ sở vật chất",
    type: "REQUEST",
    source: "INTERNAL",
    sourceOrganization: "Trường ĐH Khoa học Xã hội và Nhân văn",
    issuedDate: "2024-10-15",
    status: "PENDING_REVIEW",
    priority: "MEDIUM",
    category: "Đầu tư - Xây dựng",
    recipientDepartments: ["ĐHQG Hà Nội", "Phòng Kế hoạch - Tài chính"],
    confidentialityLevel: "INTERNAL",
    summary: "Đề nghị ĐHQG Hà Nội phê duyệt kế hoạch đầu tư 50 tỷ đồng để nâng cấp thư viện, phòng thực hành và hệ thống phòng học thông minh giai đoạn 2025-2027",
    content: "Kính gửi: Ban Giám đốc ĐHQG Hà Nội. Thực hiện Kế hoạch phát triển cơ sở vật chất...",
    attachments: [
      {
        id: "ATT012",
        fileName: "de-xuat-dau-tu.pdf",
        fileSize: 3670016,
        fileType: "pdf",
        uploadedAt: "2024-10-15T08:30:00",
        uploadedBy: "Đỗ Thị Hương"
      },
      {
        id: "ATT013",
        fileName: "du-toan-chi-phi.xlsx",
        fileSize: 1310720,
        fileType: "xlsx",
        uploadedAt: "2024-10-15T08:45:00",
        uploadedBy: "Đỗ Thị Hương"
      },
      {
        id: "ATT014",
        fileName: "ban-ve-thiet-ke.pdf",
        fileSize: 8388608,
        fileType: "pdf",
        uploadedAt: "2024-10-15T09:00:00",
        uploadedBy: "Đỗ Thị Hương"
      },
      {
        id: "ATT015",
        fileName: "bao-cao-kha-thi.docx",
        fileSize: 2097152,
        fileType: "docx",
        uploadedAt: "2024-10-15T09:30:00",
        uploadedBy: "Đỗ Thị Hương"
      }
    ],
    signatories: [
      {
        id: "SIG007",
        name: "PGS.TS Phạm Văn Đức",
        position: "Phó Hiệu trưởng",
        department: "Ban Giám hiệu",
        email: "pvd@hus.edu.vn",
        status: "PENDING"
      },
      {
        id: "SIG008",
        name: "ThS. Ngô Thị Hà",
        position: "Trưởng phòng Kế hoạch - Tài chính",
        department: "Phòng Kế hoạch - Tài chính",
        email: "nth@hus.edu.vn",
        status: "PENDING"
      }
    ],
    relatedDocuments: ["DOC014"],
    tags: ["Đầu tư", "Cơ sở vật chất", "Kế hoạch", "Nâng cấp", "Thư viện"],
    createdBy: "Đỗ Thị Hương",
    createdAt: "2024-10-15T08:30:00",
    updatedAt: "2024-10-15T08:30:00",
    notes: "Cần bổ sung thêm văn bản thẩm định kỹ thuật và đánh giá tác động môi trường",
    viewCount: 23,
    downloadCount: 8
  },
  {
    id: "DOC006",
    documentNumber: "234/ĐHQGHN-CTSV",
    title: "Hướng dẫn công tác hỗ trợ sinh viên năm học 2024-2025",
    type: "GUIDELINE",
    source: "VNU_HANOI",
    sourceOrganization: "Đại học Quốc gia Hà Nội",
    issuedDate: "2024-08-25",
    receivedDate: "2024-08-26",
    effectiveDate: "2024-09-01",
    status: "ISSUED",
    priority: "MEDIUM",
    category: "Công tác sinh viên",
    recipientDepartments: ["Phòng Công tác sinh viên", "Các Khoa", "Phòng Đào tạo"],
    confidentialityLevel: "INTERNAL",
    summary: "Hướng dẫn chi tiết về các chương trình hỗ trợ sinh viên: học bổng, tư vấn tâm lý, hỗ trợ học tập, hoạt động ngoại khóa và việc làm",
    content: "Nhằm nâng cao chất lượng công tác hỗ trợ sinh viên, ĐHQG Hà Nội ban hành hướng dẫn...",
    attachments: [
      {
        id: "ATT016",
        fileName: "huong-dan-ctsv-2024.pdf",
        fileSize: 2621440,
        fileType: "pdf",
        uploadedAt: "2024-08-26T09:00:00",
        uploadedBy: "Bùi Thị Lan"
      },
      {
        id: "ATT017",
        fileName: "mau-bieu-ho-tro.xlsx",
        fileSize: 524288,
        fileType: "xlsx",
        uploadedAt: "2024-08-26T09:15:00",
        uploadedBy: "Bùi Thị Lan"
      }
    ],
    signatories: [
      {
        id: "SIG009",
        name: "PGS.TS Trần Thị Mai",
        position: "Phó Giám đốc ĐHQG Hà Nội",
        department: "ĐHQG Hà Nội",
        status: "SIGNED",
        signedAt: "2024-08-25T16:00:00"
      }
    ],
    relatedDocuments: ["DOC015"],
    tags: ["Công tác sinh viên", "Hỗ trợ", "Học bổng", "Tư vấn", "ĐHQG Hà Nội"],
    createdBy: "Bùi Thị Lan",
    createdAt: "2024-08-26T09:00:00",
    updatedAt: "2024-08-26T09:00:00",
    viewCount: 189,
    downloadCount: 67
  },
  {
    id: "DOC007",
    documentNumber: "567/NQ-HĐQT",
    title: "Nghị quyết về việc điều chỉnh học phí năm học 2025-2026",
    type: "RESOLUTION",
    source: "INTERNAL",
    sourceOrganization: "Hội đồng Quản trị - Trường ĐHKHXHNV",
    issuedDate: "2024-10-20",
    status: "DRAFT",
    priority: "HIGH",
    category: "Tài chính",
    recipientDepartments: ["Phòng Kế hoạch - Tài chính", "Phòng Đào tạo", "Ban Giám hiệu"],
    confidentialityLevel: "CONFIDENTIAL",
    summary: "Nghị quyết điều chỉnh mức học phí các chương trình đào tạo từ năm học 2025-2026, tăng 15% so với năm trước để đảm bảo chất lượng đào tạo",
    content: "Hội đồng Quản trị trường ĐHKHXHNV, sau khi xem xét tình hình tài chính và đề xuất...",
    attachments: [
      {
        id: "ATT018",
        fileName: "du-thao-nghi-quyet.docx",
        fileSize: 716800,
        fileType: "docx",
        uploadedAt: "2024-10-20T10:00:00",
        uploadedBy: "Nguyễn Văn Hùng"
      },
      {
        id: "ATT019",
        fileName: "bang-hoc-phi-de-xuat.xlsx",
        fileSize: 409600,
        fileType: "xlsx",
        uploadedAt: "2024-10-20T10:15:00",
        uploadedBy: "Nguyễn Văn Hùng"
      },
      {
        id: "ATT020",
        fileName: "bao-cao-tai-chinh.pdf",
        fileSize: 3145728,
        fileType: "pdf",
        uploadedAt: "2024-10-20T10:30:00",
        uploadedBy: "Nguyễn Văn Hùng"
      }
    ],
    signatories: [
      {
        id: "SIG010",
        name: "GS.TS Nguyễn Văn Khoa",
        position: "Chủ tịch Hội đồng Quản trị",
        department: "Hội đồng Quản trị",
        email: "nvk@hus.edu.vn",
        status: "PENDING"
      },
      {
        id: "SIG011",
        name: "PGS.TS Lê Văn Chiến",
        position: "Hiệu trưởng",
        department: "Ban Giám hiệu",
        email: "lvc@hus.edu.vn",
        status: "PENDING"
      }
    ],
    relatedDocuments: ["DOC016"],
    tags: ["Học phí", "Tài chính", "Nghị quyết", "Điều chỉnh", "2025-2026"],
    createdBy: "Nguyễn Văn Hùng",
    createdAt: "2024-10-20T10:00:00",
    updatedAt: "2024-10-20T10:30:00",
    notes: "Cần lấy ý kiến sinh viên và phụ huynh trước khi ban hành chính thức",
    viewCount: 12,
    downloadCount: 3
  },
  {
    id: "DOC008",
    documentNumber: "15/2024/TT-BKHCN",
    title: "Thông tư về quản lý hoạt động nghiên cứu khoa học trong các trường đại học",
    type: "CIRCULAR",
    source: "MOST",
    sourceOrganization: "Bộ Khoa học và Công nghệ",
    issuedDate: "2024-07-10",
    receivedDate: "2024-07-12",
    effectiveDate: "2024-08-01",
    expiryDate: "2027-07-31",
    status: "ISSUED",
    priority: "MEDIUM",
    category: "Nghiên cứu khoa học",
    recipientDepartments: ["Phòng Khoa học - Công nghệ", "Các Khoa", "Phòng Đào tạo"],
    confidentialityLevel: "PUBLIC",
    summary: "Quy định về đăng ký, thực hiện, nghiệm thu và công bố kết quả nghiên cứu khoa học. Hướng dẫn quản lý kinh phí và đạo đức nghiên cứu khoa học",
    content: "Căn cứ Luật Khoa học và Công nghệ ngày 18 tháng 6 năm 2013...",
    attachments: [
      {
        id: "ATT021",
        fileName: "thong-tu-15-2024-tt-bkhcn.pdf",
        fileSize: 2883584,
        fileType: "pdf",
        uploadedAt: "2024-07-12T09:00:00",
        uploadedBy: "Trần Văn Nam"
      },
      {
        id: "ATT022",
        fileName: "mau-bieu-quan-ly-nckh.xlsx",
        fileSize: 614400,
        fileType: "xlsx",
        uploadedAt: "2024-07-12T09:30:00",
        uploadedBy: "Trần Văn Nam"
      }
    ],
    signatories: [
      {
        id: "SIG012",
        name: "Huỳnh Thành Đạt",
        position: "Bộ trưởng Bộ KH&CN",
        department: "Bộ Khoa học và Công nghệ",
        status: "SIGNED",
        signedAt: "2024-07-10T16:00:00"
      }
    ],
    relatedDocuments: ["DOC017"],
    tags: ["Nghiên cứu khoa học", "Quản lý", "BKHCN", "Đạo đức nghiên cứu"],
    createdBy: "Trần Văn Nam",
    createdAt: "2024-07-12T09:00:00",
    updatedAt: "2024-07-12T09:30:00",
    viewCount: 201,
    downloadCount: 78
  },
  {
    id: "DOC009",
    documentNumber: "345/ĐHQGHN-HTQT",
    title: "Quyết định phê duyệt các chương trình hợp tác quốc tế năm 2025",
    type: "DECISION",
    source: "VNU_HANOI",
    sourceOrganization: "Đại học Quốc gia Hà Nội",
    issuedDate: "2024-10-05",
    receivedDate: "2024-10-06",
    effectiveDate: "2025-01-01",
    status: "SIGNED",
    priority: "HIGH",
    category: "Hợp tác quốc tế",
    recipientDepartments: ["Phòng Hợp tác quốc tế", "Các Khoa", "Phòng Đào tạo"],
    confidentialityLevel: "INTERNAL",
    summary: "Phê duyệt 15 chương trình hợp tác quốc tế với các trường đại học ở Mỹ, Anh, Pháp, Nhật, Hàn Quốc về trao đổi sinh viên, giảng viên và nghiên cứu chung",
    content: "Căn cứ Chiến lược phát triển quốc tế của ĐHQG Hà Nội giai đoạn 2021-2030...",
    attachments: [
      {
        id: "ATT023",
        fileName: "quyet-dinh-htqt-2025.pdf",
        fileSize: 2097152,
        fileType: "pdf",
        uploadedAt: "2024-10-06T08:30:00",
        uploadedBy: "Lê Thị Phương"
      },
      {
        id: "ATT024",
        fileName: "danh-sach-chuong-trinh.xlsx",
        fileSize: 819200,
        fileType: "xlsx",
        uploadedAt: "2024-10-06T09:00:00",
        uploadedBy: "Lê Thị Phương"
      },
      {
        id: "ATT025",
        fileName: "hiep-dinh-hop-tac.pdf",
        fileSize: 5242880,
        fileType: "pdf",
        uploadedAt: "2024-10-06T09:30:00",
        uploadedBy: "Lê Thị Phương"
      }
    ],
    signatories: [
      {
        id: "SIG013",
        name: "GS.TS Lê Quân",
        position: "Giám đốc ĐHQG Hà Nội",
        department: "ĐHQG Hà Nội",
        email: "lequan@vnu.edu.vn",
        status: "SIGNED",
        signedAt: "2024-10-05T15:00:00"
      },
      {
        id: "SIG014",
        name: "TS. Hoàng Thị Thanh",
        position: "Trưởng phòng Hợp tác quốc tế",
        department: "Phòng Hợp tác quốc tế",
        email: "htt@vnu.edu.vn",
        status: "SIGNED",
        signedAt: "2024-10-03T14:00:00"
      }
    ],
    relatedDocuments: ["DOC018"],
    tags: ["Hợp tác quốc tế", "Trao đổi sinh viên", "Nghiên cứu", "2025"],
    createdBy: "Lê Thị Phương",
    createdAt: "2024-10-06T08:30:00",
    updatedAt: "2024-10-06T09:30:00",
    viewCount: 145,
    downloadCount: 52
  },
  {
    id: "DOC010",
    documentNumber: "678/CV-KTKĐCLGD",
    title: "Công văn về việc chuẩn bị đón đoàn kiểm định chất lượng giáo dục",
    type: "DISPATCH",
    source: "INTERNAL",
    sourceOrganization: "Trường ĐH Khoa học Xã hội và Nhân văn",
    issuedDate: "2024-10-25",
    status: "PENDING_SIGNATURE",
    priority: "URGENT",
    category: "Kiểm định chất lượng",
    recipientDepartments: ["Các Khoa", "Phòng Đào tạo", "Phòng KTKĐCLGD", "Phòng Hành chính"],
    confidentialityLevel: "INTERNAL",
    summary: "Hướng dẫn các đơn vị chuẩn bị hồ sơ, tài liệu và tiếp đón đoàn kiểm định chất lượng giáo dục đến làm việc từ ngày 15-20/11/2024",
    content: "Kính gửi: Các đơn vị trong toàn trường. Theo kế hoạch của Bộ GD&ĐT, đoàn kiểm định...",
    attachments: [
      {
        id: "ATT026",
        fileName: "cong-van-kiem-dinh.pdf",
        fileSize: 1048576,
        fileType: "pdf",
        uploadedAt: "2024-10-25T08:00:00",
        uploadedBy: "Phạm Thị Nga"
      },
      {
        id: "ATT027",
        fileName: "danh-sach-ho-so.xlsx",
        fileSize: 307200,
        fileType: "xlsx",
        uploadedAt: "2024-10-25T08:30:00",
        uploadedBy: "Phạm Thị Nga"
      },
      {
        id: "ATT028",
        fileName: "lich-trinh-lam-viec.docx",
        fileSize: 204800,
        fileType: "docx",
        uploadedAt: "2024-10-25T09:00:00",
        uploadedBy: "Phạm Thị Nga"
      }
    ],
    signatories: [
      {
        id: "SIG015",
        name: "PGS.TS Lê Văn Chiến",
        position: "Hiệu trưởng",
        department: "Ban Giám hiệu",
        email: "lvc@hus.edu.vn",
        status: "PENDING"
      },
      {
        id: "SIG016",
        name: "TS. Vũ Thị Hồng",
        position: "Trưởng phòng KTKĐCLGD",
        department: "Phòng KTKĐCLGD",
        email: "vth@hus.edu.vn",
        status: "SIGNED",
        signedAt: "2024-10-24T16:00:00"
      }
    ],
    relatedDocuments: ["DOC001", "DOC019"],
    tags: ["Kiểm định", "Chất lượng giáo dục", "Chuẩn bị", "Khẩn cấp"],
    createdBy: "Phạm Thị Nga",
    createdAt: "2024-10-25T08:00:00",
    updatedAt: "2024-10-25T09:00:00",
    notes: "Yêu cầu tất cả các đơn vị hoàn thành chuẩn bị trước ngày 10/11/2024",
    viewCount: 87,
    downloadCount: 34
  },
  {
    id: "DOC011",
    documentNumber: "901/TB-TS",
    title: "Thông báo lịch thi tuyển sinh đại học năm 2025",
    type: "NOTIFICATION",
    source: "INTERNAL",
    sourceOrganization: "Ban Tuyển sinh - Trường ĐHKHXHNV",
    issuedDate: "2024-04-15",
    status: "ISSUED",
    priority: "HIGH",
    category: "Tuyển sinh",
    recipientDepartments: ["Phòng Khảo thí", "Các Khoa", "Website"],
    confidentialityLevel: "PUBLIC",
    summary: "Công bố lịch thi, địa điểm thi và quy chế thi tuyển sinh đại học năm 2025. Thí sinh có thể xem chi tiết trên website của trường.",
    content: "Căn cứ Quy chế tuyển sinh đại học và Kế hoạch tuyển sinh năm 2025...",
    attachments: [
      {
        id: "ATT029",
        fileName: "thong-bao-lich-thi-2025.pdf",
        fileSize: 1572864,
        fileType: "pdf",
        uploadedAt: "2024-04-15T10:00:00",
        uploadedBy: "Nguyễn Thị Hoa"
      },
      {
        id: "ATT030",
        fileName: "danh-sach-phong-thi.xlsx",
        fileSize: 614400,
        fileType: "xlsx",
        uploadedAt: "2024-04-15T10:30:00",
        uploadedBy: "Nguyễn Thị Hoa"
      }
    ],
    signatories: [
      {
        id: "SIG017",
        name: "ThS. Hoàng Văn Dũng",
        position: "Trưởng ban Tuyển sinh",
        department: "Ban Tuyển sinh",
        email: "hvd@hus.edu.vn",
        status: "SIGNED",
        signedAt: "2024-04-15T09:30:00"
      }
    ],
    relatedDocuments: ["DOC002", "DOC003"],
    tags: ["Tuyển sinh", "Lịch thi", "2025", "Thông báo"],
    createdBy: "Nguyễn Thị Hoa",
    createdAt: "2024-04-15T10:00:00",
    updatedAt: "2024-04-15T10:30:00",
    viewCount: 512,
    downloadCount: 234
  },
  {
    id: "DOC012",
    documentNumber: "20/2024/QĐ-BGDĐT",
    title: "Quyết định ban hành khung chương trình đào tạo đại học ngành Ngôn ngữ Anh",
    type: "DECISION",
    source: "MOET",
    sourceOrganization: "Bộ Giáo dục và Đào tạo",
    issuedDate: "2024-06-15",
    receivedDate: "2024-06-17",
    effectiveDate: "2024-09-01",
    status: "ISSUED",
    priority: "HIGH",
    category: "Chương trình đào tạo",
    recipientDepartments: ["Khoa Ngôn ngữ Anh", "Phòng Đào tạo"],
    confidentialityLevel: "PUBLIC",
    summary: "Ban hành khung chương trình đào tạo chuẩn cho ngành Ngôn ngữ Anh bậc đại học, áp dụng cho tất cả các trường đại học trên toàn quốc",
    content: "Căn cứ Luật Giáo dục đại học; Căn cứ Thông tư số 08/2021/TT-BGDĐT...",
    attachments: [
      {
        id: "ATT031",
        fileName: "quyet-dinh-20-2024.pdf",
        fileSize: 3932160,
        fileType: "pdf",
        uploadedAt: "2024-06-17T09:00:00",
        uploadedBy: "Lê Văn Tùng"
      },
      {
        id: "ATT032",
        fileName: "khung-chuong-trinh-nganh-anh.xlsx",
        fileSize: 1048576,
        fileType: "xlsx",
        uploadedAt: "2024-06-17T09:30:00",
        uploadedBy: "Lê Văn Tùng"
      }
    ],
    signatories: [
      {
        id: "SIG018",
        name: "Nguyễn Kim Sơn",
        position: "Bộ trưởng Bộ GD&ĐT",
        department: "Bộ Giáo dục và Đào tạo",
        status: "SIGNED",
        signedAt: "2024-06-15T16:00:00"
      }
    ],
    relatedDocuments: ["DOC001", "DOC020"],
    tags: ["Chương trình đào tạo", "Ngôn ngữ Anh", "BGDĐT", "Khung chuẩn"],
    createdBy: "Lê Văn Tùng",
    createdAt: "2024-06-17T09:00:00",
    updatedAt: "2024-06-17T09:30:00",
    viewCount: 267,
    downloadCount: 98
  },
  {
    id: "DOC013",
    documentNumber: "445/CV-PCCC",
    title: "Công văn về việc tổ chức tập huấn phòng cháy chữa cháy",
    type: "DISPATCH",
    source: "INTERNAL",
    sourceOrganization: "Phòng Hành chính - Tổng hợp",
    issuedDate: "2024-10-28",
    status: "ISSUED",
    priority: "MEDIUM",
    category: "An toàn PCCC",
    recipientDepartments: ["Các Khoa", "Các Phòng ban", "Ký túc xá"],
    confidentialityLevel: "INTERNAL",
    summary: "Tổ chức khóa tập huấn phòng cháy chữa cháy cho cán bộ, giảng viên, sinh viên vào ngày 15/11/2024. Đăng ký tham gia trước 05/11/2024",
    content: "Thực hiện chỉ đạo của Ban Giám hiệu về công tác an toàn PCCC...",
    attachments: [
      {
        id: "ATT033",
        fileName: "cong-van-pccc.pdf",
        fileSize: 819200,
        fileType: "pdf",
        uploadedAt: "2024-10-28T08:30:00",
        uploadedBy: "Trần Văn Sơn"
      },
      {
        id: "ATT034",
        fileName: "mau-dang-ky-tap-huan.docx",
        fileSize: 102400,
        fileType: "docx",
        uploadedAt: "2024-10-28T09:00:00",
        uploadedBy: "Trần Văn Sơn"
      }
    ],
    signatories: [
      {
        id: "SIG019",
        name: "TS. Nguyễn Văn Quang",
        position: "Trưởng phòng Hành chính - Tổng hợp",
        department: "Phòng Hành chính",
        email: "nvq@hus.edu.vn",
        status: "SIGNED",
        signedAt: "2024-10-28T08:00:00"
      }
    ],
    relatedDocuments: ["DOC004"],
    tags: ["PCCC", "Tập huấn", "An toàn", "Phòng cháy"],
    createdBy: "Trần Văn Sơn",
    createdAt: "2024-10-28T08:30:00",
    updatedAt: "2024-10-28T09:00:00",
    viewCount: 56,
    downloadCount: 23
  },
  {
    id: "DOC014",
    documentNumber: "556/HD-KHTC",
    title: "Hướng dẫn lập và thực hiện kế hoạch tài chính năm 2025",
    type: "GUIDELINE",
    source: "INTERNAL",
    sourceOrganization: "Phòng Kế hoạch - Tài chính",
    issuedDate: "2024-10-30",
    status: "ISSUED",
    priority: "HIGH",
    category: "Tài chính",
    recipientDepartments: ["Các Khoa", "Các Phòng ban", "Các Trung tâm"],
    confidentialityLevel: "INTERNAL",
    summary: "Hướng dẫn chi tiết quy trình lập dự toán, phân bổ ngân sách và quyết toán tài chính năm 2025. Deadline nộp kế hoạch: 30/11/2024",
    content: "Căn cứ Luật Ngân sách Nhà nước và Quy chế quản lý tài chính của trường...",
    attachments: [
      {
        id: "ATT035",
        fileName: "huong-dan-tai-chinh-2025.pdf",
        fileSize: 2621440,
        fileType: "pdf",
        uploadedAt: "2024-10-30T09:00:00",
        uploadedBy: "Đặng Thị Hằng"
      },
      {
        id: "ATT036",
        fileName: "mau-ke-hoach-tai-chinh.xlsx",
        fileSize: 716800,
        fileType: "xlsx",
        uploadedAt: "2024-10-30T09:30:00",
        uploadedBy: "Đặng Thị Hằng"
      },
      {
        id: "ATT037",
        fileName: "bien-ban-hop-huong-dan.docx",
        fileSize: 409600,
        fileType: "docx",
        uploadedAt: "2024-10-30T10:00:00",
        uploadedBy: "Đặng Thị Hằng"
      }
    ],
    signatories: [
      {
        id: "SIG020",
        name: "ThS. Ngô Thị Hà",
        position: "Trưởng phòng Kế hoạch - Tài chính",
        department: "Phòng Kế hoạch - Tài chính",
        email: "nth@hus.edu.vn",
        status: "SIGNED",
        signedAt: "2024-10-30T08:30:00"
      }
    ],
    relatedDocuments: ["DOC005", "DOC007"],
    tags: ["Tài chính", "Kế hoạch", "Ngân sách", "2025", "Dự toán"],
    createdBy: "Đặng Thị Hằng",
    createdAt: "2024-10-30T09:00:00",
    updatedAt: "2024-10-30T10:00:00",
    viewCount: 98,
    downloadCount: 45
  },
  {
    id: "DOC015",
    documentNumber: "778/TB-HB",
    title: "Thông báo danh sách sinh viên đạt học bổng học kỳ I năm học 2024-2025",
    type: "NOTIFICATION",
    source: "INTERNAL",
    sourceOrganization: "Phòng Công tác sinh viên",
    issuedDate: "2024-10-29",
    status: "ISSUED",
    priority: "MEDIUM",
    category: "Học bổng",
    recipientDepartments: ["Các Khoa", "Website", "Phòng Kế hoạch - Tài chính"],
    confidentialityLevel: "PUBLIC",
    summary: "Công bố danh sách 156 sinh viên đạt học bổng khuyến khích học tập học kỳ I năm học 2024-2025 với tổng giá trị 780 triệu đồng",
    content: "Căn cứ Quy chế học bổng của trường và kết quả học tập học kỳ I...",
    attachments: [
      {
        id: "ATT038",
        fileName: "thong-bao-hoc-bong-hk1-2024.pdf",
        fileSize: 1310720,
        fileType: "pdf",
        uploadedAt: "2024-10-29T10:00:00",
        uploadedBy: "Vũ Thị Thanh"
      },
      {
        id: "ATT039",
        fileName: "danh-sach-sinh-vien-dat-hoc-bong.xlsx",
        fileSize: 524288,
        fileType: "xlsx",
        uploadedAt: "2024-10-29T10:30:00",
        uploadedBy: "Vũ Thị Thanh"
      }
    ],
    signatories: [
      {
        id: "SIG021",
        name: "ThS. Phạm Thị Lan",
        position: "Trưởng phòng Công tác sinh viên",
        department: "Phòng Công tác sinh viên",
        email: "ptl@hus.edu.vn",
        status: "SIGNED",
        signedAt: "2024-10-29T09:30:00"
      }
    ],
    relatedDocuments: ["DOC006"],
    tags: ["Học bổng", "Sinh viên", "Học kỳ I", "2024-2025", "Danh sách"],
    createdBy: "Vũ Thị Thanh",
    createdAt: "2024-10-29T10:00:00",
    updatedAt: "2024-10-29T10:30:00",
    viewCount: 432,
    downloadCount: 178
  }
];

// Helper functions
export const getDocumentsBySource = (source: DocumentSource): Document[] => {
  return sampleDocuments.filter(doc => doc.source === source);
};

export const getDocumentsByType = (type: DocumentType): Document[] => {
  return sampleDocuments.filter(doc => doc.type === type);
};

export const getDocumentsByStatus = (status: DocumentStatus): Document[] => {
  return sampleDocuments.filter(doc => doc.status === status);
};

export const getDocumentsByPriority = (priority: PriorityLevel): Document[] => {
  return sampleDocuments.filter(doc => doc.priority === priority);
};

export const getPendingSignatureDocuments = (): Document[] => {
  return sampleDocuments.filter(doc => doc.status === "PENDING_SIGNATURE");
};

export const getUrgentDocuments = (): Document[] => {
  return sampleDocuments.filter(doc => doc.priority === "URGENT");
};

export const searchDocuments = (query: string): Document[] => {
  const lowerQuery = query.toLowerCase();
  return sampleDocuments.filter(doc =>
    doc.title.toLowerCase().includes(lowerQuery) ||
    doc.documentNumber.toLowerCase().includes(lowerQuery) ||
    doc.summary.toLowerCase().includes(lowerQuery) ||
    doc.sourceOrganization.toLowerCase().includes(lowerQuery) ||
    doc.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
  );
};

export const getDocumentById = (id: string): Document | undefined => {
  return sampleDocuments.find(doc => doc.id === id);
};

export const getRelatedDocuments = (documentId: string): Document[] => {
  const doc = getDocumentById(documentId);
  if (!doc) return [];
  
  return sampleDocuments.filter(d => 
    doc.relatedDocuments.includes(d.id)
  );
};

// Statistics
export const getDocumentStatistics = () => {
  return {
    total: sampleDocuments.length,
    byStatus: {
      draft: getDocumentsByStatus("DRAFT").length,
      pendingReview: getDocumentsByStatus("PENDING_REVIEW").length,
      pendingSignature: getDocumentsByStatus("PENDING_SIGNATURE").length,
      signed: getDocumentsByStatus("SIGNED").length,
      issued: getDocumentsByStatus("ISSUED").length,
      archived: getDocumentsByStatus("ARCHIVED").length,
      rejected: getDocumentsByStatus("REJECTED").length,
      expired: getDocumentsByStatus("EXPIRED").length,
    },
    byPriority: {
      low: getDocumentsByPriority("LOW").length,
      medium: getDocumentsByPriority("MEDIUM").length,
      high: getDocumentsByPriority("HIGH").length,
      urgent: getDocumentsByPriority("URGENT").length,
    },
    bySource: {
      vnuHanoi: getDocumentsBySource("VNU_HANOI").length,
      moe: getDocumentsBySource("MOE").length,
      mps: getDocumentsBySource("MPS").length,
      moet: getDocumentsBySource("MOET").length,
      most: getDocumentsBySource("MOST").length,
      internal: getDocumentsBySource("INTERNAL").length,
      other: getDocumentsBySource("OTHER").length,
    },
    totalAttachments: sampleDocuments.reduce((sum, doc) => sum + doc.attachments.length, 0),
    totalViews: sampleDocuments.reduce((sum, doc) => sum + (doc.viewCount || 0), 0),
    totalDownloads: sampleDocuments.reduce((sum, doc) => sum + (doc.downloadCount || 0), 0),
  };
};

export default sampleDocuments;