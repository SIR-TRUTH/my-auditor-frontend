/**
 * MY-AUDITOR Role-Based Access Control (RBAC) & Multi-Tenant Branch Guard
 */

export type UserRole = 'ADMIN' | 'AUDITOR' | 'INVESTOR';

export interface UserContext {
  userId: string;
  businessId: string;
  branchId: string;
  role: UserRole;
}

export const PERMISSIONS = {
  POST_TRANSACTION: ['ADMIN'],
  APPROVE_AUDIT_WRITE_OFF: ['ADMIN', 'AUDITOR'],
  VIEW_REPORTS: ['ADMIN', 'AUDITOR', 'INVESTOR'],
  VIEW_AUDIT_EXPOSURE: ['ADMIN', 'AUDITOR'],
};

export function enforcePermission(user: UserContext, action: keyof typeof PERMISSIONS): void {
  const allowedRoles = PERMISSIONS[action];
  if (!allowedRoles.includes(user.role)) {
    throw new Error(`Access Denied: Role '${user.role}' is not authorized to perform '${action}' on branch '${user.branchId}'.`);
  }
}