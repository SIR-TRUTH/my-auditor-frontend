export type UserRole = 'ADMIN' | 'MANAGER' | 'AUDITOR' | 'CASHIER';

export interface BranchContext {
  branchId: string;
  branchName: string;
  organizationId: string;
}

export const PERMISSIONS: Record<UserRole, string[]> = {
  ADMIN: ['view_dashboard', 'manage_users', 'audit_receipts', 'edit_inventory', 'export_reports', 'manage_branches'],
  MANAGER: ['view_dashboard', 'audit_receipts', 'edit_inventory', 'export_reports'],
  AUDITOR: ['view_dashboard', 'audit_receipts', 'export_reports'],
  CASHIER: ['view_dashboard', 'scan_pos_barcode']
};

export function hasPermission(role: UserRole, permission: string): boolean {
  return PERMISSIONS[role]?.includes(permission) ?? false;
}
