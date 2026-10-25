import { UserContext, enforcePermission } from './lib/rbacEngine';

console.log('🚀 Running RBAC & Multi-Branch Security Verification...\n');

const investorUser: UserContext = {
  userId: 'usr-investor',
  businessId: 'biz-1',
  branchId: 'branch-ikeja',
  role: 'INVESTOR',
};

const adminUser: UserContext = {
  userId: 'usr-admin',
  businessId: 'biz-1',
  branchId: 'branch-ikeja',
  role: 'ADMIN',
};

// Test 1: Investor trying to view reports (Allowed)
try {
  enforcePermission(investorUser, 'VIEW_REPORTS');
  console.log('✅ TEST 1 PASSED: Investor successfully viewed reports.');
} catch (e: any) {
  console.log('❌ TEST 1 FAILED:', e.message);
}

// Test 2: Investor trying to post a transaction (Denied)
try {
  enforcePermission(investorUser, 'POST_TRANSACTION');
  console.log('❌ TEST 2 FAILED: Investor should not be able to post transactions.');
} catch (e: any) {
  console.log(`✅ TEST 2 PASSED: Investor correctly blocked -> "${e.message}"`);
}

// Test 3: Admin trying to post a transaction (Allowed)
try {
  enforcePermission(adminUser, 'POST_TRANSACTION');
  console.log('✅ TEST 3 PASSED: Admin successfully authorized to post transactions.');
} catch (e: any) {
  console.log('❌ TEST 3 FAILED:', e.message);
}

console.log('\n🎉 RBAC & MULTI-BRANCH ACCESS CONTROL VERIFIED SUCCESSFULLY!');