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
  Building2,
  Search,
  Users,
  CreditCard,
  PlusCircle,
  Layers,
} from 'lucide-react';

interface AppShellProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

export default function AppShell({
  children,
  title,
  subtitle,
  actions,
}: AppShellProps) {
  const router = useRouter();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState('All Branches');

  const navigationGroups = [
    {
      label: 'OVERVIEW',
      items: [
        {
          name: 'Executive Dashboard',
          href: '/dashboard',
          icon: LayoutDashboard,
        },
        {
          name: 'Action Hub',
          href: '/dashboard/actions',
          icon: PlusCircle,
        },
      ],
    },
    {
      label: 'OPERATIONS & LEDGER',
      items: [
        {
          name: 'Sales & Revenue',
          href: '/dashboard/sales',
          icon: ReceiptText,
        },
        {
          name: 'Inventory & WAC',
          href: '/dashboard/inventory',
          icon: Boxes,
        },
        {
          name: 'Expenses',
          href: '/dashboard/expenses',
          icon: WalletCards,
        },
        {
          name: 'Purchases & Suppliers',
          href: '/dashboard/purchases',
          icon: Truck,
        },
        {
          name: 'Customers & AR',
          href: '/dashboard/customers',
          icon: Users,
        },
      ],
    },
    {
      label: 'FINANCE & BANKING',
      items: [
        {
          name: 'Accounting Engine',
          href: '/dashboard/accounting',
          icon: Layers,
        },
        {
          name: 'Banking & POS Reconcile',
          href: '/dashboard/reconciliation',
          icon: CreditCard,
        },
      ],
    },
    {
      label: 'AUDIT & COMPLIANCE',
      items: [
        {
          name: 'Continuous Audit Centre',
          href: '/dashboard/audit',
          icon: ShieldCheck,
        },
        {
          name: 'AI OCR Scanner',
          href: '/dashboard/ocr',
          icon: ScanText,
        },
      ],
    },
    {
      label: 'INTELLIGENCE & P&L',
      items: [
        {
          name: 'Reports & P&L',
          href: '/dashboard/reports',
          icon: FileBarChart,
        },
        {
          name: 'AI Forensic CPA',
          href: '/dashboard/cpa',
          icon: BrainCircuit,
        },
      ],
    },
    {
      label: 'MANAGEMENT',
      items: [
        {
          name: 'Branch Management',
          href: '/dashboard/branches',
          icon: Building2,
        },
        {
          name: 'Settings & RBAC',
          href: '/dashboard/settings',
          icon: Settings,
        },
      ],
    },
  ];

  const businessName =
    typeof window !== 'undefined'
      ? localStorage.getItem('current_business_name') || 'Enterprise HQ'
      : 'Enterprise HQ';

  return (
    <div className="min-h-screen bg-[#0A0E17] text-[#F9FAFB] flex font-sans antialiased">
      {/* Mobile drawer overlay */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 bg-[#0E1522] border-r border-[#1F293B] flex flex-col transition-all duration-200 ${
          collapsed ? 'w-20' : 'w-64'
        } ${
          sidebarOpen
            ? 'translate-x-0'
            : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Sidebar header */}
        <div className="h-16 px-5 border-b border-[#1F293B] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-8 h-8 rounded-lg bg-teal-500/10 border border-teal-500/30 text-teal-400 flex items-center justify-center font-bold shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>

            {!collapsed && (
              <span className="font-bold text-white text-sm tracking-wider uppercase font-mono">
                MY-AUDITOR
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-slate-400 hover:text-white p-1"
            aria-label="Close navigation"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          {navigationGroups.map((group) => (
            <div key={group.label} className="space-y-1">
              {!collapsed && (
                <div className="px-3 pb-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider font-mono">
                  {group.label}
                </div>
              )}

              {group.items.map((item) => {
                const isActive =
                  router.pathname === item.href ||
                  (item.href !== '/dashboard' &&
                    router.pathname.startsWith(`${item.href}/`));

                const Icon = item.icon;

                return (
                  <Link
                    href={item.href}
                    key={item.name}
                    onClick={() => setSidebarOpen(false)}
                    title={collapsed ? item.name : undefined}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-all group ${
                      isActive
                        ? 'bg-teal-500/10 text-teal-400 border border-teal-500/20 font-semibold'
                        : 'text-slate-400 hover:bg-[#182234] hover:text-slate-200'
                    }`}
                  >
                    <Icon
                      className={`w-4 h-4 shrink-0 transition-colors ${
                        isActive
                          ? 'text-teal-400'
                          : 'text-slate-400 group-hover:text-slate-200'
                      }`}
                    />

                    {!collapsed && (
                      <span className="truncate">{item.name}</span>
                    )}
                  </Link>
                );
              })}
            </div>
          ))}
        </div>

        {/* Sidebar footer */}
        <div className="p-3 border-t border-[#1F293B] flex items-center justify-between bg-[#0A0E17]/50 shrink-0">
          {!collapsed && (
            <div className="text-[10px] font-mono text-slate-500 pl-2">
              ENV: PRODUCTION
            </div>
          )}

          <button
            type="button"
            onClick={() => setCollapsed((value) => !value)}
            className="p-1.5 rounded-md hover:bg-[#182234] text-slate-400 hover:text-white transition hidden lg:block cursor-pointer"
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <Menu className="w-4 h-4" />
          </button>
        </div>
      </aside>

      {/* Main content area */}
      <div
        className={`flex-1 flex flex-col min-w-0 transition-all duration-200 ${
          collapsed ? 'lg:pl-20' : 'lg:pl-64'
        }`}
      >
        {/* Top header */}
        <header className="sticky top-0 z-30 h-16 bg-[#0A0E17]/90 backdrop-blur-md border-b border-[#1F293B] px-4 sm:px-8 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg bg-[#111827] border border-[#1F293B] text-slate-300"
              aria-label="Open navigation"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Business / branch selector */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#111827] border border-[#1F293B] text-xs min-w-0">
              <Building2 className="w-3.5 h-3.5 text-teal-400 shrink-0" />

              <span className="font-semibold text-white truncate max-w-[120px] sm:max-w-none">
                {businessName}
              </span>

              <span className="text-slate-600 hidden sm:inline">/</span>

              <select
                value={selectedBranch}
                onChange={(event) => setSelectedBranch(event.target.value)}
                className="bg-transparent text-slate-300 font-medium focus:outline-none cursor-pointer text-xs max-w-[110px] sm:max-w-none"
                aria-label="Select branch"
              >
                <option value="All Branches">All Branches</option>
                <option value="Main Flagship Store">
                  Main Flagship Store
                </option>
                <option value="Ikeja Outlet">Ikeja Outlet</option>
                <option value="Abuja Branch">Abuja Branch</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {/* Search */}
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-500" />

              <input
                type="text"
                placeholder="Search ledger, audit flags..."
                className="w-56 lg:w-64 bg-[#111827] border border-[#1F293B] rounded-lg pl-9 pr-4 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-teal-500"
              />
            </div>

            {/* Notifications */}
            <button
              type="button"
              className="p-2 rounded-lg bg-[#111827] border border-[#1F293B] text-slate-400 hover:text-white relative"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4" />

              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-teal-500" />
            </button>

            <div className="h-6 w-px bg-[#1F293B] mx-1" />

            {/* Business avatar */}
            <div className="w-8 h-8 rounded-lg bg-teal-500/10 border border-teal-500/30 text-teal-400 flex items-center justify-center font-bold text-xs">
              {businessName.substring(0, 2).toUpperCase()}
            </div>
          </div>
        </header>

        {/* Main viewport */}
        <main className="flex-1 px-4 sm:px-8 py-8 max-w-7xl w-full mx-auto space-y-8">
          {(title || subtitle || actions) && (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#1F293B]">
              <div>
                {title && (
                  <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                    {title}
                  </h1>
                )}

                {subtitle && (
                  <p className="text-xs sm:text-sm text-slate-400 mt-1">
                    {subtitle}
                  </p>
                )}
              </div>

              {actions && (
                <div className="flex items-center gap-3">{actions}</div>
              )}
            </div>
          )}

          {children}
        </main>
      </div>
    </div>
  );
}