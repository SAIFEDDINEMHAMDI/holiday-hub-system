
import React, { createContext, useContext, useState } from 'react';
import { LeaveRequest } from '@/types';

interface LeaveContextType {
  requests: LeaveRequest[];
  addRequest: (request: Omit<LeaveRequest, 'id' | 'appliedDate' | 'status'>) => void;
  updateRequestStatus: (id: string, status: 'approved' | 'rejected', comment?: string) => void;
}

const LeaveContext = createContext<LeaveContextType | undefined>(undefined);

// Mock leave requests
const mockRequests: LeaveRequest[] = [
  {
    id: '1',
    employeeId: '1',
    employeeName: 'Jean Dubois',
    leaveType: 'annual',
    startDate: '2024-06-15',
    endDate: '2024-06-20',
    reason: 'Vacances d\'été en famille',
    status: 'pending',
    appliedDate: '2024-05-28',
    days: 6
  },
  {
    id: '2',
    employeeId: '3',
    employeeName: 'Pierre Dupont',
    leaveType: 'sick',
    startDate: '2024-06-01',
    endDate: '2024-06-03',
    reason: 'Grippe saisonnière',
    status: 'approved',
    appliedDate: '2024-05-25',
    days: 3
  }
];

export const LeaveProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [requests, setRequests] = useState<LeaveRequest[]>(mockRequests);

  const addRequest = (request: Omit<LeaveRequest, 'id' | 'appliedDate' | 'status'>) => {
    const newRequest: LeaveRequest = {
      ...request,
      id: Date.now().toString(),
      appliedDate: new Date().toISOString().split('T')[0],
      status: 'pending'
    };
    setRequests(prev => [...prev, newRequest]);
  };

  const updateRequestStatus = (id: string, status: 'approved' | 'rejected', comment?: string) => {
    setRequests(prev => prev.map(req => 
      req.id === id 
        ? { ...req, status, managerComment: comment }
        : req
    ));
  };

  return (
    <LeaveContext.Provider value={{ requests, addRequest, updateRequestStatus }}>
      {children}
    </LeaveContext.Provider>
  );
};

export const useLeave = () => {
  const context = useContext(LeaveContext);
  if (context === undefined) {
    throw new Error('useLeave must be used within a LeaveProvider');
  }
  return context;
};
