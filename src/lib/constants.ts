export const ROLES = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  ADMIN: 'ADMIN',
  DISTRIBUTOR: 'DISTRIBUTOR',
  VIEWER: 'VIEWER',
};

export const RISK_PROFILES = {
  CONSERVATIVE: 'Conservative',
  MODERATE: 'Moderate',
  AGGRESSIVE: 'Aggressive',
};

export const SIP_STATUS = {
  ACTIVE: 'Active',
  PAUSED: 'Paused',
  LAPSED: 'Lapsed',
  MATURED: 'Matured',
  DISCONTINUED: 'Discontinued',
};

export const COMMISSION_STATUS = {
  PENDING: 'Pending',
  APPROVED: 'Approved',
  PAID: 'Paid',
  REJECTED: 'Rejected',
};

export const GOAL_TYPES = {
  RETIREMENT: 'Retirement',
  EDUCATION: 'Education',
  HOME: 'Home',
  WEDDING: 'Wedding',
  VEHICLE: 'Vehicle',
  VACATION: 'Vacation',
  EMERGENCY_FUND: 'Emergency Fund',
  OTHER: 'Other',
};

export const CAMPAIGN_STATUS = {
  DRAFT: 'Draft',
  SCHEDULED: 'Scheduled',
  SENDING: 'Sending',
  SENT: 'Sent',
  FAILED: 'Failed',
};

export const RISK_LEVELS = {
  LOW: { label: 'Low', color: 'green', score: '0-25' },
  MEDIUM: { label: 'Medium', color: 'yellow', score: '25-50' },
  HIGH: { label: 'High', color: 'orange', score: '50-75' },
  CRITICAL: { label: 'Critical', color: 'red', score: '75-100' },
};
