
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLeave } from '@/contexts/LeaveContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';
import { Eye, CheckCircle, XCircle, FileText } from 'lucide-react';

const LeaveRequestsList = () => {
  const { user } = useAuth();
  const { requests, updateRequestStatus } = useLeave();
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [managerComment, setManagerComment] = useState('');

  if (!user) return null;

  const displayRequests = user.role === 'manager' 
    ? requests 
    : requests.filter(req => req.employeeId === user.id);

  const handleStatusUpdate = (requestId: string, status: 'approved' | 'rejected') => {
    updateRequestStatus(requestId, status, managerComment);
    toast({
      title: status === 'approved' ? "Demande approuvée" : "Demande rejetée",
      description: "Le statut a été mis à jour avec succès.",
    });
    setManagerComment('');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge className="status-badge status-pending">En attente</Badge>;
      case 'approved':
        return <Badge className="status-badge status-approved">Approuvée</Badge>;
      case 'rejected':
        return <Badge className="status-badge status-rejected">Rejetée</Badge>;
      default:
        return null;
    }
  };

  const getLeaveTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      annual: 'Congés Annuels',
      sick: 'Congé Maladie',
      personal: 'Congé Personnel',
      maternity: 'Congé Maternité',
      paternity: 'Congé Paternité'
    };
    return labels[type] || type;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <FileText className="h-8 w-8 text-primary-600" />
        <div>
          <h1 className="text-3xl font-bold">
            {user.role === 'manager' ? 'Gestion des Demandes' : 'Mes Demandes'}
          </h1>
          <p className="text-muted-foreground">
            {user.role === 'manager' 
              ? 'Gérez les demandes de congés de votre équipe' 
              : 'Suivez le statut de vos demandes de congés'
            }
          </p>
        </div>
      </div>

      {displayRequests.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Aucune demande</h3>
            <p className="text-muted-foreground">
              {user.role === 'manager' 
                ? 'Aucune demande de congé à traiter pour le moment.' 
                : 'Vous n\'avez soumis aucune demande de congé.'
              }
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {displayRequests.map((request) => (
            <Card key={request.id} className="hover:shadow-lg transition-shadow duration-200">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{request.employeeName}</CardTitle>
                    <CardDescription>
                      {getLeaveTypeLabel(request.leaveType)} • {request.days} jour(s)
                    </CardDescription>
                  </div>
                  {getStatusBadge(request.status)}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <div className="font-medium text-muted-foreground">Période</div>
                      <div>{request.startDate} au {request.endDate}</div>
                    </div>
                    <div>
                      <div className="font-medium text-muted-foreground">Date de demande</div>
                      <div>{request.appliedDate}</div>
                    </div>
                    <div>
                      <div className="font-medium text-muted-foreground">Durée</div>
                      <div>{request.days} jour{request.days > 1 ? 's' : ''}</div>
                    </div>
                  </div>

                  <div>
                    <div className="font-medium text-muted-foreground text-sm mb-1">Motif</div>
                    <div className="text-sm">{request.reason}</div>
                  </div>

                  {request.managerComment && (
                    <div className="bg-muted p-3 rounded-lg">
                      <div className="font-medium text-muted-foreground text-sm mb-1">
                        Commentaire du manager
                      </div>
                      <div className="text-sm">{request.managerComment}</div>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-2 pt-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" onClick={() => setSelectedRequest(request)}>
                          <Eye className="h-4 w-4 mr-2" />
                          Voir détails
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Détails de la demande</DialogTitle>
                          <DialogDescription>
                            Demande de {selectedRequest?.employeeName}
                          </DialogDescription>
                        </DialogHeader>
                        {selectedRequest && (
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label className="font-medium">Type de congé</Label>
                                <p>{getLeaveTypeLabel(selectedRequest.leaveType)}</p>
                              </div>
                              <div>
                                <Label className="font-medium">Statut</Label>
                                <div className="mt-1">{getStatusBadge(selectedRequest.status)}</div>
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label className="font-medium">Date de début</Label>
                                <p>{selectedRequest.startDate}</p>
                              </div>
                              <div>
                                <Label className="font-medium">Date de fin</Label>
                                <p>{selectedRequest.endDate}</p>
                              </div>
                            </div>
                            <div>
                              <Label className="font-medium">Motif</Label>
                              <p className="mt-1">{selectedRequest.reason}</p>
                            </div>
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>

                    {user.role === 'manager' && request.status === 'pending' && (
                      <>
                        <Button 
                          size="sm" 
                          onClick={() => handleStatusUpdate(request.id, 'approved')}
                          className="bg-secondary hover:bg-secondary/90"
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Approuver
                        </Button>
                        <Button 
                          size="sm" 
                          variant="destructive"
                          onClick={() => handleStatusUpdate(request.id, 'rejected')}
                        >
                          <XCircle className="h-4 w-4 mr-2" />
                          Rejeter
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

const Label = ({ className, children, ...props }: any) => (
  <div className={`text-sm font-medium text-muted-foreground ${className}`} {...props}>
    {children}
  </div>
);

export default LeaveRequestsList;
