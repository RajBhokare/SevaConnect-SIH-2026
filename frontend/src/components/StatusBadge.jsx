import React from 'react';
import { Badge } from './ui/Badge';
import { 
  Clock, 
  CheckCircle2, 
  PlayCircle, 
  XCircle, 
  ShieldCheck
} from 'lucide-react';

export function StatusBadge({ status, className }) {
  if (!status) return null;
  const s = status.toUpperCase();

  switch (s) {
    case 'REQUESTED':
      return (
        <Badge variant="default" icon={Clock} className={className}>
          Requested
        </Badge>
      );
    case 'ACCEPTED':
      return (
        <Badge variant="primary" icon={CheckCircle2} className={className}>
          Accepted
        </Badge>
      );
    case 'IN_PROGRESS':
      return (
        <Badge variant="primary" icon={PlayCircle} className={className}>
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
        <Badge variant="success" icon={ShieldCheck} className={className}>
          Verified Worker
        </Badge>
      );
    case 'PENDING':
    default:
      return (
        <Badge variant="default" icon={Clock} className={className}>
          {status}
        </Badge>
      );
  }
}
