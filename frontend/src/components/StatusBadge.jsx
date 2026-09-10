import React from 'react';
import { Badge } from './ui/Badge';
import { 
  Clock, 
  CheckCircle2, 
  PlayCircle, 
  XCircle, 
  AlertTriangle, 
  ShieldCheck, 
  CreditCard 
} from 'lucide-react';

export function StatusBadge({ status, className }) {
  if (!status) return null;
  const s = status.toUpperCase();

  switch (s) {
    case 'REQUESTED':
      return (
        <Badge variant="warning" icon={Clock} className={className}>
          Requested
        </Badge>
      );
    case 'ACCEPTED':
      return (
        <Badge variant="brand" icon={CheckCircle2} className={className}>
          Accepted
        </Badge>
      );
    case 'IN_PROGRESS':
      return (
        <Badge variant="purple" icon={PlayCircle} className={className}>
          In Progress
        </Badge>
      );
    case 'COMPLETED':
      return (
        <Badge variant="success" icon={CheckCircle2} className={className}>
          Completed
        </Badge>
      );
    case 'DECLINED':
      return (
        <Badge variant="danger" icon={XCircle} className={className}>
          Declined
        </Badge>
      );
    case 'CANCELLED':
      return (
        <Badge variant="outline" icon={XCircle} className={className}>
          Cancelled
        </Badge>
      );
    case 'VERIFIED':
      return (
        <Badge variant="coop" icon={ShieldCheck} className={className}>
          Verified Worker
        </Badge>
      );
    case 'PENDING':
      return (
        <Badge variant="warning" icon={Clock} className={className}>
          Verification Pending
        </Badge>
      );
    case 'PAID':
      return (
        <Badge variant="success" icon={CreditCard} className={className}>
          Paid
        </Badge>
      );
    case 'CASH_ON_SERVICE':
      return (
        <Badge variant="outline" icon={CreditCard} className={className}>
          Cash on Service
        </Badge>
      );
    default:
      return <Badge className={className}>{status}</Badge>;
  }
}
