export interface CompanyLocation {
  state: string;
  offices: number;
  employees: number;
  logo: string;
  description: string;
  status: "Active" | "Upcoming";
}

export const companyLogo = "/lighmodelogo.png"; // Updated path

export const companyPresence: CompanyLocation[] = [
  {
    state: "Telangana",
    offices: 3,
    employees: 120,
    logo: companyLogo,
    description: "Regional Headquarters",
    status: "Active",
  },
  {
    state: "Karnataka",
    offices: 2,
    employees: 85,
    logo: companyLogo,
    description: "Development Center",
    status: "Active",
  },
  {
    state: "Maharashtra",
    offices: 1,
    employees: 60,
    logo: companyLogo,
    description: "Sales Office",
    status: "Active",
  },
  {
    state: "Tamil Nadu",
    offices: 1,
    employees: 45,
    logo: companyLogo,
    description: "Support Hub",
    status: "Active",
  }
];

export const highlightedStates = companyPresence.map(p => p.state);
