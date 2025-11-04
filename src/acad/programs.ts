// src/features/academics/data/programs.ts
import { ProgramCatalog } from "./academicmodel";

export const programs: ProgramCatalog = {
  bachelor: [
    { code: "MET",  name: "Management of Enterprise and Technology",           faculty: "FOM" },
    { code: "MAC",  name: "Marketing and Communication",                   faculty: "FOMAC" },
    { code: "HAT",  name: "Management of Human and Talent",                       faculty: "FOM" },
    { code: "MAS",  name: "Management and Security",                        faculty: "FONS" },
    { code: "BNS",  name: "Nontraditional Security",                      faculty: "FONS" },
    { code: "HAS",  name: "Management of Hospitality and Healthcare Services",            faculty: "FONS" },
  ],
  master: [
    { code: "HSB-MBA", name: "Master of Business Administration",          faculty: "FOM" },
    { code: "MOTE",    name: "Master of Technology and Entrepreneurship",  faculty: "FONS" },
    { code: "MNS",     name: "Master of Nontraditional Security",          faculty: "FONS" },
  ],
  phd: [
    { code: "DMS",     name: "Doctor of Management and Sustainable Development",               faculty: "FOM" },
  ],
};
