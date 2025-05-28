
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'employee' | 'manager';
  department: string;
  leaveBalance: {
    annual: number;
    sick: number;
    personal: number;
  };
}

export interface LeaveRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  leaveType: 'annual' | 'sick' | 'personal' | 'maternity' | 'paternity';
  startDate: string;
  endDate: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  appliedDate: string;
  managerId?: string;
  managerComment?: string;
  days: number;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}
