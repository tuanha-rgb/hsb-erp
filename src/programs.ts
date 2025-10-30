// src/features/academics/data/programs.ts
import { ProgramCatalog } from "./academicmodel";

export const programs: ProgramCatalog = {
  bachelor: [
    { code: "MET",  name: "Management Economics and Technology",           faculty: "FOM" },
    { code: "MAC",  name: "Marketing and Communication",                   faculty: "FOMAC" },
    { code: "HAT",  name: "Hospitality and Tourism",                       faculty: "FOM" },
    { code: "MAS",  name: "Management and Sustainability",                 faculty: "FOM" },
    { code: "BNS",  name: "Business and Nontraditional Security",          faculty: "FONS" },
    { code: "HAS",  name: "Health Administration and Security",            faculty: "FONS" },
  ],
  master: [
    { code: "HSB-MBA", name: "Master of Business Administration",          faculty: "FOM" },
    { code: "MOTE",    name: "Master of Technology and Entrepreneurship",  faculty: "FONS" },
    { code: "MNS",     name: "Master of Nontraditional Security",          faculty: "FONS" },
  ],
  phd: [
    { code: "DMS",     name: "Doctor of Management Science",               faculty: "FOM" },
  ],
};
