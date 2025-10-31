// src/features/academics/data/facultyMetrics.ts
import { FacultyMetric } from "./acad/academicmodel";

export const facultyMetrics: FacultyMetric[] = [
  { code: "FOM",   name: "Faculty of Management",                   timelyDelivery: 89.5, stdDev: 0.54, skewness: -0.32, kurtosis: 2.85 },
  { code: "FOMAC", name: "Faculty of Marketing and Communication",  timelyDelivery: 92.3, stdDev: 0.58, skewness: -0.28, kurtosis: 2.92 },
  { code: "FONS",  name: "Faculty of Nontraditional Security",      timelyDelivery: 94.1, stdDev: 0.47, skewness: -0.35, kurtosis: 3.12 },
];
