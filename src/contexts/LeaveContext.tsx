
import React, { createContext, useContext, useState } from 'react';
import { LeaveRequest } from '@/types';
import { sendLeaveApprovalEmail } from '@/services/emailService';

interface LeaveContextType {
  requests: LeaveRequest[];
  addRequest: (request: Omit<LeaveRequest, 'id' | 'appliedDate' | 'status'>) => void;
  updateRequestStatus: (id: string, status: 'approved' | 'rejected', comment?: string) => Promise<void>;
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

  const updateRequestStatus = async (id: string, status: 'approved' | 'rejected', comment?: string) => {
    // Mettre à jour le statut localement d'abord
    setRequests(prev => prev.map(req => 
      req.id === id 
        ? { ...req, status, managerComment: comment }
        : req
    ));

    // Si la demande est approuvée, envoyer un email
    if (status === 'approved') {
      try {
        const approvedRequest = requests.find(req => req.id === id);
        if (approvedRequest) {
          const updatedRequest = { 
            ...approvedRequest, 
            status, 
            managerComment: comment 
          };
          await sendLeaveApprovalEmail(updatedRequest);
        }
      } catch (error) {
        console.error('Erreur lors de l\'envoi de l\'email:', error);
        // L'email a échoué mais on garde le changement de statut
      }
    }
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
