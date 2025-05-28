
// Service d'email pour les notifications de congés
export interface EmailNotification {
  to: string;
  subject: string;
  content: string;
  leaveRequest: any;
}

export const sendLeaveApprovalEmail = async (leaveRequest: any): Promise<void> => {
  const emailData: EmailNotification = {
    to: 'saiffmhamdi@gmail.com',
    subject: `Congé approuvé - ${leaveRequest.employeeName}`,
    content: `
      Bonjour,

      Nous vous informons que la demande de congé suivante a été approuvée :

      Employé: ${leaveRequest.employeeName}
      Type de congé: ${getLeaveTypeLabel(leaveRequest.leaveType)}
      Période: du ${leaveRequest.startDate} au ${leaveRequest.endDate}
      Durée: ${leaveRequest.days} jour(s)
      Motif: ${leaveRequest.reason}

      ${leaveRequest.managerComment ? `Commentaire du manager: ${leaveRequest.managerComment}` : ''}

      Cordialement,
      Système de Gestion des Congés
    `,
    leaveRequest
  };

  try {
    // Pour l'instant, on simule l'envoi d'email
    console.log('📧 Email à envoyer:', emailData);
    
    // TODO: Remplacer par un vrai service d'email une fois Supabase connecté
    // Exemple avec Supabase Edge Functions:
    /*
    const { data, error } = await supabase.functions.invoke('send-email', {
      body: emailData
    });
    
    if (error) throw error;
    */
    
    // Simulation d'un délai d'envoi
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    console.log('✅ Email envoyé avec succès à:', emailData.to);
    
  } catch (error) {
    console.error('❌ Erreur lors de l\'envoi de l\'email:', error);
    throw new Error('Échec de l\'envoi de l\'email de notification');
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
