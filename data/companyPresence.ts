export interface StatePresence {
  status?: "Active" | "Upcoming";
  offices: number;
  employees: number;
  logo: string;
  description: string;
}

export const companyLogo = "/lighmodelogo.png"; // Updated path

export const companyPresence: Record<string, StatePresence> = {
  Telangana: {
    status: "Active",
    offices: 3,
    employees: 185,
    logo: companyLogo,
    description: "Head Office & Regional Office"
  },
  Karnataka: {
    status: "Active",
    offices: 3,
    employees: 210,
    logo: companyLogo,
    description: "Development Center"
  },
  Maharashtra: {
    status: "Active",
    offices: 1,
    employees: 60,
    logo: companyLogo,
    description: "Sales Office"
  },
  "Tamil Nadu": {
    status: "Active",
    offices: 1,
    employees: 45,
    logo: companyLogo,
    description: "Support Hub"
  }
};
