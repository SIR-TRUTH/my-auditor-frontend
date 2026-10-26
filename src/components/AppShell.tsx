import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { 
  LayoutDashboard, 
  ReceiptText, 
  Boxes, 
  WalletCards, 
  Truck, 
  ShieldCheck, 
  ScanText, 
  FileBarChart, 
  BrainCircuit, 
  Settings, 
  Menu, 
  X, 
  Bell, 
  ChevronDown, 
  Building 
} from 'lucide-react';

interface AppShellProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

export default function AppShell({ children, title, subtitle, actions }: AppShellProps) {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const navigation = [
    { name: 'Executive Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Sales & Revenue', href: '/dashboard/sales', icon: ReceiptText },
    { name: 'Inventory & WAC', href: '/dashboard/inventory', icon: Boxes },
    { name: 'Expenses', href: '/dashboard/expenses', icon: WalletCards },
    { name: 'Purchases & Suppliers', href: '/dashboard/purchases', icon: Truck },
    { name: 'Continuous Audit Centre', href: '/dashboard/audit', icon: ShieldCheck },
    { name: 'AI OCR Scanner', href: '/dashboard/ocr', icon: ScanText },
    { name: 'Reports & P&L', href: '/dashboard/reports', icon: FileBarChart },
    { name: 'AI Forensic CPA', href: '/dashboard/cpa', icon: BrainCircuit },
    { name: 'Settings & RBAC', href: '/dashboard/settings', icon: Settings },
  ];

  const businessName = typeof window !== 'undefined' ? localStorage.getItem('current_business_name') || 'Enterprise HQ' : 'Enterprise HQ';
  const branchName = typeof window !== 'undefined' ? localStorage.getItem('current_branch_name') || 'Main Store' : 'Main Store';

  return (
    <div className="min-h-screen bg-[#090D16] text-[#F8FAFC] flex font-sans antialiased selection:bg-emerald-500/30 selection:text-emerald-300">
      
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          onClick={() => setSidebarOpen(false)} 
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 bg-[#111827] border-r border-[#1E293B] flex flex-col transition-all duration-300
        ${collapsed ? 'w-20' : 'w-64'}
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Brand Header */}
        <div className="h-16 px-6 border-b border-[#1E293B] flex items-center justify-between">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="bg-emerald-500/10 p-2 rounded-xl border border-emerald-500/20 text-emerald-400 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            {!collapsed && <span className="font-extrabold text-white text-base tracking-wider truncate">MY-AUDITOR</span>}
          </div>
          <button 
            onClick={() => setSidebarOpen(false)} 
            className="lg:hidden text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1.5 scrollbar-thin scrollbar-thumb-slate-800">
          {navigation.map((item) => {
            const isActive = router.pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`
                  flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all group
                  ${isActive 
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-sm' 
                    : 'text-slate-400 hover:bg-[#1F2937] hover:text-slate-200'}
                `}
                title={collapsed ? item.name : undefined}
              >
                <Icon className={`w-4 h-4 shrink-0 transition-colors ${isActive ? 'text-emerald-400' : 'text-slate-400 group-hover:text-slate-200'}`} />
                {!collapsed && <span className="truncate">{item.name}</span>}
              </Link>
            );
          })}
        </div>

        {/* Sidebar Footer / Collapse Toggle */}
        <div className="p-4 border-t border-[#1E293B] hidden lg:flex items-center justify-between">
          {!collapsed && (
            <span className="text-[11px] font-mono text-slate-500 uppercase">v4.0 Enterprise</span>
          )}
          <button 
            onClick={() => setCollapsed(!collapsed)}
            className="p-1.5 rounded-lg bg-[#1F2937] text-slate-400 hover:text-white transition"
          >
            <Menu className="w-4 h-4" />
          </button>
        </div>
      </aside>

      {/* Main Wrapper */}
      <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${collapsed ? 'lg:pl-20' : 'lg:pl-64'}`}>
        
        {/* Top Header */}
        <header className="sticky top-0 z-30 h-16 bg-[#090D16]/80 backdrop-blur-md border-b border-[#1E293B] px-4 sm:px-8 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl bg-[#111827] border border-[#1E293B] text-slate-300 hover:text-white"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Business & Branch Selector Pill */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#111827] border border-[#1E293B] text-xs">
              <Building className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span className="font-bold text-white truncate max-w-[140px]">{businessName}</span>
              <span className="text-slate-600">/</span>
              <span className="text-slate-400 truncate max-w-[100px]">{branchName}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-500 ml-1" />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="p-2 rounded-xl bg-[#111827] border border-[#1E293B] text-slate-400 hover:text-white relative transition">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </button>

            <div className="flex items-center gap-3 pl-2 border-l border-[#1E293B]">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs">
                {businessName.substring(0, 2).toUpperCase()}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content Container with Sensible Max Width */}
        <main className="flex-1 px-4 sm:px-8 py-6 max-w-7xl w-full mx-auto space-y-6">
          {(title || actions) && (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#1E293B]">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">{title}</h1>
                {subtitle && <p className="text-xs sm:text-sm text-slate-400 mt-0.5">{subtitle}</p>}
              </div>
              {actions && <div className="flex items-center gap-3">{actions}</div>}
            </div>
          )}
          {children}
        </main>
      </div>
    </div>
  );
}