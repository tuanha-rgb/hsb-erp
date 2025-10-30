export const getDisciplineColor = (discipline: string): string => {
  switch (discipline) {
    case "Nontraditional Security": return "bg-blue-100 text-blue-700";
    case "Sustainable Development": return "bg-green-100 text-green-700";
    case "Engineering & IT": return "bg-purple-100 text-purple-700";
    case "Human Resources": return "bg-emerald-100 text-emerald-700";
    case "Finance": return "bg-teal-100 text-teal-700";
    case "Marketing": return "bg-pink-100 text-pink-700";
    case "Communication": return "bg-indigo-100 text-indigo-700";
    case "Law & Criminology": return "bg-sky-100 text-sky-700";
    default: return "bg-gray-100 text-gray-700";
  }
};

export const getStatusColor = (status: string): string => {
  // works for both project & publication & patent statuses
  switch (status) {
    case "Active": return "bg-green-100 text-green-700";
    case "Completed": return "bg-blue-100 text-blue-700";
    case "Pending": return "bg-yellow-100 text-yellow-700";
    case "Published": return "bg-green-100 text-green-700";
    case "Under Review": return "bg-orange-100 text-orange-700";
    case "Rejected": return "bg-red-100 text-red-700";
    case "Granted": return "bg-green-100 text-green-700";
    case "Under Examination": return "bg-amber-100 text-amber-700";
    case "International": return "bg-purple-100 text-purple-700";
    case "International Filing": return "bg-purple-100 text-purple-700";
    default: return "bg-gray-100 text-gray-700";
  }
};
